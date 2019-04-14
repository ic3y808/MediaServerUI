using System;

using Android.Content;
using Android.Content.Res;
using Android.Graphics;
using Android.Graphics.Drawables;
using Android.OS;
using Android.Runtime;
using Android.Support.V4.View;
using Android.Util;
using Android.Views;
using Android.Views.Accessibility;
using Android.Views.Animations;
using Java.Lang;
using Math = System.Math;

namespace Alloy.Widgets
{
	public sealed class SlidingUpPanelLayout : ViewGroup
	{
		private const string TAG = "SlidingUpPanelLayout";

		/**
		 * Default peeking out panel height
		 */
		private const int DEFAULT_PANEL_HEIGHT = 68;

		/**
		 * Default anchor point height
		 */
		private const float DEFAULT_ANCHOR_POINT = 1.0f;

		/**
		 * Default initial state for the component
		 */
		private const PanelState DEFAULT_SLIDE_STATE = PanelState.COLLAPSED;

		/**
		 * Default height of the shadow above the peeking out panel
		 */
		private const int DEFAULT_SHADOW_HEIGHT = 4;

		/**
		 * If no fade color is given by default it will fade to 80% gray.
		 */
		private static readonly int DEFAULT_FADE_COLOR = Color.Argb(100, 0, 0, 0);

		/**
		 * Default Minimum velocity that will be detected as a fling
		 */
		private const int DEFAULT_MIN_FLING_VELOCITY = 400;

		private const bool DEFAULT_OVERLAY_FLAG = false;
		/**
		 * Default is set to true for clip panel for performance reasons
		 */
		private const bool DEFAULT_CLIP_PANEL_FLAG = true;
		/**
		 * Default attributes for layout
		 */
		private static readonly int[] DEFAULT_ATTRS = { Android.Resource.Attribute.Gravity };
		/**
		 * Tag for the sliding state stored inside the bundle
		 */
		public const string SLIDING_STATE = "sliding_state";

		/**
		 * Minimum velocity that will be detected as a fling
		 */
		private int mMinFlingVelocity = DEFAULT_MIN_FLING_VELOCITY;

		/**
		 * The fade color used for the panel covered by the slider. 0 = no fading.
		 */
		private int mCoveredFadeColor = DEFAULT_FADE_COLOR;

		/**
		 * The paint used to dim the main layout when sliding
		 */
		private readonly Paint mCoveredFadePaint = new Paint();

		/**
		 * Drawable used to draw the shadow between panes.
		 */
		private readonly Drawable mShadowDrawable;

		/**
		 * The size of the overhang in pixels.
		 */
		private int mPanelHeight = -1;

		/**
		 * The size of the shadow in pixels.
		 */
		private int mShadowHeight = -1;

		/**
		 * Parallax offset
		 */
		private int mParallaxOffset = -1;

		/**
		 * True if the collapsed panel should be dragged up.
		 */
		private bool mIsSlidingUp;

		/**
		 * Panel overlays the windows instead of putting it underneath it.
		 */
		private bool mOverlayContent = DEFAULT_OVERLAY_FLAG;

		/**
		 * The main view is clipped to the main top border
		 */
		private bool mClipPanel = DEFAULT_CLIP_PANEL_FLAG;

		/**
		 * If provided, the panel can be dragged by only this view. Otherwise, the entire panel can be
		 * used for dragging.
		 */
		private View mDragView;

		/**
		 * If provided, the panel can be dragged by only this view. Otherwise, the entire panel can be
		 * used for dragging.
		 */
		private int mDragViewResId = -1;

		/**
		 * If provided, the panel will transfer the scroll from this view to itself when needed.
		 */
		private View mScrollableView;
		private readonly int mScrollableViewResId;
		private ScrollableViewHelper mScrollableViewHelper = new ScrollableViewHelper();

		/**
		 * The child view that can slide, if any.
		 */
		private View mSlideableView;

		/**
		 * The main view
		 */
		private View mMainView;

		/**
		 * Current state of the slideable view.
		 */
		public enum PanelState
		{
			EXPANDED,
			COLLAPSED,
			ANCHORED,
			HIDDEN,
			DRAGGING
		}

		private PanelState mSlideState = DEFAULT_SLIDE_STATE;

		/**
		 * If the current slide state is DRAGGING, this will store the last non dragging state
		 */
		private PanelState mLastNotDraggingSlideState = DEFAULT_SLIDE_STATE;

		/**
		 * How far the panel is offset from its expanded position.
		 * range [0, 1] where 0 = collapsed, 1 = expanded.
		 */
		private float mSlideOffset;

		/**
		 * How far in pixels the slideable panel may move.
		 */
		private int mSlideRange;

		/**
		 * An anchor point where the panel can stop during sliding
		 */
		private float mAnchorPoint = 1.0f;

		/**
		 * A panel view is locked into internal scrolling or another condition that
		 * is preventing a drag.
		 */
		private bool mIsUnableToDrag;

		/**
		 * Flag indicating that sliding feature is enabled\disabled
		 */
		private bool mIsTouchEnabled;

		private float mPrevMotionX;
		private float mPrevMotionY;
		private float mInitialMotionX;
		private float mInitialMotionY;
		private bool mIsScrollableViewHandlingTouch;

		private readonly JavaList<PanelSlideListener> mPanelSlideListeners = new JavaList<PanelSlideListener>();
		private IOnClickListener mFadeOnClickListener;

		private readonly ViewDragHelper mDragHelper;

		/**
		 * Stores whether or not the pane was expanded the last time it was slideable.
		 * If expand/collapse operations are invoked this state is modified. Used by
		 * instance state save/restore.
		 */
		private bool mFirstLayout = true;

		private readonly Rect mTmpRect = new Rect();

		public SlidingUpPanelLayout(IntPtr javaReference, JniHandleOwnership transfer) : base(javaReference, transfer)
		{

		}

		public SlidingUpPanelLayout(Context context) : this(context, null)
		{
		}

