using System;
using Alloy.Helpers;
using Android.Views;
using Android.Widget;
using Alloy.Models;
using Alloy.Providers;
using Alloy.Services;
using Android.App;
using Android.Content;
using Android.Graphics;
using Android.Graphics.Drawables;
using Android.Support.V7.Widget;

namespace Alloy.Adapters
{
	public class AlbumDetailAdapter : RecyclerView.Adapter
	{
		private Context context;
		private readonly Activity Activity;
		private readonly AlbumContainer Album;
		private BackgroundAudioServiceConnection serviceConnection;

		public AlbumDetailAdapter(Activity activity, AlbumContainer album, BackgroundAudioServiceConnection serviceConnection)
		{
			Album = album;
			Activity = activity;
			this.serviceConnection = serviceConnection;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			switch (position)
			{
				case 0:

					if (holder is AlbumInformationViewHolder albumInfoHolder)
					{
						albumInfoHolder.album = Album.Album;
						albumInfoHolder.albumName.SetText(Album.Album.Name, TextView.BufferType.Normal);
						albumInfoHolder.albumSize.SetText(Album.Size, TextView.BufferType.Normal);
						albumInfoHolder.artistName.SetText(Album.Album.Artist, TextView.BufferType.Normal);
						Album.Album.GetAlbumArt(albumInfoHolder.albumImage);
						albumInfoHolder.CheckStarred();
					}
					break;
				case 1:
					if (holder is AlbumMetricsViewHolder artistMetricsHolder)
					{
						artistMetricsHolder.trackCount.SetText(Album.Tracks.Count.ToString(), TextView.BufferType.Normal);
						artistMetricsHolder.playCount.SetText(Album.TotalPlays.ToString(), TextView.BufferType.Normal);
					}
					break;
				case 2:
					if (holder is AlbumTracksViewHolder albumTracksHolder)
					{
						if (Album.Tracks.Count > 0)
						{
							albumTracksHolder.allTracksListContainer.Visibility = ViewStates.Visible;
							AlbumDetailTrackAdapter albumTracksAdapter = new AlbumDetailTrackAdapter(Album.Tracks, serviceConnection);
							BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { albumTracksAdapter.NotifyDataSetChanged(); };
							albumTracksHolder.allTracksRecycleView?.SetAdapter(albumTracksAdapter);
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
			public TextView artistName;
			public Button albumPlayButton;
			public ImageView albumImage;
			public ImageView starButton;
			private Drawable starred, notStarred;

			public AlbumInformationViewHolder(View itemView, Action listener) : base(itemView)
			{
				albumName = itemView.FindViewById<TextView>(Resource.Id.album_name);
				albumSize = itemView.FindViewById<TextView>(Resource.Id.album_size);
				artistName = itemView.FindViewById<TextView>(Resource.Id.artist_name);
				albumPlayButton = itemView.FindViewById<Button>(Resource.Id.album_play_button);
				albumPlayButton.Click += (sender, e) => listener();

				albumImage = itemView.FindViewById<ImageView>(Resource.Id.album_image);
				starButton = itemView.FindViewById<ImageView>(Resource.Id.album_favorite_button);
				starButton.Click += StarButtonClick;
				starred = itemView.Context.GetDrawable(Resource.Drawable.star_g);
				notStarred = itemView.Context.GetDrawable(Resource.Drawable.star_o);
			}

			private void StarButtonClick(object sender, EventArgs e)
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

	public class AlbumDetailTrackAdapter : RecyclerView.Adapter
	{
		public Context context;
		public MusicQueue Songs;
		private BackgroundAudioServiceConnection serviceConnection;

		public AlbumDetailTrackAdapter(MusicQueue songs, BackgroundAudioServiceConnection serviceConnection)
		{
			Songs = songs;
			this.serviceConnection = serviceConnection;
			BackgroundAudioServiceConnection.PlaybackStatusChanged += (o, arg) => { NotifyDataSetChanged(); };
		}

		public override long GetItemId(int position)
		{
			return position;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			ViewHolder h = (ViewHolder)holder;
			h.Songs = Songs;
			h.trackNo.SetText(Songs[position].No, TextView.BufferType.Normal);
			h.title.SetText(Songs[position].Title, TextView.BufferType.Normal);
			h.artist.SetText(Songs[position].Artist, TextView.BufferType.Normal);
			h.SetSelected(position);
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			context = parent.Context;
			View view = LayoutInflater.From(context).Inflate(Resource.Layout.album_detail_song_item, parent, false);
			return new ViewHolder(view, OnClick, serviceConnection);
		}

		public override int ItemCount => Songs.Count;

		void OnClick(ViewHolder.ViewHolderEvent e)
		{
			ItemClick?.Invoke(this, e);
		}

		public event EventHandler<ViewHolder.ViewHolderEvent> ItemClick;

		public class ViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout rootLayout;
			public TextView title;
			public TextView artist;
			public TextView trackNo;
			public MusicQueue Songs;
			public BackgroundAudioServiceConnection ServiceConnection;

			public ViewHolder(View itemView, Action<ViewHolderEvent> listener, BackgroundAudioServiceConnection serviceConnection) : base(itemView)
			{
				rootLayout = itemView.FindViewById<LinearLayout>(Resource.Id.root_view);
				rootLayout.Click += (sender, e) => listener(new ViewHolderEvent() { Position = LayoutPosition, Songs = Songs });
				title = itemView.FindViewById<TextView>(Resource.Id.title);
				artist = itemView.FindViewById<TextView>(Resource.Id.artist);
				trackNo = itemView.FindViewById<TextView>(Resource.Id.trackno);
				ServiceConnection = serviceConnection;
			}

			public void SetSelected(int position)
			{
				if (Songs == null || Songs.Count == 0 || position < 0 || position >= Songs.Count) return;
				bool selected = Songs[position].IsSelected || ServiceConnection != null && ServiceConnection.CurrentSong != null && ServiceConnection.CurrentSong.Id.Equals(Songs[position].Id);

				if (selected)
				{
					rootLayout.SetBackgroundResource(Resource.Color.menu_selection_color);
				}
				else
				{
					rootLayout.SetBackgroundColor(Color.Transparent);
				}
			}

			public class ViewHolderEvent
			{
				public int Position { get; set; }
				public MusicQueue Songs { get; set; }
			}
		}
	}
}