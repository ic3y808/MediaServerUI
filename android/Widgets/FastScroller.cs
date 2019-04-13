using Android.Animation;
using Android.Content;
using Android.Content.Res;
using Android.Graphics;
using Android.Support.V4.View.Animation;
using Android.Support.V7.Widget;
using Android.Util;
using Android.Views;
using Java.Lang;
using Alloy.Helpers;
using Alloy.Interfaces;

using Math = System.Math;

namespace Alloy.Widgets
{
	public class FastScroller : Object
	{
		private static readonly int DEFAULT_AUTO_HIDE_DELAY = 1500;

		private readonly FastScrollRecyclerView mRecyclerView;
		private readonly FastScrollPopup mPopup;

		private readonly int mThumbHeight;
		private readonly int mWidth;

		private readonly Paint mThumb;
		private readonly Paint mTrack;

		private readonly Rect mTmpRect = new Rect();
		private readonly Rect mInvalidateRect = new Rect();
		private readonly Rect mInvalidateTmpRect = new Rect();

		// The inset is the buffer around which a point will still register as a click on the scrollbar
		private readonly int mTouchInset;

		// This is the offset from the top of the scrollbar when the user first starts touching.  To
		// prevent jumping, this offset is applied as the user scrolls.
		private int mTouchOffset;

		private readonly Point mThumbPosition = new Point(-1, -1);
		private readonly Point mOffset = new Point(0, 0);

		private bool mIsDragging;

		private Animator mAutoHideAnimator;
		private bool mAnimatingShow;
		private int mAutoHideDelay;
		private bool mAutoHideEnabled;
		private readonly Runnable mHideRunnable;

		private readonly Color mThumbActiveColor;
		private Color mThumbInactiveColor;
		private bool mThumbInactiveState;

		public enum FastScrollerPopupPosition
		{

			ADJACENT = 0,
			CENTER = 1
		}

		public FastScroller(Context context, FastScrollRecyclerView recyclerView, IAttributeSet attrs)
		{

			Resources resources = context.Resources;

			mRecyclerView = recyclerView;
			mPopup = new FastScrollPopup(resources, recyclerView);

			mThumbHeight = Utils.toPixels(resources, 48);
			mWidth = Utils.toPixels(resources, 8);

			mTouchInset = Utils.toPixels(resources, -24);

			mThumb = new Paint(PaintFlags.AntiAlias);
			mTrack = new Paint(PaintFlags.AntiAlias);
			mThumbInactiveColor = Color.Transparent;
			TypedArray typedArray = context.Theme.ObtainStyledAttributes(attrs, Resource.Styleable.FastScrollRecyclerView, 0, 0);
			try
			{
				mAutoHideEnabled = typedArray.GetBoolean(Resource.Styleable.FastScrollRecyclerView_fastScrollAutoHide, true);
				mAutoHideDelay = typedArray.GetInteger(Resource.Styleable.FastScrollRecyclerView_fastScrollAutoHideDelay, DEFAULT_AUTO_HIDE_DELAY);
				mThumbInactiveState = typedArray.GetBoolean(Resource.Styleable.FastScrollRecyclerView_fastScrollEnableThumbInactiveColor, true);
				mThumbActiveColor = typedArray.GetColor(Resource.Styleable.FastScrollRecyclerView_fastScrollThumbColor, 0x79000000);
				mThumbInactiveColor = typedArray.GetColor(Resource.Styleable.FastScrollRecyclerView_fastScrollThumbInactiveColor, 0x79000000);

				Color trackColor = typedArray.GetColor(Resource.Styleable.FastScrollRecyclerView_fastScrollTrackColor, 0x28000000);
				Color popupBgColor = typedArray.GetColor(Resource.Styleable.FastScrollRecyclerView_fastScrollPopupBgColor, Color.Black);
				Color popupTextColor = typedArray.GetColor(Resource.Styleable.FastScrollRecyclerView_fastScrollPopupTextColor, Color.White);
				int popupTextSize = typedArray.GetDimensionPixelSize(Resource.Styleable.FastScrollRecyclerView_fastScrollPopupTextSize, Utils.toScreenPixels(resources, 44));
				int popupBackgroundSize = typedArray.GetDimensionPixelSize(Resource.Styleable.FastScrollRecyclerView_fastScrollPopupBackgroundSize, Utils.toPixels(resources, 88));

				FastScrollerPopupPosition popupPosition = (FastScrollerPopupPosition)typedArray.GetInteger(Resource.Styleable.FastScrollRecyclerView_fastScrollPopupPosition, (int)FastScrollerPopupPosition.ADJACENT);

				mTrack.Color = trackColor;
				mThumb.Color = mThumbInactiveState ? mThumbInactiveColor : mThumbActiveColor;
				mPopup.setBgColor(popupBgColor);
				mPopup.setTextColor(popupTextColor);
				mPopup.setTextSize(popupTextSize);
				mPopup.setBackgroundSize(popupBackgroundSize);
				mPopup.setPopupPosition(popupPosition);
			}
			finally { typedArray.Recycle(); }

			mHideRunnable = new Runnable(() =>
			{
				if (!mIsDragging)
				{
					mAutoHideAnimator?.Cancel();

					mAutoHideAnimator = ObjectAnimator.OfInt(this, "offsetX", (Utils.isRtl(mRecyclerView.Resources) ? -1 : 1) * mWidth);
					mAutoHideAnimator.SetInterpolator(new FastOutLinearInInterpolator());
					mAutoHideAnimator.SetDuration(200);
					mAutoHideAnimator.Start();
				}
			});



			mRecyclerView.AddOnScrollListener(new ScrollListener(this, mRecyclerView));

			if (mAutoHideEnabled) { postAutoHideDelayed(); }

		}

