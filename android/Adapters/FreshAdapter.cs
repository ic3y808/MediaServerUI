using System;
using System.Collections.Generic;
using Alloy.Helpers;
using Android.Views;
using Android.Widget;
using Alloy.Models;
using Alloy.Providers;
using Android.App;
using Android.Content;
using Android.Graphics;
using Android.Graphics.Drawables;
using Android.Support.V7.Widget;

namespace Alloy.Adapters
{
	public class FreshAdapter : Android.Support.V7.Widget.RecyclerView.Adapter
	{
		public Context context;
		public Activity Activity;

		public FreshAdapter(Activity activity)
		{
			Activity = activity;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			switch (position)
			{
				case 0:
					FreshNewTracksViewHolder freshNewTracksHolder = holder as FreshNewTracksViewHolder;
					if (MusicProvider.Fresh != null && MusicProvider.Fresh.Tracks != null && MusicProvider.Fresh.Tracks.Count > 0)
					{
						if (freshNewTracksHolder != null)
						{
							freshNewTracksHolder.freshNewTracksListContainer.Visibility = ViewStates.Visible;
							FreshHorizontalTrackAdapter freshNewTracksAdapter = new FreshHorizontalTrackAdapter(MusicProvider.Fresh.Tracks);
							freshNewTracksHolder?.freshNewTracksRecycleView?.SetAdapter(freshNewTracksAdapter);
							freshNewTracksAdapter.ItemClick += TrackClick;
							Adapters.SetAdapters(Activity, freshNewTracksAdapter);
						}
					}
					break;
				case 1:
					FreshNewArtistsViewHolder freshNewArtistsHolder = holder as FreshNewArtistsViewHolder;
					if (MusicProvider.Fresh != null && MusicProvider.Fresh.Artists != null && MusicProvider.Fresh.Artists.Count > 0)
					{
						if (freshNewArtistsHolder != null)
						{

							freshNewArtistsHolder.freshNewArtistsListContainer.Visibility = ViewStates.Visible;
							FreshArtistAdapter freshNewArtistsAdapter = new FreshArtistAdapter(MusicProvider.Fresh.Artists);
							freshNewArtistsHolder?.freshNewArtistsRecycleView?.SetAdapter(freshNewArtistsAdapter);
							freshNewArtistsAdapter.ItemClick += ArtistClick;
							Adapters.SetAdapters(Activity, freshNewArtistsAdapter);
						}
					}
					break;
				case 2:
					FreshNewAlbumsViewHolder freshNewAlbumsViewHolder = holder as FreshNewAlbumsViewHolder;
					if (MusicProvider.Fresh != null && MusicProvider.Fresh.Albums != null && MusicProvider.Fresh.Albums.Count > 0)
					{
						if (freshNewAlbumsViewHolder != null)
						{

							freshNewAlbumsViewHolder.freshNewAlbumsListContainer.Visibility = ViewStates.Visible;
							FreshAlbumAdapter freshNewArtistsAdapter = new FreshAlbumAdapter(MusicProvider.Fresh.Albums);
							freshNewAlbumsViewHolder?.freshNewAlbumRecycleView?.SetAdapter(freshNewArtistsAdapter);
							freshNewArtistsAdapter.ItemClick += AlbumClick;
							Adapters.SetAdapters(Activity, freshNewArtistsAdapter);
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
					return new FreshNewTracksViewHolder(LayoutInflater.From(context).Inflate(Resource.Layout.fresh_new_tracks, parent, false));
				case 1:
					return new FreshNewArtistsViewHolder(LayoutInflater.From(context).Inflate(Resource.Layout.fresh_new_artists, parent, false));
				case 2:
					return new FreshNewAlbumsViewHolder(LayoutInflater.From(context).Inflate(Resource.Layout.fresh_new_albums, parent, false));

			}
			return null;
		}

		public override int ItemCount
		{
			get { return 3; }
		}

		public event EventHandler<FreshHorizontalTrackAdapter.ViewHolder.ViewHolderEvent> TrackClick;
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
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Horizontal, false);
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
	}

	public class FreshArtistAdapter : Android.Support.V7.Widget.RecyclerView.Adapter
	{
		public Context context;
		public List<Artist> Artists;

		public FreshArtistAdapter(List<Artist> artists)
		{
			Artists = artists;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			ViewHolder h = (ViewHolder)holder;
			if (h.configured) return;
			h.Artist = Artists[position];
			h.image.SetImageBitmap(Artists[position].Art);
			h.name.SetText(Artists[position].Name, TextView.BufferType.Normal);

			h.configured = true;
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			context = parent.Context;
			View view = LayoutInflater.From(context).Inflate(Resource.Layout.fresh_artist_item, parent, false);
			return new FreshArtistAdapter.ViewHolder(view, OnClick);
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

	public class FreshAlbumAdapter : Android.Support.V7.Widget.RecyclerView.Adapter
	{
		public Context context;
		public List<Album> Albums;

		public FreshAlbumAdapter(List<Album> albums)
		{
			Albums = albums;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			ViewHolder h = (ViewHolder)holder;
			if (h.configured) return;
			h.Album = Albums[position];
			h.image.SetImageBitmap(Albums[position].Art);
			h.name.SetText(Albums[position].Name, TextView.BufferType.Normal);

			h.configured = true;
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			context = parent.Context;
			View view = LayoutInflater.From(context).Inflate(Resource.Layout.artist_detail_album_item, parent, false);
			return new FreshAlbumAdapter.ViewHolder(view, OnClick);
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

	public class FreshHorizontalTrackAdapter : Android.Support.V7.Widget.RecyclerView.Adapter
	{
		public Context context;
		public MusicQueue Songs;

		public FreshHorizontalTrackAdapter(MusicQueue songs)
		{
			Songs = songs;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			ViewHolder h = (ViewHolder)holder;
			if (h.configured) return;
			h.Songs = Songs;
			h.image.SetImageBitmap(Songs[position].Art);
			h.name.SetText(Songs[position].Title, TextView.BufferType.Normal);

			h.configured = true;
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			context = parent.Context;
			View view = LayoutInflater.From(context).Inflate(Resource.Layout.fresh_song_item_horizontal, parent, false);
			return new FreshHorizontalTrackAdapter.ViewHolder(view, OnClick);
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
			public TextView name;
			public bool configured;
			public MusicQueue Songs;

			public ViewHolder(View itemView, Action<ViewHolderEvent> listener) : base(itemView)
			{
				image = itemView.FindViewById<ImageView>(Resource.Id.image_view);
				name = itemView.FindViewById<TextView>(Resource.Id.name);

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