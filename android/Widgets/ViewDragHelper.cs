using Android.Content;
using Android.Support.V4.Widget;
using Android.Views;
using Android.Views.Animations;
using Java.Lang;
using Java.Util;

namespace Alloy.Widgets
{
	/**
	* ViewDragHelper is a utility class for writing custom ViewGroups. It offers a number
	* of useful operations and state tracking for allowing a user to drag and reposition
	* views within their parent ViewGroup.
	*/
	class ViewDragHelper
	{
		/**
		 * A null/invalid pointer ID.
		 */
		public const int INVALID_POINTER = -1;

		/**
		 * A view is not currently being dragged or animating as a result of a fling/snap.
		 */
		public const int STATE_IDLE = 0;

		/**
		 * A view is currently being dragged. The position is currently changing as a result
		 * of user input or simulated user input.
		 */
		public const int STATE_DRAGGING = 1;

		/**
		 * A view is currently settling into place as a result of a fling or
		 * predefined non-interactive motion.
		 */
		public const int STATE_SETTLING = 2;

		/**
		 * Edge flag indicating that the left edge should be affected.
		 */
		public const int EDGE_LEFT = 1 << 0;

		/**
		 * Edge flag indicating that the right edge should be affected.
		 */
		public const int EDGE_RIGHT = 1 << 1;

		/**
		 * Edge flag indicating that the top edge should be affected.
		 */
		public const int EDGE_TOP = 1 << 2;

		/**
		 * Edge flag indicating that the bottom edge should be affected.
		 */
		public const int EDGE_BOTTOM = 1 << 3;

		/**
		 * Edge flag set indicating all edges should be affected.
		 */
		public const int EDGE_ALL = EDGE_LEFT | EDGE_TOP | EDGE_RIGHT | EDGE_BOTTOM;

		/**
		 * Indicates that a check should occur along the horizontal axis
		 */
		public const int DIRECTION_HORIZONTAL = 1 << 0;

		/**
		 * Indicates that a check should occur along the vertical axis
		 */
		public const int DIRECTION_VERTICAL = 1 << 1;

		/**
		 * Indicates that a check should occur along all axes
		 */
		public const int DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

		private const int EDGE_SIZE = 20; // dp

		private const int BASE_SETTLE_DURATION = 256; // ms
		private const int MAX_SETTLE_DURATION = 600; // ms

		// Current drag state; idle, dragging or settling
		private int mDragState;

		// Distance to travel before a drag may begin
		private int mTouchSlop;

		// Last known position/pointer tracking
		private int mActivePointerId = INVALID_POINTER;
		private float[] mInitialMotionX;
		private float[] mInitialMotionY;
		private float[] mLastMotionX;
		private float[] mLastMotionY;
		private int[] mInitialEdgesTouched;
		private int[] mEdgeDragsInProgress;
		private int[] mEdgeDragsLocked;
		private int mPointersDown;

		private VelocityTracker mVelocityTracker;
		private readonly float mMaxVelocity;
		private float mMinVelocity;

		private readonly int mEdgeSize;
		private int mTrackingEdges;

		private readonly ScrollerCompat mScroller;

		private readonly Callback mCallback;

		private View mCapturedView;
		private bool mReleaseInProgress;

		private readonly ViewGroup mParentView;

		/**
		 * A Callback is used as a communication channel with the ViewDragHelper back to the
		 * parent view using it. <code>on*</code>methods are invoked on siginficant events and several
		 * accessor methods are expected to provide the ViewDragHelper with more information
		 * about the state of the parent view upon request. The callback also makes decisions
		 * governing the range and draggability of child views.
		 */
		public abstract class Callback
		{
			/**
			 * Called when the drag state changes. See the <code>STATE_*</code> constants
			 * for more information.
			 *
			 * @param state The new drag state
			 *
			 * @see #STATE_IDLE
			 * @see #STATE_DRAGGING
			 * @see #STATE_SETTLING
			 */
			public virtual void OnViewDragStateChanged(int state) { }

			/**
			 * Called when the captured view's position changes as the result of a drag or settle.
			 *
			 * @param changedView View whose position changed
			 * @param left New X coordinate of the left edge of the view
			 * @param top New Y coordinate of the top edge of the view
			 * @param dx Change in X position from the last call
			 * @param dy Change in Y position from the last call
			 */
			public virtual void OnViewPositionChanged(View changedView, int left, int top, int dx, int dy) { }

			/**
			 * Called when a child view is captured for dragging or settling. The ID of the pointer
			 * currently dragging the captured view is supplied. If activePointerId is
			 * identified as {@link #INVALID_POINTER} the capture is programmatic instead of
			 * pointer-initiated.
			 *
			 * @param capturedChild Child view that was captured
			 * @param activePointerId Pointer id tracking the child capture
			 */
			public virtual void OnViewCaptured(View capturedChild, int activePointerId) { }

			/**
			 * Called when the child view is no longer being actively dragged.
			 * The fling velocity is also supplied, if relevant. The velocity values may
			 * be clamped to system minimums or maximums.
			 *
			 * <p>Calling code may decide to fling or otherwise release the view to let it
			 * settle into place. It should do so using {@link #settleCapturedViewAt(int, int)}
			 * or {@link #flingCapturedView(int, int, int, int)}. If the Callback invokes
			 * one of these methods, the ViewDragHelper will enter {@link #STATE_SETTLING}
			 * and the view capture will not fully end until it comes to a complete stop.
			 * If neither of these methods is invoked before <code>onViewReleased</code> returns,
			 * the view will stop in place and the ViewDragHelper will return to
			 * {@link #STATE_IDLE}.</p>
			 *
			 * @param releasedChild The captured child view now being released
			 * @param xvel X velocity of the pointer as it left the screen in pixels per second.
			 * @param yvel Y velocity of the pointer as it left the screen in pixels per second.
			 */
			public virtual void OnViewReleased(View releasedChild, float xvel, float yvel) { }

			/**
			 * Called when one of the subscribed edges in the parent view has been touched
			 * by the user while no child view is currently captured.
			 *
			 * @param edgeFlags A combination of edge flags describing the edge(s) currently touched
			 * @param pointerId ID of the pointer touching the described edge(s)
			 * @see #EDGE_LEFT
			 * @see #EDGE_TOP
			 * @see #EDGE_RIGHT
			 * @see #EDGE_BOTTOM
			 */
			public virtual void OnEdgeTouched(int edgeFlags, int pointerId) { }

			/**
			 * Called when the given edge may become locked. This can happen if an edge drag
			 * was preliminarily rejected before beginning, but after {@link #onEdgeTouched(int, int)}
			 * was called. This method should return true to lock this edge or false to leave it
			 * unlocked. The default behavior is to leave edges unlocked.
			 *
			 * @param edgeFlags A combination of edge flags describing the edge(s) locked
			 * @return true to lock the edge, false to leave it unlocked
			 */
			public virtual bool OnEdgeLock(int edgeFlags)
			{
				return false;
			}

