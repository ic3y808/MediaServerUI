using Android.Support.V7.Widget;
using Android.Views;
using Android.Widget;

/**
 * Helper class for determining the current scroll positions for scrollable views. Currently works
 * for ListView, ScrollView and RecyclerView, but the library users can override it to add support
 * for other views.
 */
namespace SlideUpPanelLibrary
{
	/**
	* Returns the current scroll position of the scrollable view. If this method returns zero or
	* less, it means at the scrollable view is in a position such as the panel should handle
	* scrolling. If the method returns anything above zero, then the panel will let the scrollable
	* view handle the scrolling
	*
	* @param scrollableView the scrollable view
	* @param isSlidingUp whether or not the panel is sliding up or down
	* @return the scroll position
	*/
	public class ScrollableViewHelper
	{
		public int getScrollableViewScrollPosition(View scrollableView, bool isSlidingUp)
		{
			if (scrollableView == null) return 0;
			if (scrollableView is ScrollView)
			{
				if (isSlidingUp)
				{
					return scrollableView.ScrollY;
				}
				else
				{
					ScrollView sv = ((ScrollView)scrollableView);
					View child = sv.GetChildAt(0);
					return (child.Bottom - (sv.Height + sv.ScrollY));
				}
			}
			else if (scrollableView is ListView && ((ListView)scrollableView).ChildCount > 0)
			{
				ListView lv = ((ListView)scrollableView);
				if (lv.Adapter == null) return 0;
				if (isSlidingUp)
				{
					View firstChild = lv.GetChildAt(0);
					// Approximate the scroll position based on the top child and the first visible item
					return lv.FirstVisiblePosition * firstChild.Height - firstChild.Top;
				}
				else
				{
					View lastChild = lv.GetChildAt(lv.ChildCount - 1);
					// Approximate the scroll position based on the bottom child and the last visible item
					return (lv.Adapter.Count - lv.LastVisiblePosition - 1) * lastChild.Height + lastChild.Bottom - lv.Bottom;
				}
			}
			else if (scrollableView is RecyclerView && ((RecyclerView)scrollableView).ChildCount > 0)
			{
				RecyclerView rv = ((RecyclerView)scrollableView);
				RecyclerView.LayoutManager lm = rv.GetLayoutManager();
				if (rv.GetAdapter() == null) return 0;
				if (isSlidingUp)
				{
					View firstChild = rv.GetChildAt(0);
					// Approximate the scroll position based on the top child and the first visible item
					return rv.GetChildLayoutPosition(firstChild) * lm.GetDecoratedMeasuredHeight(firstChild) - lm.GetDecoratedTop(firstChild);
				}
				else
				{
					View lastChild = rv.GetChildAt(rv.ChildCount - 1);
					// Approximate the scroll position based on the bottom child and the last visible item
					return (rv.GetAdapter().ItemCount - 1) * lm.GetDecoratedMeasuredHeight(lastChild) + lm.GetDecoratedBottom(lastChild) - rv.Bottom;
				}
			}
			else
			{
				return 0;
			}
		}
	}
}