		public SlidingUpPanelLayout(Context context, IAttributeSet attrs) : this(context, attrs, 0)
		{
		}

		public SlidingUpPanelLayout(Context context, IAttributeSet attrs, int defStyleAttr) : this(context, attrs, defStyleAttr, 0)
		{
		}

		public SlidingUpPanelLayout(Context context, IAttributeSet attrs, int defStyleAttr, int defStyleRes) : base(context, attrs, defStyleAttr, defStyleRes)
		{
			if (IsInEditMode)
			{
				mShadowDrawable = null;
				mDragHelper = null;
				return;
			}

			IInterpolator scrollerInterpolator = null;
			if (attrs != null)
			{
				TypedArray defAttrs = context.ObtainStyledAttributes(attrs, DEFAULT_ATTRS);

				if (defAttrs != null)
				{
					GravityFlags gravity = (GravityFlags)defAttrs.GetInt(0, (int)GravityFlags.NoGravity);
					setGravity(gravity);
					defAttrs.Recycle();
				}


				TypedArray ta = context.ObtainStyledAttributes(attrs, Resource.Styleable.SlidingUpPanelLayout);

				if (ta != null)
				{
					mPanelHeight = ta.GetDimensionPixelSize(Resource.Styleable.SlidingUpPanelLayout_umanoPanelHeight, -1);
					mShadowHeight = ta.GetDimensionPixelSize(Resource.Styleable.SlidingUpPanelLayout_umanoShadowHeight, -1);
					mParallaxOffset = ta.GetDimensionPixelSize(Resource.Styleable.SlidingUpPanelLayout_umanoParallaxOffset, -1);

					mMinFlingVelocity = ta.GetInt(Resource.Styleable.SlidingUpPanelLayout_umanoFlingVelocity, DEFAULT_MIN_FLING_VELOCITY);
					mCoveredFadeColor = ta.GetColor(Resource.Styleable.SlidingUpPanelLayout_umanoFadeColor, DEFAULT_FADE_COLOR);

					mDragViewResId = ta.GetResourceId(Resource.Styleable.SlidingUpPanelLayout_umanoDragView, -1);
					mScrollableViewResId = ta.GetResourceId(Resource.Styleable.SlidingUpPanelLayout_umanoScrollableView, -1);

					mOverlayContent = ta.GetBoolean(Resource.Styleable.SlidingUpPanelLayout_umanoOverlay, DEFAULT_OVERLAY_FLAG);
					mClipPanel = ta.GetBoolean(Resource.Styleable.SlidingUpPanelLayout_umanoClipPanel, DEFAULT_CLIP_PANEL_FLAG);

					mAnchorPoint = ta.GetFloat(Resource.Styleable.SlidingUpPanelLayout_umanoAnchorPoint, DEFAULT_ANCHOR_POINT);

					mSlideState = (PanelState)ta.GetInt(Resource.Styleable.SlidingUpPanelLayout_umanoInitialState, (int)DEFAULT_SLIDE_STATE);

					int interpolatorResId = ta.GetResourceId(Resource.Styleable.SlidingUpPanelLayout_umanoScrollInterpolator, -1);
					if (interpolatorResId != -1)
					{
						scrollerInterpolator = AnimationUtils.LoadInterpolator(context, interpolatorResId);
					}
					ta.Recycle();
				}
			}

			float density = context.Resources.DisplayMetrics.Density;
			if (mPanelHeight == -1)
			{
				mPanelHeight = (int)(DEFAULT_PANEL_HEIGHT * density + 0.5f);
			}
			if (mShadowHeight == -1)
			{
				mShadowHeight = (int)(DEFAULT_SHADOW_HEIGHT * density + 0.5f);
			}
			if (mParallaxOffset == -1)
			{
				//TODO change parallax 0 value
				mParallaxOffset = (int)(0 * density);
			}
			// If the shadow height is zero, don't show the shadow
			if (mShadowHeight > 0)
			{
				if (mIsSlidingUp)
				{
					mShadowDrawable = Context.GetDrawable(Resource.Drawable.above_shadow);
				}
				else
				{
					mShadowDrawable = Context.GetDrawable(Resource.Drawable.below_shadow);
				}
			}
			else
			{
				mShadowDrawable = null;
			}

			SetWillNotDraw(false);

			mDragHelper = ViewDragHelper.Create(this, 0.5f, scrollerInterpolator, new DragHelperCallback(this));
			mDragHelper.SetMinVelocity(mMinFlingVelocity * density);

			mIsTouchEnabled = true;
		}

		protected override void OnFinishInflate()
		{
			base.OnFinishInflate();
			if (mDragViewResId != -1)
			{
				setDragView(FindViewById(mDragViewResId));
			}
			if (mScrollableViewResId != -1)
			{
				setScrollableView(FindViewById(mScrollableViewResId));
			}
		}

		public void setGravity(GravityFlags gravity)
		{
			if (gravity != GravityFlags.Top && gravity != GravityFlags.Bottom)
			{
				throw new IllegalArgumentException("gravity must be set to either top or Bottom");
			}
			mIsSlidingUp = gravity == GravityFlags.Bottom;
			if (!mFirstLayout)
			{
				RequestLayout();
			}
		}

		/**
     * Set the color used to fade the pane covered by the sliding pane out when the pane
     * will become fully covered in the expanded state.
     *
     * @param color An ARGB-packed color value
     */
		public void setCoveredFadeColor(int color)
		{
			mCoveredFadeColor = color;
			RequestLayout();
		}

		/**
	     * @return The ARGB-packed color value used to fade the fixed pane
	     */
		public int getCoveredFadeColor()
		{
			return mCoveredFadeColor;
		}

		/**
	     * Set sliding enabled flag
	     *
	     * @param enabled flag value
	     */
		public void setTouchEnabled(bool enabled)
		{
			mIsTouchEnabled = enabled;
		}