			/**
			 * Called when the user has started a deliberate drag away from one
			 * of the subscribed edges in the parent view while no child view is currently captured.
			 *
			 * @param edgeFlags A combination of edge flags describing the edge(s) dragged
			 * @param pointerId ID of the pointer touching the described edge(s)
			 * @see #EDGE_LEFT
			 * @see #EDGE_TOP
			 * @see #EDGE_RIGHT
			 * @see #EDGE_BOTTOM
			 */
			public virtual void OnEdgeDragStarted(int edgeFlags, int pointerId) { }

			/**
			 * Called to determine the Z-order of child views.
			 *
			 * @param index the ordered position to query for
			 * @return index of the view that should be ordered at position <code>index</code>
			 */
			public virtual int GetOrderedChildIndex(int index)
			{
				return index;
			}

			/**
			 * Return the magnitude of a draggable child view's horizontal range of motion in pixels.
			 * This method should return 0 for views that cannot move horizontally.
			 *
			 * @param child Child view to check
			 * @return range of horizontal motion in pixels
			 */
			public virtual int GetViewHorizontalDragRange(View child)
			{
				return 0;
			}

			/**
			 * Return the magnitude of a draggable child view's vertical range of motion in pixels.
			 * This method should return 0 for views that cannot move vertically.
			 *
			 * @param child Child view to check
			 * @return range of vertical motion in pixels
			 */
			public virtual int GetViewVerticalDragRange(View child)
			{
				return 0;
			}

			/**
			 * Called when the user's input indicates that they want to capture the given child view
			 * with the pointer indicated by pointerId. The callback should return true if the user
			 * is permitted to drag the given view with the indicated pointer.
			 *
			 * <p>ViewDragHelper may call this method multiple times for the same view even if
			 * the view is already captured; this indicates that a new pointer is trying to take
			 * control of the view.</p>
			 *
			 * <p>If this method returns true, a call to {@link #onViewCaptured(android.view.View, int)}
			 * will follow if the capture is successful.</p>
			 *
			 * @param child Child the user is attempting to capture
			 * @param pointerId ID of the pointer attempting the capture
			 * @return true if capture should be allowed, false otherwise
			 */
			public abstract bool TryCaptureView(View child, int pointerId);

			/**
			 * Restrict the motion of the dragged child view along the horizontal axis.
			 * The default implementation does not allow horizontal motion; the extending
			 * class must override this method and provide the desired clamping.
			 *
			 *
			 * @param child Child view being dragged
			 * @param left Attempted motion along the X axis
			 * @param dx Proposed change in position for left
			 * @return The new clamped position for left
			 */
			public virtual int ClampViewPositionHorizontal(View child, int left, int dx)
			{
				return 0;
			}

			/**
			 * Restrict the motion of the dragged child view along the vertical axis.
			 * The default implementation does not allow vertical motion; the extending
			 * class must override this method and provide the desired clamping.
			 *
			 *
			 * @param child Child view being dragged
			 * @param top Attempted motion along the Y axis
			 * @param dy Proposed change in position for top
			 * @return The new clamped position for top
			 */
			public virtual int ClampViewPositionVertical(View child, int top, int dy)
			{
				return 0;
			}
		}

		/**
		 * Interpolator defining the animation curve for mScroller
		 */
		class CustomInterpolator : Object, IInterpolator
		{
			public float GetInterpolation(float t)
			{
				t -= 1.0f;
				return t * t * t * t * t + 1.0f;
			}
		}
		private readonly CustomInterpolator sInterpolator = new CustomInterpolator();


		public class CustomRunnable : Object, IRunnable
		{
			private readonly ViewDragHelper owner;

			public CustomRunnable(ViewDragHelper owner)
			{
				this.owner = owner;
			}
			public void Run()
			{
				owner.setDragState(STATE_IDLE);
			}
		}

		private readonly CustomRunnable mSetIdleRunnable;

		/**
		 * Factory method to create a new ViewDragHelper.
		 *
		 * @param forParent Parent view to monitor
		 * @param cb Callback to provide information and receive events
		 * @return a new ViewDragHelper instance
		 */
		public static ViewDragHelper create(ViewGroup forParent, Callback cb)
		{
			return new ViewDragHelper(forParent.Context, forParent, null, cb);
		}

		/**
		 * Factory method to create a new ViewDragHelper with the specified interpolator.
		 *
		 * @param forParent Parent view to monitor
		 * @param interpolator interpolator for scroller
		 * @param cb Callback to provide information and receive events
		 * @return a new ViewDragHelper instance
		 */
		public static ViewDragHelper create(ViewGroup forParent, IInterpolator interpolator, Callback cb)
		{
			return new ViewDragHelper(forParent.Context, forParent, interpolator, cb);
		}

		/**
     * Factory method to create a new ViewDragHelper.
     *
     * @param forParent Parent view to monitor
     * @param sensitivity Multiplier for how sensitive the helper should be about detecting
     *                    the start of a drag. Larger values are more sensitive. 1.0f is normal.
     * @param cb Callback to provide information and receive events
     * @return a new ViewDragHelper instance
     */
		public static ViewDragHelper create(ViewGroup forParent, float sensitivity, Callback cb)
		{
			ViewDragHelper helper = create(forParent, cb);
			helper.mTouchSlop = (int)(helper.mTouchSlop * (1 / sensitivity));
			return helper;
		}

		/**
		 * Factory method to create a new ViewDragHelper with the specified interpolator.
		 *
		 * @param forParent Parent view to monitor
		 * @param sensitivity Multiplier for how sensitive the helper should be about detecting
		 *                    the start of a drag. Larger values are more sensitive. 1.0f is normal.
		 * @param interpolator interpolator for scroller
		 * @param cb Callback to provide information and receive events
		 * @return a new ViewDragHelper instance
		 */
		public static ViewDragHelper create(ViewGroup forParent, float sensitivity, IInterpolator interpolator, Callback cb)
		{
			ViewDragHelper helper = create(forParent, interpolator, cb);
			helper.mTouchSlop = (int)(helper.mTouchSlop * (1 / sensitivity));
			return helper;
		}

		/**
		 * Apps should use ViewDragHelper.create() to get a new instance.
		 * This will allow VDH to use internal compatibility implementations for different
		 * platform versions.
		 * If the interpolator is null, the default interpolator will be used.
		 *
		 * @param context Context to initialize config-dependent params from
		 * @param forParent Parent view to monitor
		 * @param interpolator interpolator for scroller
		 */
		private ViewDragHelper(Context context, ViewGroup forParent, IInterpolator interpolator, Callback cb)
		{
			if (forParent == null)
			{
				throw new IllegalArgumentException("Parent view may not be null");
			}
			if (cb == null)
			{
				throw new IllegalArgumentException("Callback may not be null");
			}

			mParentView = forParent;
			mCallback = cb;

			ViewConfiguration vc = ViewConfiguration.Get(context);
			float density = context.Resources.DisplayMetrics.Density;
			mEdgeSize = (int)(EDGE_SIZE * density + 0.5f);

			mTouchSlop = vc.ScaledTouchSlop;
			mMaxVelocity = vc.ScaledMaximumFlingVelocity;
			mMinVelocity = vc.ScaledMinimumFlingVelocity;

			//mScroller = ScrollerCompat.Create(context, interpolator);
			mScroller = ScrollerCompat.Create(context, sInterpolator);

			//mScroller = new OverScroller(context,  i);
			mSetIdleRunnable = new CustomRunnable(this);
		}

