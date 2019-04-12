﻿using System;
using System.Collections.Generic;
using Alloy.Helpers;
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
	public class FreshAdapter : Android.Support.V7.Widget.RecyclerView.Adapter
	{
		public Context context;
		public Activity Activity;
		private BackgroundAudioServiceConnection serviceConnection;

		public FreshAdapter(Activity activity, BackgroundAudioServiceConnection serviceConnection)
		{
			Activity = activity;
			this.serviceConnection = serviceConnection;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			switch (position)
			{
				case 0:
					FreshNewArtistsViewHolder freshNewArtistsHolder = holder as FreshNewArtistsViewHolder;
					if (MusicProvider.Fresh != null && MusicProvider.Fresh.Artists != null && MusicProvider.Fresh.Artists.Count > 0)
					{
						if (freshNewArtistsHolder != null)
						{
							freshNewArtistsHolder.freshNewArtistsListContainer.Visibility = ViewStates.Visible;
							FreshArtistAdapter freshNewArtistsAdapter = new FreshArtistAdapter(MusicProvider.Fresh.Artists, serviceConnection);
							BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { freshNewArtistsAdapter.NotifyDataSetChanged(); };
							freshNewArtistsHolder?.freshNewArtistsRecycleView?.SetAdapter(freshNewArtistsAdapter);
							freshNewArtistsAdapter.ItemClick += ArtistClick;
							Adapters.SetAdapters(Activity, freshNewArtistsAdapter);
						}
					}
					break;
				case 1:
					FreshNewTracksViewHolder freshNewTracksHolder = holder as FreshNewTracksViewHolder;
					if (MusicProvider.Fresh != null && MusicProvider.Fresh.Tracks != null && MusicProvider.Fresh.Tracks.Count > 0)
					{
						if (freshNewTracksHolder != null)
						{
							freshNewTracksHolder.freshNewTracksListContainer.Visibility = ViewStates.Visible;
							FreshTrackAdapter freshNewTracksAdapter = new FreshTrackAdapter(MusicProvider.Fresh.Tracks, serviceConnection);
							BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { freshNewTracksAdapter.NotifyDataSetChanged(); };
							freshNewTracksHolder?.freshNewTracksRecycleView?.SetAdapter(freshNewTracksAdapter);
							freshNewTracksAdapter.ItemClick += TrackClick;
							Adapters.SetAdapters(Activity, freshNewTracksAdapter);
						}
					}
					break;
				case 2:
					FreshNeverPlayedTracksViewHolder freshNeverPlayedTracksViewHolder = holder as FreshNeverPlayedTracksViewHolder;
					if (MusicProvider.Charts != null && MusicProvider.Charts.NeverPlayed != null && MusicProvider.Charts.NeverPlayed.Count > 0)
					{
						if (freshNeverPlayedTracksViewHolder != null)
						{

							freshNeverPlayedTracksViewHolder.freshNeverPlayedTracksListContainer.Visibility = ViewStates.Visible;
							FreshTrackAdapter freshNeverPlayedTracksAdapter = new FreshTrackAdapter(MusicProvider.Charts.NeverPlayed, serviceConnection);
							BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { freshNeverPlayedTracksAdapter.NotifyDataSetChanged(); };
							freshNeverPlayedTracksViewHolder?.freshNeverPlayedTracksRecycleView?.SetAdapter(freshNeverPlayedTracksAdapter);
							freshNeverPlayedTracksAdapter.ItemClick += TrackClick;
							Adapters.SetAdapters(Activity, freshNeverPlayedTracksAdapter);
						}
					}
					break;

				
				case 3:
					FreshNewAlbumsViewHolder freshNewAlbumsViewHolder = holder as FreshNewAlbumsViewHolder;
					if (MusicProvider.Fresh != null && MusicProvider.Fresh.Albums != null && MusicProvider.Fresh.Albums.Count > 0)
					{
						if (freshNewAlbumsViewHolder != null)
						{
							freshNewAlbumsViewHolder.freshNewAlbumsListContainer.Visibility = ViewStates.Visible;
							FreshAlbumAdapter freshNewArtistsAdapter = new FreshAlbumAdapter(MusicProvider.Fresh.Albums, serviceConnection);
							BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { freshNewArtistsAdapter.NotifyDataSetChanged(); };
							freshNewAlbumsViewHolder?.freshNewAlbumRecycleView?.SetAdapter(freshNewArtistsAdapter);
							freshNewArtistsAdapter.ItemClick += AlbumClick;
							Adapters.SetAdapters(Activity, freshNewArtistsAdapter);
						}
					}
					break;
				case 4:
					FreshNeverPlayedAlbumsViewHolder freshNeverPlayedAlbumsViewHolder = holder as FreshNeverPlayedAlbumsViewHolder;
					if (MusicProvider.Charts != null && MusicProvider.Charts.NeverPlayedAlbums != null && MusicProvider.Charts.NeverPlayedAlbums.Count > 0)
					{
						if (freshNeverPlayedAlbumsViewHolder != null)
						{

							freshNeverPlayedAlbumsViewHolder.fresNeverPlayedAlbumsListContainer.Visibility = ViewStates.Visible;
							FreshAlbumAdapter freshNeverPlayedAlbumsAdapter = new FreshAlbumAdapter(MusicProvider.Charts.NeverPlayedAlbums, serviceConnection);
							BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { freshNeverPlayedAlbumsAdapter.NotifyDataSetChanged(); };
							freshNeverPlayedAlbumsViewHolder?.freshNeverPlayedAlbumRecycleView?.SetAdapter(freshNeverPlayedAlbumsAdapter);
							freshNeverPlayedAlbumsAdapter.ItemClick += AlbumClick;
							Adapters.SetAdapters(Activity, freshNeverPlayedAlbumsAdapter);
						}
					}
					break;
	
				case 5:
					FreshTopPlayedTracksViewHolder freshTopPlayedTracksViewHolder = holder as FreshTopPlayedTracksViewHolder;
					if (MusicProvider.Charts != null && MusicProvider.Charts.TopTracks != null && MusicProvider.Charts.TopTracks.Count > 0)
					{
						if (freshTopPlayedTracksViewHolder != null)
						{

							freshTopPlayedTracksViewHolder.freshTopPlayedTracksListContainer.Visibility = ViewStates.Visible;
							FreshTrackAdapter freshTopTracksAdapter = new FreshTrackAdapter(MusicProvider.Charts.TopTracks, serviceConnection);
							BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { freshTopTracksAdapter.NotifyDataSetChanged(); };
							freshTopPlayedTracksViewHolder?.freshTopPlayedTracksRecycleView?.SetAdapter(freshTopTracksAdapter);
							freshTopTracksAdapter.ItemClick += TrackClick;
							Adapters.SetAdapters(Activity, freshTopTracksAdapter);
						}
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
			context = parent.Context;
			switch (viewType)
			{
				case 0:
					return new FreshNewArtistsViewHolder(LayoutInflater.From(context).Inflate(Resource.Layout.fresh_new_artists, parent, false));
				case 1:
					return new FreshNewTracksViewHolder(LayoutInflater.From(context).Inflate(Resource.Layout.fresh_new_tracks, parent, false));
				case 2:
					return new FreshNeverPlayedTracksViewHolder(LayoutInflater.From(context).Inflate(Resource.Layout.fresh_never_played_tracks, parent, false));

				case 3:
					return new FreshNewAlbumsViewHolder(LayoutInflater.From(context).Inflate(Resource.Layout.fresh_new_albums, parent, false));
				case 4:
					return new FreshNeverPlayedAlbumsViewHolder(LayoutInflater.From(context).Inflate(Resource.Layout.fresh_never_played_albums, parent, false));
				
				case 5:
					return new FreshTopPlayedTracksViewHolder(LayoutInflater.From(context).Inflate(Resource.Layout.fresh_top_played_tracks, parent, false));

			}
			return null;
		}

		public override int ItemCount
		{
			get { return 6; }
		}

		public event EventHandler<TrackViewHolderEvent> TrackClick;
		public event EventHandler<FreshArtistAdapter.ViewHolder.ViewHolderEvent> ArtistClick;
		public event EventHandler<ArtistContainer> PlayArtist;
		public event EventHandler<AlbumContainer> PlayAlbum;
		public event EventHandler<FreshAlbumAdapter.ViewHolder.ViewHolderEvent> AlbumClick;

		void OnPlayAlbum()
		{
			//	PlayAlbum?.Invoke(this, Album);
		}

		public class FreshNewTracksViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout freshNewTracksListContainer;
			public RecyclerView freshNewTracksRecycleView;
			public FreshNewTracksViewHolder(View itemView) : base(itemView)
			{
				freshNewTracksListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.fresh_new_tracks_list_container);
				freshNewTracksListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Vertical, false);
				freshNewTracksRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.fresh_new_tracks_list);
				freshNewTracksRecycleView.SetLayoutManager(layoutManager);
			}
		}

		public class FreshNewArtistsViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout freshNewArtistsListContainer;
			public RecyclerView freshNewArtistsRecycleView;
			public FreshNewArtistsViewHolder(View itemView) : base(itemView)
			{
				freshNewArtistsListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.fresh_new_artists_list_container);
				freshNewArtistsListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Horizontal, false);
				freshNewArtistsRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.fresh_new_artists_list);
				freshNewArtistsRecycleView.SetLayoutManager(layoutManager);
			}
		}

		public class FreshNewAlbumsViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout freshNewAlbumsListContainer;
			public RecyclerView freshNewAlbumRecycleView;
			public Album album;

			public FreshNewAlbumsViewHolder(View itemView) : base(itemView)
			{
				freshNewAlbumsListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.fresh_new_albums_list_container);
				freshNewAlbumsListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Horizontal, false);
				freshNewAlbumRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.fresh_new_albums_list);
				freshNewAlbumRecycleView.SetLayoutManager(layoutManager);
				//RegisterForContextMenu(albumRecycleView);
			}
		}

		public class FreshNeverPlayedAlbumsViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout fresNeverPlayedAlbumsListContainer;
			public RecyclerView freshNeverPlayedAlbumRecycleView;
			public Album album;

			public FreshNeverPlayedAlbumsViewHolder(View itemView) : base(itemView)
			{
				fresNeverPlayedAlbumsListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.fresh_never_played_albums_list_container);
				fresNeverPlayedAlbumsListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Horizontal, false);
				freshNeverPlayedAlbumRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.fresh_never_played_albums_list);
				freshNeverPlayedAlbumRecycleView.SetLayoutManager(layoutManager);
				//RegisterForContextMenu(albumRecycleView);
			}
		}

		public class FreshNeverPlayedTracksViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout freshNeverPlayedTracksListContainer;
			public RecyclerView freshNeverPlayedTracksRecycleView;
			public FreshNeverPlayedTracksViewHolder(View itemView) : base(itemView)
			{
				freshNeverPlayedTracksListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.fresh_never_played_tracks_list_container);
				freshNeverPlayedTracksListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Vertical, false);
				freshNeverPlayedTracksRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.fresh_never_played_tracks_list);
				freshNeverPlayedTracksRecycleView.SetLayoutManager(layoutManager);
			}
		}

		public class FreshTopPlayedTracksViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout freshTopPlayedTracksListContainer;
			public RecyclerView freshTopPlayedTracksRecycleView;
			public FreshTopPlayedTracksViewHolder(View itemView) : base(itemView)
			{
				freshTopPlayedTracksListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.fresh_top_played_tracks_list_container);
				freshTopPlayedTracksListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Vertical, false);
				freshTopPlayedTracksRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.fresh_top_played_tracks_list);
				freshTopPlayedTracksRecycleView.SetLayoutManager(layoutManager);
			}
		}
	}

	public class FreshArtistAdapter : Android.Support.V7.Widget.RecyclerView.Adapter
	{
		public Context context;
		public List<Artist> Artists;

		private BackgroundAudioServiceConnection serviceConnection;

		public FreshArtistAdapter(List<Artist> artists, BackgroundAudioServiceConnection serviceConnection)
		{
			Artists = artists;
			this.serviceConnection = serviceConnection;
		}
		
		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			ViewHolder h = (ViewHolder)holder;

			h.Artist = Artists[position];
			Artists[position].GetAlbumArt(h.image);
			h.name.SetText(Artists[position].Name, TextView.BufferType.Normal);
			h.SetSelected();
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			context = parent.Context;
			View view = LayoutInflater.From(context).Inflate(Resource.Layout.fresh_artist_item, parent, false);
			return new FreshArtistAdapter.ViewHolder(view, OnClick, serviceConnection);
		}

		public override int ItemCount => Artists.Count;

		void OnClick(ViewHolder.ViewHolderEvent e)
		{
			ItemClick?.Invoke(this, e);
		}
		public event EventHandler<ViewHolder.ViewHolderEvent> ItemClick;

		public class ViewHolder : RecyclerView.ViewHolder
		{
			public RelativeLayout itemRoot;
			public ImageView image;
			public TextView name;
			public bool configured;
			public Artist Artist;
			private BackgroundAudioServiceConnection serviceConnection;

			public ViewHolder(View itemView, Action<ViewHolderEvent> listener, BackgroundAudioServiceConnection serviceConnection) : base(itemView)
			{
				itemRoot = itemView.FindViewById<RelativeLayout>(Resource.Id.item_root);
				image = itemView.FindViewById<ImageView>(Resource.Id.image_view);
				name = itemView.FindViewById<TextView>(Resource.Id.name);
				this.serviceConnection = serviceConnection;
				itemView.Click += (sender, e) => listener(new ViewHolderEvent() { Position = base.LayoutPosition, Artist = Artist });
				BackgroundAudioServiceConnection.PlaybackStatusChanged += (o, e) => { SetSelected(); };
			}

			public void SetSelected()
			{
				if (Artist == null) return;

				bool selected = Artist.IsSelected || serviceConnection != null && serviceConnection.CurrentSong != null && serviceConnection.CurrentSong.ArtistId.Equals(Artist.Id);

				if (selected)
				{
					itemRoot.SetBackgroundResource(Resource.Color.menu_selection_color);
				}
				else
				{
					itemRoot.SetBackgroundColor(Color.Transparent);
				}

			}

			public class ViewHolderEvent
			{
				public int Position { get; set; }
				public Artist Artist { get; set; }
			}
		}
	}

	public class FreshAlbumAdapter : Android.Support.V7.Widget.RecyclerView.Adapter
	{
		public Context context;
		public List<Album> Albums;
		private BackgroundAudioServiceConnection serviceConnection;

		public FreshAlbumAdapter(List<Album> albums, BackgroundAudioServiceConnection serviceConnection)
		{
			Albums = albums;
			this.serviceConnection = serviceConnection;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			ViewHolder h = (ViewHolder)holder;
			h.Album = Albums[position];
			Albums[position].GetAlbumArt(h.image);
			h.name.SetText(Albums[position].Name, TextView.BufferType.Normal);
			h.SetSelected();
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			context = parent.Context;
			View view = LayoutInflater.From(context).Inflate(Resource.Layout.fresh_album_item, parent, false);
			return new FreshAlbumAdapter.ViewHolder(view, OnClick, serviceConnection);
		}

		public override int ItemCount => Albums.Count;

		void OnClick(ViewHolder.ViewHolderEvent e)
		{
			ItemClick?.Invoke(this, e);
		}
		public event EventHandler<ViewHolder.ViewHolderEvent> ItemClick;

		public class ViewHolder : RecyclerView.ViewHolder
		{
			public RelativeLayout itemRoot;
			public ImageView image;
			public TextView name;
			public Album Album;
			private BackgroundAudioServiceConnection serviceConnection;

			public ViewHolder(View itemView, Action<ViewHolderEvent> listener, BackgroundAudioServiceConnection serviceConnection) : base(itemView)
			{
				itemRoot = itemView.FindViewById<RelativeLayout>(Resource.Id.item_root);
				image = itemView.FindViewById<ImageView>(Resource.Id.image_view);
				name = itemView.FindViewById<TextView>(Resource.Id.name);
				this.serviceConnection = serviceConnection;
				itemView.Click += (sender, e) => listener(new ViewHolderEvent() { Position = base.LayoutPosition, Album = Album });
				BackgroundAudioServiceConnection.PlaybackStatusChanged += (o, e) => { SetSelected(); };
			}

			public void SetSelected()
			{
				if (Album == null) return;

				bool selected = Album.IsSelected || serviceConnection != null && serviceConnection.CurrentSong != null && serviceConnection.CurrentSong.AlbumId.Equals(Album.Id);

				if (Album.Tracks != null && Album.Tracks.Count != 0)
				{
					foreach (Song albumTrack in Album.Tracks)
					{
						if (albumTrack.IsSelected || serviceConnection != null && serviceConnection.CurrentSong != null && serviceConnection.CurrentSong.Id.Equals(albumTrack.Id)) selected = true;
					}
				}

				if (selected)
				{
					itemRoot.SetBackgroundResource(Resource.Color.menu_selection_color);
				}
				else
				{
					itemRoot.SetBackgroundColor(Color.Transparent);
				}
			}

			public class ViewHolderEvent
			{
				public int Position { get; set; }
				public Album Album { get; set; }
			}
		}
	}

	public class FreshTrackAdapter : Android.Support.V7.Widget.RecyclerView.Adapter
	{
		public Context context;
		public MusicQueue Songs;
		private BackgroundAudioServiceConnection serviceConnection;

		public FreshTrackAdapter(MusicQueue songs, BackgroundAudioServiceConnection serviceConnection)
		{
			Songs = songs;
			this.serviceConnection = serviceConnection;
		}

		public override long GetItemId(int position)
		{
			return position;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			ViewHolder h = (ViewHolder)holder;
			h.Songs = Songs;
			Songs[position].GetAlbumArt(h.image);
			h.title.SetText(Songs[position].Title, TextView.BufferType.Normal);
			h.album.SetText(Songs[position].Album, TextView.BufferType.Normal);
			if (Songs[position].IsSelected)
			{
				h.ItemView.FindViewById<LinearLayout>(Resource.Id.item_root).SetBackgroundResource(Resource.Color.menu_selection_color);
			}
			else h.ItemView.FindViewById<LinearLayout>(Resource.Id.item_root).SetBackgroundColor(Color.Transparent);
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			context = parent.Context;
			View view = LayoutInflater.From(context).Inflate(Resource.Layout.fresh_song_item, parent, false);
			return new ViewHolder(view, OnClick, serviceConnection);
		}

		public override int ItemCount => Songs.Count;

		void OnClick(TrackViewHolderEvent e)
		{
			ItemClick?.Invoke(this, e);
		}

		public event EventHandler<TrackViewHolderEvent> ItemClick;

		public class ViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout itemRoot;
			public ImageView image;
			public TextView title;
			public TextView album;
			public MusicQueue Songs;
			private BackgroundAudioServiceConnection serviceConnection;

			public ViewHolder(View itemView, Action<TrackViewHolderEvent> listener, BackgroundAudioServiceConnection serviceConnection) : base(itemView)
			{
				itemRoot = itemView.FindViewById<LinearLayout>(Resource.Id.item_root);
				image = itemView.FindViewById<ImageView>(Resource.Id.image_view);
				title = itemView.FindViewById<TextView>(Resource.Id.title);
				album = itemView.FindViewById<TextView>(Resource.Id.album);
				this.serviceConnection = serviceConnection;
				itemView.Click += (sender, e) => listener(new TrackViewHolderEvent() { Position = base.LayoutPosition, Songs = Songs });
				BackgroundAudioServiceConnection.PlaybackStatusChanged += (o, e) => { SetSelected(base.LayoutPosition); };
			}

			public void SetSelected(int position)
			{
				if (Songs == null || Songs.Count == 0 || position < 0 || position >= Songs.Count) return;

				bool selected = Songs[position].IsSelected || serviceConnection != null && serviceConnection.CurrentSong != null && serviceConnection.CurrentSong.Id.Equals(Songs[position].Id);

				if (selected)
				{
					itemRoot.SetBackgroundResource(Resource.Color.menu_selection_color);
				}
				else
				{
					itemRoot.SetBackgroundColor(Color.Transparent);
				}
			}
		}
	}

	public class FreshHorizontalTrackAdapter : Android.Support.V7.Widget.RecyclerView.Adapter
	{
		public Context context;
		public MusicQueue Songs;
		private BackgroundAudioServiceConnection serviceConnection;

		public FreshHorizontalTrackAdapter(MusicQueue songs, BackgroundAudioServiceConnection serviceConnection)
		{
			Songs = songs;
			this.serviceConnection = serviceConnection;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			ViewHolder h = (ViewHolder)holder;
			h.Songs = Songs;
			Songs[position].GetAlbumArt(h.image);
			h.name.SetText(Songs[position].Title, TextView.BufferType.Normal);
			h.SetSelected(position);
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			context = parent.Context;
			View view = LayoutInflater.From(context).Inflate(Resource.Layout.fresh_song_item_horizontal, parent, false);
			return new FreshHorizontalTrackAdapter.ViewHolder(view, OnClick, serviceConnection);
		}

		public override int ItemCount => Songs.Count;

		void OnClick(TrackViewHolderEvent e)
		{
			ItemClick?.Invoke(this, e);
		}
		public event EventHandler<TrackViewHolderEvent> ItemClick;

		public class ViewHolder : RecyclerView.ViewHolder
		{
			public RelativeLayout itemRoot;
			public ImageView image;
			public TextView name;
			public MusicQueue Songs;
			private BackgroundAudioServiceConnection serviceConnection;

			public ViewHolder(View itemView, Action<TrackViewHolderEvent> listener, BackgroundAudioServiceConnection serviceConnection) : base(itemView)
			{
				itemRoot = itemView.FindViewById<RelativeLayout>(Resource.Id.item_root);
				image = itemView.FindViewById<ImageView>(Resource.Id.image_view);
				name = itemView.FindViewById<TextView>(Resource.Id.name);
				this.serviceConnection = serviceConnection;
				itemView.Click += (sender, e) => listener(new TrackViewHolderEvent() { Position = base.LayoutPosition, Songs = Songs });
				BackgroundAudioServiceConnection.PlaybackStatusChanged += (o, e) => { SetSelected(base.LayoutPosition); };
			}

			public void SetSelected(int position)
			{
				if (Songs == null || Songs.Count == 0 || position < 0 || position >= Songs.Count) return;

				bool selected = Songs[position].IsSelected || serviceConnection != null && serviceConnection.CurrentSong != null && serviceConnection.CurrentSong.Id.Equals(Songs[position].Id);

				if (selected)
				{
					itemRoot.SetBackgroundResource(Resource.Color.menu_selection_color);
				}
				else
				{
					itemRoot.SetBackgroundColor(Color.Transparent);
				}
			}
		}
	}

	public class TrackViewHolderEvent
	{
		public int Position { get; set; }
		public MusicQueue Songs { get; set; }
	}
}