using System;
using System.Collections.Generic;
using Alloy.Helpers;
using Alloy.Models;
using Alloy.Providers;
using Alloy.Services;
using Android.App;
using Android.Content;
using Android.Graphics;
using Android.Graphics.Drawables;
using Android.Support.V7.Widget;
using Android.Views;
using Android.Widget;

namespace Alloy.Adapters
{
	public class ArtistDetailAdapter : Android.Support.V7.Widget.RecyclerView.Adapter
	{
		public Context context;
		public Activity Activity;
		public ArtistContainer Artist;

		public ArtistDetailAdapter(Activity activity, ArtistContainer artist)
		{
			Artist = artist;
			Activity = activity;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			switch (position)
			{
				case 0:
					ArtistInformationViewHolder artistInfoHolder = holder as ArtistInformationViewHolder;
					
					if (artistInfoHolder != null)
					{
						artistInfoHolder.artist = Artist.Artist;
						artistInfoHolder?.artistName?.SetText(Artist.Artist.Name, TextView.BufferType.Normal);
						artistInfoHolder?.artistSize?.SetText(Artist.Size, TextView.BufferType.Normal);
						
						Bitmap art = Artist.Artist.GetAlbumArt();
			
						artistInfoHolder?.artistImage.SetImageBitmap(art);
			
						artistInfoHolder.CheckStarred();
					}

					break;
				case 1:
					ArtistMetricsViewHolder artistMetricsHolder = holder as ArtistMetricsViewHolder;
					artistMetricsHolder?.trackCount?.SetText(Artist.Tracks.Count.ToString(), TextView.BufferType.Normal);
					artistMetricsHolder?.playCount?.SetText(Artist.TotalPlays.ToString(), TextView.BufferType.Normal);
					break;
				case 2:
					ArtistAlbumsViewHolder artistAlbumsHolder = holder as ArtistAlbumsViewHolder;
					if (Artist.Albums.Count > 0)
					{
						if (artistAlbumsHolder != null)
						{
							artistAlbumsHolder.albumsListContainer.Visibility = ViewStates.Visible;
							ArtistDetailAlbumAdapter albumsAdapter = new ArtistDetailAlbumAdapter(Artist.Albums);
							artistAlbumsHolder?.albumRecycleView?.SetAdapter(albumsAdapter);
							albumsAdapter.ItemClick += AlbumClick;
							Adapters.SetAdapters(Activity, albumsAdapter);
						}
					}
					break;
				case 3:
					ArtistEpsViewHolder artistEpsHolder = holder as ArtistEpsViewHolder;
					if (Artist.EPs.Count > 0)
					{
						if (artistEpsHolder != null)
						{
							artistEpsHolder.epsListContainer.Visibility = ViewStates.Visible;
							ArtistDetailAlbumAdapter albumsAdapter = new ArtistDetailAlbumAdapter(Artist.EPs);
							artistEpsHolder?.epsRecycleView?.SetAdapter(albumsAdapter);
							albumsAdapter.ItemClick += AlbumClick;
							Adapters.SetAdapters(Activity, albumsAdapter);
						}
					}
					break;
				case 4:
					ArtistSinglesViewHolder artistSinglesHolder = holder as ArtistSinglesViewHolder;
					if (Artist.Singles.Count > 0)
					{
						if (artistSinglesHolder != null)
						{
							artistSinglesHolder.singlesListContainer.Visibility = ViewStates.Visible;
							ArtistDetailAlbumAdapter albumsAdapter = new ArtistDetailAlbumAdapter(Artist.Singles);
							artistSinglesHolder?.singlesRecycleView?.SetAdapter(albumsAdapter);
							albumsAdapter.ItemClick += AlbumClick;
							Adapters.SetAdapters(Activity, albumsAdapter);
						}
					}
					break;
				case 5:
					ArtistTopTracksViewHolder artistTopTracksHolder = holder as ArtistTopTracksViewHolder;
					if (Artist.PopularTracks.Count > 0)
					{
						if (artistTopTracksHolder != null)
						{
							artistTopTracksHolder.topTracksListContainer.Visibility = ViewStates.Visible;
							ArtistDetailTrackAdapter topAdapter = new ArtistDetailTrackAdapter(Artist.PopularTracks);
							artistTopTracksHolder?.topTrackRecycleView?.SetAdapter(topAdapter);
							topAdapter.ItemClick += TrackClick;
							Adapters.SetAdapters(Activity, topAdapter);
						}
					}
					break;
				case 6:
					ArtistAllTracksViewHolder allTracksHolder = holder as ArtistAllTracksViewHolder;
					if (Artist.Tracks.Count > 0)
					{
						if (allTracksHolder != null)
						{
							allTracksHolder.allTracksListContainer.Visibility = ViewStates.Visible;
							ArtistDetailTrackAdapter allTracksAdapter = new ArtistDetailTrackAdapter(Artist.Tracks);
							allTracksHolder?.allTracksRecycleView?.SetAdapter(allTracksAdapter);
							allTracksAdapter.ItemClick += TrackClick;
							Adapters.SetAdapters(Activity, allTracksAdapter);
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
					return new ArtistInformationViewHolder(LayoutInflater.From(context).Inflate(Resource.Layout.artist_detail_artist_info, parent, false), OnPlayArtist);
				case 1:
					return new ArtistMetricsViewHolder(LayoutInflater.From(context).Inflate(Resource.Layout.artist_detail_artist_metrics, parent, false));
				case 2:
					return new ArtistAlbumsViewHolder(LayoutInflater.From(context).Inflate(Resource.Layout.artist_detail_artist_albums, parent, false));
				case 3:
					return new ArtistEpsViewHolder(LayoutInflater.From(context).Inflate(Resource.Layout.artist_detail_artist_eps, parent, false));
				case 4:
					return new ArtistSinglesViewHolder(LayoutInflater.From(context).Inflate(Resource.Layout.artist_detail_artist_singles, parent, false));
				case 5:
					return new ArtistTopTracksViewHolder(LayoutInflater.From(context).Inflate(Resource.Layout.artist_detail_artist_top, parent, false));
				case 6:
					return new ArtistAllTracksViewHolder(LayoutInflater.From(context).Inflate(Resource.Layout.artist_detail_artist_all, parent, false));

			}
			return null;
		}

		public override int ItemCount
		{
			get { return 7; }
		}



		public event EventHandler<ArtistDetailAlbumAdapter.ViewHolder.ViewHolderEvent> AlbumClick;
		public event EventHandler<ArtistDetailTrackAdapter.ViewHolder.ViewHolderEvent> TrackClick;
		public event EventHandler<ArtistContainer> PlayArtist;

		void OnPlayArtist()
		{
			PlayArtist?.Invoke(this, Artist);
		}

		public class ArtistInformationViewHolder : RecyclerView.ViewHolder
		{
			public Artist artist;
			public TextView artistName;
			public TextView artistSize;
			public Button artistPlayButton;
			public ImageView artistImage;
			public ImageView starButton;
			private Drawable starred, notStarred;

			public ArtistInformationViewHolder(View itemView, Action listener) : base(itemView)
			{
				artistName = itemView.FindViewById<TextView>(Resource.Id.artist_name);
				artistSize = itemView.FindViewById<TextView>(Resource.Id.artist_size);
				artistPlayButton = itemView.FindViewById<Button>(Resource.Id.artist_play_button);
				artistPlayButton.Click += (sender, e) => listener();

				artistImage = itemView.FindViewById<ImageView>(Resource.Id.artist_image);
				starButton = itemView.FindViewById<ImageView>(Resource.Id.artist_favorite_button);
				starButton.Click += StarButtonClick;
				starred = itemView.Context.GetDrawable(Resource.Drawable.star_g);
				notStarred = itemView.Context.GetDrawable(Resource.Drawable.star_o);
			}

			private void StarButtonClick(object sender, System.EventArgs e)
			{
				if (artist.Starred)
				{
					MusicProvider.RemoveStar(artist);
				}
				else
				{
					MusicProvider.AddStar(artist);
				}
				CheckStarred();
			}

			public void CheckStarred(Artist a = null)
			{
				if (a != null)
				{
					starButton?.SetImageDrawable(a.Starred ? starred : notStarred);
				}
				else
				{
					starButton?.SetImageDrawable(artist.Starred ? starred : notStarred);
				}
			}

			public class PlayArtistEvent
			{
				public Artist Artist;
			}
		}

		public class ArtistMetricsViewHolder : RecyclerView.ViewHolder
		{
			public TextView trackCount;
			public TextView playCount;
			public ArtistMetricsViewHolder(View itemView) : base(itemView)
			{
				trackCount = itemView.FindViewById<TextView>(Resource.Id.artist_track_count);
				playCount = itemView.FindViewById<TextView>(Resource.Id.artist_play_count);
				
			}
		}

		public class ArtistAlbumsViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout albumsListContainer;
			public RecyclerView albumRecycleView;
			public ArtistAlbumsViewHolder(View itemView) : base(itemView)
			{
				albumsListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.artist_albums_list_container);
				albumsListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Horizontal, false);
				albumRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.artist_albums_list);
				albumRecycleView.SetLayoutManager(layoutManager);
				//RegisterForContextMenu(albumRecycleView);

			}
		}

		public class ArtistEpsViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout epsListContainer;
			public RecyclerView epsRecycleView;
			public ArtistEpsViewHolder(View itemView) : base(itemView)
			{
				epsListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.artist_eps_list_container);
				epsListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Horizontal, false);
				epsRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.artist_eps_list);
				epsRecycleView.SetLayoutManager(layoutManager);
			}
		}

		public class ArtistSinglesViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout singlesListContainer;
			public RecyclerView singlesRecycleView;
			public ArtistSinglesViewHolder(View itemView) : base(itemView)
			{
				singlesListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.artist_singles_list_container);
				singlesListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Horizontal, false);
				singlesRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.artist_singles_list);
				singlesRecycleView.SetLayoutManager(layoutManager);
			}
		}

		public class ArtistTopTracksViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout topTracksListContainer;
			public RecyclerView topTrackRecycleView;
			public ArtistTopTracksViewHolder(View itemView) : base(itemView)
			{
				topTracksListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.artist_top_tracks_list_container);
				topTracksListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Vertical, false);
				topTrackRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.artist_top_tracks_list);
				topTrackRecycleView.SetLayoutManager(layoutManager);
			}
		}

		public class ArtistAllTracksViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout allTracksListContainer;
			public RecyclerView allTracksRecycleView;
			public ArtistAllTracksViewHolder(View itemView) : base(itemView)
			{
				allTracksListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.artist_all_tracks_list_container);
				allTracksListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Vertical, false);
				allTracksRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.artist_all_tracks_list);
				allTracksRecycleView.SetLayoutManager(layoutManager);
			}
		}
	}
	
	public class ArtistDetailAlbumAdapter : Android.Support.V7.Widget.RecyclerView.Adapter
	{
		public Context context;
		public List<Album> Albums;

		public ArtistDetailAlbumAdapter(List<Album> albums)
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
			return new ArtistDetailAlbumAdapter.ViewHolder(view, OnClick);
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

	public class ArtistDetailTrackAdapter : Android.Support.V7.Widget.RecyclerView.Adapter
	{
		public Context context;
		public MusicQueue Songs;

		public ArtistDetailTrackAdapter(MusicQueue songs)
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

			public ViewHolder(View itemView, Action<ArtistDetailTrackAdapter.ViewHolder.ViewHolderEvent> listener) : base(itemView)
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