		/**
		 * Set the minimum velocity that will be detected as having a magnitude greater than zero
		 * in pixels per second. Callback methods accepting a velocity will be clamped appropriately.
		 *
		 * @param minVel Minimum velocity to detect
		 */
		public void setMinVelocity(float minVel)
		{
			mMinVelocity = minVel;
		}

		/**
		 * Return the currently configured minimum velocity. Any flings with a magnitude less
		 * than this value in pixels per second. Callback methods accepting a velocity will receive
		 * zero as a velocity value if the real detected velocity was below this threshold.
		 *
		 * @return the minimum velocity that will be detected
		 */
		public float getMinVelocity()
		{
			return mMinVelocity;
		}

		/**
		 * Retrieve the current drag state of this helper. This will return one of
		 * {@link #STATE_IDLE}, {@link #STATE_DRAGGING} or {@link #STATE_SETTLING}.
		 * @return The current drag state
		 */
		public int getViewDragState()
		{
			return mDragState;
		}

		/**
		 * Enable edge tracking for the selected edges of the parent view.
		 * The callback's {@link Callback#onEdgeTouched(int, int)} and
		 * {@link Callback#onEdgeDragStarted(int, int)} methods will only be invoked
		 * for edges for which edge tracking has been enabled.
		 *
		 * @param edgeFlags Combination of edge flags describing the edges to watch
		 * @see #EDGE_LEFT
		 * @see #EDGE_TOP
		 * @see #EDGE_RIGHT
		 * @see #EDGE_BOTTOM
		 */
		public void setEdgeTrackingEnabled(int edgeFlags)
		{
			mTrackingEdges = edgeFlags;
		}

		/**
		 * Return the size of an edge. This is the range in pixels along the edges of this view
		 * that will actively detect edge touches or drags if edge tracking is enabled.
		 *
		 * @return The size of an edge in pixels
		 * @see #setEdgeTrackingEnabled(int)
		 */
		public int getEdgeSize()
		{
			return mEdgeSize;
		}

		/**
		 * Capture a specific child view for dragging within the parent. The callback will be notified
		 * but {@link Callback#tryCaptureView(android.view.View, int)} will not be asked permission to
		 * capture this view.
		 *
		 * @param childView Child view to capture
		 * @param activePointerId ID of the pointer that is dragging the captured child view
		 */
		public void captureChildView(View childView, int activePointerId)
		{
			if (childView.Parent != mParentView)
			{
				throw new IllegalArgumentException("captureChildView: parameter must be a descendant " +
						"of the ViewDragHelper's tracked parent view (" + mParentView + ")");
			}

			mCapturedView = childView;
			mActivePointerId = activePointerId;
			mCallback.OnViewCaptured(childView, activePointerId);
			setDragState(STATE_DRAGGING);
		}

		/**
		 * @return The currently captured view, or null if no view has been captured.
		 */
		public View getCapturedView()
		{
			return mCapturedView;
		}

		/**
		 * @return The ID of the pointer currently dragging the captured view,
		 *         or {@link #INVALID_POINTER}.
		 */
		public int getActivePointerId()
		{
			return mActivePointerId;
		}

		/**
		 * @return The minimum distance in pixels that the user must travel to initiate a drag
		 */
		public int getTouchSlop()
		{
			return mTouchSlop;
		}

		/**
		 * The result of a call to this method is equivalent to
		 * {@link #processTouchEvent(android.view.MotionEvent)} receiving an ACTION_CANCEL event.
		 */
		public void cancel()
		{
			mActivePointerId = INVALID_POINTER;
			clearMotionHistory();

			if (mVelocityTracker != null)
			{
				mVelocityTracker.Recycle();
				mVelocityTracker = null;
			}
		}

		/**
		 * {@link #cancel()}, but also abort all motion in progress and snap to the end of any
		 * animation.
		 */
		public void abort()
		{
			cancel();
			if (mDragState == STATE_SETTLING)
			{
				int oldX = mScroller.FinalX;
				int oldY = mScroller.FinalY;
				mScroller.AbortAnimation();
				int newX = mScroller.FinalX;
				int newY = mScroller.FinalY;
				mCallback.OnViewPositionChanged(mCapturedView, newX, newY, newX - oldX, newY - oldY);
			}
			setDragState(STATE_IDLE);
		}

		/**
		 * Animate the view <code>child</code> to the given (left, top) position.
		 * If this method returns true, the caller should invoke {@link #continueSettling(bool)}
		 * on each subsequent frame to continue the motion until it returns false. If this method
		 * returns false there is no further work to do to complete the movement.
		 *
		 * <p>This operation does not count as a capture event, though {@link #getCapturedView()}
		 * will still report the sliding view while the slide is in progress.</p>
		 *
		 * @param child Child view to capture and animate
		 * @param Left  left position of child
		 * @param Top  top position of child
		 * @return true if animation should continue through {@link #continueSettling(bool)} calls
		 */
		public bool smoothSlideViewTo(View child, int Left, int Top)
		{
			mCapturedView = child;
			mActivePointerId = INVALID_POINTER;

			return forceSettleCapturedViewAt(Left, Top, 0, 0);
		}

		/**
		 * Settle the captured view at the given (left, top) position.
		 * The appropriate velocity from prior motion will be taken into account.
		 * If this method returns true, the caller should invoke {@link #continueSettling(bool)}
		 * on each subsequent frame to continue the motion until it returns false. If this method
		 * returns false there is no further work to do to complete the movement.
		 *
		 * @param Left Settled left edge position for the captured view
		 * @param Top Settled top edge position for the captured view
		 * @return true if animation should continue through {@link #continueSettling(bool)} calls
		 */
		public bool settleCapturedViewAt(int Left, int Top)
		{
			if (!mReleaseInProgress)
			{
				throw new IllegalStateException("Cannot settleCapturedViewAt outside of a call to " +
						"Callback#onViewReleased");
			}

			return forceSettleCapturedViewAt(Left, Top,
					(int)mVelocityTracker.GetXVelocity(mActivePointerId),
					(int)mVelocityTracker.GetYVelocity(mActivePointerId));
		}

