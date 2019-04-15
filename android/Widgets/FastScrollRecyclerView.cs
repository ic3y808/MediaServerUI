using System;
using Android.Content;
using Android.Content.Res;
using Android.Graphics;
using Android.Runtime;
using Android.Support.V7.Widget;
using Android.Util;
using Android.Views;
using Java.Lang;
using Alloy.Helpers;
using Alloy.Interfaces;

using Math = System.Math;
using String = System.String;

namespace Alloy.Widgets
{
	[Register("alloy.widgets.FastScrollRecyclerView")]
	public class FastScrollRecyclerView : RecyclerView, RecyclerView.IOnItemTouchListener
	{
		private readonly FastScroller mScrollbar;
		private const string TAG = "FastScrollRecyclerView";
		private bool mFastScrollEnabled;

		/**
		 * The current scroll state of the recycler view.  We use this in onUpdateScrollbar()
		 * and scrollToPositionAtProgress() to determine the scroll position of the recycler view so
		 * that we can calculate what the scroll bar looks like, and where to jump to from the fast
		 * scroller.
		 */
		public class ScrollPositionState
		{
			// The index of the first visible row
			public int RowIndex { get; set; }
			// The offset of the first visible row
			public int RowTopOffset { get; set; }
			// The height of a given row (they are currently all the same height)
			public int RowHeight { get; set; }
		}

		private readonly ScrollPositionState mScrollPosState = new ScrollPositionState();

		private int mDownX;
		private int mDownY;
		private int mLastY;

		private readonly SparseIntArray mScrollOffsets;

		private readonly ScrollOffsetInvalidator mScrollOffsetInvalidator;
		private OnFastScrollStateChangeListener mStateChangeListener;

		public FastScrollRecyclerView(Context context) : this(context, null)
		{
		}

		public FastScrollRecyclerView(Context context, IAttributeSet attrs) : this(context, attrs, 0)
		{

		}

		public FastScrollRecyclerView(Context context, IAttributeSet attrs, int defStyleAttr) : base(context, attrs, defStyleAttr)
		{


			TypedArray typedArray = context.Theme.ObtainStyledAttributes(
					attrs, Resource.Styleable.FastScrollRecyclerView, 0, 0);
			try
			{
				mFastScrollEnabled = typedArray.GetBoolean(Resource.Styleable.FastScrollRecyclerView_fastScrollThumbEnabled, true);
			}
			finally
			{
				typedArray.Recycle();
			}

			mScrollbar = new FastScroller(context, this, attrs);

			mScrollOffsets = new SparseIntArray();
			mScrollOffsetInvalidator = new ScrollOffsetInvalidator(mScrollOffsets);
		}

		public int getScrollBarWidth()
		{
			return mScrollbar.getWidth();
		}

		public int getScrollBarThumbHeight()
		{
			return mScrollbar.getThumbHeight();
		}


		protected override void OnFinishInflate()
		{
			base.OnFinishInflate();
			AddOnItemTouchListener(this);
		}


		public override void SetAdapter(Adapter adapter)
		{
			if (GetAdapter() != null)
			{
				GetAdapter().UnregisterAdapterDataObserver(mScrollOffsetInvalidator);
			}

			if (adapter != null)
			{
				adapter.RegisterAdapterDataObserver(mScrollOffsetInvalidator);
			}

			base.SetAdapter(adapter);
		}

		/**
		 * We intercept the touch handling only to support fast scrolling when initiated from the
		 * scroll bar.  Otherwise, we fall back to the default RecyclerView touch handling.
		 */
		bool IOnItemTouchListener.OnInterceptTouchEvent(RecyclerView rv, MotionEvent e)
		{
			return handleTouchEvent(e);
		}

		void IOnItemTouchListener.OnTouchEvent(RecyclerView rv, MotionEvent e)
		{
			handleTouchEvent(e);
		}

