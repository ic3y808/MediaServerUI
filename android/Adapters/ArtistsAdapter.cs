using System;
using System.Collections.Generic;
using Alloy.Helpers;
using Alloy.Interfaces;
using Android.App;
using Android.Graphics;
using Android.Views;
using Android.Widget;
using Alloy.Models;
using Alloy.Providers;
using Alloy.Services;
using Android.Support.V7.Widget;
using Android.Views.Animations;

namespace Alloy.Adapters
{
	public class ArtistsAdapter : RecyclerView.Adapter, ItemTouchHelperAdapter
	{
		public event EventHandler<CustomViewHolderEvent> ItemClick;
		public OnStartDragListener DragStartListener;
		private LayoutInflater layoutInflater;
		public BackgroundAudioServiceConnection serviceConnection;
		private int lastPosition = -1;
		

		public ArtistsAdapter(BackgroundAudioServiceConnection connection)
		{
			layoutInflater = LayoutInflater.From(Application.Context);
			serviceConnection = connection;
		}

		public override long GetItemId(int position)
		{
			return position;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			setAnimation(holder.ItemView, position);

			var h = (CustomViewHolder)holder;

			if (MusicProvider.Artists.Count == 0 || position >= MusicProvider.Artists.Count) return;
			h.title.SetText(MusicProvider.Artists[position].Name, TextView.BufferType.Normal);
			h.artist.SetText(MusicProvider.Artists[position].Name, TextView.BufferType.Normal);
			if (string.IsNullOrEmpty(MusicProvider.Artists[position].Biography))
				h.comment.Visibility = ViewStates.Gone;
			else
				h.comment.SetText(MusicProvider.Artists[position].Biography, TextView.BufferType.Normal);

			//h.reposts.SetText(MusicProvider.Artists[position].RepostsCount.ToString(), TextView.BufferType.Normal);
			//h.likes.SetText(MusicProvider.Artists[position].FavoritingsCount.ToString(), TextView.BufferType.Normal);
			//h.duration.SetText(MusicProvider.Artists[position].Duration.ToTime(), TextView.BufferType.Normal);
			h.Artist = MusicProvider.Artists[position];

			h.SetFavorite();
			h.SetSelected();
			//h.moveHandle.Visibility = ViewStates.Gone;
			if (h.Artist.Art == null)
			{
				h.imageView.SetImageResource(Resource.Drawable.wave);
			}
			else
			{
				h.imageView.SetImageBitmap(h.Artist.Art);
			}


		}

		private void setAnimation(View viewToAnimate, int position)
		{
			if (position > lastPosition)
			{
				Animation animation = AnimationUtils.LoadAnimation(viewToAnimate.Context, Android.Resource.Animation.FadeIn);
				viewToAnimate.StartAnimation(animation);
				lastPosition = position;
			}
		}

		//public override View GetView(int position, View convertView, ViewGroup parent)
		//{
		//	if (MusicProvider.Artists == null || MusicProvider.Artists.Count == 0) return convertView;

		//	if (convertView == null) // otherwise create a new one
		//	{
		//		convertView = layoutInflater.Inflate(Resource.Layout.general_list_row, null);
		//	}
		//	convertView.FindViewById<TextView>(Resource.Id.title).Text = MusicProvider.Artists[position].Name;
		//	convertView.FindViewById<TextView>(Resource.Id.artist).Visibility = ViewStates.Gone;
		//	convertView.FindViewById<TextView>(Resource.Id.right_side_count).Text = MusicProvider.Artists[position].TrackCount.ToString();
		//	//convertView.FindViewById<ImageView>(Resource.Id.album_art).SetImageBitmap(MusicProvider.Artists[position].Art);

		//	if (MusicProvider.Artists[position].IsSelected)
		//	{
		//		convertView.FindViewById<RelativeLayout>(Resource.Id.main_layout).SetBackgroundResource(Resource.Color.menu_selection_color);
		//	}
		//	else convertView.FindViewById<RelativeLayout>(Resource.Id.main_layout).SetBackgroundColor(Color.Transparent);

		//	return convertView;
		//}


		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			View v = LayoutInflater.From(parent.Context).Inflate(Resource.Layout.song_card, parent, false);
			var holder = new CustomViewHolder(v, OnClick, false);
			return holder;
		}

		public override int ItemCount => MusicProvider.Artists.Count;

		void OnClick(CustomViewHolderEvent e)
		{
			if (ItemClick != null)
			{
				ItemClick(this, e);
			}
		}

		public bool OnItemMove(int fromPosition, int toPosition)
		{
			MusicProvider.Artists.Move(fromPosition, toPosition);
			NotifyItemMoved(fromPosition, toPosition);
			return true;
		}

		public void OnItemDismiss(int position)
		{
			if (MusicProvider.Artists[position].IsSelected)
			{
				serviceConnection.PlayNextSong();
				MusicProvider.Artists.RemoveAt(position);
			}
			else MusicProvider.Artists.RemoveAt(position);

			NotifyItemRemoved(position);
		}
	}
}