		/**
		 * Settle the captured view at the given (left, top) position.
		 *
		 * @param Left Target left position for the captured view
		 * @param Top Target top position for the captured view
		 * @param xvel Horizontal velocity
		 * @param yvel Vertical velocity
		 * @return true if animation should continue through {@link #continueSettling(bool)} calls
		 */
		private bool forceSettleCapturedViewAt(int Left, int Top, int xvel, int yvel)
		{
			int startLeft = mCapturedView.Left;
			int startTop = mCapturedView.Top;
			int dx = Left - startLeft;
			int dy = Top - startTop;

			if (dx == 0 && dy == 0)
			{
				// Nothing to do. Send callbacks, be done.
				mScroller.AbortAnimation();
				setDragState(STATE_IDLE);
				return false;
			}

			int duration = computeSettleDuration(mCapturedView, dx, dy, xvel, yvel);
			mScroller.StartScroll(startLeft, startTop, dx, dy, duration);

			setDragState(STATE_SETTLING);
			return true;
		}

		private int computeSettleDuration(View child, int dx, int dy, int xvel, int yvel)
		{
			xvel = clampMag(xvel, (int)mMinVelocity, (int)mMaxVelocity);
			yvel = clampMag(yvel, (int)mMinVelocity, (int)mMaxVelocity);
			int absDx = Math.Abs(dx);
			int absDy = Math.Abs(dy);
			int absXVel = Math.Abs(xvel);
			int absYVel = Math.Abs(yvel);
			int addedVel = absXVel + absYVel;
			int addedDistance = absDx + absDy;

			float xweight = xvel != 0 ? (float)absXVel / addedVel :
				   (float)absDx / addedDistance;
			float yweight = yvel != 0 ? (float)absYVel / addedVel :
				   (float)absDy / addedDistance;

			int xduration = computeAxisDuration(dx, xvel, mCallback.GetViewHorizontalDragRange(child));
			int yduration = computeAxisDuration(dy, yvel, mCallback.GetViewVerticalDragRange(child));

			return (int)(xduration * xweight + yduration * yweight);
		}

		private int computeAxisDuration(int delta, int velocity, int motionRange)
		{
			if (delta == 0)
			{
				return 0;
			}

			int width = mParentView.Width;
			int halfWidth = width / 2;
			float distanceRatio = Math.Min(1f, (float)Math.Abs(delta) / width);
			float distance = halfWidth + halfWidth *
				   distanceInfluenceForSnapDuration(distanceRatio);

			int duration;
			velocity = Math.Abs(velocity);
			if (velocity > 0)
			{
				duration = 4 * Math.Round(1000 * Math.Abs(distance / velocity));
			}
			else
			{
				float range = (float)Math.Abs(delta) / motionRange;
				duration = (int)((range + 1) * BASE_SETTLE_DURATION);
			}
			return Math.Min(duration, MAX_SETTLE_DURATION);
		}

		/**
		 * Clamp the magnitude of value for absMin and absMax.
		 * If the value is below the minimum, it will be clamped to zero.
		 * If the value is above the maximum, it will be clamped to the maximum.
		 *
		 * @param value Value to clamp
		 * @param absMin Absolute value of the minimum significant value to return
		 * @param absMax Absolute value of the maximum value to return
		 * @return The clamped value with the same sign as <code>value</code>
		 */
		private int clampMag(int value, int absMin, int absMax)
		{
			int absValue = Math.Abs(value);
			if (absValue < absMin) return 0;
			if (absValue > absMax) return value > 0 ? absMax : -absMax;
			return value;
		}

		/**
		 * Clamp the magnitude of value for absMin and absMax.
		 * If the value is below the minimum, it will be clamped to zero.
		 * If the value is above the maximum, it will be clamped to the maximum.
		 *
		 * @param value Value to clamp
		 * @param absMin Absolute value of the minimum significant value to return
		 * @param absMax Absolute value of the maximum value to return
		 * @return The clamped value with the same sign as <code>value</code>
		 */
		private float clampMag(float value, float absMin, float absMax)
		{
			float absValue = Math.Abs(value);
			if (absValue < absMin) return 0;
			if (absValue > absMax) return value > 0 ? absMax : -absMax;
			return value;
		}

		private float distanceInfluenceForSnapDuration(float f)
		{
			f -= 0.5f; // center the values about 0.
			f *= 0.3f * (float)Math.Pi / 2.0f;
			return (float)Math.Sin(f);
		}

		/**
     * Settle the captured view based on standard free-moving fling behavior.
     * The caller should invoke {@link #continueSettling(bool)} on each subsequent frame
     * to continue the motion until it returns false.
     *
     * @param minLeft Minimum X position for the view's left edge
     * @param minTop Minimum Y position for the view's top edge
     * @param maxLeft Maximum X position for the view's left edge
     * @param maxTop Maximum Y position for the view's top edge
     */
		public void flingCapturedView(int minLeft, int minTop, int maxLeft, int maxTop)
		{
			if (!mReleaseInProgress)
			{
				throw new IllegalStateException("Cannot flingCapturedView outside of a call to " +
						"Callback#onViewReleased");
			}

			mScroller.Fling(mCapturedView.Left, mCapturedView.Top,
					(int)mVelocityTracker.GetXVelocity(mActivePointerId),
					(int)mVelocityTracker.GetYVelocity(mActivePointerId),
					minLeft, maxLeft, minTop, maxTop);

			setDragState(STATE_SETTLING);
		}

		/**
		 * Move the captured settling view by the appropriate amount for the current time.
		 * If <code>continueSettling</code> returns true, the caller should call it again
		 * on the next frame to continue.
		 *
		 * @param deferCallbacks true if state callbacks should be deferred via posted message.
		 *                       Set this to true if you are calling this method from
		 *                       {@link android.view.View#computeScroll()} or similar methods
		 *                       invoked as part of layout or drawing.
		 * @return true if settle is still in progress
		 */
		public bool continueSettling(bool deferCallbacks)
		{
			// Make sure, there is a captured view
			if (mCapturedView == null)
			{
				return false;
			}
			if (mDragState == STATE_SETTLING)
			{
				bool keepGoing = mScroller.ComputeScrollOffset();
				int x = mScroller.CurrX;
				int y = mScroller.CurrY;
				int dx = x - mCapturedView.Left;
				int dy = y - mCapturedView.Top;

				if (!keepGoing && dy != 0)
				{ //fix #525
				  //Invalid drag state
				  //mCapturedView.SetY(0);
					mCapturedView.Top = 0;
					return true;
				}

				if (dx != 0)
				{
					mCapturedView.OffsetLeftAndRight(dx);
				}
				if (dy != 0)
				{
					mCapturedView.OffsetTopAndBottom(dy);
				}

				if (dx != 0 || dy != 0)
				{
					mCallback.OnViewPositionChanged(mCapturedView, x, y, dx, dy);
				}

				if (keepGoing && x == mScroller.FinalX && y == mScroller.FinalY)
				{
					// Close enough. The interpolator/scroller might think we're still moving
					// but the user sure doesn't.
					mScroller.AbortAnimation();
					keepGoing = mScroller.IsFinished;
				}

				if (!keepGoing)
				{
					if (deferCallbacks)
					{
						mParentView.Post(mSetIdleRunnable);
					}
					else
					{
						setDragState(STATE_IDLE);
					}
				}
			}

			return mDragState == STATE_SETTLING;
		}

