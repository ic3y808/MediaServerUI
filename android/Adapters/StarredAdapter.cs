using System;
using System.Collections.Generic;
using Alloy.Helpers;
using Android.Views;
using Android.Widget;
using Alloy.Models;
using Alloy.Providers;
using Android.App;
using Android.Content;
using Android.Support.V7.Widget;

namespace Alloy.Adapters
{
	public class StarredAdapter : Android.Support.V7.Widget.RecyclerView.Adapter
	{
		public Context context;
		public Activity Activity;

		public StarredAdapter(Activity activity)
		{
			Activity = activity;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			switch (position)
			{
				case 0:
					StarredTopArtistsViewHolder starredTopArtistsHolder = holder as StarredTopArtistsViewHolder;
					if (MusicProvider.Starred != null && MusicProvider.Starred.TopArtists != null && MusicProvider.Starred.TopArtists.Count > 0)
					{
						if (starredTopArtistsHolder != null)
						{

							starredTopArtistsHolder.starredTopArtistsListContainer.Visibility = ViewStates.Visible;
							StarredArtistAdapter starredTopArtistsAdapter = new StarredArtistAdapter(MusicProvider.Starred.TopArtists);
							starredTopArtistsHolder?.starredTopArtistsRecycleView?.SetAdapter(starredTopArtistsAdapter);
							starredTopArtistsAdapter.ItemClick += ArtistClick;
							Adapters.SetAdapters(Activity, starredTopArtistsAdapter);
						}
					}
					break;
				case 1:
					StarredTopAlbumsViewHolder starredTopAlbumsHolder = holder as StarredTopAlbumsViewHolder;

					if (MusicProvider.Starred != null && MusicProvider.Starred.Albums != null && MusicProvider.Starred.TopAlbums.Count > 0)
					{
						if (starredTopAlbumsHolder != null)
						{
							starredTopAlbumsHolder.starredTopAlbumsListContainer.Visibility = ViewStates.Visible;
							StarredAlbumAdapter albumsAdapter = new StarredAlbumAdapter(MusicProvider.Starred.TopAlbums);
							starredTopAlbumsHolder?.starredTopAlbumRecycleView?.SetAdapter(albumsAdapter);
							albumsAdapter.ItemClick += AlbumClick;
							Adapters.SetAdapters(Activity, albumsAdapter);
						}
					}
					break;
				case 2:
					StarredTopTracksViewHolder starredTopTracksHolder = holder as StarredTopTracksViewHolder;
					if (MusicProvider.Starred != null && MusicProvider.Starred.TopTracks != null && MusicProvider.Starred.TopTracks.Count > 0)
					{
						if (starredTopTracksHolder != null)
						{

							starredTopTracksHolder.starredTopTracksListContainer.Visibility = ViewStates.Visible;
							StarredTrackAdapter starredTopTracksAdapter = new StarredTrackAdapter(MusicProvider.Starred.TopTracks);
							starredTopTracksHolder?.starredTopTracksRecycleView?.SetAdapter(starredTopTracksAdapter);
							starredTopTracksAdapter.ItemClick += TrackClick;
							Adapters.SetAdapters(Activity, starredTopTracksAdapter);
						}
					}
					break;
				case 3:
					StarredArtistsViewHolder starredArtistsHolder = holder as StarredArtistsViewHolder;
					if (MusicProvider.Starred != null && MusicProvider.Starred.Artists != null && MusicProvider.Starred.Artists.Count > 0)
					{
						if (starredArtistsHolder != null)
						{

							starredArtistsHolder.starredArtistsListContainer.Visibility = ViewStates.Visible;
							StarredArtistAdapter starredArtistsAdapter = new StarredArtistAdapter(MusicProvider.Starred.Artists);
							starredArtistsHolder?.starredArtistsRecycleView?.SetAdapter(starredArtistsAdapter);
							starredArtistsAdapter.ItemClick += ArtistClick;
							Adapters.SetAdapters(Activity, starredArtistsAdapter);
						}
					}
					break;
				case 4:
					StarredAlbumsViewHolder starredAlbumsHolder = holder as StarredAlbumsViewHolder;

					if (MusicProvider.Starred != null && MusicProvider.Starred.Albums != null && MusicProvider.Starred.Albums.Count > 0)
					{
						if (starredAlbumsHolder != null)
						{
							starredAlbumsHolder.starredAlbumsListContainer.Visibility = ViewStates.Visible;
							StarredAlbumAdapter albumsAdapter = new StarredAlbumAdapter(MusicProvider.Starred.Albums);
							starredAlbumsHolder?.starredAlbumRecycleView?.SetAdapter(albumsAdapter);
							albumsAdapter.ItemClick += AlbumClick;
							Adapters.SetAdapters(Activity, albumsAdapter);
						}
					}
					break;
				
				case 5:
					StarredTracksViewHolder  starredTracksHolder = holder as StarredTracksViewHolder;
					if (MusicProvider.Starred != null && MusicProvider.Starred.Tracks != null && MusicProvider.Starred.Tracks.Count > 0)
					{
						if (starredTracksHolder != null)
						{

							starredTracksHolder.starredTracksListContainer.Visibility = ViewStates.Visible;
							StarredTrackAdapter starredTracksAdapter = new StarredTrackAdapter(MusicProvider.Starred.Tracks);
							starredTracksHolder?.starredTracksRecycleView?.SetAdapter(starredTracksAdapter);
							starredTracksAdapter.ItemClick += TrackClick;
							Adapters.SetAdapters(Activity, starredTracksAdapter);
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
					return new StarredTopArtistsViewHolder(LayoutInflater.From(context).Inflate(Resource.Layout.starred_top_artists, parent, false));
				case 1:
					return new StarredTopAlbumsViewHolder(LayoutInflater.From(context).Inflate(Resource.Layout.starred_top_albums, parent, false));
				case 2:
					return new StarredTopTracksViewHolder(LayoutInflater.From(context).Inflate(Resource.Layout.starred_top_tracks, parent, false));
				case 3:
					return new StarredArtistsViewHolder(LayoutInflater.From(context).Inflate(Resource.Layout.starred_artists, parent, false));
				case 4:
					return new StarredAlbumsViewHolder(LayoutInflater.From(context).Inflate(Resource.Layout.starred_albums, parent, false));
				case 5:
					return new StarredTracksViewHolder(LayoutInflater.From(context).Inflate(Resource.Layout.starred_tracks, parent, false));
				
			}
			return null;
		}

		public override int ItemCount
		{
			get { return 6; }
		}

		public event EventHandler<StarredTrackAdapter.ViewHolder.ViewHolderEvent> TrackClick;
		public event EventHandler<StarredArtistAdapter.ViewHolder.ViewHolderEvent> ArtistClick;
		public event EventHandler<ArtistContainer> PlayArtist;
		public event EventHandler<AlbumContainer> PlayAlbum;
		public event EventHandler<StarredAlbumAdapter.ViewHolder.ViewHolderEvent> AlbumClick;

		void OnPlayAlbum()
		{
		//	PlayAlbum?.Invoke(this, Album);
		}

		public class StarredAlbumsViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout starredAlbumsListContainer;
			public RecyclerView starredAlbumRecycleView;
			public Album album;

			public StarredAlbumsViewHolder(View itemView) : base(itemView)
			{
				starredAlbumsListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.starred_albums_list_container);
				starredAlbumsListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Horizontal, false);
				starredAlbumRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.starred_albums_list);
				starredAlbumRecycleView.SetLayoutManager(layoutManager);
				//RegisterForContextMenu(albumRecycleView);
			}
		}

		public class StarredTopAlbumsViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout starredTopAlbumsListContainer;
			public RecyclerView starredTopAlbumRecycleView;
			public Album album;

			public StarredTopAlbumsViewHolder(View itemView) : base(itemView)
			{
				starredTopAlbumsListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.starred_top_albums_list_container);
				starredTopAlbumsListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Horizontal, false);
				starredTopAlbumRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.starred_top_albums_list);
				starredTopAlbumRecycleView.SetLayoutManager(layoutManager);
				//RegisterForContextMenu(albumRecycleView);
			}
		}

		public class StarredTracksViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout starredTracksListContainer;
			public RecyclerView starredTracksRecycleView;
			public StarredTracksViewHolder(View itemView) : base(itemView)
			{
				starredTracksListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.starred_tracks_list_container);
				starredTracksListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Vertical, false);
				starredTracksRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.starred_tracks_list);
				starredTracksRecycleView.SetLayoutManager(layoutManager);
			}
		}

		public class StarredTopTracksViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout starredTopTracksListContainer;
			public RecyclerView starredTopTracksRecycleView;
			public StarredTopTracksViewHolder(View itemView) : base(itemView)
			{
				starredTopTracksListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.starred_top_tracks_list_container);
				starredTopTracksListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Vertical, false);
				starredTopTracksRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.starred_top_tracks_list);
				starredTopTracksRecycleView.SetLayoutManager(layoutManager);
			}
		}

		public class StarredArtistsViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout starredArtistsListContainer;
			public RecyclerView starredArtistsRecycleView;
			public StarredArtistsViewHolder(View itemView) : base(itemView)
			{
				starredArtistsListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.starred_artists_list_container);
				starredArtistsListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Horizontal, false);
				starredArtistsRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.starred_artists_list);
				starredArtistsRecycleView.SetLayoutManager(layoutManager);
			}
		}

		public class StarredTopArtistsViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout starredTopArtistsListContainer;
			public RecyclerView starredTopArtistsRecycleView;
			public StarredTopArtistsViewHolder(View itemView) : base(itemView)
			{
				starredTopArtistsListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.starred_top_artists_list_container);
				starredTopArtistsListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Horizontal, false);
				starredTopArtistsRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.starred_top_artists_list);
				starredTopArtistsRecycleView.SetLayoutManager(layoutManager);
			}
		}
	}

	public class StarredArtistAdapter : Android.Support.V7.Widget.RecyclerView.Adapter
	{
		public Context context;
		public List<Artist> Artists;

		public StarredArtistAdapter(List<Artist> artists)
		{
			Artists = artists;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			ViewHolder h = (ViewHolder)holder;
			if (h.configured) return;
			h.Artist = Artists[position];
			Artists[position].GetAlbumArt(h.image);
			h.name.SetText(Artists[position].Name, TextView.BufferType.Normal);

			h.configured = true;
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			context = parent.Context;
			View view = LayoutInflater.From(context).Inflate(Resource.Layout.starred_artist_item, parent, false);
			return new StarredArtistAdapter.ViewHolder(view, OnClick);
		}

		public override int ItemCount => Artists.Count;

		void OnClick(ViewHolder.ViewHolderEvent e)
		{
			ItemClick?.Invoke(this, e);
		}
		public event EventHandler<ViewHolder.ViewHolderEvent> ItemClick;

		public class ViewHolder : RecyclerView.ViewHolder
		{

			public ImageView image;
			public TextView name;
			public bool configured;
			public Artist Artist;

			public ViewHolder(View itemView, Action<ViewHolderEvent> listener) : base(itemView)
			{
				image = itemView.FindViewById<ImageView>(Resource.Id.image_view);
				name = itemView.FindViewById<TextView>(Resource.Id.name);

				itemView.Click += (sender, e) => listener(new ViewHolderEvent() { Position = base.LayoutPosition, Artist = Artist });
			}

			public class ViewHolderEvent
			{
				public int Position { get; set; }
				public Artist Artist { get; set; }
			}
		}
	}

	public class StarredAlbumAdapter : Android.Support.V7.Widget.RecyclerView.Adapter
	{
		public Context context;
		public List<Album> Albums;

		public StarredAlbumAdapter(List<Album> albums)
		{
			Albums = albums;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			ViewHolder h = (ViewHolder)holder;
			if (h.configured) return;
			h.Album = Albums[position];
			Albums[position].GetAlbumArt(h.image);
			h.name.SetText(Albums[position].Name, TextView.BufferType.Normal);

			h.configured = true;
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			context = parent.Context;
			View view = LayoutInflater.From(context).Inflate(Resource.Layout.artist_detail_album_item, parent, false);
			return new StarredAlbumAdapter.ViewHolder(view, OnClick);
		}

		public override int ItemCount => Albums.Count;

		void OnClick(ViewHolder.ViewHolderEvent e)
		{
			ItemClick?.Invoke(this, e);
		}
		public event EventHandler<ViewHolder.ViewHolderEvent> ItemClick;

		public class ViewHolder : RecyclerView.ViewHolder
		{

			public ImageView image;
			public TextView name;
			public bool configured;
			public Album Album;

			public ViewHolder(View itemView, Action<ViewHolderEvent> listener) : base(itemView)
			{
				image = itemView.FindViewById<ImageView>(Resource.Id.image_view);
				name = itemView.FindViewById<TextView>(Resource.Id.name);

				itemView.Click += (sender, e) => listener(new ViewHolderEvent() { Position = base.LayoutPosition, Album = Album });
			}

			public class ViewHolderEvent
			{
				public int Position { get; set; }
				public Album Album { get; set; }
			}
		}
	}

	public class StarredTrackAdapter : Android.Support.V7.Widget.RecyclerView.Adapter
	{
		public Context context;
		public MusicQueue Songs;

		public StarredTrackAdapter(MusicQueue songs)
		{
			Songs = songs;
		}

		public override long GetItemId(int position)
		{
			return position;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			ViewHolder h = (ViewHolder)holder;
			if (h.configured) return;
			h.Songs = Songs;
			Songs[position].GetAlbumArt(h.image);
			h.title.SetText(Songs[position].Title, TextView.BufferType.Normal);
			h.album.SetText(Songs[position].Album, TextView.BufferType.Normal);
			h.configured = true;
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			context = parent.Context;
			View view = LayoutInflater.From(context).Inflate(Resource.Layout.artist_detail_song_item, parent, false);
			return new ViewHolder(view, OnClick);
		}

		public override int ItemCount => Songs.Count;

		void OnClick(ViewHolder.ViewHolderEvent e)
		{
			ItemClick?.Invoke(this, e);
		}

		public event EventHandler<ViewHolder.ViewHolderEvent> ItemClick;

		public class ViewHolder : RecyclerView.ViewHolder
		{

			public ImageView image;
			public TextView title;
			public TextView album;
			public MusicQueue Songs;
			public bool configured;

			public ViewHolder(View itemView, Action<StarredTrackAdapter.ViewHolder.ViewHolderEvent> listener) : base(itemView)
			{
				image = itemView.FindViewById<ImageView>(Resource.Id.image_view);
				title = itemView.FindViewById<TextView>(Resource.Id.title);
				album = itemView.FindViewById<TextView>(Resource.Id.album);
				itemView.Click += (sender, e) => listener(new ViewHolderEvent() { Position = base.LayoutPosition, Songs = Songs });
			}

			public class ViewHolderEvent
			{
				public int Position { get; set; }
				public MusicQueue Songs { get; set; }
			}
		}
	}

}