		public bool isTouchEnabled()
		{
			return mIsTouchEnabled && mSlideableView != null && mSlideState != PanelState.HIDDEN;
		}

		/**
     * Set the collapsed panel height in pixels
     *
     * @param val A height in pixels
     */
		public void setPanelHeight(int val)
		{
			if (getPanelHeight() == val)
			{
				return;
			}

			mPanelHeight = val;
			if (!mFirstLayout)
			{
				RequestLayout();
			}

			if (getPanelState() != PanelState.COLLAPSED) return;
			smoothToBottom();
			Invalidate();
		}

		private void smoothToBottom()
		{
			smoothSlideTo(0);
		}

		/**
		 * @return The current shadow height
		 */
		public int getShadowHeight()
		{
			return mShadowHeight;
		}

		/**
		 * Set the shadow height
		 *
		 * @param val A height in pixels
		 */
		public void setShadowHeight(int val)
		{
			mShadowHeight = val;
			if (!mFirstLayout)
			{
				Invalidate();
			}
		}

		/**
		 * @return The current collapsed panel height
		 */
		public int getPanelHeight()
		{
			return mPanelHeight;
		}

		/**
		 * @return The current parallax offset
		 */
		public int getCurrentParallaxOffset()
		{
			// Clamp slide offset at zero for parallax computation;
			int offset = (int)(mParallaxOffset * Math.Max(mSlideOffset, 0));
			return mIsSlidingUp ? -offset : offset;
		}

		/**
		 * Set parallax offset for the panel
		 *
		 * @param val A height in pixels
		 */
		public void setParallaxOffset(int val)
		{
			mParallaxOffset = val;
			if (!mFirstLayout)
			{
				RequestLayout();
			}
		}

		/**
		 * @return The current minimin fling velocity
		 */
		public int getMinFlingVelocity()
		{
			return mMinFlingVelocity;
		}

		/**
		 * Sets the minimum fling velocity for the panel
		 *
		 * @param val the new value
		 */
		public void setMinFlingVelocity(int val)
		{
			mMinFlingVelocity = val;
		}

		/**
		 * Adds a panel slide listener
		 *
		 * @param listener
		 */
		public void addPanelSlideListener(PanelSlideListener listener)
		{
			lock (mPanelSlideListeners)
			{
				mPanelSlideListeners.Add(listener);
			}
		}

		/**
     * Removes a panel slide listener
     *
     * @param listener
     */
		public void removePanelSlideListener(PanelSlideListener listener)
		{
			lock (mPanelSlideListeners)
			{
				mPanelSlideListeners.Remove(listener);
			}
		}

		/**
		 * Provides an on click for the portion of the main view that is dimmed. The listener is not
		 * triggered if the panel is in a collapsed or a hidden position. If the on click listener is
		 * not provided, the clicks on the dimmed area are passed through to the main layout.
		 *
		 * @param listener
		 */
		public void setFadeOnClickListener(IOnClickListener listener)
		{
			mFadeOnClickListener = listener;
		}

		/**
		 * Set the draggable view portion. Use to null, to allow the whole panel to be draggable
		 *
		 * @param dragView A view that will be used to drag the panel.
		 */
		public void setDragView(View dragView)
		{
			if (mDragView != null)
			{
				mDragView.SetOnClickListener(null);
			}
			mDragView = dragView;
			if (mDragView != null)
			{
				mDragView.Clickable = true;
				mDragView.Focusable = false;
				mDragView.FocusableInTouchMode = false;
				mDragView.Click += (sender, args) =>
				{
					if (!Enabled || !isTouchEnabled()) return;
					if (mSlideState != PanelState.EXPANDED && mSlideState != PanelState.ANCHORED)
					{
						if (mAnchorPoint < 1.0f)
						{
							setPanelState(PanelState.ANCHORED);
						}
						else
						{
							setPanelState(PanelState.EXPANDED);
						}
					}
					else
					{
						setPanelState(PanelState.COLLAPSED);
					}

				};

			}
		}

		/**
		 * Set the draggable view portion. Use to null, to allow the whole panel to be draggable
		 *
		 * @param dragViewResId The resource ID of the new drag view
		 */
		public void setDragView(int dragViewResId)
		{
			mDragViewResId = dragViewResId;
			setDragView(FindViewById(dragViewResId));
		}

		/**
		 * Set the scrollable child of the sliding layout. If set, scrolling will be transfered between
		 * the panel and the view when necessary
		 *
		 * @param scrollableView The scrollable view
		 */
		public void setScrollableView(View scrollableView)
		{
			mScrollableView = scrollableView;
		}

		/**
		 * Sets the current scrollable view helper. See ScrollableViewHelper description for details.
		 *
		 * @param helper
		 */
		public void setScrollableViewHelper(ScrollableViewHelper helper)
		{
			mScrollableViewHelper = helper;
		}

		/**
		 * Set an anchor point where the panel can stop during sliding
		 *
		 * @param anchorPoint A value between 0 and 1, determining the position of the anchor point
		 *                    starting from the top of the layout.
		 */
		public void setAnchorPoint(float anchorPoint)
		{
			if (anchorPoint > 0 && anchorPoint <= 1)
			{
				mAnchorPoint = anchorPoint;
				mFirstLayout = true;
				RequestLayout();
			}
		}

		/**
		 * Gets the currently set anchor point
		 *
		 * @return the currently set anchor point
		 */
		public float getAnchorPoint()
		{
			return mAnchorPoint;
		}

		/**
		 * Sets whether or not the panel overlays the content
		 *
		 * @param overlayed
		 */
		public void setOverlayed(bool overlayed)
		{
			mOverlayContent = overlayed;
		}

		/**
		 * Check if the panel is set as an overlay.
		 */
		public bool isOverlayed()
		{
			return mOverlayContent;
		}

		/**
		 * Sets whether or not the main content is clipped to the top of the panel
		 *
		 * @param clip
		 */
		public void setClipPanel(bool clip)
		{
			mClipPanel = clip;
		}

