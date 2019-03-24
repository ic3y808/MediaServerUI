using Android.Support.V7.Widget;
using Android.Views;

namespace Alloy.Helpers
{
	public class PageHelper : LinearSnapHelper
	{

		public override int FindTargetSnapPosition(RecyclerView.LayoutManager layoutManager, int velocityX, int velocityY)
		{

			if (!(layoutManager is RecyclerView.SmoothScroller.IScrollVectorProvider))
			{
				return RecyclerView.NoPosition;
			}

			View currentView = FindSnapView(layoutManager);

			if (currentView == null)
			{
				return RecyclerView.NoPosition;
			}

			int currentPosition = layoutManager.GetPosition(currentView);

			if (currentPosition == RecyclerView.NoPosition)
			{
				return RecyclerView.NoPosition;
			}

			return currentPosition;
		}
	}
}