		/**
		 * Like all callback events this must happen on the UI thread, but release
		 * involves some extra semantics. During a release (mReleaseInProgress)
		 * is the only time it is valid to call {@link #settleCapturedViewAt(int, int)}
		 * or {@link #flingCapturedView(int, int, int, int)}.
		 */
		private void dispatchViewReleased(float xvel, float yvel)
		{
			mReleaseInProgress = true;
			mCallback.OnViewReleased(mCapturedView, xvel, yvel);
			mReleaseInProgress = false;

			if (mDragState == STATE_DRAGGING)
			{
				// onViewReleased didn't call a method that would have changed this. Go idle.
				setDragState(STATE_IDLE);
			}
		}

		private void clearMotionHistory()
		{
			if (mInitialMotionX == null)
			{
				return;
			}
			Arrays.Fill(mInitialMotionX, 0);
			Arrays.Fill(mInitialMotionY, 0);
			Arrays.Fill(mLastMotionX, 0);
			Arrays.Fill(mLastMotionY, 0);
			Arrays.Fill(mInitialEdgesTouched, 0);
			Arrays.Fill(mEdgeDragsInProgress, 0);
			Arrays.Fill(mEdgeDragsLocked, 0);
			mPointersDown = 0;
		}

		private void clearMotionHistory(int pointerId)
		{
			if (mInitialMotionX == null || mInitialMotionX.Length <= pointerId)
			{
				return;
			}
			mInitialMotionX[pointerId] = 0;
			mInitialMotionY[pointerId] = 0;
			mLastMotionX[pointerId] = 0;
			mLastMotionY[pointerId] = 0;
			mInitialEdgesTouched[pointerId] = 0;
			mEdgeDragsInProgress[pointerId] = 0;
			mEdgeDragsLocked[pointerId] = 0;
			mPointersDown &= ~(1 << pointerId);
		}

		private void ensureMotionHistorySizeForId(int pointerId)
		{
			if (mInitialMotionX == null || mInitialMotionX.Length <= pointerId)
			{
				float[] imx = new float[pointerId + 1];
				float[] imy = new float[pointerId + 1];
				float[] lmx = new float[pointerId + 1];
				float[] lmy = new float[pointerId + 1];
				int[] iit = new int[pointerId + 1];
				int[] edip = new int[pointerId + 1];
				int[] edl = new int[pointerId + 1];

				if (mInitialMotionX != null)
				{
					JavaSystem.Arraycopy(mInitialMotionX, 0, imx, 0, mInitialMotionX.Length);
					JavaSystem.Arraycopy(mInitialMotionY, 0, imy, 0, mInitialMotionY.Length);
					JavaSystem.Arraycopy(mLastMotionX, 0, lmx, 0, mLastMotionX.Length);
					JavaSystem.Arraycopy(mLastMotionY, 0, lmy, 0, mLastMotionY.Length);
					JavaSystem.Arraycopy(mInitialEdgesTouched, 0, iit, 0, mInitialEdgesTouched.Length);
					JavaSystem.Arraycopy(mEdgeDragsInProgress, 0, edip, 0, mEdgeDragsInProgress.Length);
					JavaSystem.Arraycopy(mEdgeDragsLocked, 0, edl, 0, mEdgeDragsLocked.Length);
				}

				mInitialMotionX = imx;
				mInitialMotionY = imy;
				mLastMotionX = lmx;
				mLastMotionY = lmy;
				mInitialEdgesTouched = iit;
				mEdgeDragsInProgress = edip;
				mEdgeDragsLocked = edl;
			}
		}

		private void saveInitialMotion(float x, float y, int pointerId)
		{
			ensureMotionHistorySizeForId(pointerId);
			mInitialMotionX[pointerId] = mLastMotionX[pointerId] = x;
			mInitialMotionY[pointerId] = mLastMotionY[pointerId] = y;
			mInitialEdgesTouched[pointerId] = getEdgesTouched((int)x, (int)y);
			mPointersDown |= 1 << pointerId;
		}

		private void saveLastMotion(MotionEvent ev)
		{
			int pointerCount = ev.PointerCount;
			for (int i = 0; i < pointerCount; i++)
			{
				int pointerId = ev.GetPointerId(i);
				float x = ev.GetX(i);
				float y = ev.GetY(i);
				// Sometimes we can try and save last motion for a pointer never recorded in initial motion. In this case we just discard it.
				if (mLastMotionX != null && mLastMotionY != null
						&& mLastMotionX.Length > pointerId && mLastMotionY.Length > pointerId)
				{
					mLastMotionX[pointerId] = x;
					mLastMotionY[pointerId] = y;
				}
			}
		}

		/**
		 * Check if the given pointer ID represents a pointer that is currently down (to the best
		 * of the ViewDragHelper's knowledge).
		 *
		 * <p>The state used to report this information is populated by the methods
		 * {@link #shouldInterceptTouchEvent(android.view.MotionEvent)} or
		 * {@link #processTouchEvent(android.view.MotionEvent)}. If one of these methods has not
		 * been called for all relevant MotionEvents to track, the information reported
		 * by this method may be stale or incorrect.</p>
		 *
		 * @param pointerId pointer ID to check; corresponds to IDs provided by MotionEvent
		 * @return true if the pointer with the given ID is still down
		 */
		public bool isPointerDown(int pointerId)
		{
			return (mPointersDown & 1 << pointerId) != 0;
		}

		public void setDragState(int state)
		{
			if (mDragState != state)
			{
				mDragState = state;
				mCallback.OnViewDragStateChanged(state);
				if (mDragState == STATE_IDLE)
				{
					mCapturedView = null;
				}
			}
		}

		/**
		 * Attempt to capture the view with the given pointer ID. The callback will be involved.
		 * This will put us into the "dragging" state. If we've already captured this view with
		 * this pointer this method will immediately return true without consulting the callback.
		 *
		 * @param toCapture View to capture
		 * @param pointerId Pointer to capture with
		 * @return true if capture was successful
		 */
		bool tryCaptureViewForDrag(View toCapture, int pointerId)
		{
			if (toCapture == mCapturedView && mActivePointerId == pointerId)
			{
				// Already done!
				return true;
			}
			if (toCapture != null && mCallback.TryCaptureView(toCapture, pointerId))
			{
				mActivePointerId = pointerId;
				captureChildView(toCapture, pointerId);
				return true;
			}
			return false;
		}

