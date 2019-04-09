using System;
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
	public class AlbumDetailAdapter : Android.Support.V7.Widget.RecyclerView.Adapter
	{
		public Context context;
		public Activity Activity;
		public AlbumContainer Album;

		public AlbumDetailAdapter(Activity activity, AlbumContainer album)
		{
			Album = album;
			Activity = activity;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			switch (position)
			{
				case 0:
					AlbumInformationViewHolder albumInfoHolder = holder as AlbumInformationViewHolder;

					if (albumInfoHolder != null)
					{
						albumInfoHolder.album = Album.Album;
						albumInfoHolder?.albumName?.SetText(Album.Album.Name, TextView.BufferType.Normal);
						albumInfoHolder?.albumSize?.SetText(Album.Size, TextView.BufferType.Normal);

						Bitmap art = Album.Album.GetAlbumArt();

						albumInfoHolder?.albumImage.SetImageBitmap(art);

						albumInfoHolder.CheckStarred();
					}

					break;
				case 1:
					AlbumMetricsViewHolder artistMetricsHolder = holder as AlbumMetricsViewHolder;
					artistMetricsHolder?.trackCount?.SetText(Album.Tracks.Count.ToString(), TextView.BufferType.Normal);
					artistMetricsHolder?.playCount?.SetText(Album.TotalPlays.ToString(), TextView.BufferType.Normal);
					break;
				case 2:
					AlbumTracksViewHolder albumTracksHolder = holder as AlbumTracksViewHolder;
					if (Album.Tracks.Count > 0)
					{
						if (albumTracksHolder != null)
						{
							albumTracksHolder.allTracksListContainer.Visibility = ViewStates.Visible;
							AlbumDetailTrackAdapter albumTracksAdapter = new AlbumDetailTrackAdapter(Album.Tracks);
							albumTracksHolder?.allTracksRecycleView?.SetAdapter(albumTracksAdapter);
							albumTracksAdapter.ItemClick += TrackClick;
							Adapters.SetAdapters(Activity, albumTracksAdapter);
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
					return new AlbumInformationViewHolder(LayoutInflater.From(context).Inflate(Resource.Layout.album_detail_album_info, parent, false), OnPlayAlbum);
				case 1:
					return new AlbumMetricsViewHolder(LayoutInflater.From(context).Inflate(Resource.Layout.album_detail_album_metrics, parent, false));
				case 2:
					return new AlbumTracksViewHolder(LayoutInflater.From(context).Inflate(Resource.Layout.album_detail_album_tracks, parent, false));

			}
			return null;
		}

		public override int ItemCount
		{
			get { return 3; }
		}

		public event EventHandler<AlbumDetailTrackAdapter.ViewHolder.ViewHolderEvent> TrackClick;
		public event EventHandler<AlbumContainer> PlayAlbum;

		void OnPlayAlbum()
		{
			PlayAlbum?.Invoke(this, Album);
		}

		public class AlbumInformationViewHolder : RecyclerView.ViewHolder
		{
			public Album album;
			public TextView albumName;
			public TextView albumArtist;
			public TextView albumSize;
			public Button albumPlayButton;
			public ImageView albumImage;
			public ImageView starButton;
			private Drawable starred, notStarred;

			public AlbumInformationViewHolder(View itemView, Action listener) : base(itemView)
			{
				albumName = itemView.FindViewById<TextView>(Resource.Id.album_name);
				albumSize = itemView.FindViewById<TextView>(Resource.Id.album_size);
				albumPlayButton = itemView.FindViewById<Button>(Resource.Id.album_play_button);
				albumPlayButton.Click += (sender, e) => listener();

				albumImage = itemView.FindViewById<ImageView>(Resource.Id.album_image);
				starButton = itemView.FindViewById<ImageView>(Resource.Id.album_favorite_button);
				starButton.Click += StarButtonClick;
				starred = itemView.Context.GetDrawable(Resource.Drawable.star_g);
				notStarred = itemView.Context.GetDrawable(Resource.Drawable.star_o);
			}

			private void StarButtonClick(object sender, System.EventArgs e)
			{
				if (album.Starred)
				{
					MusicProvider.RemoveStar(album);
				}
				else
				{
					MusicProvider.AddStar(album);
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
					starButton?.SetImageDrawable(album.Starred ? starred : notStarred);
				}
			}
		}

		public class AlbumMetricsViewHolder : RecyclerView.ViewHolder
		{
			public TextView trackCount;
			public TextView playCount;
			public AlbumMetricsViewHolder(View itemView) : base(itemView)
			{
				trackCount = itemView.FindViewById<TextView>(Resource.Id.album_track_count);
				playCount = itemView.FindViewById<TextView>(Resource.Id.album_play_count);
			}
		}

		public class AlbumTracksViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout allTracksListContainer;
			public RecyclerView allTracksRecycleView;
			public AlbumTracksViewHolder(View itemView) : base(itemView)
			{
				allTracksListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.album_tracks_list_container);
				allTracksListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Vertical, false);
				allTracksRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.album_tracks_list);
				allTracksRecycleView.SetLayoutManager(layoutManager);
			}
		}
	}
	
	public class AlbumDetailTrackAdapter : Android.Support.V7.Widget.RecyclerView.Adapter
	{
		public Context context;
		public MusicQueue Songs;

		public AlbumDetailTrackAdapter(MusicQueue songs)
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

			public ViewHolder(View itemView, Action<AlbumDetailTrackAdapter.ViewHolder.ViewHolderEvent> listener) : base(itemView)
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