		/**
		 * Handles the touch event and determines whether to show the fast scroller (or updates it if
		 * it is already showing).
		 */
		private bool handleTouchEvent(MotionEvent ev)
		{
			MotionEventActions action = ev.Action;
			int x = (int)ev.GetX();
			int y = (int)ev.GetY();
			switch (action)
			{
				case MotionEventActions.Down:
					// Keep track of the down positions
					mDownX = x;
					mLastY = y;
					mDownY = y;
					mScrollbar.handleTouchEvent(ev, mDownX, mDownY, mLastY, mStateChangeListener);
					break;
				case MotionEventActions.Move:
					mLastY = y;
					mScrollbar.handleTouchEvent(ev, mDownX, mDownY, mLastY, mStateChangeListener);
					break;
				case MotionEventActions.Up:
				case MotionEventActions.Cancel:
					mScrollbar.handleTouchEvent(ev, mDownX, mDownY, mLastY, mStateChangeListener);
					break;
			}
			return mScrollbar.isDragging();
		}

		void IOnItemTouchListener.OnRequestDisallowInterceptTouchEvent(bool disallowIntercept)
		{
			// not being used
		}

		/**
		 * Returns the available scroll height:
		 * AvailableScrollHeight = Total height of the all items - last page height
		 *
		 * @param yOffset the offset from the top of the recycler view to start tracking.
		 */
		protected int getAvailableScrollHeight(int adapterHeight, int yOffset)
		{
			int visibleHeight = Height;
			int scrollHeight = PaddingTop + yOffset + adapterHeight + PaddingBottom;
			int availableScrollHeight = scrollHeight - visibleHeight;
			return availableScrollHeight;
		}

		/**
		 * Returns the available scroll bar height:
		 * AvailableScrollBarHeight = Total height of the visible view - thumb height
		 */
		protected int getAvailableScrollBarHeight()
		{
			int visibleHeight = Height;
			int availableScrollBarHeight = visibleHeight - mScrollbar.getThumbHeight();
			return availableScrollBarHeight;
		}


		public override void Draw(Canvas canvas)
		{
			base.Draw(canvas);
			if (!mFastScrollEnabled) return;
			onUpdateScrollbar();
			mScrollbar.draw(canvas);
		}

		/**
		 * Updates the scrollbar thumb offset to match the visible scroll of the recycler view.  It does
		 * this by mapping the available scroll area of the recycler view to the available space for the
		 * scroll bar.
		 *  @param scrollPosState the current scroll position
		 * @param rowCount       the number of rows, used to calculate the total scroll height (assumes that
		 */
		protected void updateThumbPosition(ScrollPositionState scrollPosState, int rowCount)
		{

			int availableScrollHeight = 0;
			int scrolledPastHeight = 0;
			Adapter adapter = GetAdapter();
			if (adapter != null)
			{
				if (adapter.GetType().IsSubclassOf(typeof(IMeasurableAdapter)))
				{
					availableScrollHeight = getAvailableScrollHeight(calculateAdapterHeight(), 0);
					scrolledPastHeight = calculateScrollDistanceToPosition(scrollPosState.RowIndex);
				}
				else
				{
					availableScrollHeight = getAvailableScrollHeight(rowCount * scrollPosState.RowHeight, 0);
					scrolledPastHeight = scrollPosState.RowIndex * scrollPosState.RowHeight;
				}
			}


			int availableScrollBarHeight = getAvailableScrollBarHeight();

			// Only show the scrollbar if there is height to be scrolled
			if (availableScrollHeight <= 0)
			{
				mScrollbar.setThumbPosition(-1, -1);
				return;
			}

			// Calculate the current scroll position, the scrollY of the recycler view accounts for the
			// view padding, while the scrollBarY is drawn right up to the background padding (ignoring
			// padding)
			int scrollY = PaddingTop + scrolledPastHeight - scrollPosState.RowTopOffset;
			int scrollBarY = (int)(((float)scrollY / availableScrollHeight) * availableScrollBarHeight);

			// Calculate the position and size of the scroll bar
			int scrollBarX;
			if (Utils.isRtl(Resources))
			{
				scrollBarX = 0;
			}
			else
			{
				scrollBarX = Width - mScrollbar.getWidth();
			}
			mScrollbar.setThumbPosition(scrollBarX, scrollBarY);
		}