		/**
		 * Tests scrollability within child views of v given a delta of dx.
		 *
		 * @param v View to test for horizontal scrollability
		 * @param checkV Whether the view v passed should itself be checked for scrollability (true),
		 *               or just its children (false).
		 * @param dx Delta scrolled in pixels along the X axis
		 * @param dy Delta scrolled in pixels along the Y axis
		 * @param x X coordinate of the active touch point
		 * @param y Y coordinate of the active touch point
		 * @return true if child views of v can be scrolled by delta of dx.
		 */
		protected bool canScroll(View v, bool checkV, int dx, int dy, int x, int y)
		{
			if (v is ViewGroup)
			{
				ViewGroup group = (ViewGroup)v;
				int scrollX = v.ScrollX;
				int scrollY = v.ScrollY;
				int count = group.ChildCount;
				// Count backwards - let topmost views consume scroll distance first.
				for (int i = count - 1; i >= 0; i--)
				{
					// TODO: Add versioned support here for transformed views.
					// This will not work for transformed views in Honeycomb+
					View child = group.GetChildAt(i);
					if (x + scrollX >= child.Left && x + scrollX < child.Right &&
							y + scrollY >= child.Top && y + scrollY < child.Bottom &&
							canScroll(child, true, dx, dy, x + scrollX - child.Left,
									y + scrollY - child.Top))
					{
						return true;
					}
				}
			}

			return checkV && (v.CanScrollHorizontally(-dx) || v.CanScrollVertically(-dy));
		}

		/**
		 * Check if this event as provided to the parent view's onInterceptTouchEvent should
		 * cause the parent to intercept the touch event stream.
		 *
		 * @param ev MotionEvent provided to onInterceptTouchEvent
		 * @return true if the parent view should return true from onInterceptTouchEvent
		 */
		public bool shouldInterceptTouchEvent(MotionEvent ev)
		{
			MotionEventActions action = ev.ActionMasked;
			int actionIndex = ev.ActionIndex;

			if (action == MotionEventActions.Down)
			{
				// Reset things for a new event stream, just in case we didn't get
				// the whole previous stream.
				cancel();
			}

			if (mVelocityTracker == null)
			{
				mVelocityTracker = VelocityTracker.Obtain();
			}
			mVelocityTracker.AddMovement(ev);

			switch (action)
			{
				case MotionEventActions.Down:
					{
						float x = ev.GetX();
						float y = ev.GetY();
						int pointerId = ev.GetPointerId(0);
						saveInitialMotion(x, y, pointerId);

						View toCapture = findTopChildUnder((int)x, (int)y);

						// Catch a settling view if possible.
						if (toCapture == mCapturedView && mDragState == STATE_SETTLING)
						{
							tryCaptureViewForDrag(toCapture, pointerId);
						}

						int edgesTouched = mInitialEdgesTouched[pointerId];
						if ((edgesTouched & mTrackingEdges) != 0)
						{
							mCallback.OnEdgeTouched(edgesTouched & mTrackingEdges, pointerId);
						}
						break;
					}

				case MotionEventActions.PointerDown:
					{
						int pointerId = ev.GetPointerId(actionIndex);
						float x = ev.GetX(actionIndex);
						float y = ev.GetY(actionIndex);

						saveInitialMotion(x, y, pointerId);

						// A ViewDragHelper can only manipulate one view at a time.
						if (mDragState == STATE_IDLE)
						{
							int edgesTouched = mInitialEdgesTouched[pointerId];
							if ((edgesTouched & mTrackingEdges) != 0)
							{
								mCallback.OnEdgeTouched(edgesTouched & mTrackingEdges, pointerId);
							}
						}
						else if (mDragState == STATE_SETTLING)
						{
							// Catch a settling view if possible.
							View toCapture = findTopChildUnder((int)x, (int)y);
							if (toCapture == mCapturedView)
							{
								tryCaptureViewForDrag(toCapture, pointerId);
							}
						}
						break;
					}

				case MotionEventActions.Move:
					{
						// First to cross a touch slop over a draggable view wins. Also report edge drags.
						int pointerCount = ev.PointerCount;
						for (int i = 0; i < pointerCount && mInitialMotionX != null && mInitialMotionY != null; i++)
						{
							int pointerId = ev.GetPointerId(i);
							if (pointerId >= mInitialMotionX.Length || pointerId >= mInitialMotionY.Length)
							{
								continue;
							}
							float x = ev.GetX(i);
							float y = ev.GetY(i);
							float dx = x - mInitialMotionX[pointerId];
							float dy = y - mInitialMotionY[pointerId];

							reportNewEdgeDrags(dx, dy, pointerId);
							if (mDragState == STATE_DRAGGING)
							{
								// Callback might have started an edge drag
								break;
							}

							View toCapture = findTopChildUnder((int)mInitialMotionX[pointerId], (int)mInitialMotionY[pointerId]);
							if (toCapture != null && checkTouchSlop(toCapture, dx, dy) &&
									tryCaptureViewForDrag(toCapture, pointerId))
							{
								break;
							}
						}
						saveLastMotion(ev);
						break;
					}

				case MotionEventActions.PointerUp:
					{
						int pointerId = ev.GetPointerId(actionIndex);
						clearMotionHistory(pointerId);
						break;
					}

				case MotionEventActions.Up:
				case MotionEventActions.Cancel:
					{
						cancel();
						break;
					}
			}

			return mDragState == STATE_DRAGGING;
		}

