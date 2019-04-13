using System;
using Android.Content;
using Android.Graphics;
using Android.OS;
using Android.Support.V7.Widget;
using Android.Views;
using Android.Widget;
using Java.Lang;
using Microsoft.AppCenter.Crashes;
using Exception = System.Exception;
using Math = System.Math;

namespace Alloy.Widgets
{
	public class IndexFastScrollRecyclerSection : RecyclerView.AdapterDataObserver
	{
		private float mIndexbarWidth;
		private float mIndexbarMarginWidth;
		private float mIndexbarMarginHeight;
		private float mPreviewPadding;
		private float mDensity;
		private float mScaledDensity;
		private int mListViewWidth;
		private int mListViewHeight;
		private int mCurrentSection = -1;
		private bool mIsIndexing;
		private RecyclerView mRecyclerView;
		private ISectionIndexer mIndexer;
		private Java.Lang.Object[] mSections;
		private RectF mIndexbarRect;

		private int indexTextSize;
		private float indexbarWidth;
		private float indexbarMarginWidth;
		private float indexbarMarginHeight;
		private int previewPadding;
		private bool PreviewVisibility = true;
		private int indexBarCornerRadius;
		private Typeface typeface;
		private bool indexBarVisibility = true;
		private bool indexBarHighLateTextVisibility;
		private Color indexbarBackgroudColor;
		private Color indexbarTextColor;
		private Color indexbarHighLateTextColor;

		private int previewTextSize;
		private Color previewBackgroundColor;
		private Color previewTextColor;
		private int previewBackgroudAlpha;
		private int indexbarBackgroudAlpha;

		private static int WHAT_FADE_PREVIEW = 1;

		public IndexFastScrollRecyclerSection(Context context, IndexFastScrollRecyclerView rv)
		{

			indexTextSize = rv.IndexTextSize;
			indexbarWidth = rv.IndexbarWidth;
			indexbarMarginWidth = rv.IndexbarMarginWidth;
			indexbarMarginHeight = rv.IndexbarMarginHeight;
			previewPadding = rv.PreviewPadding;
			previewTextSize = rv.PreviewTextSize;
			previewBackgroundColor = rv.PreviewBackgroudColor;
			previewTextColor = rv.PreviewTextColor;
			previewBackgroudAlpha = convertTransparentValueToBackgroundAlpha(rv.PreviewTransparentValue);

			indexBarCornerRadius = rv.IndexBarCornerRadius;
			indexbarBackgroudColor = rv.IndexbarBackgroudColor;
			indexbarTextColor = rv.IndexbarTextColor;
			indexbarHighLateTextColor = rv.IndexbarHighLateTextColor;

			indexbarBackgroudAlpha = convertTransparentValueToBackgroundAlpha(rv.IndexBarTransparentValue);

			mDensity = context.Resources.DisplayMetrics.Density;
			mScaledDensity = context.Resources.DisplayMetrics.ScaledDensity;
			mRecyclerView = rv;
			SetAdapter(mRecyclerView.GetAdapter());

			mIndexbarWidth = indexbarWidth * mDensity;
			mIndexbarMarginWidth = indexbarMarginWidth * mDensity;
			mIndexbarMarginHeight = indexbarMarginHeight * mDensity;
			mPreviewPadding = previewPadding * mDensity;
		}

