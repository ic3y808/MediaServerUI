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
using Android.Content.Res;
using Android.Graphics;
using Android.Support.V4.Content;
using Android.Support.V7.Widget;
using MaterialRippleLibrary;

namespace Alloy.Adapters
{
	public class StarredAdapter : RecyclerView.Adapter
	{
		public Context Context { get; set; }
		public Activity Activity { get; set; }
		private BackgroundAudioServiceConnection ServiceConnection { get; }

		public StarredAdapter(Activity activity, BackgroundAudioServiceConnection serviceConnection)
		{
			Activity = activity;
			ServiceConnection = serviceConnection;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			switch (position)
			{
				case 0:
					StarredTopArtistsViewHolder starredTopArtistsHolder = holder as StarredTopArtistsViewHolder;
					if (MusicProvider.Starred != null && MusicProvider.Starred.TopArtists != null && MusicProvider.Starred.TopArtists.Count > 0 && starredTopArtistsHolder != null)
					{
						starredTopArtistsHolder.StarredTopArtistsListContainer.Visibility = ViewStates.Visible;
						StarredArtistAdapter starredTopArtistsAdapter = new StarredArtistAdapter(MusicProvider.Starred.TopArtists, ServiceConnection);
						BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { starredTopArtistsAdapter.NotifyDataSetChanged(); };
						starredTopArtistsHolder.StarredTopArtistsRecycleView?.SetAdapter(starredTopArtistsAdapter);
						starredTopArtistsAdapter.ItemClick += ArtistClick;
						Adapters.SetAdapters(Activity, starredTopArtistsAdapter);
					}

					break;
				case 1:
					StarredTopAlbumsViewHolder starredTopAlbumsHolder = holder as StarredTopAlbumsViewHolder;

					if (MusicProvider.Starred != null && MusicProvider.Starred.Albums != null && MusicProvider.Starred.TopAlbums.Count > 0 && starredTopAlbumsHolder != null)
					{
						starredTopAlbumsHolder.StarredTopAlbumsListContainer.Visibility = ViewStates.Visible;
						StarredAlbumAdapter albumsAdapter = new StarredAlbumAdapter(MusicProvider.Starred.TopAlbums, ServiceConnection);
						BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { albumsAdapter.NotifyDataSetChanged(); };
						starredTopAlbumsHolder.StarredTopAlbumRecycleView?.SetAdapter(albumsAdapter);
						albumsAdapter.ItemClick += AlbumClick;
						Adapters.SetAdapters(Activity, albumsAdapter);
					}

					break;
				case 2:
					StarredTopTracksViewHolder starredTopTracksHolder = holder as StarredTopTracksViewHolder;
					if (MusicProvider.Starred != null && MusicProvider.Starred.TopTracks != null && MusicProvider.Starred.TopTracks.Count > 0 && starredTopTracksHolder != null)
					{
						starredTopTracksHolder.StarredTopTracksListContainer.Visibility = ViewStates.Visible;
						StarredTrackAdapter starredTopTracksAdapter = new StarredTrackAdapter(MusicProvider.Starred.TopTracks, ServiceConnection);
						BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { starredTopTracksAdapter.NotifyDataSetChanged(); };
						starredTopTracksHolder.StarredTopTracksRecycleView?.SetAdapter(starredTopTracksAdapter);
						//starredTopTracksAdapter.ItemClick += TrackClick;
						Adapters.SetAdapters(Activity, starredTopTracksAdapter);
					}

					break;
				case 3:
					StarredArtistsViewHolder starredArtistsHolder = holder as StarredArtistsViewHolder;
					if (MusicProvider.Starred != null && MusicProvider.Starred.Artists != null && MusicProvider.Starred.Artists.Count > 0 && starredArtistsHolder != null)
					{
						starredArtistsHolder.StarredArtistsListContainer.Visibility = ViewStates.Visible;
						StarredArtistAdapter starredArtistsAdapter = new StarredArtistAdapter(MusicProvider.Starred.Artists, ServiceConnection);
						BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { starredArtistsAdapter.NotifyDataSetChanged(); };
						starredArtistsHolder.StarredArtistsRecycleView?.SetAdapter(starredArtistsAdapter);
						starredArtistsAdapter.ItemClick += ArtistClick;
						Adapters.SetAdapters(Activity, starredArtistsAdapter);
					}

					break;
				case 4:
					StarredAlbumsViewHolder starredAlbumsHolder = holder as StarredAlbumsViewHolder;

					if (MusicProvider.Starred != null && MusicProvider.Starred.Albums != null && MusicProvider.Starred.Albums.Count > 0 && starredAlbumsHolder != null)
					{
						starredAlbumsHolder.StarredAlbumsListContainer.Visibility = ViewStates.Visible;
						StarredAlbumAdapter albumsAdapter = new StarredAlbumAdapter(MusicProvider.Starred.Albums, ServiceConnection);
						BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { albumsAdapter.NotifyDataSetChanged(); };
						starredAlbumsHolder.StarredAlbumRecycleView?.SetAdapter(albumsAdapter);
						albumsAdapter.ItemClick += AlbumClick;
						Adapters.SetAdapters(Activity, albumsAdapter);
					}

					break;

				case 5:
					StarredTracksViewHolder starredTracksHolder = holder as StarredTracksViewHolder;
					if (MusicProvider.Starred != null && MusicProvider.Starred.Tracks != null && MusicProvider.Starred.Tracks.Count > 0 && starredTracksHolder != null)
					{
						starredTracksHolder.StarredTracksListContainer.Visibility = ViewStates.Visible;
						StarredTrackAdapter starredTracksAdapter = new StarredTrackAdapter(MusicProvider.Starred.Tracks, ServiceConnection);
						BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { starredTracksAdapter.NotifyDataSetChanged(); };
						starredTracksHolder.StarredTracksRecycleView?.SetAdapter(starredTracksAdapter);
						//starredTracksAdapter.ItemClick += TrackClick;
						Adapters.SetAdapters(Activity, starredTracksAdapter);
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
			Context = parent.Context;
			switch (viewType)
			{
				case 0:
					return new StarredTopArtistsViewHolder(LayoutInflater.From(Context).Inflate(Resource.Layout.starred_top_artists, parent, false));
				case 1:
					return new StarredTopAlbumsViewHolder(LayoutInflater.From(Context).Inflate(Resource.Layout.starred_top_albums, parent, false));
				case 2:
					return new StarredTopTracksViewHolder(MaterialRippleLayout.on(LayoutInflater.From(Context).Inflate(Resource.Layout.starred_top_tracks, parent, false))
						.RippleColor(Color.ParseColor("#FF0000"))
						.RippleAlpha(0.2f)
						.RippleHover(true)
						.create());
				case 3:
					return new StarredArtistsViewHolder(LayoutInflater.From(Context).Inflate(Resource.Layout.starred_artists, parent, false));
				case 4:
					return new StarredAlbumsViewHolder(LayoutInflater.From(Context).Inflate(Resource.Layout.starred_albums, parent, false));
				case 5:
					return new StarredTracksViewHolder(LayoutInflater.From(Context).Inflate(Resource.Layout.starred_tracks, parent, false));

			}
			return null;
		}

		public override int ItemCount
		{
			get { return 6; }
		}

		public event EventHandler<StarredTrackAdapter.ViewHolder.ViewHolderEvent> TrackClick;
		public event EventHandler<StarredArtistAdapter.ViewHolder.ViewHolderEvent> ArtistClick;
		public event EventHandler<StarredAlbumAdapter.ViewHolder.ViewHolderEvent> AlbumClick;

		public class StarredAlbumsViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout StarredAlbumsListContainer { get; set; }
			public RecyclerView StarredAlbumRecycleView { get; set; }
			public Album Album { get; set; }

			public StarredAlbumsViewHolder(View itemView) : base(itemView)
			{
				StarredAlbumsListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.starred_albums_list_container);
				StarredAlbumsListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Horizontal, false);
				StarredAlbumRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.starred_albums_list);
				StarredAlbumRecycleView.SetLayoutManager(layoutManager);
			}
		}

		public class StarredTopAlbumsViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout StarredTopAlbumsListContainer { get; set; }
			public RecyclerView StarredTopAlbumRecycleView { get; set; }
			public Album Album { get; set; }

			public StarredTopAlbumsViewHolder(View itemView) : base(itemView)
			{
				StarredTopAlbumsListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.starred_top_albums_list_container);
				StarredTopAlbumsListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Horizontal, false);
				StarredTopAlbumRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.starred_top_albums_list);
				StarredTopAlbumRecycleView.SetLayoutManager(layoutManager);
			}
		}

		public class StarredTracksViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout StarredTracksListContainer { get; set; }
			public RecyclerView StarredTracksRecycleView { get; set; }
			public StarredTracksViewHolder(View itemView) : base(itemView)
			{
				StarredTracksListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.starred_tracks_list_container);
				StarredTracksListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Vertical, false);
				StarredTracksRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.starred_tracks_list);
				StarredTracksRecycleView.SetLayoutManager(layoutManager);
			}
		}

		public class StarredTopTracksViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout StarredTopTracksListContainer { get; set; }
			public RecyclerView StarredTopTracksRecycleView { get; set; }
			public StarredTopTracksViewHolder(View itemView) : base(itemView)
			{
				itemView.Clickable = true;
				StarredTopTracksListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.starred_top_tracks_list_container);
				StarredTopTracksListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Vertical, false);
				StarredTopTracksRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.starred_top_tracks_list);
				StarredTopTracksRecycleView.SetLayoutManager(layoutManager);
			}
		}

		public class StarredArtistsViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout StarredArtistsListContainer { get; set; }
			public RecyclerView StarredArtistsRecycleView { get; set; }
			public StarredArtistsViewHolder(View itemView) : base(itemView)
			{
				StarredArtistsListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.starred_artists_list_container);
				StarredArtistsListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Horizontal, false);
				StarredArtistsRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.starred_artists_list);
				StarredArtistsRecycleView.SetLayoutManager(layoutManager);
			}
		}

		public class StarredTopArtistsViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout StarredTopArtistsListContainer { get; set; }
			public RecyclerView StarredTopArtistsRecycleView { get; set; }
			public StarredTopArtistsViewHolder(View itemView) : base(itemView)
			{
				StarredTopArtistsListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.starred_top_artists_list_container);
				StarredTopArtistsListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Horizontal, false);
				StarredTopArtistsRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.starred_top_artists_list);
				StarredTopArtistsRecycleView.SetLayoutManager(layoutManager);
			}
		}
	}

	public class StarredArtistAdapter : RecyclerView.Adapter
	{
		public List<Artist> Artists { get; set; }
		private BackgroundAudioServiceConnection ServiceConnection { get; }

		public StarredArtistAdapter(List<Artist> artists, BackgroundAudioServiceConnection serviceConnection)
		{
			Artists = artists;
			ServiceConnection = serviceConnection;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			ViewHolder h = (ViewHolder)holder;
			h.Artist = Artists[position];
			Artists[position].GetAlbumArt(h.Image);
			h.Name.SetText(Artists[position].Name, TextView.BufferType.Normal);
			h.SetSelected();
			BackgroundAudioServiceConnection.PlaybackStatusChanged += (o, e) => { h.SetSelected(); };
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			View view = LayoutInflater.From(parent.Context).Inflate(Resource.Layout.starred_artist_item, parent, false);
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
			private BackgroundAudioServiceConnection ServiceConnection { get; }

			public ViewHolder(View itemView, Action<ViewHolderEvent> listener, BackgroundAudioServiceConnection serviceConnection) : base(itemView)
			{
				ItemRoot = itemView.FindViewById<RelativeLayout>(Resource.Id.item_root);
				Image = itemView.FindViewById<ImageView>(Resource.Id.image_view);
				Name = itemView.FindViewById<TextView>(Resource.Id.name);
				ServiceConnection = serviceConnection;
				itemView.Click += (sender, e) => listener(new ViewHolderEvent { Position = LayoutPosition, Artist = Artist });
			}

			public class ViewHolderEvent
			{
				public int Position { get; set; }
				public Artist Artist { get; set; }
			}

			public void SetSelected()
			{
				if (Artist == null) return;

				bool selected = Artist.IsSelected || ServiceConnection != null && ServiceConnection.CurrentSong != null && ServiceConnection.CurrentSong.ArtistId.Equals(Artist.Id);

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

	public class StarredAlbumAdapter : RecyclerView.Adapter
	{
		public List<Album> Albums { get; set; }
		private BackgroundAudioServiceConnection ServiceConnection { get; set; }

		public StarredAlbumAdapter(List<Album> albums, BackgroundAudioServiceConnection serviceConnection)
		{
			Albums = albums;
			ServiceConnection = serviceConnection;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			ViewHolder h = (ViewHolder)holder;
			h.Album = Albums[position];
			Albums[position].GetAlbumArt(h.Image);
			h.Name.SetText(Albums[position].Name, TextView.BufferType.Normal);
			h.SetSelected();
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			View view = LayoutInflater.From(parent.Context).Inflate(Resource.Layout.starred_album_item, parent, false);
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
			private BackgroundAudioServiceConnection ServiceConnection { get; }

			public ViewHolder(View itemView, Action<ViewHolderEvent> listener, BackgroundAudioServiceConnection serviceConnection) : base(itemView)
			{
				ItemRoot = itemView.FindViewById<RelativeLayout>(Resource.Id.item_root);
				Image = itemView.FindViewById<ImageView>(Resource.Id.image_view);
				Name = itemView.FindViewById<TextView>(Resource.Id.name);
				ServiceConnection = serviceConnection;
				itemView.Click += (sender, e) => listener(new ViewHolderEvent { Position = LayoutPosition, Album = Album });
				BackgroundAudioServiceConnection.PlaybackStatusChanged += (o, e) => { SetSelected(); };
			}

			public class ViewHolderEvent
			{
				public int Position { get; set; }
				public Album Album { get; set; }
			}

			public void SetSelected()
			{
				if (Album == null) return;

				bool selected = Album.IsSelected || ServiceConnection != null && ServiceConnection.CurrentSong != null && ServiceConnection.CurrentSong.AlbumId.Equals(Album.Id);

				if (Album.Tracks != null && Album.Tracks.Count != 0)
				{
					foreach (Song albumTrack in Album.Tracks)
					{
						if (albumTrack.IsSelected || ServiceConnection != null && ServiceConnection.CurrentSong != null && ServiceConnection.CurrentSong.Id.Equals(albumTrack.Id)) selected = true;
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
		}
	}

	public class StarredTrackAdapter : RecyclerView.Adapter
	{
		public List<Song> Songs { get; set; }
		private BackgroundAudioServiceConnection ServiceConnection { get; }

		public StarredTrackAdapter(List<Song> songs, BackgroundAudioServiceConnection serviceConnection)
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
			h.Title.SetText(Songs[position].Title, TextView.BufferType.Normal);
			h.Album.SetText(Songs[position].Album, TextView.BufferType.Normal);
			h.Artist.SetText(Songs[position].Artist, TextView.BufferType.Normal);
			h.SetSelected(position);
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			return new ViewHolder(
				MaterialRippleLayout.on(LayoutInflater.From(parent.Context).Inflate(Resource.Layout.starred_song_item, parent, false))
					.RippleColor(new Color(ContextCompat.GetColor(parent.Context, Resource.Color.ripple_color)))
					.RippleAlpha(0.2f)
					.RippleHover(true)
					.create(), ServiceConnection);
		}

		public override int ItemCount => Songs.Count;

		public class ViewHolder : RecyclerView.ViewHolder, View.IOnClickListener, View.IOnLongClickListener
		{
			public LinearLayout ItemRoot { get; set; }
			public ImageView Image { get; set; }
			public TextView Title { get; set; }
			public TextView Artist { get; set; }
			public TextView Album { get; set; }
			public List<Song> Songs { get; set; }
			private BackgroundAudioServiceConnection ServiceConnection { get; }

			public ViewHolder(View itemView, BackgroundAudioServiceConnection serviceConnection) : base(itemView)
			{
				
				ItemRoot = itemView.FindViewById<LinearLayout>(Resource.Id.item_root);
				Image = itemView.FindViewById<ImageView>(Resource.Id.image_view);
				Title = itemView.FindViewById<TextView>(Resource.Id.title);
				Artist = itemView.FindViewById<TextView>(Resource.Id.artist);
				Album = itemView.FindViewById<TextView>(Resource.Id.album);
				Album.Typeface = Typeface.Create(Album.Typeface, TypefaceStyle.Italic);
				ServiceConnection = serviceConnection;
				//itemView.Click += (sender, e) => listener(new ViewHolderEvent { Position = LayoutPosition, Songs = Songs });
				BackgroundAudioServiceConnection.PlaybackStatusChanged += (o, e) => { SetSelected(LayoutPosition); };
				ItemView.LayoutParameters = (new RecyclerView.LayoutParams(RecyclerView.LayoutParams.MatchParent, RecyclerView.LayoutParams.WrapContent));
				itemView.SetOnClickListener(this);
				itemView.SetOnLongClickListener(this);

			}

			public void SetSelected(int position)
			{
				if (Songs == null || Songs.Count == 0 || position < 0 || position >= Songs.Count) return;

				bool selected = Songs[position].IsSelected || ServiceConnection?.CurrentSong != null && ServiceConnection.CurrentSong.Id.Equals(Songs[position].Id);

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
				public List<Song> Songs { get; set; }
			}

			public void OnClick(View v)
			{
				ServiceConnection?.Play(AdapterPosition, Songs.ToQueue());
			}

			public bool OnLongClick(View v)
			{
				return true;
				
			}
		}
	}
}