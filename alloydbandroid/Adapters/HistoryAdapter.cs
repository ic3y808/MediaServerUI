using System;
using System.Collections.Generic;
using Alloy.Helpers;
using Alloy.Interfaces;
using Android.Views;
using Android.Widget;
using Alloy.Models;
using Alloy.Providers;

using Alloy.Services;
using Android.App;
using Android.Content;
using Android.Graphics;
using Android.Support.V7.Widget;

namespace Alloy.Adapters
{
	public class HistoryAdapter : RecyclerView.Adapter
	{
		public Activity Activity { get; set; }
		private readonly BackgroundAudioServiceConnection ServiceConnection;

		public HistoryAdapter(Activity activity, BackgroundAudioServiceConnection serviceConnection)
		{
			Activity = activity;
			ServiceConnection = serviceConnection;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{

			HistoryTracksViewHolder historyTracksViewHolder = holder as HistoryTracksViewHolder;
			if (MusicProvider.History == null || MusicProvider.History.Count <= 0 || historyTracksViewHolder == null) return;
			historyTracksViewHolder.HistoryTracksListContainer.Visibility = ViewStates.Visible;
			HistoryTrackAdapter historyTopTracksAdapter = new HistoryTrackAdapter(MusicProvider.Charts.TopTracks, ServiceConnection);
			BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { historyTopTracksAdapter.NotifyDataSetChanged(); };
			historyTracksViewHolder.HistoryTracksRecycleView?.SetAdapter(historyTopTracksAdapter);
			historyTopTracksAdapter.ItemClick += TrackClick;
			Adapters.SetAdapters(Activity, historyTopTracksAdapter);
		}

		public override int GetItemViewType(int position)
		{
			return position;
		}

		public override long GetItemId(int position)
		{
			return position;
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			return new HistoryTracksViewHolder(LayoutInflater.From(parent.Context).Inflate(Resource.Layout.history_tracks, parent, false));
		}

		public override int ItemCount
		{
			get { return 1; }
		}

		public event EventHandler<HistoryTrackViewHolderEvent> TrackClick;

		public class HistoryTracksViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout HistoryTracksListContainer { get; set; }
			public RecyclerView HistoryTracksRecycleView { get; set; }
			public HistoryTracksViewHolder(View itemView) : base(itemView)
			{
				HistoryTracksListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.history_tracks_list_container);
				HistoryTracksListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Vertical, false);
				HistoryTracksRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.history_tracks_list);
				HistoryTracksRecycleView.SetLayoutManager(layoutManager);
			}
		}
	}

	
	public class HistoryTrackAdapter : RecyclerView.Adapter
	{
		public Queue Songs { get; set; }
		public BackgroundAudioServiceConnection ServiceConnection { get; }

		public HistoryTrackAdapter(Queue songs, BackgroundAudioServiceConnection serviceConnection)
		{
			Songs = songs;
			ServiceConnection = serviceConnection;
		}

		public override long GetItemId(int position)
		{
			return position;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			ViewHolder h = (ViewHolder)holder;
			h.Songs = Songs;
			Songs[position].GetAlbumArt(h.Image);
			h.Title.Text = Songs[position].Title;
			h.Artist.Text = Songs[position].Artist;
			h.Album.Text = Songs[position].Album;
			if (Songs[position].IsSelected)
			{
				h.ItemView.FindViewById<LinearLayout>(Resource.Id.item_root).SetBackgroundResource(Resource.Color.menu_selection_color);
			}
			else h.ItemView.FindViewById<LinearLayout>(Resource.Id.item_root).SetBackgroundColor(Color.Transparent);
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			View view = LayoutInflater.From(parent.Context).Inflate(Resource.Layout.history_song_item, parent, false);
			return new ViewHolder(view, OnClick, ServiceConnection);
		}

		public override int ItemCount => Songs.Count;

		void OnClick(HistoryTrackViewHolderEvent e)
		{
			ItemClick?.Invoke(this, e);
		}

		public event EventHandler<HistoryTrackViewHolderEvent> ItemClick;

		public class ViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout ItemRoot { get; set; }
			public ImageView Image { get; set; }
			public TextView Title { get; set; }
			public TextView Artist { get; set; }
			public TextView Album { get; set; }
			public Queue Songs { get; set; }
			public BackgroundAudioServiceConnection ServiceConnection { get; }

			public ViewHolder(View itemView, Action<HistoryTrackViewHolderEvent> listener, BackgroundAudioServiceConnection serviceConnection) : base(itemView)
			{
				ItemRoot = itemView.FindViewById<LinearLayout>(Resource.Id.item_root);
				Image = itemView.FindViewById<ImageView>(Resource.Id.image_view);
				Title = itemView.FindViewById<TextView>(Resource.Id.title);
				Artist = itemView.FindViewById<TextView>(Resource.Id.artist);
				Album = itemView.FindViewById<TextView>(Resource.Id.album);
				ServiceConnection = serviceConnection;
				itemView.Click += (sender, e) => listener(new HistoryTrackViewHolderEvent { Position = LayoutPosition, Songs = Songs });
				BackgroundAudioServiceConnection.PlaybackStatusChanged += (o, e) => { SetSelected(LayoutPosition); };
			}

			public void SetSelected(int position)
			{
				if (Songs == null || Songs.Count == 0 || position < 0 || position >= Songs.Count) return;

				bool selected = Songs[position].IsSelected || ServiceConnection != null && ServiceConnection.CurrentSong != null && ServiceConnection.CurrentSong.Id.Equals(Songs[position].Id);

				if (selected)
				{
					ItemRoot.SetBackgroundResource(Resource.Color.menu_selection_color);
				}
				else
				{
					ItemRoot.SetBackgroundColor(Color.Transparent);
				}
			}
		}
	}


	public class HistoryTrackViewHolderEvent
	{
		public int Position { get; set; }
		public Queue Songs { get; set; }
	}
}