		public class ScrollListener : RecyclerView.OnScrollListener
		{
			private readonly FastScroller fastScroller;
			private readonly FastScrollRecyclerView mRecyclerView;

			public ScrollListener(FastScroller fastScroller, FastScrollRecyclerView mRecyclerView)
			{
				this.fastScroller = fastScroller;
				this.mRecyclerView = mRecyclerView;
			}
			public override void OnScrolled(RecyclerView recyclerView, int dx, int dy)
			{
				base.OnScrolled(recyclerView, dx, dy);

				if (!mRecyclerView.IsInEditMode)
				{
					fastScroller.show();
				}
			}
		}

		public int getThumbHeight()
		{
			return mThumbHeight;
		}

		public int getWidth()
		{
			return mWidth;
		}

		public bool isDragging()
		{
			return mIsDragging;
		}

		/**
		 * Handles the touch event and determines whether to show the fast scroller (or updates it if
		 * it is already showing).
		 */
		public void handleTouchEvent(MotionEvent ev, int downX, int downY, int lastY,
									 OnFastScrollStateChangeListener stateChangeListener)
		{
			ViewConfiguration config = ViewConfiguration.Get(mRecyclerView.Context);

			MotionEventActions action = ev.Action;
			int y = (int)ev.GetY();
			switch (action)
			{
				case MotionEventActions.Down:
					if (isNearPoint(downX, downY))
					{
						mTouchOffset = downY - mThumbPosition.Y;
					}
					break;
				case MotionEventActions.Move:
					// Check if we should start scrolling
					if (!mIsDragging && isNearPoint(downX, downY) &&
							Math.Abs(y - downY) > config.ScaledTouchSlop)
					{
						mRecyclerView.Parent.RequestDisallowInterceptTouchEvent(true);
						mIsDragging = true;
						mTouchOffset += (lastY - downY);
						mPopup.animateVisibility(true);
						if (stateChangeListener != null)
						{
							stateChangeListener.onFastScrollStart();
						}
						if (mThumbInactiveState)
						{
							mThumb.Color = mThumbActiveColor;
						}
					}
					if (mIsDragging)
					{
						// Update the fastscroller section name at this touch position
						int top = 0;
						int bottom = mRecyclerView.Height - mThumbHeight;
						float boundedY = Math.Max(top, Math.Min(bottom, y - mTouchOffset));
						string sectionName = mRecyclerView.scrollToPositionAtProgress((boundedY - top) / (bottom - top));
						mPopup.setSectionName(sectionName);
						mPopup.animateVisibility(!string.IsNullOrEmpty(sectionName));
						mRecyclerView.Invalidate(mPopup.updateFastScrollerBounds(mRecyclerView, mThumbPosition.Y));
					}
					break;
				case MotionEventActions.Up:
				case MotionEventActions.Cancel:
					mTouchOffset = 0;
					if (mIsDragging)
					{
						mIsDragging = false;
						mPopup.animateVisibility(false);
						stateChangeListener?.onFastScrollStop();
					}
					if (mThumbInactiveState)
					{
						mThumb.Color = mThumbInactiveColor;
					}
					break;
			}
		}

		public void draw(Canvas canvas)
		{

			if (mThumbPosition.X < 0 || mThumbPosition.Y < 0)
			{
				return;
			}

			//Background
			canvas.DrawRect(mThumbPosition.X + mOffset.X, mOffset.Y, mThumbPosition.X + mOffset.X + mWidth, mRecyclerView.Height + mOffset.Y, mTrack);

			//Handle
			canvas.DrawRect(mThumbPosition.X + mOffset.X, mThumbPosition.Y + mOffset.Y, mThumbPosition.X + mOffset.X + mWidth, mThumbPosition.Y + mOffset.Y + mThumbHeight, mThumb);

			//Popup
			mPopup.draw(canvas);
		}

		/**
		 * Returns whether the specified points are near the scroll bar bounds.
		 */
		private bool isNearPoint(int x, int y)
		{
			mTmpRect.Set(mThumbPosition.X, mThumbPosition.Y, mThumbPosition.X + mWidth,
					mThumbPosition.Y + mThumbHeight);
			mTmpRect.Inset(mTouchInset, mTouchInset);
			return mTmpRect.Contains(x, y);
		}

