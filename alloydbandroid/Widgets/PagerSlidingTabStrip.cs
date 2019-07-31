using Android.Content;
using Android.Content.Res;
using Android.Database;
using Android.Graphics;
using Android.OS;
using Android.Support.V4.Content;
using Android.Support.V4.View;
using Android.Util;
using Android.Views;
using Android.Widget;
using Java.Interop;
using Java.Lang;
using Orientation = Android.Widget.Orientation;

namespace Alloy.Widgets
{
	public sealed class PagerSlidingTabStrip : HorizontalScrollView
	{

		public const int DEF_VALUE_TAB_TEXT_ALPHA = 150;
		private static readonly int[] ANDROID_ATTRS = {
			Android.Resource.Attribute.TextColorPrimary,
			Android.Resource.Attribute.Padding,
			Android.Resource.Attribute.PaddingLeft,
			Android.Resource.Attribute.PaddingRight,
		};

		//These indexes must be related with the ATTR array above
		private static int TEXT_COLOR_PRIMARY = 0;
		private static int PADDING_INDEX = 1;
		private static int PADDING_LEFT_INDEX = 2;
		private static int PADDING_RIGHT_INDEX = 3;

		private readonly LinearLayout mTabsContainer;
		private readonly LinearLayout.LayoutParams mTabLayoutParams;

		private PagerAdapterObserver mAdapterObserver;

		private OnTabReselectedListener mTabReselectedListener;
		private ViewPager.IOnPageChangeListener mDelegatePageListener;
		private ViewPager mPager;

		private int mTabCount;

		private int mCurrentPosition;
		private float mCurrentPositionOffset;

		private readonly Paint mRectPaint;
		private readonly Paint mDividerPaint;

		private Color mIndicatorColor;
		private int mIndicatorHeight = 2;

		private int mUnderlineHeight;
		private Color mUnderlineColor;

		private int mDividerWidth;
		private int mDividerPadding;
		private Color mDividerColor;

		private int mTabPadding = 12;
		private int mTabTextSize = 14;
		private ColorStateList mTabTextColor;

		private int mPaddingLeft;
		private int mPaddingRight;

		private bool isExpandTabs;
		private bool isPaddingMiddle;
		private bool isTabTextAllCaps = true;

		private Typeface mTabTextTypeface;
		private TypefaceStyle mTabTextTypefaceStyle = TypefaceStyle.Bold;

		private int mScrollOffset;
		private int mLastScrollX;

		private int mTabBackgroundResId = Resource.Drawable.psts_background_tab;

		public PagerSlidingTabStrip(Context context) : this(context, null, 0)
		{

		}

		public PagerSlidingTabStrip(Context context, IAttributeSet attrs) : this(context, attrs, 0)
		{
		}

