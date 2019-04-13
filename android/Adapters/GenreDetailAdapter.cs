using System;
using Android.App;
using Android.Graphics;
using Android.Views;
using Android.Widget;
using Alloy.Helpers;
using Alloy.Models;
using Alloy.Providers;
using Alloy.Services;
using Android.Graphics.Drawables;
using Android.Support.V7.Widget;

namespace Alloy.Adapters
{
	class GenreDetailAdapter : RecyclerView.Adapter
	{
		private readonly Activity Activity;
		private readonly GenreContainer Genre;
		private readonly BackgroundAudioServiceConnection ServiceConnection;


		public GenreDetailAdapter(Activity activity, GenreContainer genre, BackgroundAudioServiceConnection serviceConnection)
		{
			Genre = genre;
			Activity = activity;
			ServiceConnection = serviceConnection;
			BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { NotifyDataSetChanged(); };
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			switch (position)
			{
				case 0:
					if (holder is GenreInformationViewHolder genreInfoHolder)
					{
						genreInfoHolder.Genre = Genre.Genre;
						genreInfoHolder.GenreName.SetText(Genre.Genre.Name, TextView.BufferType.Normal);
						genreInfoHolder.GenreSize.SetText(Genre.Size, TextView.BufferType.Normal);
						Genre.Genre.GetAlbumArt(genreInfoHolder.GenreImage);
						genreInfoHolder.CheckStarred();
					}
					break;
				case 1:
					if (holder is GenreMetricsViewHolder genreMetricsHolder)
					{
						genreMetricsHolder.TrackCount.SetText(Genre.Tracks.Count.ToString(), TextView.BufferType.Normal);
						genreMetricsHolder.PlayCount.SetText(Genre.TotalPlays.ToString(), TextView.BufferType.Normal);
					}
					break;
				case 2:
					if (holder is GenreTracksViewHolder genreTracksHolder)
					{
						if (Genre.Tracks.Count > 0)
						{
							genreTracksHolder.GenreTracksListContainer.Visibility = ViewStates.Visible;
							GenreDetailTrackAdapter genreTracksAdapter = new GenreDetailTrackAdapter(Genre.Tracks, ServiceConnection);
							BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { genreTracksAdapter.NotifyDataSetChanged(); };
							genreTracksHolder.GenreTracksRecycleView?.SetAdapter(genreTracksAdapter);
							genreTracksAdapter.ItemClick += TrackClick;
							Adapters.SetAdapters(Activity, genreTracksAdapter);
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
					return new GenreInformationViewHolder(LayoutInflater.From(parent.Context).Inflate(Resource.Layout.genre_detail_genre_info, parent, false));
				case 1:
					return new GenreMetricsViewHolder(LayoutInflater.From(parent.Context).Inflate(Resource.Layout.genre_detail_genre_metrics, parent, false));
				case 2:
					return new GenreTracksViewHolder(LayoutInflater.From(parent.Context).Inflate(Resource.Layout.genre_detail_genre_tracks, parent, false));

			}
			return null;
		}

		public override int ItemCount
		{
			get { return 3; }
		}

		public event EventHandler<GenreDetailTrackAdapter.ViewHolder.ViewHolderEvent> TrackClick;

		public class GenreInformationViewHolder : RecyclerView.ViewHolder
		{
			public Genre Genre { get; set; }
			public TextView GenreName { get; set; }
			public TextView GenreSize { get; set; }
			public Button GenrePlayButton { get; set; }
			public ImageView GenreImage { get; set; }
			public ImageView StarButton { get; set; }
			private Drawable Starred { get; set; }
			private Drawable NotStarred { get; set; }

			public GenreInformationViewHolder(View itemView) : base(itemView)
			{
				GenreName = itemView.FindViewById<TextView>(Resource.Id.genre_name);
				GenreSize = itemView.FindViewById<TextView>(Resource.Id.genre_size);
				GenrePlayButton = itemView.FindViewById<Button>(Resource.Id.genre_play_button);
				GenrePlayButton.Click += (sender, e) => ItemClick?.Invoke(null,null);
				GenreImage = itemView.FindViewById<ImageView>(Resource.Id.genre_image);
				StarButton = itemView.FindViewById<ImageView>(Resource.Id.genre_star_button);
				StarButton.Click += StarButtonClick;
				Starred = itemView.Context.GetDrawable(Resource.Drawable.star_g);
				NotStarred = itemView.Context.GetDrawable(Resource.Drawable.star_o);
			}

			public event EventHandler ItemClick;

			private void StarButtonClick(object sender, EventArgs e)
			{
				if (Genre.Starred)
				{
					MusicProvider.RemoveStar(Genre);
				}
				else
				{
					MusicProvider.AddStar(Genre);
				}
				CheckStarred();
			}

			public void CheckStarred()
			{
				StarButton?.SetImageDrawable(Genre.Starred ? Starred : NotStarred);
			}
		}

		public class GenreMetricsViewHolder : RecyclerView.ViewHolder
		{
			public TextView TrackCount { get; set; }
			public TextView PlayCount { get; set; }

			public GenreMetricsViewHolder(View itemView) : base(itemView)
			{
				TrackCount = itemView.FindViewById<TextView>(Resource.Id.genre_track_count);
				PlayCount = itemView.FindViewById<TextView>(Resource.Id.genre_play_count);
			}
		}

		public class GenreTracksViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout GenreTracksListContainer { get; set; }
			public RecyclerView GenreTracksRecycleView { get; set; }
			public GenreTracksViewHolder(View itemView) : base(itemView)
			{
				GenreTracksListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.genre_tracks_list_container);
				GenreTracksListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Vertical, false);
				GenreTracksRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.genre_tracks_list);
				GenreTracksRecycleView.SetLayoutManager(layoutManager);
			}
		}
	}

	public class GenreDetailTrackAdapter : RecyclerView.Adapter
	{
		public MusicQueue Songs { get; set; }
		private BackgroundAudioServiceConnection ServiceConnection { get; }

		public GenreDetailTrackAdapter(MusicQueue songs, BackgroundAudioServiceConnection serviceConnection)
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
			View view = LayoutInflater.From(parent.Context).Inflate(Resource.Layout.genre_detail_song_item, parent, false);
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
				bool selected = Songs[position].IsSelected || ServiceConnection?.CurrentSong != null && ServiceConnection.CurrentSong.Id.Equals(Songs[position].Id);

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