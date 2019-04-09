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
	public class StarredDetailAdapter : Android.Support.V7.Widget.RecyclerView.Adapter
	{
		public Context context;
		public Activity Activity;

		public StarredDetailAdapter(Activity activity)
		{
			Activity = activity;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			switch (position)
			{
				case 0:
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
					return new StarredAlbumsViewHolder(LayoutInflater.From(context).Inflate(Resource.Layout.starred_albums, parent, false));
		
			}
			return null;
		}

		public override int ItemCount
		{
			get { return 1; }
		}

		public event EventHandler<StarredTrackAdapter.ViewHolder.ViewHolderEvent> TrackClick;
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
			h.image.SetImageBitmap(Albums[position].Art);
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
			h.image.SetImageBitmap(Songs[position].Art);
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