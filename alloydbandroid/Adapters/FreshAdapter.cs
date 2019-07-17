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
	public class FreshAdapter : RecyclerView.Adapter
	{
		public Activity Activity { get; set; }
		private readonly BackgroundAudioServiceConnection ServiceConnection;

		public FreshAdapter(Activity activity, BackgroundAudioServiceConnection serviceConnection)
		{
			Activity = activity;
			ServiceConnection = serviceConnection;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			switch (position)
			{
				case 0:
					FreshNewArtistsViewHolder freshNewArtistsHolder = holder as FreshNewArtistsViewHolder;
					if (MusicProvider.Fresh != null && MusicProvider.Fresh.Artists != null && MusicProvider.Fresh.Artists.Count > 0 && freshNewArtistsHolder != null)
					{
						freshNewArtistsHolder.FreshNewArtistsListContainer.Visibility = ViewStates.Visible;
						FreshArtistAdapter freshNewArtistsAdapter = new FreshArtistAdapter(MusicProvider.Fresh.Artists, ServiceConnection);
						BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { freshNewArtistsAdapter.NotifyDataSetChanged(); };
						freshNewArtistsHolder.FreshNewArtistsRecycleView?.SetAdapter(freshNewArtistsAdapter);
						freshNewArtistsAdapter.ItemClick += ArtistClick;
						Adapters.SetAdapters(Activity, freshNewArtistsAdapter);
					}

					break;
				case 1:
					FreshNewTracksViewHolder freshNewTracksHolder = holder as FreshNewTracksViewHolder;
					if (MusicProvider.Fresh != null && MusicProvider.Fresh.Tracks != null && MusicProvider.Fresh.Tracks.Count > 0 && freshNewTracksHolder != null)
					{
						freshNewTracksHolder.FreshNewTracksListContainer.Visibility = ViewStates.Visible;
						FreshTrackAdapter freshNewTracksAdapter = new FreshTrackAdapter(MusicProvider.Fresh.Tracks, ServiceConnection);
						BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { freshNewTracksAdapter.NotifyDataSetChanged(); };
						freshNewTracksHolder.FreshNewTracksRecycleView?.SetAdapter(freshNewTracksAdapter);
						freshNewTracksAdapter.ItemClick += TrackClick;
						Adapters.SetAdapters(Activity, freshNewTracksAdapter);
					}

					break;
				case 2:
					FreshNeverPlayedTracksViewHolder freshNeverPlayedTracksViewHolder = holder as FreshNeverPlayedTracksViewHolder;
					if (MusicProvider.Charts != null && MusicProvider.Charts.NeverPlayed != null && MusicProvider.Charts.NeverPlayed.Count > 0 && freshNeverPlayedTracksViewHolder != null)
					{
						freshNeverPlayedTracksViewHolder.FreshNeverPlayedTracksListContainer.Visibility = ViewStates.Visible;
						FreshTrackAdapter freshNeverPlayedTracksAdapter = new FreshTrackAdapter(MusicProvider.Charts.NeverPlayed, ServiceConnection);
						BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { freshNeverPlayedTracksAdapter.NotifyDataSetChanged(); };
						freshNeverPlayedTracksViewHolder.FreshNeverPlayedTracksRecycleView?.SetAdapter(freshNeverPlayedTracksAdapter);
						freshNeverPlayedTracksAdapter.ItemClick += TrackClick;
						Adapters.SetAdapters(Activity, freshNeverPlayedTracksAdapter);
					}

					break;


				case 3:
					FreshNewAlbumsViewHolder freshNewAlbumsViewHolder = holder as FreshNewAlbumsViewHolder;
					if (MusicProvider.Fresh != null && MusicProvider.Fresh.Albums != null && MusicProvider.Fresh.Albums.Count > 0 && freshNewAlbumsViewHolder != null)
					{
						freshNewAlbumsViewHolder.FreshNewAlbumsListContainer.Visibility = ViewStates.Visible;
						FreshAlbumAdapter freshNewArtistsAdapter = new FreshAlbumAdapter(MusicProvider.Fresh.Albums, ServiceConnection);
						BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { freshNewArtistsAdapter.NotifyDataSetChanged(); };
						freshNewAlbumsViewHolder.FreshNewAlbumRecycleView?.SetAdapter(freshNewArtistsAdapter);
						freshNewArtistsAdapter.ItemClick += AlbumClick;
						Adapters.SetAdapters(Activity, freshNewArtistsAdapter);
					}

					break;
				case 4:
					FreshNeverPlayedAlbumsViewHolder freshNeverPlayedAlbumsViewHolder = holder as FreshNeverPlayedAlbumsViewHolder;
					if (MusicProvider.Charts != null && MusicProvider.Charts.NeverPlayedAlbums != null && MusicProvider.Charts.NeverPlayedAlbums.Count > 0 && freshNeverPlayedAlbumsViewHolder != null)
					{
						freshNeverPlayedAlbumsViewHolder.FresNeverPlayedAlbumsListContainer.Visibility = ViewStates.Visible;
						FreshAlbumAdapter freshNeverPlayedAlbumsAdapter = new FreshAlbumAdapter(MusicProvider.Charts.NeverPlayedAlbums, ServiceConnection);
						BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { freshNeverPlayedAlbumsAdapter.NotifyDataSetChanged(); };
						freshNeverPlayedAlbumsViewHolder.FreshNeverPlayedAlbumRecycleView?.SetAdapter(freshNeverPlayedAlbumsAdapter);
						freshNeverPlayedAlbumsAdapter.ItemClick += AlbumClick;
						Adapters.SetAdapters(Activity, freshNeverPlayedAlbumsAdapter);
					}

					break;

				case 5:
					FreshTopPlayedTracksViewHolder freshTopPlayedTracksViewHolder = holder as FreshTopPlayedTracksViewHolder;
					if (MusicProvider.Charts != null && MusicProvider.Charts.TopTracks != null && MusicProvider.Charts.TopTracks.Count > 0 && freshTopPlayedTracksViewHolder != null)
					{
						freshTopPlayedTracksViewHolder.FreshTopPlayedTracksListContainer.Visibility = ViewStates.Visible;
						FreshTrackAdapter freshTopTracksAdapter = new FreshTrackAdapter(MusicProvider.Charts.TopTracks, ServiceConnection);
						BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { freshTopTracksAdapter.NotifyDataSetChanged(); };
						freshTopPlayedTracksViewHolder.FreshTopPlayedTracksRecycleView?.SetAdapter(freshTopTracksAdapter);
						freshTopTracksAdapter.ItemClick += TrackClick;
						Adapters.SetAdapters(Activity, freshTopTracksAdapter);
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
					return new FreshNewArtistsViewHolder(LayoutInflater.From(parent.Context).Inflate(Resource.Layout.fresh_new_artists, parent, false));
				case 1:
					return new FreshNewTracksViewHolder(LayoutInflater.From(parent.Context).Inflate(Resource.Layout.fresh_new_tracks, parent, false));
				case 2:
					return new FreshNeverPlayedTracksViewHolder(LayoutInflater.From(parent.Context).Inflate(Resource.Layout.fresh_never_played_tracks, parent, false));
				case 3:
					return new FreshNewAlbumsViewHolder(LayoutInflater.From(parent.Context).Inflate(Resource.Layout.fresh_new_albums, parent, false));
				case 4:
					return new FreshNeverPlayedAlbumsViewHolder(LayoutInflater.From(parent.Context).Inflate(Resource.Layout.fresh_never_played_albums, parent, false));
				case 5:
					return new FreshTopPlayedTracksViewHolder(LayoutInflater.From(parent.Context).Inflate(Resource.Layout.fresh_top_played_tracks, parent, false));

			}
			return null;
		}

		public override int ItemCount
		{
			get { return 6; }
		}

		public event EventHandler<TrackViewHolderEvent> TrackClick;
		public event EventHandler<FreshArtistAdapter.ViewHolder.ViewHolderEvent> ArtistClick;
		public event EventHandler<FreshAlbumAdapter.ViewHolder.ViewHolderEvent> AlbumClick;

		public class FreshNewTracksViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout FreshNewTracksListContainer { get; set; }
			public RecyclerView FreshNewTracksRecycleView { get; set; }
			public FreshNewTracksViewHolder(View itemView) : base(itemView)
			{
				FreshNewTracksListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.fresh_new_tracks_list_container);
				FreshNewTracksListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Vertical, false);
				FreshNewTracksRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.fresh_new_tracks_list);
				FreshNewTracksRecycleView.SetLayoutManager(layoutManager);
			}
		}

		public class FreshNewArtistsViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout FreshNewArtistsListContainer { get; set; }
			public RecyclerView FreshNewArtistsRecycleView { get; set; }
			public FreshNewArtistsViewHolder(View itemView) : base(itemView)
			{
				FreshNewArtistsListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.fresh_new_artists_list_container);
				FreshNewArtistsListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Horizontal, false);
				FreshNewArtistsRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.fresh_new_artists_list);
				FreshNewArtistsRecycleView.SetLayoutManager(layoutManager);
			}
		}

		public class FreshNewAlbumsViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout FreshNewAlbumsListContainer { get; set; }
			public RecyclerView FreshNewAlbumRecycleView { get; set; }
			public Album Album { get; set; }

			public FreshNewAlbumsViewHolder(View itemView) : base(itemView)
			{
				FreshNewAlbumsListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.fresh_new_albums_list_container);
				FreshNewAlbumsListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Horizontal, false);
				FreshNewAlbumRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.fresh_new_albums_list);
				FreshNewAlbumRecycleView.SetLayoutManager(layoutManager);
			}
		}

		public class FreshNeverPlayedAlbumsViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout FresNeverPlayedAlbumsListContainer { get; set; }
			public RecyclerView FreshNeverPlayedAlbumRecycleView { get; set; }
			public Album Album { get; set; }

			public FreshNeverPlayedAlbumsViewHolder(View itemView) : base(itemView)
			{
				FresNeverPlayedAlbumsListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.fresh_never_played_albums_list_container);
				FresNeverPlayedAlbumsListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Horizontal, false);
				FreshNeverPlayedAlbumRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.fresh_never_played_albums_list);
				FreshNeverPlayedAlbumRecycleView.SetLayoutManager(layoutManager);
			}
		}

		public class FreshNeverPlayedTracksViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout FreshNeverPlayedTracksListContainer { get; set; }
			public RecyclerView FreshNeverPlayedTracksRecycleView { get; set; }
			public FreshNeverPlayedTracksViewHolder(View itemView) : base(itemView)
			{
				FreshNeverPlayedTracksListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.fresh_never_played_tracks_list_container);
				FreshNeverPlayedTracksListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Vertical, false);
				FreshNeverPlayedTracksRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.fresh_never_played_tracks_list);
				FreshNeverPlayedTracksRecycleView.SetLayoutManager(layoutManager);
			}
		}

		public class FreshTopPlayedTracksViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout FreshTopPlayedTracksListContainer { get; set; }
			public RecyclerView FreshTopPlayedTracksRecycleView { get; set; }
			public FreshTopPlayedTracksViewHolder(View itemView) : base(itemView)
			{
				FreshTopPlayedTracksListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.fresh_top_played_tracks_list_container);
				FreshTopPlayedTracksListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Vertical, false);
				FreshTopPlayedTracksRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.fresh_top_played_tracks_list);
				FreshTopPlayedTracksRecycleView.SetLayoutManager(layoutManager);
			}
		}
	}

	public class FreshArtistAdapter : RecyclerView.Adapter
	{
		public List<Artist> Artists { get; set; }

		public BackgroundAudioServiceConnection ServiceConnection { get; }

		public FreshArtistAdapter(List<Artist> artists, BackgroundAudioServiceConnection serviceConnection)
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

	public class FreshAlbumAdapter : RecyclerView.Adapter
	{
		public List<Album> Albums { get; set; }
		public BackgroundAudioServiceConnection ServiceConnection { get; }

		public FreshAlbumAdapter(List<Album> albums, BackgroundAudioServiceConnection serviceConnection)
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

	public class FreshTrackAdapter : RecyclerView.Adapter
	{
		public List<Song> Songs { get; set; }
		public BackgroundAudioServiceConnection ServiceConnection { get; }

		public FreshTrackAdapter(List<Song> songs, BackgroundAudioServiceConnection serviceConnection)
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
			public List<Song> Songs { get; set; }
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

	public class FreshHorizontalTrackAdapter : RecyclerView.Adapter
	{
		public Queue Songs { get; set; }
		public BackgroundAudioServiceConnection ServiceConnection { get; }

		public FreshHorizontalTrackAdapter(Queue songs, BackgroundAudioServiceConnection serviceConnection)
		{
			Songs = songs;
			ServiceConnection = serviceConnection;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			ViewHolder h = (ViewHolder)holder;
			h.Songs = Songs;
			Songs[position].GetAlbumArt(h.Image);
			h.Name.Text = Songs[position].Title;
			h.SetSelected(position);
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			View view = LayoutInflater.From(parent.Context).Inflate(Resource.Layout.fresh_song_item_horizontal, parent, false);
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
			public RelativeLayout ItemRoot { get; set; }
			public ImageView Image { get; set; }
			public TextView Name { get; set; }
			public Queue Songs { get; set; }
			public BackgroundAudioServiceConnection ServiceConnection { get; }

			public ViewHolder(View itemView, Action<TrackViewHolderEvent> listener, BackgroundAudioServiceConnection serviceConnection) : base(itemView)
			{
				ItemRoot = itemView.FindViewById<RelativeLayout>(Resource.Id.item_root);
				Image = itemView.FindViewById<ImageView>(Resource.Id.image_view);
				Name = itemView.FindViewById<TextView>(Resource.Id.name);
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

	public class TrackViewHolderEvent
	{
		public int Position { get; set; }
		public List<Song> Songs { get; set; }
	}
}