		public void draw(Canvas canvas)
		{

			if (indexBarVisibility)
			{

				Paint indexbarPaint = new Paint();
				indexbarPaint.Color = indexbarBackgroudColor;
				indexbarPaint.Alpha = indexbarBackgroudAlpha;
				indexbarPaint.AntiAlias = true;
				canvas.DrawRoundRect(mIndexbarRect, indexBarCornerRadius * mDensity, indexBarCornerRadius * mDensity, indexbarPaint);

				if (mSections != null && mSections.Length > 0)
				{
					// Preview is shown when mCurrentSection is set
					if (PreviewVisibility && mCurrentSection >= 0 && mSections[mCurrentSection].ToString() != "")
					{
						Paint previewPaint = new Paint();
						previewPaint.Color			= previewBackgroundColor;
						previewPaint.Alpha			= previewBackgroudAlpha;
						previewPaint.AntiAlias		= true;
						previewPaint.SetShadowLayer(3, 0, 0, Color.Argb(64, 0, 0, 0));

						Paint previewTextPaint = new Paint();
						previewTextPaint.Color = previewTextColor;
						previewTextPaint.AntiAlias = true;
						previewTextPaint.TextSize = previewTextSize * mScaledDensity;
						previewTextPaint.SetTypeface(typeface);

						float previewTextWidth = previewTextPaint.MeasureText(mSections[mCurrentSection].ToString());
						float previewSize = 2 * mPreviewPadding + previewTextPaint.Descent() - previewTextPaint.Ascent();
						previewSize = Math.Max(previewSize, previewTextWidth + 2 * mPreviewPadding);
						RectF previewRect = new RectF((mListViewWidth - previewSize) / 2
								, (mListViewHeight - previewSize) / 2
								, (mListViewWidth - previewSize) / 2 + previewSize
								, (mListViewHeight - previewSize) / 2 + previewSize);

						canvas.DrawRoundRect(previewRect, 5 * mDensity, 5 * mDensity, previewPaint);
						canvas.DrawText(mSections[mCurrentSection].ToString(), previewRect.Left + (previewSize - previewTextWidth) / 2 - 1
								, previewRect.Top + (previewSize - (previewTextPaint.Descent() - previewTextPaint.Ascent())) / 2 - previewTextPaint.Ascent(), previewTextPaint);
						fade(300);
					}

					Paint indexPaint = new Paint();
					indexPaint.Color = indexbarTextColor;
					indexPaint.AntiAlias = true;
					indexPaint.TextSize = indexTextSize * mScaledDensity;
					indexPaint.SetTypeface(typeface);

					float sectionHeight = (mIndexbarRect.Height() - /*2 **/ mIndexbarMarginHeight) / mSections.Length;
					float paddingTop = (sectionHeight - (indexPaint.Descent() - indexPaint.Ascent())) / 2;
					for (int i = 0; i < mSections.Length; i++)
					{

						if (indexBarHighLateTextVisibility)
						{

							if (mCurrentSection > -1 && i == mCurrentSection)
							{
								indexPaint.SetTypeface(Typeface.Create(typeface, TypefaceStyle.Bold));
								indexPaint.TextSize = (indexTextSize + 3) * mScaledDensity;
								indexPaint.Color = indexbarHighLateTextColor;
							}
							else
							{
								indexPaint.SetTypeface(typeface);
								indexPaint.TextSize = indexTextSize * mScaledDensity;
								indexPaint.Color = indexbarTextColor;
							}
							float paddingLeft = (mIndexbarWidth - indexPaint.MeasureText(mSections[i].ToString())) / 2;
							canvas.DrawText(mSections[i].ToString(), mIndexbarRect.Left + paddingLeft
									, mIndexbarRect.Top + mIndexbarMarginHeight + sectionHeight * i + paddingTop - indexPaint.Ascent(), indexPaint);


						}
						else
						{
							float paddingLeft = (mIndexbarWidth - indexPaint.MeasureText(mSections[i].ToString())) / 2;
							canvas.DrawText(mSections[i].ToString(), mIndexbarRect.Left + paddingLeft
									, mIndexbarRect.Top + mIndexbarMarginHeight + sectionHeight * i + paddingTop - indexPaint.Ascent(), indexPaint);
						}

					}
				}
			}
		}

		public bool onTouchEvent(MotionEvent ev)
		{
			switch (ev.Action)
			{
				case MotionEventActions.Down:
					// If down event occurs inside index bar region, start indexing
					if (contains(ev.GetX(), ev.GetY()))
					{

						// It demonstrates that the motion event started from index bar
						mIsIndexing = true;
						// Determine which section the point is in, and move the list to that section
						mCurrentSection = getSectionByPoint(ev.GetY());
						scrollToPosition();
						return true;
					}
					break;
				case MotionEventActions.Move:
					if (mIsIndexing)
					{
						// If this event moves inside index bar
						if (contains(ev.GetX(), ev.GetY()))
						{
							// Determine which section the point is in, and move the list to that section
							mCurrentSection = getSectionByPoint(ev.GetY());
							scrollToPosition();
						}
						return true;
					}
					break;
				case MotionEventActions.Up:
					if (mIsIndexing)
					{
						mIsIndexing = false;
						mCurrentSection = -1;
					}
					break;
			}
			return false;
		}

		private void scrollToPosition()
		{
			try
			{
				int position = mIndexer.GetPositionForSection(mCurrentSection);
				RecyclerView.LayoutManager layoutManager = mRecyclerView.GetLayoutManager();
				if (layoutManager is LinearLayoutManager) {
					((LinearLayoutManager)layoutManager).ScrollToPositionWithOffset(position, 0);
				} else {
					layoutManager.ScrollToPosition(position);
				}
			}
			catch (Exception ee) { Crashes.TrackError(ee); }
		}

