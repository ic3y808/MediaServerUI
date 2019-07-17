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
	public class ChartsAdapter : RecyclerView.Adapter
	{
		public Activity Activity { get; set; }
		private readonly BackgroundAudioServiceConnection ServiceConnection;

		public ChartsAdapter(Activity activity, BackgroundAudioServiceConnection serviceConnection)
		{
			Activity = activity;
			ServiceConnection = serviceConnection;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			switch (position)
			{
				case 0:
					ChartsNeverPlayedAlbumsViewHolder chartsNeverPlayedAlbumsViewHolder = holder as ChartsNeverPlayedAlbumsViewHolder;
					if (MusicProvider.Charts != null && MusicProvider.Charts.NeverPlayedAlbums != null && MusicProvider.Charts.NeverPlayedAlbums.Count > 0 && chartsNeverPlayedAlbumsViewHolder != null)
					{
						chartsNeverPlayedAlbumsViewHolder.ChartsNeverPlayedAlbumsListContainer.Visibility = ViewStates.Visible;
						ChartsAlbumAdapter chartsNeverPlayedAlbumsAdapter = new ChartsAlbumAdapter(MusicProvider.Charts.NeverPlayedAlbums, ServiceConnection);
						BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { chartsNeverPlayedAlbumsAdapter.NotifyDataSetChanged(); };
						chartsNeverPlayedAlbumsViewHolder.ChartsNeverPlayedAlbumsRecycleView?.SetAdapter(chartsNeverPlayedAlbumsAdapter);
						chartsNeverPlayedAlbumsAdapter.ItemClick += AlbumClick;
						Adapters.SetAdapters(Activity, chartsNeverPlayedAlbumsAdapter);
					}

					break;
				case 1:
					ChartsTopTracksViewHolder chartsTopTracksViewHolder = holder as ChartsTopTracksViewHolder;
					if (MusicProvider.Charts != null && MusicProvider.Charts.TopTracks != null && MusicProvider.Charts.TopTracks.Count > 0 && chartsTopTracksViewHolder != null)
					{
						chartsTopTracksViewHolder.ChartsTopTracksListContainer.Visibility = ViewStates.Visible;
						ChartsTrackAdapter chartsTopTracksAdapter = new ChartsTrackAdapter(MusicProvider.Charts.TopTracks, ServiceConnection);
						BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { chartsTopTracksAdapter.NotifyDataSetChanged(); };
						chartsTopTracksViewHolder.ChartsTopTracksRecycleView?.SetAdapter(chartsTopTracksAdapter);
						chartsTopTracksAdapter.ItemClick += TrackClick;
						Adapters.SetAdapters(Activity, chartsTopTracksAdapter);
					}

					break;
				case 2:
					ChartsNeverPlayedTracksViewHolder chartsNeverPlayedTracksViewHolder = holder as ChartsNeverPlayedTracksViewHolder;
					if (MusicProvider.Charts != null && MusicProvider.Charts.NeverPlayed != null && MusicProvider.Charts.NeverPlayed.Count > 0 && chartsNeverPlayedTracksViewHolder != null)
					{
						chartsNeverPlayedTracksViewHolder.ChartsNeverPlayedTracksListContainer.Visibility = ViewStates.Visible;
						ChartsTrackAdapter chartsNeverPlayedTracksAdapter = new ChartsTrackAdapter(MusicProvider.Charts.TopTracks, ServiceConnection);
						BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { chartsNeverPlayedTracksAdapter.NotifyDataSetChanged(); };
						chartsNeverPlayedTracksViewHolder.ChartsNeverPlayedTracksRecycleView?.SetAdapter(chartsNeverPlayedTracksAdapter);
						chartsNeverPlayedTracksAdapter.ItemClick += TrackClick;
						Adapters.SetAdapters(Activity, chartsNeverPlayedTracksAdapter);
					}

					break;
			
			}
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
			switch (viewType)
			{
				case 0:
					return new ChartsNeverPlayedAlbumsViewHolder(LayoutInflater.From(parent.Context).Inflate(Resource.Layout.charts_never_played_albums, parent, false));
				case 1:
					return new ChartsTopTracksViewHolder(LayoutInflater.From(parent.Context).Inflate(Resource.Layout.charts_top_tracks, parent, false));
			case 2:
					return new ChartsNeverPlayedTracksViewHolder(LayoutInflater.From(parent.Context).Inflate(Resource.Layout.charts_never_played_tracks, parent, false));
	

			}
			return null;
		}

		public override int ItemCount
		{
			get { return 3; }
		}

		public event EventHandler<TrackViewHolderEvent> TrackClick;
		public event EventHandler<ChartsArtistAdapter.ViewHolder.ViewHolderEvent> ArtistClick;
		public event EventHandler<ChartsAlbumAdapter.ViewHolder.ViewHolderEvent> AlbumClick;

		public class ChartsNeverPlayedAlbumsViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout ChartsNeverPlayedAlbumsListContainer { get; set; }
			public RecyclerView ChartsNeverPlayedAlbumsRecycleView { get; set; }
			public ChartsNeverPlayedAlbumsViewHolder(View itemView) : base(itemView)
			{
				ChartsNeverPlayedAlbumsListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.charts_never_played_albums_list_container);
				ChartsNeverPlayedAlbumsListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Horizontal, false);
				ChartsNeverPlayedAlbumsRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.charts_never_played_albums_list);
				ChartsNeverPlayedAlbumsRecycleView.SetLayoutManager(layoutManager);
			}
		}
		public class ChartsTopTracksViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout ChartsTopTracksListContainer { get; set; }
			public RecyclerView ChartsTopTracksRecycleView { get; set; }
			public ChartsTopTracksViewHolder(View itemView) : base(itemView)
			{
				ChartsTopTracksListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.charts_top_tracks_list_container);
				ChartsTopTracksListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Vertical, false);
				ChartsTopTracksRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.charts_top_tracks_list);
				ChartsTopTracksRecycleView.SetLayoutManager(layoutManager);
			}
		}

		public class ChartsNeverPlayedTracksViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout ChartsNeverPlayedTracksListContainer { get; set; }
			public RecyclerView ChartsNeverPlayedTracksRecycleView { get; set; }
			public ChartsNeverPlayedTracksViewHolder(View itemView) : base(itemView)
			{
				ChartsNeverPlayedTracksListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.charts_never_played_tracks_list_container);
				ChartsNeverPlayedTracksListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Vertical, false);
				ChartsNeverPlayedTracksRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.charts_never_played_tracks_list);
				ChartsNeverPlayedTracksRecycleView.SetLayoutManager(layoutManager);
			}
		}

		
	}

	public class ChartsArtistAdapter : RecyclerView.Adapter
	{
		public List<Artist> Artists { get; set; }

		public BackgroundAudioServiceConnection ServiceConnection { get; }

		public ChartsArtistAdapter(List<Artist> artists, BackgroundAudioServiceConnection serviceConnection)
		{
			Artists = artists;
			ServiceConnection = serviceConnection;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			ViewHolder h = (ViewHolder)holder;

			h.Artist = Artists[position];
			Artists[position].GetAlbumArt(h.Image);
			h.Name.Text = Artists[position].Name;
			h.SetSelected();
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			View view = LayoutInflater.From(parent.Context).Inflate(Resource.Layout.fresh_artist_item, parent, false);
			return new ViewHolder(view, OnClick, ServiceConnection);
		}

		public override int ItemCount => Artists.Count;

		void OnClick(ViewHolder.ViewHolderEvent e)
		{
			ItemClick?.Invoke(this, e);
		}

		public event EventHandler<ViewHolder.ViewHolderEvent> ItemClick;

		public class ViewHolder : RecyclerView.ViewHolder
		{
			public RelativeLayout ItemRoot { get; set; }
			public ImageView Image { get; set; }
			public TextView Name { get; set; }
			public Artist Artist { get; set; }
			public BackgroundAudioServiceConnection ServiceConnection { get; }

			public ViewHolder(View itemView, Action<ViewHolderEvent> listener, BackgroundAudioServiceConnection serviceConnection) : base(itemView)
			{
				ItemRoot = itemView.FindViewById<RelativeLayout>(Resource.Id.item_root);
				Image = itemView.FindViewById<ImageView>(Resource.Id.image_view);
				Name = itemView.FindViewById<TextView>(Resource.Id.name);
				ServiceConnection = serviceConnection;
				itemView.Click += (sender, e) => listener(new ViewHolderEvent { Position = LayoutPosition, Artist = Artist });
				BackgroundAudioServiceConnection.PlaybackStatusChanged += (o, e) => { SetSelected(); };
			}

			public void SetSelected()
			{
				if (Artist == null) return;

				bool selected = Artist.IsSelected || ServiceConnection?.CurrentSong != null && ServiceConnection.CurrentSong.ArtistId.Equals(Artist.Id);

				if (selected)
				{
					ItemRoot.SetBackgroundResource(Resource.Color.menu_selection_color);
				}
				else
				{
					ItemRoot.SetBackgroundColor(Color.Transparent);
				}
			}

			public class ViewHolderEvent
			{
				public int Position { get; set; }
				public Artist Artist { get; set; }
			}
		}
	}

	public class ChartsAlbumAdapter : RecyclerView.Adapter
	{
		public List<Album> Albums { get; set; }
		public BackgroundAudioServiceConnection ServiceConnection { get; }

		public ChartsAlbumAdapter(List<Album> albums, BackgroundAudioServiceConnection serviceConnection)
		{
			Albums = albums;
			ServiceConnection = serviceConnection;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			ViewHolder h = (ViewHolder)holder;
			h.Album = Albums[position];
			Albums[position].GetAlbumArt(h.Image);
			h.Name.Text = Albums[position].Name;
			h.SetSelected();
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			View view = LayoutInflater.From(parent.Context).Inflate(Resource.Layout.fresh_album_item, parent, false);
			return new ViewHolder(view, OnClick, ServiceConnection);
		}

		public override int ItemCount => Albums.Count;

		void OnClick(ViewHolder.ViewHolderEvent e)
		{
			ItemClick?.Invoke(this, e);
		}
		public event EventHandler<ViewHolder.ViewHolderEvent> ItemClick;

		public class ViewHolder : RecyclerView.ViewHolder
		{
			public RelativeLayout ItemRoot { get; set; }
			public ImageView Image { get; set; }
			public TextView Name { get; set; }
			public Album Album { get; set; }
			public BackgroundAudioServiceConnection ServiceConnection { get; }

			public ViewHolder(View itemView, Action<ViewHolderEvent> listener, BackgroundAudioServiceConnection serviceConnection) : base(itemView)
			{
				ItemRoot = itemView.FindViewById<RelativeLayout>(Resource.Id.item_root);
				Image = itemView.FindViewById<ImageView>(Resource.Id.image_view);
				Name = itemView.FindViewById<TextView>(Resource.Id.name);
				ServiceConnection = serviceConnection;
				itemView.Click += (sender, e) => listener(new ViewHolderEvent { Position = LayoutPosition, Album = Album });
				BackgroundAudioServiceConnection.PlaybackStatusChanged += (o, e) => { SetSelected(); };
			}

			public void SetSelected()
			{
				if (Album == null) return;

				bool selected = Album.IsSelected || ServiceConnection?.CurrentSong != null && ServiceConnection.CurrentSong.AlbumId.Equals(Album.Id);

				if (Album.Tracks != null && Album.Tracks.Count != 0)
				{
					foreach (Song albumTrack in Album.Tracks)
					{
						if (albumTrack.IsSelected || ServiceConnection?.CurrentSong != null && ServiceConnection.CurrentSong.Id.Equals(albumTrack.Id)) selected = true;
					}
				}

				if (selected)
				{
					ItemRoot.SetBackgroundResource(Resource.Color.menu_selection_color);
				}
				else
				{
					ItemRoot.SetBackgroundColor(Color.Transparent);
				}
			}

			public class ViewHolderEvent
			{
				public int Position { get; set; }
				public Album Album { get; set; }
			}
		}
	}

	public class ChartsTrackAdapter : RecyclerView.Adapter
	{
		public Queue Songs { get; set; }
		public BackgroundAudioServiceConnection ServiceConnection { get; }

		public ChartsTrackAdapter(Queue songs, BackgroundAudioServiceConnection serviceConnection)
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
			View view = LayoutInflater.From(parent.Context).Inflate(Resource.Layout.fresh_song_item, parent, false);
			return new ViewHolder(view, OnClick, ServiceConnection);
		}

		public override int ItemCount => Songs.Count;

		void OnClick(TrackViewHolderEvent e)
		{
			ItemClick?.Invoke(this, e);
		}

		public event EventHandler<TrackViewHolderEvent> ItemClick;

		public class ViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout ItemRoot { get; set; }
			public ImageView Image { get; set; }
			public TextView Title { get; set; }
			public TextView Artist { get; set; }
			public TextView Album { get; set; }
			public Queue Songs { get; set; }
			public BackgroundAudioServiceConnection ServiceConnection { get; }

			public ViewHolder(View itemView, Action<TrackViewHolderEvent> listener, BackgroundAudioServiceConnection serviceConnection) : base(itemView)
			{
				ItemRoot = itemView.FindViewById<LinearLayout>(Resource.Id.item_root);
				Image = itemView.FindViewById<ImageView>(Resource.Id.image_view);
				Title = itemView.FindViewById<TextView>(Resource.Id.title);
				Artist = itemView.FindViewById<TextView>(Resource.Id.artist);
				Album = itemView.FindViewById<TextView>(Resource.Id.album);
				ServiceConnection = serviceConnection;
				itemView.Click += (sender, e) => listener(new TrackViewHolderEvent { Position = LayoutPosition, Songs = Songs });
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

	public class ChartTrackViewHolderEvent
	{
		public int Position { get; set; }
		public Queue Songs { get; set; }
	}
}