		/**
		 * Process a touch event received by the parent view. This method will dispatch callback events
		 * as needed before returning. The parent view's onTouchEvent implementation should call this.
		 *
		 * @param ev The touch event received by the parent view
		 */
		public void processTouchEvent(MotionEvent ev)
		{
			MotionEventActions action = ev.ActionMasked;
			int actionIndex = ev.ActionIndex;

			if (action == MotionEventActions.Down)
			{
				// Reset things for a new event stream, just in case we didn't get
				// the whole previous stream.
				cancel();
			}

			if (mVelocityTracker == null)
			{
				mVelocityTracker = VelocityTracker.Obtain();
			}
			mVelocityTracker.AddMovement(ev);

			switch (action)
			{
				case MotionEventActions.Down:
					{
						float x = ev.GetX();
						float y = ev.GetY();
						int pointerId = ev.GetPointerId(0);
						View toCapture = findTopChildUnder((int)x, (int)y);

						saveInitialMotion(x, y, pointerId);

						// Since the parent is already directly processing this touch event,
						// there is no reason to delay for a slop before dragging.
						// Start immediately if possible.
						tryCaptureViewForDrag(toCapture, pointerId);

						int edgesTouched = mInitialEdgesTouched[pointerId];
						if ((edgesTouched & mTrackingEdges) != 0)
						{
							mCallback.OnEdgeTouched(edgesTouched & mTrackingEdges, pointerId);
						}
						break;
					}

				case MotionEventActions.PointerDown:
					{
						int pointerId = ev.GetPointerId(actionIndex);
						float x = ev.GetX(actionIndex);
						float y = ev.GetY(actionIndex);

						saveInitialMotion(x, y, pointerId);

						// A ViewDragHelper can only manipulate one view at a time.
						if (mDragState == STATE_IDLE)
						{
							// If we're idle we can do anything! Treat it like a normal down event.

							View toCapture = findTopChildUnder((int)x, (int)y);
							tryCaptureViewForDrag(toCapture, pointerId);

							int edgesTouched = mInitialEdgesTouched[pointerId];
							if ((edgesTouched & mTrackingEdges) != 0)
							{
								mCallback.OnEdgeTouched(edgesTouched & mTrackingEdges, pointerId);
							}
						}
						else if (isCapturedViewUnder((int)x, (int)y))
						{
							// We're still tracking a captured view. If the same view is under this
							// point, we'll swap to controlling it with this pointer instead.
							// (This will still work if we're "catching" a settling view.)

							tryCaptureViewForDrag(mCapturedView, pointerId);
						}
						break;
					}

				case MotionEventActions.Move:
					{
						if (mDragState == STATE_DRAGGING)
						{
							int index = ev.FindPointerIndex(mActivePointerId);
							float x = ev.GetX(index);
							float y = ev.GetY(index);
							int idx = (int)(x - mLastMotionX[mActivePointerId]);
							int idy = (int)(y - mLastMotionY[mActivePointerId]);

							dragTo(mCapturedView.Left + idx, mCapturedView.Top + idy, idx, idy);

							saveLastMotion(ev);
						}
						else
						{
							// Check to see if any pointer is now over a draggable view.
							int pointerCount = ev.PointerCount;
							for (int i = 0; i < pointerCount; i++)
							{
								int pointerId = ev.GetPointerId(i)
									   ;
								float x = ev.GetX(i);
								float y = ev.GetY(i);
								float dx = x - mInitialMotionX[pointerId];
								float dy = y - mInitialMotionY[pointerId];

								reportNewEdgeDrags(dx, dy, pointerId);
								if (mDragState == STATE_DRAGGING)
								{
									// Callback might have started an edge drag.
									break;
								}

								View toCapture = findTopChildUnder((int)mInitialMotionX[pointerId], (int)mInitialMotionY[pointerId]);
								if (checkTouchSlop(toCapture, dx, dy) &&
										tryCaptureViewForDrag(toCapture, pointerId))
								{
									break;
								}
							}
							saveLastMotion(ev);
						}
						break;
					}

				case MotionEventActions.PointerUp:
					{
						int pointerId = ev.GetPointerId(actionIndex);
						if (mDragState == STATE_DRAGGING && pointerId == mActivePointerId)
						{
							// Try to find another pointer that's still holding on to the captured view.
							int newActivePointer = INVALID_POINTER;
							int pointerCount = ev.PointerCount;
							for (int i = 0; i < pointerCount; i++)
							{
								int id = ev.GetPointerId(i);
								if (id == mActivePointerId)
								{
									// This one's going away, skip.
									continue;
								}

								float x = ev.GetX(i);
								float y = ev.GetY(i);
								if (findTopChildUnder((int)x, (int)y) == mCapturedView &&
										tryCaptureViewForDrag(mCapturedView, id))
								{
									newActivePointer = mActivePointerId;
									break;
								}
							}

							if (newActivePointer == INVALID_POINTER)
							{
								// We didn't find another pointer still touching the view, release it.
								releaseViewForPointerUp();
							}
						}
						clearMotionHistory(pointerId);
						break;
					}

				case MotionEventActions.Up:
					{
						if (mDragState == STATE_DRAGGING)
						{
							releaseViewForPointerUp();
						}
						cancel();
						break;
					}

				case MotionEventActions.Cancel:
					{
						if (mDragState == STATE_DRAGGING)
						{
							dispatchViewReleased(0, 0);
						}
						cancel();
						break;
					}
			}
		}

		private void reportNewEdgeDrags(float dx, float dy, int pointerId)
		{
			int dragsStarted = 0;
			if (checkNewEdgeDrag(dx, dy, pointerId, EDGE_LEFT))
			{
				dragsStarted |= EDGE_LEFT;
			}
			if (checkNewEdgeDrag(dy, dx, pointerId, EDGE_TOP))
			{
				dragsStarted |= EDGE_TOP;
			}
			if (checkNewEdgeDrag(dx, dy, pointerId, EDGE_RIGHT))
			{
				dragsStarted |= EDGE_RIGHT;
			}
			if (checkNewEdgeDrag(dy, dx, pointerId, EDGE_BOTTOM))
			{
				dragsStarted |= EDGE_BOTTOM;
			}

			if (dragsStarted != 0)
			{
				mEdgeDragsInProgress[pointerId] |= dragsStarted;
				mCallback.OnEdgeDragStarted(dragsStarted, pointerId);
			}
		}

		private bool checkNewEdgeDrag(float delta, float odelta, int pointerId, int edge)
		{
			float absDelta = Math.Abs(delta);
			float absODelta = Math.Abs(odelta);

			if ((mInitialEdgesTouched[pointerId] & edge) != edge || (mTrackingEdges & edge) == 0 ||
					(mEdgeDragsLocked[pointerId] & edge) == edge ||
					(mEdgeDragsInProgress[pointerId] & edge) == edge ||
					(absDelta <= mTouchSlop && absODelta <= mTouchSlop))
			{
				return false;
			}
			if (absDelta < absODelta * 0.5f && mCallback.OnEdgeLock(edge))
			{
				mEdgeDragsLocked[pointerId] |= edge;
				return false;
			}
			return (mEdgeDragsInProgress[pointerId] & edge) == 0 && absDelta > mTouchSlop;
		}

		/**
		 * Check if we've crossed a reasonable touch slop for the given child view.
		 * If the child cannot be dragged along the horizontal or vertical axis, motion
		 * along that axis will not count toward the slop check.
		 *
		 * @param child Child to check
		 * @param dx Motion since initial position along X axis
		 * @param dy Motion since initial position along Y axis
		 * @return true if the touch slop has been crossed
		 */
		private bool checkTouchSlop(View child, float dx, float dy)
		{
			if (child == null)
			{
				return false;
			}
			bool checkHorizontal = mCallback.GetViewHorizontalDragRange(child) > 0;
			bool checkVertical = mCallback.GetViewVerticalDragRange(child) > 0;

			if (checkHorizontal && checkVertical)
			{
				return dx * dx + dy * dy > mTouchSlop * mTouchSlop;
			}
			else if (checkHorizontal)
			{
				return Math.Abs(dx) > mTouchSlop;
			}
			else if (checkVertical)
			{
				return Math.Abs(dy) > mTouchSlop;
			}
			return false;
		}

		/**
		 * Check if any pointer tracked in the current gesture has crossed
		 * the required slop threshold.
		 *
		 * <p>This depends on internal state populated by
		 * {@link #shouldInterceptTouchEvent(android.view.MotionEvent)} or
		 * {@link #processTouchEvent(android.view.MotionEvent)}. You should only rely on
		 * the results of this method after all currently available touch data
		 * has been provided to one of these two methods.</p>
		 *
		 * @param directions Combination of direction flags, see {@link #DIRECTION_HORIZONTAL},
		 *                   {@link #DIRECTION_VERTICAL}, {@link #DIRECTION_ALL}
		 * @return true if the slop threshold has been crossed, false otherwise
		 */
		public bool checkTouchSlop(int directions)
		{
			int count = mInitialMotionX.Length;
			for (int i = 0; i < count; i++)
			{
				if (checkTouchSlop(directions, i))
				{
					return true;
				}
			}
			return false;
		}