		/**
		 * Check whether or not the main content is clipped to the top of the panel
		 */
		public bool isClipPanel()
		{
			return mClipPanel;
		}


		void dispatchOnPanelSlide(View panel)
		{
			lock (mPanelSlideListeners)
			{
				foreach (PanelSlideListener l in mPanelSlideListeners)
				{
					l.onPanelSlide(panel, mSlideOffset);
				}
			}
		}


		void dispatchOnPanelStateChanged(View panel, PanelState previousState, PanelState newState)
		{
			lock (mPanelSlideListeners)
			{
				foreach (PanelSlideListener l in mPanelSlideListeners)
				{
					l.onPanelStateChanged(panel, previousState, newState);
				}
			}
			SendAccessibilityEvent(EventTypes.WindowStateChanged);
		}

		void updateObscuredViewVisibility()
		{
			if (ChildCount == 0)
			{
				return;
			}
			int leftBound = PaddingLeft;
			int rightBound = Width - PaddingRight;
			int topBound = PaddingTop;
			int bottomBound = Height - PaddingBottom;
			int left;
			int right;
			int top;
			int bottom;
			if (mSlideableView != null && hasOpaqueBackground(mSlideableView))
			{
				left = mSlideableView.Left;
				right = mSlideableView.Right;
				top = mSlideableView.Top;
				bottom = mSlideableView.Bottom;
			}
			else
			{
				left = 0;
				right = 0;
				top = 0;
				bottom = 0;
			}
			View child = GetChildAt(0);
			int clampedChildLeft = Math.Max(leftBound, child.Left);
			int clampedChildTop = Math.Max(topBound, child.Top);
			int clampedChildRight = Math.Min(rightBound, child.Right);
			int clampedChildBottom = Math.Min(bottomBound, child.Bottom);
			ViewStates vis;
			if (clampedChildLeft >= left && clampedChildTop >= top &&
				clampedChildRight <= right && clampedChildBottom <= bottom)
			{
				vis = ViewStates.Invisible;
			}
			else
			{
				vis = ViewStates.Visible;
			}

			child.Visibility = vis;
		}

		void setAllChildrenVisible()
		{
			for (int i = 0, childCount = ChildCount; i < childCount; i++)
			{
				View child = GetChildAt(i);
				if (child.Visibility == ViewStates.Invisible) { child.Visibility = ViewStates.Visible; }
			}
		}

		private static bool hasOpaqueBackground(View v)
		{
			Drawable bg = v.Background;
			return bg != null && bg.Opacity == (int)Format.Opaque;
		}

		public override bool OnInterceptTouchEvent(MotionEvent ev)
		{
			// If the scrollable view is handling touch, never intercept
			if (mIsScrollableViewHandlingTouch || !isTouchEnabled())
			{
				mDragHelper.Abort();
				return false;
			}

			MotionEventActions action = ev.ActionMasked;
			float x = ev.GetX();
			float y = ev.GetY();
			float adx = Math.Abs(x - mInitialMotionX);
			float ady = Math.Abs(y - mInitialMotionY);
			int dragSlop = mDragHelper.GetTouchSlop();

			switch (action)
			{
				case MotionEventActions.Down:
					{
						mIsUnableToDrag = false;
						mInitialMotionX = x;
						mInitialMotionY = y;
						if (!isViewUnder(mDragView, (int)x, (int)y))
						{
							mDragHelper.Cancel();
							mIsUnableToDrag = true;
							return false;
						}

						break;
					}

				case MotionEventActions.Move:
					{
						if (ady > dragSlop && adx > ady)
						{
							mDragHelper.Cancel();
							mIsUnableToDrag = true;
							return false;
						}
						break;
					}

				case MotionEventActions.Cancel:
				case MotionEventActions.Up:
					// If the dragView is still dragging when we get here, we need to call processTouchEvent
					// so that the view is settled
					// Added to make scrollable views work (tokudu)
					if (mDragHelper.IsDragging())
					{
						mDragHelper.ProcessTouchEvent(ev);
						return true;
					}
					// Check if this was a click on the faded part of the screen, and fire off the listener if there is one.
					if (ady <= dragSlop
							&& adx <= dragSlop
							&& mSlideOffset > 0 && !isViewUnder(mSlideableView, (int)mInitialMotionX, (int)mInitialMotionY) && mFadeOnClickListener != null)
					{
						PlaySoundEffect(SoundEffects.Click);
						mFadeOnClickListener.OnClick(this);
						return true;
					}
					break;
			}
			return mDragHelper.ShouldInterceptTouchEvent(ev);
		}

		protected override void OnLayout(bool changed, int l, int t, int r, int b)
		{
			int paddingLeft = PaddingLeft;
			int paddingTop = PaddingTop;

			int childCount = ChildCount;

			if (mFirstLayout)
			{
				switch (mSlideState)
				{
					case PanelState.EXPANDED:
						mSlideOffset = 1.0f;
						break;
					case PanelState.ANCHORED:
						mSlideOffset = mAnchorPoint;
						break;
					case PanelState.HIDDEN:
						int newTop = computePanelTopPosition(0.0f) + (mIsSlidingUp ? +mPanelHeight : -mPanelHeight);
						mSlideOffset = computeSlideOffset(newTop);
						break;
					default:
						mSlideOffset = 0.0f;
						break;
				}
			}

			for (int i = 0; i < childCount; i++)
			{
				View child = GetChildAt(i);
				LayoutParams lp = (LayoutParams)child.LayoutParameters;

				// Always layout the sliding view on the first layout
				if (child.Visibility == ViewStates.Gone && (i == 0 || mFirstLayout))
				{
					continue;
				}

				int childHeight = child.MeasuredHeight;
				int childTop = paddingTop;

				if (child == mSlideableView)
				{
					childTop = computePanelTopPosition(mSlideOffset);
				}

				if (!mIsSlidingUp)
				{
					if (child == mMainView && !mOverlayContent)
					{
						childTop = computePanelTopPosition(mSlideOffset) + mSlideableView.MeasuredHeight;
					}
				}
				int childBottom = childTop + childHeight;
				int childLeft = paddingLeft + lp.LeftMargin;
				int childRight = childLeft + child.MeasuredWidth;

				child.Layout(childLeft, childTop, childRight, childBottom);
			}

			if (mFirstLayout)
			{
				updateObscuredViewVisibility();
			}
			applyParallaxForCurrentSlideOffset();

			mFirstLayout = false;
		}

