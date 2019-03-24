namespace Alloy.Interfaces
{
	interface ItemTouchHelperAdapter
	{
		bool OnItemMove(int fromPosition, int toPosition);
		void OnItemDismiss(int position);
	}
}