		/**
		 * Check if the specified pointer tracked in the current gesture has crossed
		 * the required slop threshold.
		 *
		 * <p>This depends on internal state populated by
		 * {@link #shouldInterceptTouchEvent(android.view.MotionEvent)} or
		 * {@link #processTouchEvent(android.view.MotionEvent)}. You should only rely on
		 * the results of this method after all currently available touch data
		 * has been provided to one of these two methods.</p>
		 *
		 * @param directions Combination of direction flags, see {@link #DIRECTION_HORIZONTAL},
		 *                   {@link #DIRECTION_VERTICAL}, {@link #DIRECTION_ALL}
		 * @param pointerId ID of the pointer to slop check as specified by MotionEvent
		 * @return true if the slop threshold has been crossed, false otherwise
		 */
		public bool checkTouchSlop(int directions, int pointerId)
		{
			if (!isPointerDown(pointerId))
			{
				return false;
			}

			bool checkHorizontal = (directions & DIRECTION_HORIZONTAL) == DIRECTION_HORIZONTAL;
			bool checkVertical = (directions & DIRECTION_VERTICAL) == DIRECTION_VERTICAL;

			float dx = mLastMotionX[pointerId] - mInitialMotionX[pointerId];
			float dy = mLastMotionY[pointerId] - mInitialMotionY[pointerId];

			if (checkHorizontal && checkVertical)
			{
				return dx * dx + dy * dy > mTouchSlop * mTouchSlop;
			}
			else if (checkHorizontal)
			{
				return Math.Abs(dx) > mTouchSlop;
			}
			else if (checkVertical)
			{
				return Math.Abs(dy) > mTouchSlop;
			}
			return false;
		}

		/**
		 * Check if any of the edges specified were initially touched in the currently active gesture.
		 * If there is no currently active gesture this method will return false.
		 *
		 * @param edges Edges to check for an initial edge touch. See {@link #EDGE_LEFT},
		 *              {@link #EDGE_TOP}, {@link #EDGE_RIGHT}, {@link #EDGE_BOTTOM} and
		 *              {@link #EDGE_ALL}
		 * @return true if any of the edges specified were initially touched in the current gesture
		 */
		public bool isEdgeTouched(int edges)
		{
			int count = mInitialEdgesTouched.Length;
			for (int i = 0; i < count; i++)
			{
				if (isEdgeTouched(edges, i))
				{
					return true;
				}
			}
			return false;
		}

		/**
		 * Check if any of the edges specified were initially touched by the pointer with
		 * the specified ID. If there is no currently active gesture or if there is no pointer with
		 * the given ID currently down this method will return false.
		 *
		 * @param edges Edges to check for an initial edge touch. See {@link #EDGE_LEFT},
		 *              {@link #EDGE_TOP}, {@link #EDGE_RIGHT}, {@link #EDGE_BOTTOM} and
		 *              {@link #EDGE_ALL}
		 * @return true if any of the edges specified were initially touched in the current gesture
		 */
		public bool isEdgeTouched(int edges, int pointerId)
		{
			return isPointerDown(pointerId) && (mInitialEdgesTouched[pointerId] & edges) != 0;
		}

		public bool isDragging()
		{
			return mDragState == STATE_DRAGGING;
		}

		private void releaseViewForPointerUp()
		{
			mVelocityTracker.ComputeCurrentVelocity(1000, mMaxVelocity);
			float xvel = clampMag(mVelocityTracker.XVelocity, mMinVelocity, mMaxVelocity);
			float yvel = clampMag(mVelocityTracker.YVelocity, mMinVelocity, mMaxVelocity);
			dispatchViewReleased(xvel, yvel);
		}

		private void dragTo(int left, int top, int dx, int dy)
		{
			int clampedX = left;
			int clampedY = top;
			int oldLeft = mCapturedView.Left;
			int oldTop = mCapturedView.Top;
			if (dx != 0)
			{
				clampedX = mCallback.ClampViewPositionHorizontal(mCapturedView, left, dx);
				mCapturedView.OffsetLeftAndRight(clampedX - oldLeft);
			}
			if (dy != 0)
			{
				clampedY = mCallback.ClampViewPositionVertical(mCapturedView, top, dy);
				mCapturedView.OffsetTopAndBottom(clampedY - oldTop);
			}

			if (dx != 0 || dy != 0)
			{
				int clampedDx = clampedX - oldLeft;
				int clampedDy = clampedY - oldTop;
				mCallback.OnViewPositionChanged(mCapturedView, clampedX, clampedY,
						clampedDx, clampedDy);
			}
		}

		/**
		 * Determine if the currently captured view is under the given point in the
		 * parent view's coordinate system. If there is no captured view this method
		 * will return false.
		 *
		 * @param x X position to test in the parent's coordinate system
		 * @param y Y position to test in the parent's coordinate system
		 * @return true if the captured view is under the given point, false otherwise
		 */
		public bool isCapturedViewUnder(int x, int y)
		{
			return isViewUnder(mCapturedView, x, y);
		}

		/**
		 * Determine if the supplied view is under the given point in the
		 * parent view's coordinate system.
		 *
		 * @param view Child view of the parent to hit test
		 * @param x X position to test in the parent's coordinate system
		 * @param y Y position to test in the parent's coordinate system
		 * @return true if the supplied view is under the given point, false otherwise
		 */
		public bool isViewUnder(View view, int x, int y)
		{
			if (view == null)
			{
				return false;
			}
			return x >= view.Left &&
					x < view.Right &&
					y >= view.Top &&
					y < view.Bottom;
		}

		/**
		 * Find the topmost child under the given point within the parent view's coordinate system.
		 * The child order is determined using {@link Callback#getOrderedChildIndex(int)}.
		 *
		 * @param x X position to test in the parent's coordinate system
		 * @param y Y position to test in the parent's coordinate system
		 * @return The topmost child view under (x, y) or null if none found.
		 */
		public View findTopChildUnder(int x, int y)
		{
			int childCount = mParentView.ChildCount;
			for (int i = childCount - 1; i >= 0; i--)
			{
				View child = mParentView.GetChildAt(mCallback.GetOrderedChildIndex(i));
				if (x >= child.Left && x < child.Right &&
						y >= child.Top && y < child.Bottom)
				{
					return child;
				}
			}
			return null;
		}

		private int getEdgesTouched(int x, int y)
		{
			int result = 0;

			if (x < mParentView.Left + mEdgeSize) result |= EDGE_LEFT;
			if (y < mParentView.Top + mEdgeSize) result |= EDGE_TOP;
			if (x > mParentView.Right - mEdgeSize) result |= EDGE_RIGHT;
			if (y > mParentView.Bottom - mEdgeSize) result |= EDGE_BOTTOM;

			return result;
		}
	}
}