		public override bool DispatchTouchEvent(MotionEvent e)
		{
			MotionEventActions action = e.ActionMasked;

			if (!Enabled || !isTouchEnabled() || (mIsUnableToDrag && action != MotionEventActions.Down))
			{
				mDragHelper.Abort();
				return base.DispatchTouchEvent(e);
			}

			float x = e.GetX();
			float y = e.GetY();

			if (action == MotionEventActions.Down)
			{
				mIsScrollableViewHandlingTouch = false;
				mPrevMotionX = x;
				mPrevMotionY = y;
			}
			else if (action == MotionEventActions.Move)
			{
				float dx = x - mPrevMotionX;
				float dy = y - mPrevMotionY;
				mPrevMotionX = x;
				mPrevMotionY = y;

				if (Math.Abs(dx) > Math.Abs(dy))
				{
					// Scrolling horizontally, so ignore
					return base.DispatchTouchEvent(e);
				}

				// If the scroll view isn't under the touch, pass the
				// event along to the dragView.
				if (!isViewUnder(mScrollableView, (int)mInitialMotionX, (int)mInitialMotionY))
				{
					return base.DispatchTouchEvent(e);
				}

				// Which direction (up or down) is the drag moving?
				if (dy * (mIsSlidingUp ? 1 : -1) > 0)
				{ // Collapsing
				  // Is the child less than fully scrolled?
				  // Then let the child handle it.
					if (mScrollableViewHelper.getScrollableViewScrollPosition(mScrollableView, mIsSlidingUp) > 0)
					{
						mIsScrollableViewHandlingTouch = true;
						return base.DispatchTouchEvent(e);
					}

					// Was the child handling the touch previously?
					// Then we need to rejigger things so that the
					// drag panel gets a proper down event.
					if (mIsScrollableViewHandlingTouch)
					{
						// Send an 'UP' event to the child.
						MotionEvent up = MotionEvent.Obtain(e);
						up.Action = MotionEventActions.Cancel;
						base.DispatchTouchEvent(up);
						up.Recycle();

						// Send a 'DOWN' event to the panel. (We'll cheat
						// and hijack this one)
						e.Action = MotionEventActions.Down;
					}

					mIsScrollableViewHandlingTouch = false;
					return OnTouchEvent(e);
				}
				else if (dy * (mIsSlidingUp ? 1 : -1) < 0)
				{ // Expanding
				  // Is the panel less than fully expanded?
				  // Then we'll handle the drag here.
					if (mSlideOffset < 1.0f)
					{
						mIsScrollableViewHandlingTouch = false;
						return OnTouchEvent(e);
					}

					// Was the panel handling the touch previously?
					// Then we need to rejigger things so that the
					// child gets a proper down event.
					if (!mIsScrollableViewHandlingTouch && mDragHelper.IsDragging())
					{
						mDragHelper.Cancel();
						e.Action = MotionEventActions.Down;
					}

					mIsScrollableViewHandlingTouch = true;
					return base.DispatchTouchEvent(e);
				}
			}
			else if (action == MotionEventActions.Up)
			{
				// If the scrollable view was handling the touch and we receive an up
				// we want to clear any previous dragging state so we don't intercept a touch stream accidentally
				if (mIsScrollableViewHandlingTouch)
				{
					mDragHelper.setDragState(ViewDragHelper.STATE_IDLE);
				}
			}

			// In all other cases, just let the default behavior take over.
			return base.DispatchTouchEvent(e);
		}

		protected override void OnAttachedToWindow()
		{
			base.OnAttachedToWindow();
			mFirstLayout = true;
		}

		protected override void OnDetachedFromWindow()
		{
			base.OnDetachedFromWindow();
			mFirstLayout = true;
		}

