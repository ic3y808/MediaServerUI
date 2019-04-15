using System;
using Android.Animation;
using Android.Content.Res;
using Android.Graphics;
using Android.Text;
using Java.Interop;
using Alloy.Helpers;

namespace Alloy.Widgets
{
	public class FastScrollPopup : Java.Lang.Object
	{
		private readonly FastScrollRecyclerView mRecyclerView;

		private readonly Resources mRes;

		private int mBackgroundSize;
		private int mCornerRadius;

		private readonly Path mBackgroundPath = new Path();
		private readonly RectF mBackgroundRect = new RectF();
		private readonly Paint mBackgroundPaint;
		private Color mBackgroundColor;

		private readonly Rect mInvalidateRect = new Rect();
		private readonly Rect mTmpRect = new Rect();
		
		private readonly Rect mBgBounds = new Rect();

		private string mSectionName;

		private readonly Paint mTextPaint;
		private readonly Rect mTextBounds = new Rect();

		private float mAlpha = 1;

		private ObjectAnimator mAlphaAnimator;
		private bool mVisible;

		FastScroller.FastScrollerPopupPosition mPosition;

		public FastScrollPopup(Resources resources, FastScrollRecyclerView recyclerView)
		{
			mBackgroundColor = Color.Black;
			mRes = resources;

			mRecyclerView = recyclerView;

			mBackgroundPaint = new Paint(PaintFlags.AntiAlias);

			mTextPaint = new Paint(PaintFlags.AntiAlias);
			mTextPaint.Alpha = 0;

			setTextSize(Utils.toScreenPixels(mRes, 44));
			setBackgroundSize(Utils.toPixels(mRes, 88));
		}

		public void setBgColor(Color color)
		{
			mBackgroundColor = color;
			mBackgroundPaint.Color = color;
			mRecyclerView.Invalidate(mBgBounds);
		}

		public void setTextColor(Color color)
		{
			mTextPaint.Color = color;
			mRecyclerView.Invalidate(mBgBounds);
		}

		public void setTextSize(int size)
		{
			mTextPaint.TextSize = size;
			mRecyclerView.Invalidate(mBgBounds);
		}

		public void setBackgroundSize(int size)
		{
			mBackgroundSize = size;
			mCornerRadius = mBackgroundSize / 2;
			mRecyclerView.Invalidate(mBgBounds);
		}

		public void setTypeface(Typeface typeface)
		{
			mTextPaint.SetTypeface(typeface);
			mRecyclerView.Invalidate(mBgBounds);
		}

		/**
		 * Animates the visibility of the fast scroller popup.
		 */
		public void animateVisibility(bool visible)
		{
			if (mVisible != visible)
			{
				mVisible = visible;
				if (mAlphaAnimator != null)
				{
					mAlphaAnimator.Cancel();
				}
				mAlphaAnimator = ObjectAnimator.OfFloat(this, "Alpha", visible ? 1f : 0f);
				mAlphaAnimator.SetDuration(visible ? 200 : 150);
				mAlphaAnimator.Start();
			}
		}

		[Export("setAlpha")]
		public void setAlpha(float alpha)
		{
			mAlpha = alpha;
			mRecyclerView.Invalidate(mBgBounds);
		}

		public void setPopupPosition(FastScroller.FastScrollerPopupPosition position)
		{
			mPosition = position;
		}

		public FastScroller.FastScrollerPopupPosition getPopupPosition()
		{
			return mPosition;
		}

		private float[] createRadii()
		{
			if (mPosition == FastScroller.FastScrollerPopupPosition.CENTER)
			{
				return new float[] { mCornerRadius, mCornerRadius, mCornerRadius, mCornerRadius, mCornerRadius, mCornerRadius, mCornerRadius, mCornerRadius };
			}

			if (Utils.isRtl(mRes))
			{
				return new float[] { mCornerRadius, mCornerRadius, mCornerRadius, mCornerRadius, mCornerRadius, mCornerRadius, 0, 0 };
			}
			else
			{
				return new float[] { mCornerRadius, mCornerRadius, mCornerRadius, mCornerRadius, 0, 0, mCornerRadius, mCornerRadius };
			}
		}