		public PagerSlidingTabStrip(Context context, IAttributeSet attrs, int defStyle) : base(context, attrs, defStyle)
		{
			FillViewport = true;
			SetWillNotDraw(false);
			mTabsContainer = new LinearLayout(context);
			mTabsContainer.Orientation = Orientation.Horizontal;
			AddView(mTabsContainer);

			mRectPaint = new Paint();
			mRectPaint.AntiAlias = true;
			mRectPaint.SetStyle(Paint.Style.Fill);

			DisplayMetrics dm = Resources.DisplayMetrics;
			mScrollOffset = (int)TypedValue.ApplyDimension(ComplexUnitType.Dip, mScrollOffset, dm);
			mIndicatorHeight = (int)TypedValue.ApplyDimension(ComplexUnitType.Dip, mIndicatorHeight, dm);
			mUnderlineHeight = (int)TypedValue.ApplyDimension(ComplexUnitType.Dip, mUnderlineHeight, dm);
			mDividerPadding = (int)TypedValue.ApplyDimension(ComplexUnitType.Dip, mDividerPadding, dm);
			mTabPadding = (int)TypedValue.ApplyDimension(ComplexUnitType.Dip, mTabPadding, dm);
			mDividerWidth = (int)TypedValue.ApplyDimension(ComplexUnitType.Dip, mDividerWidth, dm);
			mTabTextSize = (int)TypedValue.ApplyDimension(ComplexUnitType.Sp, mTabTextSize, dm);

			mDividerPaint = new Paint();
			mDividerPaint.AntiAlias = true;
			mDividerPaint.StrokeWidth = mDividerWidth;

			// get system attrs for container
			TypedArray a = context.ObtainStyledAttributes(attrs, ANDROID_ATTRS);
			int textPrimaryColor = a.GetColor(TEXT_COLOR_PRIMARY, ContextCompat.GetColor(context, Android.Resource.Color.Black));
			mUnderlineColor = new Color(textPrimaryColor);
			mDividerColor = new Color(textPrimaryColor);
			mIndicatorColor = new Color(textPrimaryColor);
			int padding = a.GetDimensionPixelSize(PADDING_INDEX, 0);
			mPaddingLeft = padding > 0 ? padding : a.GetDimensionPixelSize(PADDING_LEFT_INDEX, 0);
			mPaddingRight = padding > 0 ? padding : a.GetDimensionPixelSize(PADDING_RIGHT_INDEX, 0);
			a.Recycle();


			// Use Roboto Medium as the default typeface from API 21 onwards
			if (Build.VERSION.SdkInt >= BuildVersionCodes.Lollipop)
			{
				mTabTextTypefaceStyle = TypefaceStyle.Bold;
			}

			// get custom attrs for tabs and container
			a = context.ObtainStyledAttributes(attrs, Resource.Styleable.PagerSlidingTabStrip);
			mIndicatorColor = a.GetColor(Resource.Styleable.PagerSlidingTabStrip_pstsIndicatorColor, mIndicatorColor);
			mIndicatorHeight = a.GetDimensionPixelSize(Resource.Styleable.PagerSlidingTabStrip_pstsIndicatorHeight, mIndicatorHeight);
			mUnderlineColor = a.GetColor(Resource.Styleable.PagerSlidingTabStrip_pstsUnderlineColor, mUnderlineColor);
			mUnderlineHeight = a.GetDimensionPixelSize(Resource.Styleable.PagerSlidingTabStrip_pstsUnderlineHeight, mUnderlineHeight);
			mDividerColor = a.GetColor(Resource.Styleable.PagerSlidingTabStrip_pstsDividerColor, mDividerColor);
			mDividerWidth = a.GetDimensionPixelSize(Resource.Styleable.PagerSlidingTabStrip_pstsDividerWidth, mDividerWidth);
			mDividerPadding = a.GetDimensionPixelSize(Resource.Styleable.PagerSlidingTabStrip_pstsDividerPadding, mDividerPadding);
			isExpandTabs = a.GetBoolean(Resource.Styleable.PagerSlidingTabStrip_pstsShouldExpand, isExpandTabs);
			mScrollOffset = a.GetDimensionPixelSize(Resource.Styleable.PagerSlidingTabStrip_pstsScrollOffset, mScrollOffset);
			isPaddingMiddle = a.GetBoolean(Resource.Styleable.PagerSlidingTabStrip_pstsPaddingMiddle, isPaddingMiddle);
			mTabPadding = a.GetDimensionPixelSize(Resource.Styleable.PagerSlidingTabStrip_pstsTabPaddingLeftRight, mTabPadding);
			mTabBackgroundResId = a.GetResourceId(Resource.Styleable.PagerSlidingTabStrip_pstsTabBackground, mTabBackgroundResId);
			mTabTextSize = a.GetDimensionPixelSize(Resource.Styleable.PagerSlidingTabStrip_pstsTabTextSize, mTabTextSize);
			mTabTextColor = a.HasValue(Resource.Styleable.PagerSlidingTabStrip_pstsTabTextColor) ? a.GetColorStateList(Resource.Styleable.PagerSlidingTabStrip_pstsTabTextColor) : null;
			//mTabTextTypefaceStyle = a.GetInt(Resource.Styleable.PagerSlidingTabStrip_pstsTabTextStyle, mTabTextTypefaceStyle);
			isTabTextAllCaps = a.GetBoolean(Resource.Styleable.PagerSlidingTabStrip_pstsTabTextAllCaps, isTabTextAllCaps);
			int tabTextAlpha = a.GetInt(Resource.Styleable.PagerSlidingTabStrip_pstsTabTextAlpha, DEF_VALUE_TAB_TEXT_ALPHA);
			//string fontFamily = a.GetString(Resource.Styleable.PagerSlidingTabStrip_pstsTabTextFontFamily);
			a.Recycle();

			//Tab text color selector
			if (mTabTextColor == null)
			{
				mTabTextColor = createColorStateList(textPrimaryColor, textPrimaryColor, Color.Argb(tabTextAlpha, textPrimaryColor, textPrimaryColor, textPrimaryColor));
			}

			//Tab text typeface and style
			//if (fontFamily != null)
			//{
			//	tabTextTypefaceName = fontFamily;
			//}
			//mTabTextTypeface = Typeface.Create(tabTextTypefaceName, mTabTextTypefaceStyle);

			//Bottom padding for the tabs container parent view to show indicator and underline
			setTabsContainerParentViewPaddings();

			//Configure tab's container LayoutParams for either equal divided space or just wrap tabs
			mTabLayoutParams = isExpandTabs ?
				new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.MatchParent, 1.0f) :
				new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WrapContent, ViewGroup.LayoutParams.MatchParent);
		}

		private void setTabsContainerParentViewPaddings()
		{
			int bottomMargin = mIndicatorHeight >= mUnderlineHeight ? mIndicatorHeight : mUnderlineHeight;
			SetPadding(PaddingLeft, PaddingTop, PaddingRight, bottomMargin);
		}

		public void setViewPager(ViewPager pager)
		{
			mPager = pager;
			if (pager.Adapter == null)
			{
				throw new IllegalStateException("ViewPager does not have adapter instance.");
			}

			PageListener mPageListener = new PageListener(this);
			pager.AddOnPageChangeListener(mPageListener);
			mAdapterObserver = new PagerAdapterObserver(this);
			pager.Adapter.RegisterDataSetObserver(mAdapterObserver);
			mAdapterObserver.setAttached(true);
			notifyDataSetChanged();
		}

		public void notifyDataSetChanged()
		{
			mTabsContainer.RemoveAllViews();
			mTabCount = mPager.Adapter.Count;
			for (int i = 0; i < mTabCount; i++)
			{

				View tabView = LayoutInflater.From(Context).Inflate(Resource.Layout.psts_tab, this, false);


				string title = mPager.Adapter.GetPageTitle(i);
				addTab(i, title, tabView);
			}

			updateTabStyles();
		}

		private void addTab(int position, string title, View tabView)
		{
			TextView textView = (TextView)tabView.FindViewById(Resource.Id.psts_tab_title);
			if (textView != null)
			{
				if (title != null) textView.Text = title;
			}

			tabView.SetFocusable(ViewFocusability.Focusable);
			tabView.Click += (sender, args) =>
			{
				if (mPager.CurrentItem != position)
				{
					View tab = mTabsContainer.GetChildAt(mPager.CurrentItem);
					unSelect(tab);
					mPager.SetCurrentItem(position, true);
				}
				else if (mTabReselectedListener != null) { mTabReselectedListener.onTabReselected(position); }
			};

			mTabsContainer.AddView(tabView, position, mTabLayoutParams);
		}

		private void updateTabStyles()
		{
			for (int i = 0; i < mTabCount; i++)
			{
				View v = mTabsContainer.GetChildAt(i);
				v.SetBackgroundResource(mTabBackgroundResId);
				v.SetPadding(mTabPadding, v.PaddingTop, mTabPadding, v.PaddingBottom);
				TextView tab_title = (TextView)v.FindViewById(Resource.Id.psts_tab_title);
				if (tab_title != null)
				{
					tab_title.SetTextColor(mTabTextColor);
					tab_title.SetTypeface(mTabTextTypeface, mTabTextTypefaceStyle);
					tab_title.SetTextSize(ComplexUnitType.Px, mTabTextSize);
					// setAllCaps() is only available from API 14, so the upper case is made manually if we are on a
					// pre-ICS-build
					if (isTabTextAllCaps)
					{
						if (Build.VERSION.SdkInt >= BuildVersionCodes.IceCreamSandwich)
						{
							tab_title.SetAllCaps(true);
						}
						else
						{
							tab_title.Text = tab_title.Text.ToUpper();
						}
					}
				}
			}
		}

		private void scrollToChild(int position, int offset)
		{
			if (mTabCount == 0)
			{
				return;
			}

			int newScrollX = mTabsContainer.GetChildAt(position).Left + offset;
			if (position > 0 || offset > 0)
			{
				//Half screen offset.
				//- Either tabs start at the middle of the view scrolling straight away
				//- Or tabs start at the begging (no padding) scrolling when indicator gets
				//  to the middle of the view width
				newScrollX -= mScrollOffset;
				Point lines = getIndicatorCoordinates();
				newScrollX += ((lines.Y - lines.X) / 2);
			}

			if (newScrollX != mLastScrollX)
			{
				mLastScrollX = newScrollX;
				ScrollTo(newScrollX, 0);
			}
		}

		public Point getIndicatorCoordinates()
		{
			// default: line below current tab
			View currentTab = mTabsContainer.GetChildAt(mCurrentPosition);
			float lineLeft = currentTab.Left;
			float lineRight = currentTab.Right;
			// if there is an offset, start interpolating left and right coordinates between current and next tab
			if (mCurrentPositionOffset > 0f && mCurrentPosition < mTabCount - 1)
			{
				View nextTab = mTabsContainer.GetChildAt(mCurrentPosition + 1);
				float nextTabLeft = nextTab.Left;
				float nextTabRight = nextTab.Right;
				lineLeft = (mCurrentPositionOffset * nextTabLeft + (1f - mCurrentPositionOffset) * lineLeft);
				lineRight = (mCurrentPositionOffset * nextTabRight + (1f - mCurrentPositionOffset) * lineRight);
			}

			return new Point((int)lineLeft, (int)lineRight);
		}


		protected override void OnLayout(bool changed, int l, int t, int r, int b)
		{
			if (isPaddingMiddle && mTabsContainer.ChildCount > 0)
			{
				View view = mTabsContainer.GetChildAt(0);
				int halfWidthFirstTab = view.MeasuredWidth / 2;
				mPaddingLeft = mPaddingRight = Width / 2 - halfWidthFirstTab;
			}

			if (isPaddingMiddle || mPaddingLeft > 0 || mPaddingRight > 0)
			{
				int width;
				if (isPaddingMiddle)
				{
					width = Width;
				}
				else
				{
					// Account for manually set padding for offsetting tab start and end positions.
					width = Width - mPaddingLeft - mPaddingRight;
				}

				//Make sure tabContainer is bigger than the HorizontalScrollView to be able to scroll
				mTabsContainer.SetMinimumWidth(width);
				//Clipping padding to false to see the tabs while we pass them swiping
				SetClipToPadding(false);
			}

			SetPadding(mPaddingLeft, PaddingTop, mPaddingRight, PaddingBottom);
			if (mScrollOffset == 0)
			{
				mScrollOffset = Width / 2 - mPaddingLeft;
			}

			if (mPager != null)
			{
				mCurrentPosition = mPager.CurrentItem;
			}

			mCurrentPositionOffset = 0f;
			scrollToChild(mCurrentPosition, 0);
			updateSelection(mCurrentPosition);
			base.OnLayout(changed, l, t, r, b);
		}


		public override void Draw(Canvas canvas)
		{
			base.Draw(canvas);
			if (IsInEditMode || mTabCount == 0)
			{
				return;
			}

			int height = Height;
			// draw divider
			if (mDividerWidth > 0)
			{
				mDividerPaint.StrokeWidth = mDividerWidth;
				mDividerPaint.Color = mDividerColor;
				for (int i = 0; i < mTabCount - 1; i++)
				{
					View tab = mTabsContainer.GetChildAt(i);
					canvas.DrawLine(tab.Right, mDividerPadding, tab.Right, height - mDividerPadding, mDividerPaint);
				}
			}

			// draw underline
			if (mUnderlineHeight > 0)
			{
				mRectPaint.Color = mUnderlineColor;
				canvas.DrawRect(mPaddingLeft, height - mUnderlineHeight, mTabsContainer.Height + mPaddingRight, height, mRectPaint);
			}

			// draw indicator line
			if (mIndicatorHeight > 0)
			{
				mRectPaint.Color = mIndicatorColor;
				var lines = getIndicatorCoordinates();
				canvas.DrawRect(lines.X + mPaddingLeft, height - mIndicatorHeight, lines.Y + mPaddingLeft, height, mRectPaint);
			}
		}

		public void setOnTabReselectedListener(OnTabReselectedListener tabReselectedListener)
		{
			mTabReselectedListener = tabReselectedListener;
		}

		public void setOnPageChangeListener(ViewPager.IOnPageChangeListener listener)
		{
			mDelegatePageListener = listener;
		}

		private class PageListener : Object, ViewPager.IOnPageChangeListener
		{
			private PagerSlidingTabStrip pagerSlidingTabStrip;
			public PageListener(PagerSlidingTabStrip pagerSlidingTabStrip)
			{
				this.pagerSlidingTabStrip = pagerSlidingTabStrip;
			}
			public void OnPageScrollStateChanged(int state)
			{
				if (state == ViewPager.ScrollStateIdle)
				{
					pagerSlidingTabStrip.scrollToChild(pagerSlidingTabStrip.mPager.CurrentItem, 0);
				}
				if (pagerSlidingTabStrip.mDelegatePageListener != null)
				{
					pagerSlidingTabStrip.mDelegatePageListener.OnPageScrollStateChanged(state);
				}
			}

			public void OnPageScrolled(int position, float positionOffset, int positionOffsetPixels)
			{
				pagerSlidingTabStrip.mCurrentPosition = position;
				pagerSlidingTabStrip.mCurrentPositionOffset = positionOffset;
				int offset = pagerSlidingTabStrip.mTabCount > 0 ? (int)(positionOffset * pagerSlidingTabStrip.mTabsContainer.GetChildAt(position).Height) : 0;
				pagerSlidingTabStrip.scrollToChild(position, offset);
				pagerSlidingTabStrip.Invalidate();
				if (pagerSlidingTabStrip.mDelegatePageListener != null)
				{
					pagerSlidingTabStrip.mDelegatePageListener.OnPageScrolled(position, positionOffset, positionOffsetPixels);
				}
			}

			public void OnPageSelected(int position)
			{
				pagerSlidingTabStrip.updateSelection(position);

				//Select current item
				View currentTab = pagerSlidingTabStrip.mTabsContainer.GetChildAt(position);
				pagerSlidingTabStrip.select(currentTab);
				//Unselect prev item
				if (position > 0)
				{
					View prevTab = pagerSlidingTabStrip.mTabsContainer.GetChildAt(position - 1);
					pagerSlidingTabStrip.unSelect(prevTab);
				}
				//Unselect next item
				if (position < pagerSlidingTabStrip.mPager.Adapter.Count - 1)
				{
					View nextTab = pagerSlidingTabStrip.mTabsContainer.GetChildAt(position + 1);
					pagerSlidingTabStrip.unSelect(nextTab);
				}

				if (pagerSlidingTabStrip.mDelegatePageListener != null)
				{
					pagerSlidingTabStrip.mDelegatePageListener.OnPageSelected(position);
				}
			}
		}

		private void updateSelection(int position)
		{
			for (int i = 0; i < mTabCount; ++i)
			{
				View tv = mTabsContainer.GetChildAt(i);
				bool selected = i == position;
				if (selected)
				{
					select(tv);
				}
				else
				{
					unSelect(tv);
				}
			}
		}

		private void unSelect(View tab)
		{
			if (tab != null)
			{
				TextView tab_title = (TextView)tab.FindViewById(Resource.Id.psts_tab_title);
				if (tab_title != null) { tab_title.Selected = false; }
			}
		}

		private void select(View tab)
		{
			if (tab != null)
			{
				TextView tab_title = (TextView)tab.FindViewById(Resource.Id.psts_tab_title);
				if (tab_title != null) { tab_title.Selected = true; }
			}
		}

		protected override void OnAttachedToWindow()
		{
			base.OnAttachedToWindow();
			if (mPager != null)
			{
				if (!mAdapterObserver.isAttached())
				{
					mPager.Adapter.RegisterDataSetObserver(mAdapterObserver);
					mAdapterObserver.setAttached(true);
				}
			}
		}

		protected override void OnDetachedFromWindow()
		{
			base.OnDetachedFromWindow();
			if (mPager != null)
			{
				if (mAdapterObserver.isAttached())
				{
					mPager.Adapter.UnregisterDataSetObserver(mAdapterObserver);
					mAdapterObserver.setAttached(false);
				}
			}
		}

		protected override void OnRestoreInstanceState(IParcelable state)
		{

			SavedState savedState = (SavedState)state;
			base.OnRestoreInstanceState(state);
			mCurrentPosition = savedState.currentPosition;
			if (mCurrentPosition != 0 && mTabsContainer.ChildCount > 0)
			{
				unSelect(mTabsContainer.GetChildAt(0));
				select(mTabsContainer.GetChildAt(mCurrentPosition));
			}
			RequestLayout();
		}

		protected override IParcelable OnSaveInstanceState()
		{
			IParcelable superState = base.OnSaveInstanceState();
			SavedState savedState = new SavedState(superState) {currentPosition = mCurrentPosition};
			return savedState;
		}

		class SavedState : BaseSavedState
		{
			public int currentPosition;

			public SavedState(Parcel state) : base(state)
			{
				currentPosition = state.ReadInt();
			}
			public SavedState(IParcelable state) : base(state)
			{

			}

			public override void WriteToParcel(Parcel dest, ParcelableWriteFlags flags)
			{
				base.WriteToParcel(dest, flags);
				dest.WriteInt(currentPosition);
			}

			public class SaveStateCreator : Object, IParcelableCreator
			{
				public Object CreateFromParcel(Parcel source)
				{

					return new SavedState(source);
				}

				public Object[] NewArray(int size)
				{
					return new SavedState[size];
				}
			}

			[ExportField("CREATOR")]
			public static SaveStateCreator InitializeCreator()
			{
				return new SaveStateCreator();
			}
		}

		public int getIndicatorColor()
		{
			return mIndicatorColor;
		}

		public int getIndicatorHeight()
		{
			return mIndicatorHeight;
		}

		public int getUnderlineColor()
		{
			return mUnderlineColor;
		}

		public int getDividerColor()
		{
			return mDividerColor;
		}

		public int getDividerWidth()
		{
			return mDividerWidth;
		}

		public int getUnderlineHeight()
		{
			return mUnderlineHeight;
		}

		public int getDividerPadding()
		{
			return mDividerPadding;
		}

		public int getScrollOffset()
		{
			return mScrollOffset;
		}

		public bool getShouldExpand()
		{
			return isExpandTabs;
		}

		public int getTextSize()
		{
			return mTabTextSize;
		}

		public bool isTextAllCaps()
		{
			return isTabTextAllCaps;
		}

		public ColorStateList getTextColor()
		{
			return mTabTextColor;
		}

		public int getTabBackground()
		{
			return mTabBackgroundResId;
		}

		public int getTabPaddingLeftRight()
		{
			return mTabPadding;
		}

		public LinearLayout getTabsContainer()
		{
			return mTabsContainer;
		}

		public int getTabCount()
		{
			return mTabCount;
		}

		public int getCurrentPosition()
		{
			return mCurrentPosition;
		}

		public float getCurrentPositionOffset()
		{
			return mCurrentPositionOffset;
		}

		public void setIndicatorColor(Color indicatorColor)
		{
			mIndicatorColor = indicatorColor;
			Invalidate();
		}

		public void setIndicatorColorResource(int resId)
		{
			mIndicatorColor = new Color(ContextCompat.GetColor(Context, resId));
			Invalidate();
		}

		public void setIndicatorHeight(int indicatorLineHeightPx)
		{
			mIndicatorHeight = indicatorLineHeightPx;
			Invalidate();
		}

		public void setUnderlineColor(Color underlineColor)
		{
			mUnderlineColor = underlineColor;
			Invalidate();
		}

		public void setUnderlineColorResource(int resId)
		{
			mUnderlineColor = new Color(ContextCompat.GetColor(Context, resId));
			Invalidate();
		}

		public void setDividerColor(Color dividerColor)
		{
			mDividerColor = dividerColor;
			Invalidate();
		}

		public void setDividerColorResource(int resId)
		{
			mDividerColor = new Color(ContextCompat.GetColor(Context, resId));
			Invalidate();
		}

		public void setDividerWidth(int dividerWidthPx)
		{
			mDividerWidth = dividerWidthPx;
			Invalidate();
		}

		public void setUnderlineHeight(int underlineHeightPx)
		{
			mUnderlineHeight = underlineHeightPx;
			Invalidate();
		}

		public void setDividerPadding(int dividerPaddingPx)
		{
			mDividerPadding = dividerPaddingPx;
			Invalidate();
		}

		public void setScrollOffset(int scrollOffsetPx)
		{
			mScrollOffset = scrollOffsetPx;
			Invalidate();
		}

		public void setShouldExpand(bool shouldExpand)
		{
			isExpandTabs = shouldExpand;
			if (mPager != null)
			{
				RequestLayout();
			}
		}

		public void setAllCaps(bool textAllCaps)
		{
			isTabTextAllCaps = textAllCaps;
		}

		public void setTextSize(int textSizePx)
		{
			mTabTextSize = textSizePx;
			updateTabStyles();
		}

		public void setTextColorResource(int resId)
		{
			setTextColor(ContextCompat.GetColor(Context, resId));
		}

		public void setTextColor(int textColor)
		{
			setTextColor(createColorStateList(textColor));
		}

		public void setTextColorStateListResource(int resId)
		{
			setTextColor(ContextCompat.GetColorStateList(Context, resId));
		}

		public void setTextColor(ColorStateList colorStateList)
		{
			mTabTextColor = colorStateList;
			updateTabStyles();
		}

		private ColorStateList createColorStateList(int color_state_default)
		{
			return new ColorStateList(
				new[]
				{
					new int[]{} //default
				},
				new[]{
					color_state_default //default
				}
			);
		}

		private ColorStateList createColorStateList(int color_state_pressed, int color_state_selected, int color_state_default)
		{
			return new ColorStateList(
				new[]
				{
					new[]{Android.Resource.Attribute.StatePressed}, //pressed
					new[]{Android.Resource.Attribute.StateSelected}, // enabled
					new int[]{} //default
				},
				new[]{
					color_state_pressed,
					color_state_selected,
					color_state_default
				}
			);
		}

		public void setTypeface(Typeface typeface, TypefaceStyle style)
		{
			mTabTextTypeface = typeface;
			mTabTextTypefaceStyle = style;
			updateTabStyles();
		}

		public void setTabBackground(int resId)
		{
			mTabBackgroundResId = resId;
		}

		public void setTabPaddingLeftRight(int paddingPx)
		{
			mTabPadding = paddingPx;
			updateTabStyles();
		}

		public interface CustomTabProvider
		{
			View getCustomTabView(ViewGroup parent, int position);

			void tabSelected(View tab);

			void tabUnselected(View tab);
		}

		public interface OnTabReselectedListener
		{
			void onTabReselected(int position);
		}

		private class PagerAdapterObserver : DataSetObserver
		{
			private readonly PagerSlidingTabStrip pagerSlidingTabStrip;
			public PagerAdapterObserver(PagerSlidingTabStrip pagerSlidingTabStrip)
			{
				this.pagerSlidingTabStrip = pagerSlidingTabStrip;
			}

			private bool attached;


			public override void OnChanged()
			{
				pagerSlidingTabStrip.notifyDataSetChanged();
			}

			public void setAttached(bool isAttached)
			{
				attached = isAttached;
			}

			public bool isAttached()
			{
				return attached;
			}
		}
	}
}