		protected override void OnMeasure(int widthMeasureSpec, int heightMeasureSpec)
		{
			MeasureSpecMode widthMode = MeasureSpec.GetMode(widthMeasureSpec);
			int widthSize = MeasureSpec.GetSize(widthMeasureSpec);
			MeasureSpecMode heightMode = MeasureSpec.GetMode(heightMeasureSpec);
			int heightSize = MeasureSpec.GetSize(heightMeasureSpec);

			if (widthMode != MeasureSpecMode.Exactly && widthMode != MeasureSpecMode.AtMost)
			{
				throw new IllegalStateException("Width must have an exact value or MATCH_PARENT");
			}
			else if (heightMode != MeasureSpecMode.Exactly && heightMode != MeasureSpecMode.AtMost)
			{
				throw new IllegalStateException("Height must have an exact value or MATCH_PARENT");
			}

			int childCount = ChildCount;

			if (childCount != 2)
			{
				throw new IllegalStateException("Sliding up panel layout must have exactly 2 children!");
			}

			mMainView = GetChildAt(0);
			mSlideableView = GetChildAt(1);
			if (mDragView == null)
			{
				setDragView(mSlideableView);
			}

			// If the sliding panel is not visible, then put the whole view in the hidden state
			if (mSlideableView.Visibility != ViewStates.Visible)
			{
				mSlideState = PanelState.HIDDEN;
			}

			int layoutHeight = heightSize - PaddingTop - PaddingBottom;
			int layoutWidth = widthSize - PaddingLeft - PaddingRight;

			// First pass. Measure based on child LayoutParams width/height.
			for (int i = 0; i < childCount; i++)
			{
				View child = GetChildAt(i);
				LayoutParams lp = (LayoutParams)child.LayoutParameters;

				// We always measure the sliding panel in order to know it's height (needed for show panel)
				if (child.Visibility == ViewStates.Gone && i == 0)
				{
					continue;
				}

				int height = layoutHeight;
				int width = layoutWidth;
				if (child == mMainView)
				{
					if (!mOverlayContent && mSlideState != PanelState.HIDDEN)
					{
						height -= mPanelHeight;
					}

					width -= lp.LeftMargin + lp.RightMargin;
				}
				else if (child == mSlideableView)
				{
					// The slideable view should be aware of its top margin.
					// See https://github.com/umano/AndroidSlidingUpPanel/issues/412.
					height -= lp.TopMargin;
				}

				int childWidthSpec;
				if (lp.Width == ViewGroup.LayoutParams.WrapContent)
				{
					childWidthSpec = MeasureSpec.MakeMeasureSpec(width, MeasureSpecMode.AtMost);
				}
				else if (lp.Width == ViewGroup.LayoutParams.MatchParent)
				{
					childWidthSpec = MeasureSpec.MakeMeasureSpec(width, MeasureSpecMode.Exactly);
				}
				else
				{
					childWidthSpec = MeasureSpec.MakeMeasureSpec(lp.Width, MeasureSpecMode.Exactly);
				}

				int childHeightSpec;
				if (lp.Height == ViewGroup.LayoutParams.WrapContent)
				{
					childHeightSpec = MeasureSpec.MakeMeasureSpec(height, MeasureSpecMode.AtMost);
				}
				else
				{
					// Modify the height based on the weight.
					if (lp.Width > 0 && lp.Weight < 1)
					{
						height = (int)(height * lp.Weight);
					}
					else if (lp.Height != ViewGroup.LayoutParams.MatchParent)
					{
						height = lp.Height;
					}
					childHeightSpec = MeasureSpec.MakeMeasureSpec(height, MeasureSpecMode.Exactly);
				}

				child.Measure(childWidthSpec, childHeightSpec);

				if (child == mSlideableView)
				{
					mSlideRange = mSlideableView.MeasuredHeight - mPanelHeight;
				}
			}

			SetMeasuredDimension(widthSize, heightSize);
		}

		protected override void OnSizeChanged(int w, int h, int oldw, int oldh)
		{
			base.OnSizeChanged(w, h, oldw, oldh);
			// Recalculate sliding panes and their details
			if (h != oldh)
			{
				mFirstLayout = true;
			}
		}

		public override bool OnTouchEvent(MotionEvent e)
		{
			if (!Enabled || !isTouchEnabled())
			{
				return base.OnTouchEvent(e);
			}
			try
			{
				mDragHelper.ProcessTouchEvent(e);
				return true;
			}
			catch (Java.Lang.Exception)
			{
				// Ignore the pointer out of range exception
				return false;
			}
		}

		private bool isViewUnder(View view, int x, int y)
		{
			if (view == null) return false;
			int[] viewLocation = new int[2];
			view.GetLocationOnScreen(viewLocation);
			int[] parentLocation = new int[2];
			GetLocationOnScreen(parentLocation);
			int screenX = parentLocation[0] + x;
			int screenY = parentLocation[1] + y;
			return screenX >= viewLocation[0] && screenX < viewLocation[0] + view.Width &&
				   screenY >= viewLocation[1] && screenY < viewLocation[1] + view.Height;
		}

		/*
		 * Computes the top position of the panel based on the slide offset.
		 */
		private int computePanelTopPosition(float slideOffset)
		{
			int slidingViewHeight = mSlideableView != null ? mSlideableView.MeasuredHeight : 0;
			int slidePixelOffset = (int)(slideOffset * mSlideRange);
			// Compute the top of the panel if its collapsed
			return mIsSlidingUp
					? MeasuredHeight - PaddingBottom - mPanelHeight - slidePixelOffset
					: PaddingTop - slidingViewHeight + mPanelHeight + slidePixelOffset;
		}

		/*
		 * Computes the slide offset based on the top position of the panel
		 */
		private float computeSlideOffset(int topPosition)
		{
			// Compute the panel top position if the panel is collapsed (offset 0)
			int topBoundCollapsed = computePanelTopPosition(0);

			// Determine the new slide offset based on the collapsed top position and the new required
			// top position
			return (mIsSlidingUp
					? (float)(topBoundCollapsed - topPosition) / mSlideRange
					: (float)(topPosition - topBoundCollapsed) / mSlideRange);
		}

		/**
		 * Returns the current state of the panel as an enum.
		 *
		 * @return the current panel state
		 */
		public PanelState getPanelState()
		{
			return mSlideState;
		}

		/**
		 * Change panel state to the given state with
		 *
		 * @param state - new panel state
		 */
		public void setPanelState(PanelState state)
		{

			// Abort any running animation, to allow state change
			if (mDragHelper.GetViewDragState() == ViewDragHelper.STATE_SETTLING)
			{
				Log.Debug(TAG, "View is settling. Aborting animation.");
				mDragHelper.Abort();
			}

			if (state == PanelState.DRAGGING)
			{
				throw new IllegalArgumentException("Panel state cannot be null or DRAGGING.");
			}
			if (!Enabled
					|| (!mFirstLayout && mSlideableView == null)
					|| state == mSlideState
					|| mSlideState == PanelState.DRAGGING) return;

			if (mFirstLayout)
			{
				setPanelStateInternal(state);
			}
			else
			{
				if (mSlideState == PanelState.HIDDEN)
				{
					mSlideableView.Visibility = ViewStates.Visible;
					RequestLayout();
				}
				switch (state)
				{
					case PanelState.ANCHORED:
						smoothSlideTo(mAnchorPoint);
						break;
					case PanelState.COLLAPSED:
						smoothSlideTo(0);
						break;
					case PanelState.EXPANDED:
						smoothSlideTo(1.0f);
						break;
					case PanelState.HIDDEN:
						int newTop = computePanelTopPosition(0.0f) + (mIsSlidingUp ? +mPanelHeight : -mPanelHeight);
						smoothSlideTo(computeSlideOffset(newTop));
						break;
				}
			}
		}