		/**
		 * Maps the touch (from 0..1) to the adapter position that should be visible.
		 */
		public String scrollToPositionAtProgress(float touchFraction)
		{
			int itemCount = GetAdapter().ItemCount;
			if (itemCount == 0)
			{
				return "";
			}
			int spanCount = 1;
			int rowCount = itemCount;
			LayoutManager manager = GetLayoutManager();
			if (manager is GridLayoutManager)
			{
				spanCount = ((GridLayoutManager)GetLayoutManager()).SpanCount;
				rowCount = (int)Math.Ceiling((double)rowCount / spanCount);
			}

			// Stop the scroller if it is scrolling
			StopScroll();

			getCurScrollState(mScrollPosState);

			float itemPos = 0;
			int scrollPosition = 0;
			int scrollOffset = 0;

			Adapter adapter = GetAdapter();
			if (adapter != null)
			{
				int availableScrollHeight;
				if (adapter.GetType().IsSubclassOf(typeof(IMeasurableAdapter)))
				{
					itemPos = findItemPosition(touchFraction);
					availableScrollHeight = calculateAdapterHeight();
					scrollPosition = (int)itemPos;
					scrollOffset = calculateScrollDistanceToPosition(scrollPosition) - (int)(touchFraction * availableScrollHeight);
				}
				else
				{
					itemPos = findItemPosition(touchFraction);
					availableScrollHeight = getAvailableScrollHeight(rowCount * mScrollPosState.RowHeight, 0);

					//The exact position of our desired item
					int exactItemPos = (int)(availableScrollHeight * touchFraction);

					//The offset used here is kind of hard to explain.
					//If the position we wish to scroll to is, say, position 10.5, we scroll to position 10,
					//and then offset by 0.5 * rowHeight. This is how we achieve smooth scrolling.
					scrollPosition = spanCount * exactItemPos / mScrollPosState.RowHeight;
					scrollOffset = -(exactItemPos % mScrollPosState.RowHeight);
				}
			}

			LinearLayoutManager layoutManager = ((LinearLayoutManager)GetLayoutManager());
			layoutManager.ScrollToPositionWithOffset(scrollPosition, scrollOffset);

			if (!(GetAdapter() is ISectionedAdapter))
			{
				return "";
			}

			int posInt = (int)((Math.Abs(touchFraction - 1) < 0.001) ? itemPos - 1 : itemPos);

			ISectionedAdapter sectionedAdapter = (ISectionedAdapter)GetAdapter();
			return sectionedAdapter.GetSectionName(posInt);
		}



		private float findItemPosition(float touchFraction)
		{
			IMeasurableAdapter measurer = GetAdapter() as IMeasurableAdapter;
			if (GetAdapter().GetType().IsSubclassOf(typeof(IMeasurableAdapter)))
			{
				int viewTop = (int)(touchFraction * calculateAdapterHeight());

				for (int i = 0; i < GetAdapter().ItemCount; i++)
				{
					int top = calculateScrollDistanceToPosition(i);
					int bottom = top + measurer.getViewTypeHeight(this, FindViewHolderForAdapterPosition(i), GetAdapter().GetItemViewType(i));
					if (viewTop >= top && viewTop <= bottom)
					{
						return i;
					}
				}

				// Should never happen
				Log.Warn(TAG, "Failed to find a view at the provided scroll fraction (" + touchFraction + ")");
				return touchFraction * GetAdapter().ItemCount;
			}

			return GetAdapter().ItemCount * touchFraction;
		}

		/**
		 * Updates the bounds for the scrollbar.
		 */
		public void onUpdateScrollbar()
		{

			if (GetAdapter() == null)
			{
				return;
			}

			int rowCount = GetAdapter().ItemCount;
			LayoutManager manager = GetLayoutManager();
			if (manager is GridLayoutManager)
			{
				int spanCount = ((GridLayoutManager)GetLayoutManager()).SpanCount;
				rowCount = (int)Math.Ceiling((double)rowCount / spanCount);
			}
			// Skip early if, there are no items.
			if (rowCount == 0)
			{
				mScrollbar.setThumbPosition(-1, -1);
				return;
			}

			// Skip early if, there no child laid out in the container.
			getCurScrollState(mScrollPosState);
			if (mScrollPosState.RowIndex < 0)
			{
				mScrollbar.setThumbPosition(-1, -1);
				return;
			}

			updateThumbPosition(mScrollPosState, rowCount);
		}