		public void draw(Canvas canvas)
		{
			if (isVisible())
			{
				// Draw the fast scroller popup
#pragma warning disable 618
				int restoreCount = canvas.Save(SaveFlags.Matrix);
#pragma warning restore 618
				canvas.Translate(mBgBounds.Left, mBgBounds.Top);
				mTmpRect.Set(mBgBounds);
				mTmpRect.OffsetTo(0, 0);

				mBackgroundPath.Reset();
				mBackgroundRect.Set(mTmpRect);

				float[] radii = createRadii();

				mBackgroundPath.AddRoundRect(mBackgroundRect, radii, Path.Direction.Cw);

				mBackgroundPaint.Alpha = (int)(Color.GetAlphaComponent(mBackgroundColor) * mAlpha);
				mTextPaint.Alpha = (int)(mAlpha * 255);
				canvas.DrawPath(mBackgroundPath, mBackgroundPaint);
				canvas.DrawText(mSectionName, (mBgBounds.Width() - (float)mTextBounds.Width()) / 2,
						mBgBounds.Height() - (mBgBounds.Height() - (float)mTextBounds.Height()) / 2,
						mTextPaint);
				canvas.RestoreToCount(restoreCount);
			}
		}

		public void setSectionName(String sectionName)
		{
			if (!sectionName.Equals(mSectionName))
			{
				mSectionName = sectionName;
				mTextPaint.GetTextBounds(sectionName, 0, sectionName.Length, mTextBounds);
				// Update the width to use measureText since that is more accurate
				mTextBounds.Right = (int)(mTextBounds.Left + mTextPaint.MeasureText(sectionName));
			}
		}

		/**
		 * Updates the bounds for the fast scroller.
		 *
		 * @return the invalidation rect for this update.
		 */
		public Rect updateFastScrollerBounds(FastScrollRecyclerView recyclerView, int thumbOffsetY)
		{
			mInvalidateRect.Set(mBgBounds);

			if (isVisible())
			{
				// Calculate the dimensions and position of the fast scroller popup
				int edgePadding = recyclerView.getScrollBarWidth();
				int bgPadding = (int)Math.Round((double)(mBackgroundSize - mTextBounds.Height()) / 10) * 5;
				int bgHeight = mBackgroundSize;
				int bgWidth = Math.Max(mBackgroundSize, mTextBounds.Width() + (2 * bgPadding));
				if (mPosition == FastScroller.FastScrollerPopupPosition.CENTER)
				{
					mBgBounds.Left = (recyclerView.Width - bgWidth) / 2;
					mBgBounds.Right = mBgBounds.Left + bgWidth;
					mBgBounds.Top = (recyclerView.Height - bgHeight) / 2;
				}
				else
				{
					if (Utils.isRtl(mRes))
					{
						mBgBounds.Left = (2 * recyclerView.getScrollBarWidth());
						mBgBounds.Right = mBgBounds.Left + bgWidth;
					}
					else
					{
						mBgBounds.Right = recyclerView.Width - (2 * recyclerView.getScrollBarWidth());
						mBgBounds.Left = mBgBounds.Right - bgWidth;
					}
					mBgBounds.Top = thumbOffsetY - bgHeight + recyclerView.getScrollBarThumbHeight() / 2;
					mBgBounds.Top = Math.Max(edgePadding, Math.Min(mBgBounds.Top, recyclerView.Height - edgePadding - bgHeight));
				}
				mBgBounds.Bottom = mBgBounds.Top + bgHeight;
			}
			else
			{
				mBgBounds.SetEmpty();
			}

			// Combine the old and new fast scroller bounds to create the full invalidate rect
			mInvalidateRect.Union(mBgBounds);
			return mInvalidateRect;
		}

		public bool isVisible()
		{
			return (mAlpha > 0f) && (!TextUtils.IsEmpty(mSectionName));
		}
	}
}