		private void setPanelStateInternal(PanelState state)
		{
			if (mSlideState == state) return;
			PanelState oldState = mSlideState;
			mSlideState = state;
			dispatchOnPanelStateChanged(this, oldState, state);
		}

		/**
		 * Update the parallax based on the current slide offset.
		 */

		private void applyParallaxForCurrentSlideOffset()
		{
			if (mParallaxOffset > 0)
			{
				int mainViewOffset = getCurrentParallaxOffset();
				mMainView.TranslationY = mainViewOffset;
			}
		}

		private void onPanelDragged(int newTop)
		{
			if (mSlideState != PanelState.DRAGGING)
			{
				mLastNotDraggingSlideState = mSlideState;
			}
			setPanelStateInternal(PanelState.DRAGGING);
			// Recompute the slide offset based on the new top position
			mSlideOffset = computeSlideOffset(newTop);
			applyParallaxForCurrentSlideOffset();
			// Dispatch the slide event
			dispatchOnPanelSlide(mSlideableView);
			// If the slide offset is negative, and overlay is not on, we need to increase the
			// height of the main content
			LayoutParams lp = (LayoutParams)mMainView.LayoutParameters;
			int defaultHeight = Height - PaddingBottom - PaddingTop - mPanelHeight;

			if (mSlideOffset <= 0 && !mOverlayContent)
			{
				// expand the main view
				lp.Height = mIsSlidingUp ? (newTop - PaddingBottom) : (Height - PaddingBottom - mSlideableView.MeasuredHeight - newTop);
				if (lp.Height == defaultHeight)
				{
					lp.Height = ViewGroup.LayoutParams.MatchParent;
				}
				mMainView.RequestLayout();
			}
			else if (lp.Height != ViewGroup.LayoutParams.MatchParent && !mOverlayContent)
			{
				lp.Height = ViewGroup.LayoutParams.MatchParent;
				mMainView.RequestLayout();
			}
		}

		protected override bool DrawChild(Canvas canvas, View child, long drawingTime)
		{
			bool result;
			int save = canvas.Save();

			if (mSlideableView != null && mSlideableView != child)
			{ // if main view
			  // Clip against the slider; no sense drawing what will immediately be covered,
			  // Unless the panel is set to overlay content
				canvas.GetClipBounds(mTmpRect);
				if (!mOverlayContent)
				{
					if (mIsSlidingUp)
					{
						mTmpRect.Bottom = Math.Min(mTmpRect.Bottom, mSlideableView.Top);
					}
					else
					{
						mTmpRect.Top = Math.Max(mTmpRect.Top, mSlideableView.Bottom);
					}
				}
				if (mClipPanel)
				{
					canvas.ClipRect(mTmpRect);
				}

				result = base.DrawChild(canvas, child, drawingTime);

				if (mCoveredFadeColor != 0 && mSlideOffset > 0)
				{
					long baseAlpha = (mCoveredFadeColor & 0xff000000) >> 24;
					int imag = (int)(baseAlpha * mSlideOffset);
					int color = imag << 24 | (mCoveredFadeColor & 0xffffff);
					mCoveredFadePaint.Color = new Color(color);
					canvas.DrawRect(mTmpRect, mCoveredFadePaint);
				}
			}
			else
			{
				result = base.DrawChild(canvas, child, drawingTime);
			}

			canvas.RestoreToCount(save);

			return result;
		}

		/**
		* Smoothly animate mDraggingPane to the target X position within its range.
		*
		* @param slideOffset position to animate to
		* @param velocity    initial velocity in case of fling, or 0.
		*/
		void smoothSlideTo(float slideOffset)
		{
			if (!Enabled || mSlideableView == null)
			{
				// Nothing to do.
				return;
			}

			int panelTop = computePanelTopPosition(slideOffset);

			if (!mDragHelper.SmoothSlideViewTo(mSlideableView, mSlideableView.Left, panelTop)) return;
			setAllChildrenVisible();
			ViewCompat.PostInvalidateOnAnimation(this);
		}

		public override void ComputeScroll()
		{
			if (mDragHelper != null && mDragHelper.ContinueSettling(true))
			{
				if (!Enabled)
				{
					mDragHelper.Abort();
					return;
				}

				ViewCompat.PostInvalidateOnAnimation(this);
			}
		}

		public override void Draw(Canvas canvas)
		{
			base.Draw(canvas);

			// draw the shadow
			if (mShadowDrawable == null || mSlideableView == null) return;
			int right = mSlideableView.Right;
			int top;
			int bottom;
			if (mIsSlidingUp)
			{
				top = mSlideableView.Top - mShadowHeight;
				bottom = mSlideableView.Top;
			}
			else
			{
				top = mSlideableView.Bottom;
				bottom = mSlideableView.Bottom + mShadowHeight;
			}
			int left = mSlideableView.Left;
			mShadowDrawable.SetBounds(left, top, right, bottom);
			mShadowDrawable.Draw(canvas);
		}

		protected override bool CheckLayoutParams(ViewGroup.LayoutParams p)
		{
			return p is LayoutParams && base.CheckLayoutParams(p);
		}

		protected override ViewGroup.LayoutParams GenerateDefaultLayoutParams()
		{
			return new LayoutParams();
		}

		public override ViewGroup.LayoutParams GenerateLayoutParams(IAttributeSet attrs)
		{
			return new LayoutParams(Context, attrs);
		}

		protected override ViewGroup.LayoutParams GenerateLayoutParams(ViewGroup.LayoutParams p)
		{
			return p is MarginLayoutParams
				? new LayoutParams((MarginLayoutParams)p)
				: new LayoutParams(p);
		}