		public void setThumbPosition(int x, int y)
		{
			if (mThumbPosition.X == x && mThumbPosition.Y == y)
			{
				return;
			}
			// do not create new objects here, this is called quite often
			mInvalidateRect.Set(mThumbPosition.X + mOffset.X, mOffset.Y, mThumbPosition.X + mOffset.X + mWidth, mRecyclerView.Height + mOffset.Y);
			mThumbPosition.Set(x, y);
			mInvalidateTmpRect.Set(mThumbPosition.X + mOffset.X, mOffset.Y, mThumbPosition.X + mOffset.X + mWidth, mRecyclerView.Height + mOffset.Y);
			mInvalidateRect.Union(mInvalidateTmpRect);
			mRecyclerView.Invalidate(mInvalidateRect);
		}


		public void setOffset(int x, int y)
		{
			if (mOffset.X == x && mOffset.Y == y)
			{
				return;
			}
			// do not create new objects here, this is called quite often
			mInvalidateRect.Set(mThumbPosition.X + mOffset.X, mOffset.Y, mThumbPosition.X + mOffset.X + mWidth, mRecyclerView.Height + mOffset.Y);
			mOffset.Set(x, y);
			mInvalidateTmpRect.Set(mThumbPosition.X + mOffset.X, mOffset.Y, mThumbPosition.X + mOffset.X + mWidth, mRecyclerView.Height + mOffset.Y);
			mInvalidateRect.Union(mInvalidateTmpRect);
			mRecyclerView.Invalidate(mInvalidateRect);
		}

		// Setter/getter for the popup alpha for animations
		public void setOffsetX(int x)
		{
			setOffset(x, mOffset.Y);
		}

		public int getOffsetX()
		{
			return mOffset.X;
		}

		public class AnimatiorListener : AnimatorListenerAdapter
		{
			readonly FastScroller fastScroller;

			public AnimatiorListener(FastScroller fastScroller)
			{
				this.fastScroller = fastScroller;
			}

			public override void OnAnimationCancel(Animator animation)
			{
				base.OnAnimationCancel(animation);
				fastScroller.mAnimatingShow = false;
			}

			public override void OnAnimationEnd(Animator animation)
			{
				base.OnAnimationEnd(animation);
				fastScroller.mAnimatingShow = false;
			}
		}
		public void show()
		{
			if (!mAnimatingShow)
			{
				if (mAutoHideAnimator != null)
				{
					mAutoHideAnimator.Cancel();
				}
				mAutoHideAnimator = ObjectAnimator.OfInt(this, "offsetX", 0);
				mAutoHideAnimator.SetInterpolator(new LinearOutSlowInInterpolator());
				mAutoHideAnimator.SetDuration(150);
				mAutoHideAnimator.AddListener(new AnimatiorListener(this));
				mAnimatingShow = true;
				mAutoHideAnimator.Start();
			}
			if (mAutoHideEnabled)
			{
				postAutoHideDelayed();
			}
			else
			{
				cancelAutoHide();
			}
		}

		protected void postAutoHideDelayed()
		{
			if (mRecyclerView != null)
			{
				cancelAutoHide();
				mRecyclerView.PostDelayed(mHideRunnable, mAutoHideDelay);
			}
		}

		protected void cancelAutoHide()
		{
			if (mRecyclerView != null)
			{
				mRecyclerView.RemoveCallbacks(mHideRunnable);
			}
		}

		public void setThumbColor(Color color)
		{
			mThumb.Color = color;
			mRecyclerView.Invalidate(mInvalidateRect);
		}

		public void setTrackColor(Color color)
		{
			mTrack.Color = color;
			mRecyclerView.Invalidate(mInvalidateRect);
		}

		public void setPopupBgColor(Color color)
		{
			mPopup.setBgColor(color);
		}

		public void setPopupTextColor(Color color)
		{
			mPopup.setTextColor(color);
		}

		public void setPopupTypeface(Typeface typeface)
		{
			mPopup.setTypeface(typeface);
		}

		public void setPopupTextSize(int size)
		{
			mPopup.setTextSize(size);
		}

		public void setAutoHideDelay(int hideDelay)
		{
			mAutoHideDelay = hideDelay;
			if (mAutoHideEnabled)
			{
				postAutoHideDelayed();
			}
		}

		public void setAutoHideEnabled(bool autoHideEnabled)
		{
			mAutoHideEnabled = autoHideEnabled;
			if (autoHideEnabled)
			{
				postAutoHideDelayed();
			}
			else
			{
				cancelAutoHide();
			}
		}

		public void setPopupPosition(FastScrollerPopupPosition popupPosition)
		{
			mPopup.setPopupPosition(popupPosition);
		}

		public void setThumbInactiveColor(Color color)
		{
			mThumbInactiveColor = color;
			enableThumbInactiveColor(true);
		}

		public void enableThumbInactiveColor(bool enableInactiveColor)
		{
			mThumbInactiveState = enableInactiveColor;
			mThumb.Color = mThumbInactiveState ? mThumbInactiveColor : mThumbActiveColor;
		}


		public void setThumbInactiveColor(bool thumbInactiveColor)
		{
			enableThumbInactiveColor(thumbInactiveColor);
		}
	}
}