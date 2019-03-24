using Android.Graphics;
using Android.Support.V7.Widget;
using Android.Support.V7.Widget.Helper;
using Alloy.Interfaces;
using Math = System.Math;

namespace Alloy.Helpers
{
	class SimpleItemTouchHelperCallback : ItemTouchHelper.Callback
	{
		public static float ALPHA_FULL = 1.0f;

		private ItemTouchHelperAdapter mAdapter;

		public SimpleItemTouchHelperCallback(ItemTouchHelperAdapter adapter)
		{
			mAdapter = adapter;
		}

		public override float GetMoveThreshold(RecyclerView.ViewHolder viewHolder)
		{
			return 0.1f;
		}

		public override float GetSwipeThreshold(RecyclerView.ViewHolder viewHolder)
		{
			return 0.7f;
		}

		public override float GetSwipeVelocityThreshold(float defaultValue)
		{
			return 0.1f;
		}

		public override bool IsItemViewSwipeEnabled => true;
		public override bool IsLongPressDragEnabled => true;

		public override int GetMovementFlags(RecyclerView recyclerView, RecyclerView.ViewHolder viewHolder)
		{
			// Set movement flags based on the layout manager
			if (recyclerView.GetLayoutManager() is GridLayoutManager)
			{
				int dragFlags = ItemTouchHelper.Up | ItemTouchHelper.Down | ItemTouchHelper.Left | ItemTouchHelper.Right;
				int swipeFlags = 0;
				return MakeMovementFlags(dragFlags, swipeFlags);
			}
			else
			{
				int dragFlags = ItemTouchHelper.Up | ItemTouchHelper.Down;
				int swipeFlags = ItemTouchHelper.Start | ItemTouchHelper.End;
				return MakeMovementFlags(dragFlags, swipeFlags);
			}
		}


		public override bool OnMove(RecyclerView recyclerView, RecyclerView.ViewHolder source, RecyclerView.ViewHolder target)
		{
			if (source.ItemViewType != target.ItemViewType)
			{
				return false;
			}

			// Notify the adapter of the move
			mAdapter.OnItemMove(source.AdapterPosition, target.AdapterPosition);
			return true;
		}


		public override void OnSwiped(RecyclerView.ViewHolder viewHolder, int i)
		{
			// Notify the adapter of the dismissal
			mAdapter.OnItemDismiss(viewHolder.AdapterPosition);
		}


		public override void OnChildDraw(Canvas c, RecyclerView recyclerView, RecyclerView.ViewHolder viewHolder, float dX, float dY, int actionState, bool isCurrentlyActive)
		{
			if (actionState == ItemTouchHelper.ActionStateSwipe)
			{
				// Fade out the view as it is swiped out of the parent's bounds
				float alpha = ALPHA_FULL - Math.Abs(dX) / (float)viewHolder.ItemView.Width;
				viewHolder.ItemView.Alpha = alpha;
				viewHolder.ItemView.TranslationX = dX;
			}
			else
			{
				base.OnChildDraw(c, recyclerView, viewHolder, dX, dY, actionState, isCurrentlyActive);
			}
		}


		public override void OnSelectedChanged(RecyclerView.ViewHolder viewHolder, int actionState)
		{
			// We only want the active item to change
			if (actionState != ItemTouchHelper.ActionStateIdle)
			{
				if (viewHolder is ItemTouchHelperViewHolder)
				{
					// Let the view holder know that this item is being moved or dragged
					ItemTouchHelperViewHolder itemViewHolder = (ItemTouchHelperViewHolder)viewHolder;
					itemViewHolder.OnItemSelected();
				}
			}

			base.OnSelectedChanged(viewHolder, actionState);
		}


		public override void ClearView(RecyclerView recyclerView, RecyclerView.ViewHolder viewHolder)
		{
			base.ClearView(recyclerView, viewHolder);

			viewHolder.ItemView.Alpha = ALPHA_FULL;

			if (viewHolder is ItemTouchHelperViewHolder)
			{
				// Tell the view holder it's time to restore the idle state
				ItemTouchHelperViewHolder itemViewHolder = (ItemTouchHelperViewHolder)viewHolder;
				itemViewHolder.OnItemClear();
			}
		}
	}
}