		public void onSizeChanged(int w, int h, int oldw, int oldh)
		{
			mListViewWidth = w;
			mListViewHeight = h;
			mIndexbarRect = new RectF(w - mIndexbarMarginWidth - mIndexbarWidth
				, mIndexbarMarginHeight
				, w - (mIndexbarMarginWidth * 2)
				, h /*- mIndexbarMarginHeight*/);
		}

		public void SetAdapter(RecyclerView.Adapter adapter)
		{
			if (adapter is ISectionIndexer) {
				adapter.RegisterAdapterDataObserver(this);
				mIndexer = (ISectionIndexer)adapter;
				mSections = mIndexer.GetSections();
			}
		}

		public override void OnChanged()
		{
			base.OnChanged();
			mSections = mIndexer.GetSections();
		}

		public bool contains(float x, float y)
		{
			// Determine if the point is in index bar region, which includes the right margin of the bar
			return (x >= mIndexbarRect.Left && y >= mIndexbarRect.Top && y <= mIndexbarRect.Top + mIndexbarRect.Height());
		}

		private int getSectionByPoint(float y)
		{
			if (mSections == null || mSections.Length == 0)
				return 0;
			if (y < mIndexbarRect.Top + mIndexbarMarginHeight)
				return 0;
			if (y >= mIndexbarRect.Top + mIndexbarRect.Height() - mIndexbarMarginHeight)
				return mSections.Length - 1;
			return (int)((y - mIndexbarRect.Top - mIndexbarMarginHeight) / ((mIndexbarRect.Height() - /*2 **/ mIndexbarMarginHeight) / mSections.Length));
		}

		private Runnable mLastFadeRunnable;


		private void fade(long delay)
		{
			if (mRecyclerView != null)
			{
				if (mLastFadeRunnable != null)
				{
					mRecyclerView.RemoveCallbacks(mLastFadeRunnable);
				}
			}
			var mHandler = new Handler(new Action<Message>((msg) =>
			{
				if (msg.What == WHAT_FADE_PREVIEW)
				{
					mRecyclerView.Invalidate();
				}

				mLastFadeRunnable = new Runnable(new Action(() =>
				{
					mRecyclerView.Invalidate();
				}));

				mRecyclerView.PostDelayed(mLastFadeRunnable, delay);
			}));
			mHandler.RemoveMessages(0);
			mHandler.SendEmptyMessageAtTime(WHAT_FADE_PREVIEW, SystemClock.UptimeMillis() + delay);
		}

		private int convertTransparentValueToBackgroundAlpha(float value)
		{
			return (int)(255 * value);
		}

		public void SetIndexTextSize(int value)
		{
			indexTextSize = value;
		}

		public void SetIndexbarWidth(float value)
		{
			mIndexbarWidth = value;
		}

		public void SetIndexbarMarginWidth(float value)
		{
			mIndexbarMarginWidth = value;
		}

		public void SetIndexbarMarginHeight(float value)
		{
			mIndexbarMarginHeight = value;
		}

		public void SetPreviewPadding(int value)
		{
			previewPadding = value;
		}

		public void SetIndexBarCornerRadius(int value)
		{
			indexBarCornerRadius = value;
		}

		public void SetIndexBarTransparentValue(float value)
		{
			indexbarBackgroudAlpha = convertTransparentValueToBackgroundAlpha(value);
		}

		public void SetTypeface(Typeface tf)
		{
			typeface = tf;
		}

		public void SetIndexBarVisibility(bool shown)
		{
			indexBarVisibility = shown;
		}

		public void SetPreviewVisibility(bool shown)
		{
			PreviewVisibility = shown;
		}

		public void SetPreviewTextSize(int value)
		{
			previewTextSize = value;
		}

		public void SetPreviewColor(Color color)
		{
			previewBackgroundColor = color;
		}

		public void SetPreviewTextColor(Color color)
		{
			previewTextColor = color;
		}

		public void SetPreviewTransparentValue(float value)
		{
			previewBackgroudAlpha = convertTransparentValueToBackgroundAlpha(value);
		}

		public void SetIndexBarColor(Color color)
		{
			indexbarBackgroudColor = color;
		}

		public void SetIndexBarTextColor(Color color)
		{
			indexbarTextColor = color;
		}

		public void SetIndexBarHighLateTextColor(Color color)
		{
			indexbarHighLateTextColor = color;
		}

		public void SetIndexBarHighLateTextVisibility(bool shown)
		{
			indexBarHighLateTextVisibility = shown;
		}
	}
}