		/**
		 * Returns the current scroll state of the apps rows.
		 */
		private void getCurScrollState(ScrollPositionState stateOut)
		{
			stateOut.RowIndex = -1;
			stateOut.RowTopOffset = -1;
			stateOut.RowHeight = -1;

			int itemCount = GetAdapter().ItemCount;

			// Return early if there are no items, or no children.
			if (itemCount == 0 || ChildCount == 0)
			{
				return;
			}

			View child = GetChildAt(0);

			stateOut.RowIndex = GetChildAdapterPosition(child);
			LayoutManager manager = GetLayoutManager();
			if (manager is GridLayoutManager)
			{
				stateOut.RowIndex = stateOut.RowIndex / ((GridLayoutManager)GetLayoutManager()).SpanCount;
			}
			stateOut.RowTopOffset = GetLayoutManager().GetDecoratedTop(child);
			stateOut.RowHeight = child.Height + GetLayoutManager().GetTopDecorationHeight(child)
					+ GetLayoutManager().GetBottomDecorationHeight(child);
		}

		/**
		 * Calculates the total height of all views above a position in the recycler view. This method
		 * should only be called when the attached adapter implements {@link MeasurableAdapter}.
		 *
		 * @param adapterIndex The index in the adapter to find the total height above the
		 *                     corresponding view
		 * @return The total height of all views above {@code adapterIndex} in pixels
		 */
		private int calculateScrollDistanceToPosition(int adapterIndex)
		{
			if (!(GetAdapter().GetType().IsSubclassOf(typeof(IMeasurableAdapter))))
			{
				throw new IllegalStateException("calculateScrollDistanceToPosition() should only be called where the RecyclerView.Adapter is an instance of MeasurableAdapter");
			}

			if (mScrollOffsets.IndexOfKey(adapterIndex) >= 0)
			{
				return mScrollOffsets.Get(adapterIndex);
			}

			int totalHeight = 0;
			IMeasurableAdapter measurer = (IMeasurableAdapter)GetAdapter();

			// TODO Take grid layouts into account

			for (int i = 0; i < adapterIndex; i++)
			{
				mScrollOffsets.Put(i, totalHeight);
				int viewType = GetAdapter().GetItemViewType(i);
				totalHeight += measurer.getViewTypeHeight(this, FindViewHolderForAdapterPosition(i), viewType);
			}

			mScrollOffsets.Put(adapterIndex, totalHeight);
			return totalHeight;
		}

		/**
		 * Calculates the total height of the recycler view. This method should only be called when the
		 * attached adapter implements {@link MeasurableAdapter}.
		 *
		 * @return The total height of all rows in the RecyclerView
		 */
		private int calculateAdapterHeight()
		{
			if (!(GetAdapter().GetType().IsSubclassOf(typeof(IMeasurableAdapter))))
			{
				throw new IllegalStateException("calculateAdapterHeight() should only be called where the RecyclerView.Adapter is an instance of MeasurableAdapter");
			}
			return calculateScrollDistanceToPosition(GetAdapter().ItemCount);
		}

		public void showScrollbar()
		{
			mScrollbar.show();
		}

		public void setThumbColor(Color color)
		{
			mScrollbar.setThumbColor(color);
		}

		public void setTrackColor(Color color)
		{
			mScrollbar.setTrackColor(color);
		}

		public void setPopupBgColor(Color color)
		{
			mScrollbar.setPopupBgColor(color);
		}

		public void setPopupTextColor(Color color)
		{
			mScrollbar.setPopupTextColor(color);
		}