		protected override void OnRestoreInstanceState(IParcelable state)
		{
			if (state is Bundle bundle)
			{
				mSlideState = (PanelState)bundle.GetInt(SLIDING_STATE, (int)DEFAULT_SLIDE_STATE);
				state = (IParcelable)bundle.GetParcelable("superState");
			}
			base.OnRestoreInstanceState(state);
		}

		protected override IParcelable OnSaveInstanceState()
		{
			Bundle bundle = new Bundle();
			bundle.PutParcelable("superState", base.OnSaveInstanceState());
			bundle.PutInt(SLIDING_STATE, mSlideState != PanelState.DRAGGING ? (int)mSlideState : (int)mLastNotDraggingSlideState);
			return bundle;
		}

		private class DragHelperCallback : ViewDragHelper.Callback
		{
			private readonly SlidingUpPanelLayout layout;
			public DragHelperCallback(SlidingUpPanelLayout layout)
			{
				this.layout = layout;
			}
			public override void OnViewDragStateChanged(int state)
			{
				if (layout.mDragHelper != null && layout.mDragHelper.GetViewDragState() == ViewDragHelper.STATE_IDLE)
				{
					layout.mSlideOffset = layout.computeSlideOffset(layout.mSlideableView.Top);
					layout.applyParallaxForCurrentSlideOffset();

					if (Math.Abs(layout.mSlideOffset - 1) < 0.001)
					{
						layout.updateObscuredViewVisibility();
						layout.setPanelStateInternal(PanelState.EXPANDED);
					}
					else if (Math.Abs(layout.mSlideOffset) < 0.001)
					{
						layout.setPanelStateInternal(PanelState.COLLAPSED);
					}
					else if (layout.mSlideOffset < 0)
					{
						layout.setPanelStateInternal(PanelState.HIDDEN);
						layout.mSlideableView.Visibility = ViewStates.Invisible;
					}
					else
					{
						layout.updateObscuredViewVisibility();
						layout.setPanelStateInternal(PanelState.ANCHORED);
					}
				}
			}

			public override void OnViewPositionChanged(View changedView, int left, int top, int dx, int dy)
			{
				layout.onPanelDragged(top);
				layout.Invalidate();
			}

			public override void OnViewCaptured(View capturedChild, int activePointerId)
			{
				layout.setAllChildrenVisible();
			}

			public override void OnViewReleased(View releasedChild, float xvel, float yvel)
			{
				int target;

				// direction is always positive if we are sliding in the expanded direction
				float direction = layout.mIsSlidingUp ? -yvel : yvel;

				if (direction > 0 && layout.mSlideOffset <= layout.mAnchorPoint)
				{
					// swipe up -> expand and stop at anchor point
					target = layout.computePanelTopPosition(layout.mAnchorPoint);
				}
				else if (direction > 0 && layout.mSlideOffset > layout.mAnchorPoint)
				{
					// swipe up past anchor -> expand
					target = layout.computePanelTopPosition(1.0f);
				}
				else if (direction < 0 && layout.mSlideOffset >= layout.mAnchorPoint)
				{
					// swipe down -> collapse and stop at anchor point
					target = layout.computePanelTopPosition(layout.mAnchorPoint);
				}
				else if (direction < 0 && layout.mSlideOffset < layout.mAnchorPoint)
				{
					// swipe down past anchor -> collapse
					target = layout.computePanelTopPosition(0.0f);
				}
				else if (layout.mSlideOffset >= (1.0f + layout.mAnchorPoint) / 2)
				{
					// zero velocity, and far enough from anchor point => expand to the top
					target = layout.computePanelTopPosition(1.0f);
				}
				else if (layout.mSlideOffset >= layout.mAnchorPoint / 2)
				{
					// zero velocity, and close enough to anchor point => go to anchor
					target = layout.computePanelTopPosition(layout.mAnchorPoint);
				}
				else
				{
					// settle at the Bottom
					target = layout.computePanelTopPosition(0.0f);
				}

				if (layout.mDragHelper != null)
				{
					layout.mDragHelper.SettleCapturedViewAt(releasedChild.Left, target);
				}
				layout.Invalidate();
			}

			public override int GetViewVerticalDragRange(View child)
			{
				return layout.mSlideRange;
			}

			public override bool TryCaptureView(View child, int pointerId)
			{
				return !layout.mIsUnableToDrag && child == layout.mSlideableView;
			}

			public override int ClampViewPositionVertical(View child, int top, int dy)
			{
				int collapsedTop = layout.computePanelTopPosition(0.0f);
				int expandedTop = layout.computePanelTopPosition(1.0f);
				if (layout.mIsSlidingUp)
				{
					return Math.Min(Math.Max(top, expandedTop), collapsedTop);
				}
				else
				{
					return Math.Min(Math.Max(top, collapsedTop), expandedTop);
				}
			}
		}

		public new class LayoutParams : MarginLayoutParams
		{
			private static readonly int[] ATTRS = { Android.Resource.Attribute.LayoutWeight };

			public float Weight { get; set; }
			protected LayoutParams(IntPtr javaReference, JniHandleOwnership transfer) : base(javaReference, transfer)
			{
			}

			public LayoutParams(Context c, IAttributeSet attrs) : base(c, attrs)
			{
				TypedArray ta = c.ObtainStyledAttributes(attrs, ATTRS);
				if (ta != null)
				{
					Weight = ta.GetFloat(0, 0);
					ta.Recycle();
				}
			}

			public LayoutParams(ViewGroup.LayoutParams source) : base(source)
			{
			}

			public LayoutParams(MarginLayoutParams source) : base(source)
			{
			}

			public LayoutParams(int width, int height) : base(width, height)
			{
			}

			public LayoutParams() : base(MatchParent, MatchParent)
			{

			}

			public LayoutParams(int width, int height, float weight) : base(width, height)
			{
				Weight = weight;
			}
		}
	}
}