using System;
using System.Linq;
using Android.Support.V7.Widget;
using Android.Views;
using Android.Views.Animations;
using Android.Widget;
using Java.Util;
using Alloy.Helpers;
using Alloy.Interfaces;
using Alloy.Models;
using Alloy.Providers;
using Alloy.Services;
using Alloy.Widgets;
using Object = Java.Lang.Object;

namespace Alloy.Adapters
{
	public class AllMusicAdapter : RecyclerView.Adapter, ItemTouchHelperAdapter, ISectionIndexer, FastScrollRecyclerView.SectionedAdapter/*, FastScrollRecyclerView.IMeasurableAdapter*/
	{
		public event EventHandler<CustomViewHolderEvent> ItemClick;

		public OnStartDragListener DragStartListener;
		private int textViewId;
		private int lastPosition = -1;
		public BackgroundAudioServiceConnection serviceConnection;
		private ArrayList mSectionPositions;

		public AllMusicAdapter(int textViewResourceId, OnStartDragListener dragStartListener, BackgroundAudioServiceConnection connection)
		{
			textViewId = textViewResourceId;
			DragStartListener = dragStartListener;
			serviceConnection = connection;
		}

		public override long GetItemId(int position)
		{
			return position;
		}

		private class OnTouchListener : Java.Lang.Object, View.IOnTouchListener
		{
			private OnStartDragListener DragStartListener;
			private CustomViewHolder holder;
			public OnTouchListener(CustomViewHolder h, OnStartDragListener dragStartListener)
			{
				holder = h;
				DragStartListener = dragStartListener;
			}
			public bool OnTouch(View v, MotionEvent e)
			{
				if (e.ActionMasked == MotionEventActions.Down)
				{
					DragStartListener.OnStartDrag(holder);
				}
				return false;
			}
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			setAnimation(holder.ItemView, position);

			var h = (CustomViewHolder)holder;
			if (position >= MusicProvider.AllSongs.Count) return;
			h.Song = MusicProvider.AllSongs[position];

			h.title.SetText(MusicProvider.AllSongs[position].Title, TextView.BufferType.Normal);
			h.artist.SetText(MusicProvider.AllSongs[position].Artist, TextView.BufferType.Normal);
			//h.duration.SetText(MusicProvider.AllSongs[position].Duration.ToTimeFromSeconds(), TextView.BufferType.Normal);
			//if (string.IsNullOrEmpty(MusicProvider.AllSongs[position].Description))
			//	h.comment.Visibility = ViewStates.Gone;
			//else
			//	h.comment.SetText(MusicProvider.AllSongs[position].Description, TextView.BufferType.Normal);
			//h.likes.Visibility = ViewStates.Gone;
			//h.reposts.Visibility = ViewStates.Gone;

			if (MusicProvider.AllSongs[position].Art == null)
			{
				h.imageView.SetImageResource(Resource.Drawable.wave);
			}
			else
			{
				h.imageView.SetImageBitmap(MusicProvider.AllSongs[position].Art);
			}

			if (serviceConnection != null && serviceConnection.IsConnected && serviceConnection.CurrentSong != null && serviceConnection.CurrentSong.Id.Equals(h.Song.Id)) h.Song.IsSelected = true;
			h.SetFavorite();
			h.SetSelected();
			//h.moveHandle.SetOnTouchListener(new OnTouchListener(h, DragStartListener));
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			View v = LayoutInflater.From(parent.Context).Inflate(textViewId, parent, false);
			var holder = new CustomViewHolder(v, OnClick, true);
			return holder;
		}

		public override int ItemCount => MusicProvider.AllSongs.Count;

		void OnClick(CustomViewHolderEvent e)
		{
			if (ItemClick != null)
			{
				ItemClick(this, e);
			}
		}

		private void setAnimation(View viewToAnimate, int position)
		{
			// If the bound view wasn't previously displayed on screen, it's animated
			if (position > lastPosition)
			{
				Animation animation = AnimationUtils.LoadAnimation(viewToAnimate.Context, Android.Resource.Animation.FadeIn);
				viewToAnimate.StartAnimation(animation);
				lastPosition = position;
			}
		}

		public override void OnViewAttachedToWindow(Java.Lang.Object holder)
		{
			base.OnViewAttachedToWindow(holder);
			var cHolder = (CustomViewHolder)holder;
			cHolder?.SetSelected();
		}

		public override void OnViewDetachedFromWindow(Object holder)
		{
			base.OnViewDetachedFromWindow(holder);
			var cHolder = (CustomViewHolder)holder;
			cHolder?.ClearAnimation();
			cHolder?.SetSelected();
		}

		public bool OnItemMove(int fromPosition, int toPosition)
		{
			MusicProvider.AllSongs.Move(fromPosition, toPosition);
			NotifyItemMoved(fromPosition, toPosition);
			return true;
		}

		public void OnItemDismiss(int position)
		{
			if (MusicProvider.AllSongs[position].IsSelected)
			{
				serviceConnection.PlayNextSong();
				MusicProvider.AllSongs.RemoveAt(position);
			}
			else MusicProvider.AllSongs.RemoveAt(position);

			NotifyItemRemoved(position);

		}

		public int GetPositionForSection(int sectionIndex)
		{
			return (int)mSectionPositions.Get(sectionIndex);
		}

		public int GetSectionForPosition(int position)
		{
			return 0;
		}

		public Object[] GetSections()
		{
			var sections = new ArrayList(26);
			mSectionPositions = new ArrayList(26);
			for (int i = 0, size = MusicProvider.AllSongs.Count; i < size; i++)
			{
				if(i>= MusicProvider.AllSongs.Count) return sections.ToArray();
				string section = MusicProvider.AllSongs[i]?.Artist?.Substring(0, 1)?.ToUpper();
				if (!sections.Contains(section))
				{
					sections.Add(section);
					mSectionPositions.Add(i);
				}
			}
			return sections.ToArray();
		}

		public string getSectionName(int position)
		{
			try {
				var a = MusicProvider.AllSongs[position].Artist;
				var b = a.Substring(0, 1);
				return b.Any(char.IsLower) ? b.ToUpper() : b;
			}
			catch 
			{
				return "";
			}
		}

		//public int getViewTypeHeight(RecyclerView recyclerView, RecyclerView.ViewHolder viewHolder, int viewType)
		//{
		//	if (viewType == Resource.Layout.song_card)
		//	{
		//		return recyclerView.Resources.GetDimensionPixelSize(Resource.Dimension.song_card_height);
		//	}
		//	return 0;
		//}
	}
}