		public void setPopupTextSize(int textSize)
		{
			mScrollbar.setPopupTextSize(textSize);
		}

		public void setPopUpTypeface(Typeface typeface)
		{
			mScrollbar.setPopupTypeface(typeface);
		}

		public void setAutoHideDelay(int hideDelay)
		{
			mScrollbar.setAutoHideDelay(hideDelay);
		}

		public void setAutoHideEnabled(bool autoHideEnabled)
		{
			mScrollbar.setAutoHideEnabled(autoHideEnabled);
		}

		public void setOnFastScrollStateChangeListener(OnFastScrollStateChangeListener stateChangeListener)
		{
			mStateChangeListener = stateChangeListener;
		}


		public void setStateChangeListener(OnFastScrollStateChangeListener stateChangeListener)
		{
			setOnFastScrollStateChangeListener(stateChangeListener);
		}

		public void setThumbInactiveColor(Color color)
		{
			mScrollbar.setThumbInactiveColor(color);
		}

		public void allowThumbInactiveColor(bool allowInactiveColor)
		{
			mScrollbar.enableThumbInactiveColor(allowInactiveColor);
		}


		public void setThumbInactiveColor(bool allowInactiveColor)
		{
			allowThumbInactiveColor(allowInactiveColor);
		}

		public void setFastScrollEnabled(bool fastScrollEnabled)
		{
			mFastScrollEnabled = fastScrollEnabled;
		}


		public void setThumbEnabled(bool thumbEnabled)
		{
			setFastScrollEnabled(thumbEnabled);
		}

		/**
		 * Set the FastScroll Popup position. This is either {@link FastScroller.FastScrollerPopupPosition#ADJACENT},
		 * meaning the popup moves adjacent to the FastScroll thumb, or {@link FastScroller.FastScrollerPopupPosition#CENTER},
		 * meaning the popup is static and centered within the RecyclerView.
		 */
		public void setPopupPosition(FastScroller.FastScrollerPopupPosition popupPosition)
		{
			mScrollbar.setPopupPosition(popupPosition);
		}

		private class ScrollOffsetInvalidator : AdapterDataObserver
		{
			private readonly SparseIntArray mScrollOffsets;

			public ScrollOffsetInvalidator(SparseIntArray mScrollOffsets)
			{
				this.mScrollOffsets = mScrollOffsets;
			}
			private void invalidateAllScrollOffsets()
			{
				mScrollOffsets.Clear();
			}


			public override void OnChanged()
			{
				invalidateAllScrollOffsets();
			}

			public override void OnItemRangeChanged(int positionStart, int itemCount)
			{
				invalidateAllScrollOffsets();
			}

			public override void OnItemRangeInserted(int positionStart, int itemCount)
			{
				invalidateAllScrollOffsets();
			}

			public override void OnItemRangeRemoved(int positionStart, int itemCount)
			{
				invalidateAllScrollOffsets();
			}
			public override void OnItemRangeMoved(int fromPosition, int toPosition, int itemCount)
			{
				invalidateAllScrollOffsets();
			}
		}

		public interface ISectionedAdapter
		{

			string GetSectionName(int position);
		}

		/**
		 * FastScrollRecyclerView by default assumes that all items in a RecyclerView will have
		 * ItemViews with the same heights so that the total height of all views in the RecyclerView
		 * can be calculated. If your list uses different view heights, then make your adapter implement
		 * this interface.
		 */
		public class VH : ViewHolder
		{
			public VH(IntPtr javaReference, JniHandleOwnership transfer) : base(javaReference, transfer)
			{
			}

			public VH(View itemView) : base(itemView)
			{
			}
		}
		public interface IMeasurableAdapter
		{
			/**
			 * Gets the height of a specific view type, including item decorations
			 * @param recyclerView The recyclerView that this item view will be placed in
			 * @param viewHolder The viewHolder that corresponds to this item view
			 * @param viewType The view type to get the height of
			 * @return The height of a single view for the given view type in pixels
			 */
			int getViewTypeHeight(RecyclerView recyclerView, ViewHolder viewHolder, int viewType);
		}
	}
}