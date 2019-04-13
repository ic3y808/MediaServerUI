using System;
using Alloy.Helpers;
using Android.Views;
using Android.Widget;
using Alloy.Models;
using Alloy.Providers;

using Alloy.Services;
using Android.App;
using Android.Graphics;
using Android.Graphics.Drawables;
using Android.Support.V7.Widget;

namespace Alloy.Adapters
{
	public class AlbumDetailAdapter : RecyclerView.Adapter
	{
		public Activity Activity { get; }
		public AlbumContainer Album { get; }
		public BackgroundAudioServiceConnection ServiceConnection { get; }

		public AlbumDetailAdapter(Activity activity, AlbumContainer album, BackgroundAudioServiceConnection serviceConnection)
		{
			Album = album;
			Activity = activity;
			ServiceConnection = serviceConnection;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			switch (position)
			{
				case 0:

					if (holder is AlbumInformationViewHolder albumInfoHolder)
					{
						albumInfoHolder.Album = Album.Album;
						albumInfoHolder.AlbumName.SetText(Album.Album.Name, TextView.BufferType.Normal);
						albumInfoHolder.AlbumSize.SetText(Album.Size, TextView.BufferType.Normal);
						albumInfoHolder.ArtistName.SetText(Album.Album.Artist, TextView.BufferType.Normal);
						albumInfoHolder.ItemClick += PlayAlbum;
						Album.Album.GetAlbumArt(albumInfoHolder.AlbumImage);
						albumInfoHolder.CheckStarred();
					}
					break;
				case 1:
					if (holder is AlbumMetricsViewHolder artistMetricsHolder)
					{
						artistMetricsHolder.TrackCount.SetText(Album.Tracks.Count.ToString(), TextView.BufferType.Normal);
						artistMetricsHolder.PlayCount.SetText(Album.TotalPlays.ToString(), TextView.BufferType.Normal);
					}
					break;
				case 2:
					if (holder is AlbumTracksViewHolder albumTracksHolder)
					{
						if (Album.Tracks.Count > 0)
						{
							albumTracksHolder.AllTracksListContainer.Visibility = ViewStates.Visible;
							AlbumDetailTrackAdapter albumTracksAdapter = new AlbumDetailTrackAdapter(Album.Tracks, ServiceConnection);
							BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { albumTracksAdapter.NotifyDataSetChanged(); };
							albumTracksHolder.AllTracksRecycleView?.SetAdapter(albumTracksAdapter);
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
			switch (viewType)
			{
				case 0:
					return new AlbumInformationViewHolder(LayoutInflater.From(parent.Context).Inflate(Resource.Layout.album_detail_album_info, parent, false));
				case 1:
					return new AlbumMetricsViewHolder(LayoutInflater.From(parent.Context).Inflate(Resource.Layout.album_detail_album_metrics, parent, false));
				case 2:
					return new AlbumTracksViewHolder(LayoutInflater.From(parent.Context).Inflate(Resource.Layout.album_detail_album_tracks, parent, false));

			}
			return null;
		}

		public override int ItemCount
		{
			get { return 3; }
		}

		public event EventHandler<AlbumDetailTrackAdapter.ViewHolder.ViewHolderEvent> TrackClick;
		public event EventHandler PlayAlbum;

		public class AlbumInformationViewHolder : RecyclerView.ViewHolder
		{
			public Album Album { get; set; }
			public TextView AlbumName { get; set; }
			public TextView AlbumArtist { get; set; }
			public TextView AlbumSize { get; set; }
			public TextView ArtistName { get; set; }
			public Button AlbumPlayButton { get; set; }
			public ImageView AlbumImage { get; set; }
			public ImageView StarButton { get; set; }
			private Drawable Starred { get; }
			private Drawable NotStarred { get; }
			public event EventHandler ItemClick;

			public AlbumInformationViewHolder(View itemView) : base(itemView)
			{
				AlbumName = itemView.FindViewById<TextView>(Resource.Id.album_name);
				AlbumSize = itemView.FindViewById<TextView>(Resource.Id.album_size);
				ArtistName = itemView.FindViewById<TextView>(Resource.Id.artist_name);
				AlbumPlayButton = itemView.FindViewById<Button>(Resource.Id.album_play_button);
				AlbumPlayButton.Click += (sender, e) => ItemClick?.Invoke(null, null);

				AlbumImage = itemView.FindViewById<ImageView>(Resource.Id.album_image);
				StarButton = itemView.FindViewById<ImageView>(Resource.Id.album_favorite_button);
				StarButton.Click += StarButtonClick;
				Starred = itemView.Context.GetDrawable(Resource.Drawable.star_g);
				NotStarred = itemView.Context.GetDrawable(Resource.Drawable.star_o);
			}

			private void StarButtonClick(object sender, EventArgs e)
			{
				if (Album.Starred)
				{
					MusicProvider.RemoveStar(Album);
				}
				else
				{
					MusicProvider.AddStar(Album);
				}
				CheckStarred();
			}

			public void CheckStarred()
			{
				StarButton?.SetImageDrawable(Album.Starred ? Starred : NotStarred);
			}
		}

		public class AlbumMetricsViewHolder : RecyclerView.ViewHolder
		{
			public TextView TrackCount { get; set; }
			public TextView PlayCount { get; set; }
			public AlbumMetricsViewHolder(View itemView) : base(itemView)
			{
				TrackCount = itemView.FindViewById<TextView>(Resource.Id.album_track_count);
				PlayCount = itemView.FindViewById<TextView>(Resource.Id.album_play_count);
			}
		}

		public class AlbumTracksViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout AllTracksListContainer { get; set; }
			public RecyclerView AllTracksRecycleView { get; set; }
			public AlbumTracksViewHolder(View itemView) : base(itemView)
			{
				AllTracksListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.album_tracks_list_container);
				AllTracksListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Vertical, false);
				AllTracksRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.album_tracks_list);
				AllTracksRecycleView.SetLayoutManager(layoutManager);
			}
		}
	}

	public class AlbumDetailTrackAdapter : RecyclerView.Adapter
	{
		public MusicQueue Songs { get; set; }
		private BackgroundAudioServiceConnection ServiceConnection { get; }

		public AlbumDetailTrackAdapter(MusicQueue songs, BackgroundAudioServiceConnection serviceConnection)
		{
			Songs = songs;
			ServiceConnection = serviceConnection;
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
			h.TrackNo.SetText(Songs[position].No, TextView.BufferType.Normal);
			h.Title.SetText(Songs[position].Title, TextView.BufferType.Normal);
			h.Artist.SetText(Songs[position].Artist, TextView.BufferType.Normal);
			h.SetSelected(position);
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			View view = LayoutInflater.From(parent.Context).Inflate(Resource.Layout.album_detail_song_item, parent, false);
			return new ViewHolder(view, OnClick, ServiceConnection);
		}

		public override int ItemCount => Songs.Count;

		void OnClick(ViewHolder.ViewHolderEvent e)
		{
			ItemClick?.Invoke(this, e);
		}

		public event EventHandler<ViewHolder.ViewHolderEvent> ItemClick;

		public class ViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout RootLayout { get; set; }
			public TextView Title { get; set; }
			public TextView Artist { get; set; }
			public TextView TrackNo { get; set; }
			public MusicQueue Songs { get; set; }
			public BackgroundAudioServiceConnection ServiceConnection { get; set; }

			public ViewHolder(View itemView, Action<ViewHolderEvent> listener, BackgroundAudioServiceConnection serviceConnection) : base(itemView)
			{
				RootLayout = itemView.FindViewById<LinearLayout>(Resource.Id.root_view);
				RootLayout.Click += (sender, e) => listener(new ViewHolderEvent { Position = LayoutPosition, Songs = Songs });
				Title = itemView.FindViewById<TextView>(Resource.Id.title);
				Artist = itemView.FindViewById<TextView>(Resource.Id.artist);
				TrackNo = itemView.FindViewById<TextView>(Resource.Id.trackno);
				ServiceConnection = serviceConnection;
			}

			public void SetSelected(int position)
			{
				if (Songs == null || Songs.Count == 0 || position < 0 || position >= Songs.Count) return;
				bool selected = Songs[position].IsSelected || ServiceConnection != null && ServiceConnection.CurrentSong != null && ServiceConnection.CurrentSong.Id.Equals(Songs[position].Id);

				if (selected)
				{
					RootLayout.SetBackgroundResource(Resource.Color.menu_selection_color);
				}
				else
				{
					RootLayout.SetBackgroundColor(Color.Transparent);
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