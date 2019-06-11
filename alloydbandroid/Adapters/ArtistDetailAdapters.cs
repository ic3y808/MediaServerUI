using System;
using System.Collections.Generic;
using Alloy.Helpers;
using Alloy.Models;
using Alloy.Providers;

using Alloy.Services;
using Android.App;
using Android.Graphics;
using Android.Graphics.Drawables;
using Android.Support.V7.Widget;
using Android.Views;
using Android.Widget;

namespace Alloy.Adapters
{
	public class ArtistDetailAdapter : RecyclerView.Adapter
	{
		private readonly Activity Activity;
		private readonly ArtistContainer Artist;
		private readonly BackgroundAudioServiceConnection ServiceConnection;

		public ArtistDetailAdapter(Activity activity, ArtistContainer artist, BackgroundAudioServiceConnection serviceConnection)
		{
			Artist = artist;
			Activity = activity;
			ServiceConnection = serviceConnection;
			BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { NotifyDataSetChanged(); };
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			switch (position)
			{
				case 0:
					if (holder is ArtistInformationViewHolder artistInfoHolder)
					{
						artistInfoHolder.Artist = Artist.Artist;
						artistInfoHolder.ArtistName.SetText(Artist.Artist.Name, TextView.BufferType.Normal);
						artistInfoHolder.ArtistSize.SetText(Artist.Size, TextView.BufferType.Normal);
						Artist.Artist.GetAlbumArt(artistInfoHolder.ArtistImage);
						artistInfoHolder.CheckStarred();
					}
					break;
				case 1:
					if (holder is ArtistMetricsViewHolder artistMetricsHolder)
					{
						artistMetricsHolder.TrackCount.SetText(Artist.Tracks.Count.ToString(), TextView.BufferType.Normal);
						artistMetricsHolder.PlayCount.SetText(Artist.TotalPlays.ToString(), TextView.BufferType.Normal);
					}

					break;
				case 2:
					if (holder is ArtistAlbumsViewHolder artistAlbumsHolder && Artist.Albums.Count > 0)
					{
						artistAlbumsHolder.AlbumsListContainer.Visibility = ViewStates.Visible;
						ArtistDetailAlbumAdapter artistDetailAlbumsAdapter = new ArtistDetailAlbumAdapter(Artist.Albums, ServiceConnection);
						BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { artistDetailAlbumsAdapter.NotifyDataSetChanged(); };
						artistAlbumsHolder.AlbumRecycleView.SetAdapter(artistDetailAlbumsAdapter);
						artistDetailAlbumsAdapter.ItemClick += AlbumClick;
						Adapters.SetAdapters(Activity, artistDetailAlbumsAdapter);
					}

					break;
				case 3:
					if (holder is ArtistEpsViewHolder artistEpsHolder && Artist.EPs.Count > 0)
					{
						artistEpsHolder.EpsListContainer.Visibility = ViewStates.Visible;
						ArtistDetailAlbumAdapter artistDetailEpsAdapter = new ArtistDetailAlbumAdapter(Artist.EPs, ServiceConnection);
						BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { artistDetailEpsAdapter.NotifyDataSetChanged(); };
						artistEpsHolder.EpsRecycleView.SetAdapter(artistDetailEpsAdapter);
						artistDetailEpsAdapter.ItemClick += AlbumClick;
						Adapters.SetAdapters(Activity, artistDetailEpsAdapter);
					}

					break;
				case 4:
					if (holder is ArtistSinglesViewHolder artistSinglesHolder && Artist.Singles.Count > 0)
					{
						artistSinglesHolder.SinglesListContainer.Visibility = ViewStates.Visible;
						ArtistDetailAlbumAdapter artistDetailSinglesAdapter = new ArtistDetailAlbumAdapter(Artist.Singles, ServiceConnection);
						BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { artistDetailSinglesAdapter.NotifyDataSetChanged(); };
						artistSinglesHolder.SinglesRecycleView.SetAdapter(artistDetailSinglesAdapter);
						artistDetailSinglesAdapter.ItemClick += AlbumClick;
						Adapters.SetAdapters(Activity, artistDetailSinglesAdapter);
					}

					break;
				case 5:
					if (holder is ArtistTopTracksViewHolder artistTopTracksHolder && Artist.PopularTracks.Count > 0)
					{
						artistTopTracksHolder.TopTracksListContainer.Visibility = ViewStates.Visible;
						ArtistDetailTrackAdapter topAdapter = new ArtistDetailTrackAdapter(Artist.PopularTracks, ServiceConnection);
						BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { topAdapter.NotifyDataSetChanged(); };
						artistTopTracksHolder.TopTrackRecycleView.SetAdapter(topAdapter);
						topAdapter.ItemClick += TrackClick;
						Adapters.SetAdapters(Activity, topAdapter);
					}

					break;
				case 6:
					if (holder is ArtistAllTracksViewHolder allTracksHolder && Artist.Tracks.Count > 0)
					{
						allTracksHolder.AllTracksListContainer.Visibility = ViewStates.Visible;
						ArtistDetailTrackAdapter allTracksAdapter = new ArtistDetailTrackAdapter(Artist.Tracks, ServiceConnection);
						BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { allTracksAdapter.NotifyDataSetChanged(); };
						allTracksHolder.AllTracksRecycleView.SetAdapter(allTracksAdapter);
						allTracksAdapter.ItemClick += TrackClick;
						Adapters.SetAdapters(Activity, allTracksAdapter);
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
					return new ArtistInformationViewHolder(LayoutInflater.From(parent.Context).Inflate(Resource.Layout.artist_detail_artist_info, parent, false), OnPlayArtist);
				case 1:
					return new ArtistMetricsViewHolder(LayoutInflater.From(parent.Context).Inflate(Resource.Layout.artist_detail_artist_metrics, parent, false));
				case 2:
					return new ArtistAlbumsViewHolder(LayoutInflater.From(parent.Context).Inflate(Resource.Layout.artist_detail_artist_albums, parent, false));
				case 3:
					return new ArtistEpsViewHolder(LayoutInflater.From(parent.Context).Inflate(Resource.Layout.artist_detail_artist_eps, parent, false));
				case 4:
					return new ArtistSinglesViewHolder(LayoutInflater.From(parent.Context).Inflate(Resource.Layout.artist_detail_artist_singles, parent, false));
				case 5:
					return new ArtistTopTracksViewHolder(LayoutInflater.From(parent.Context).Inflate(Resource.Layout.artist_detail_artist_top, parent, false));
				case 6:
					return new ArtistAllTracksViewHolder(LayoutInflater.From(parent.Context).Inflate(Resource.Layout.artist_detail_artist_all, parent, false));

			}
			return null;
		}

		public override int ItemCount => 7;


		public event EventHandler<ArtistDetailAlbumAdapter.ViewHolder.ViewHolderEvent> AlbumClick;
		public event EventHandler<ArtistDetailTrackAdapter.ViewHolder.ViewHolderEvent> TrackClick;
		public event EventHandler<ArtistContainer> PlayArtist;

		void OnPlayArtist()
		{
			PlayArtist?.Invoke(this, Artist);
		}

		public class ArtistInformationViewHolder : RecyclerView.ViewHolder
		{
			public Artist Artist { get; set; }
			public TextView ArtistName { get; set; }
			public TextView ArtistSize { get; set; }
			public Button ArtistPlayButton { get; set; }
			public ImageView ArtistImage { get; set; }
			public ImageView StarButton { get; set; }
			private Drawable Starred { get; set; }
			private Drawable NotStarred { get; set; }

			public ArtistInformationViewHolder(View itemView, Action listener) : base(itemView)
			{
				ArtistName = itemView.FindViewById<TextView>(Resource.Id.artist_name);
				ArtistSize = itemView.FindViewById<TextView>(Resource.Id.artist_size);
				ArtistPlayButton = itemView.FindViewById<Button>(Resource.Id.artist_play_button);
				ArtistPlayButton.Click += (sender, e) => listener();
				ArtistImage = itemView.FindViewById<ImageView>(Resource.Id.artist_image);
				StarButton = itemView.FindViewById<ImageView>(Resource.Id.artist_favorite_button);
				StarButton.Click += StarButtonClick;
				Starred = itemView.Context.GetDrawable(Resource.Drawable.star_g);
				NotStarred = itemView.Context.GetDrawable(Resource.Drawable.star_o);
			}

			private void StarButtonClick(object sender, EventArgs e)
			{
				if (Artist.Starred)
				{
					MusicProvider.RemoveStar(Artist);
				}
				else
				{
					MusicProvider.AddStar(Artist);
				}
				CheckStarred();
			}

			public void CheckStarred()
			{
				StarButton?.SetImageDrawable(Artist.Starred ? Starred : NotStarred);
			}
		}

		public class ArtistMetricsViewHolder : RecyclerView.ViewHolder
		{
			public TextView TrackCount { get; set; }
			public TextView PlayCount { get; set; }

			public ArtistMetricsViewHolder(View itemView) : base(itemView)
			{
				TrackCount = itemView.FindViewById<TextView>(Resource.Id.artist_track_count);
				PlayCount = itemView.FindViewById<TextView>(Resource.Id.artist_play_count);
			}
		}

		public class ArtistAlbumsViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout AlbumsListContainer { get; set; }
			public RecyclerView AlbumRecycleView { get; set; }
			public ArtistAlbumsViewHolder(View itemView) : base(itemView)
			{
				AlbumsListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.artist_albums_list_container);
				AlbumsListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Horizontal, false);
				AlbumRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.artist_albums_list);
				AlbumRecycleView.SetLayoutManager(layoutManager);
			}
		}

		public class ArtistEpsViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout EpsListContainer { get; set; }
			public RecyclerView EpsRecycleView { get; set; }
			public ArtistEpsViewHolder(View itemView) : base(itemView)
			{
				EpsListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.artist_eps_list_container);
				EpsListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Horizontal, false);
				EpsRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.artist_eps_list);
				EpsRecycleView.SetLayoutManager(layoutManager);
			}
		}

		public class ArtistSinglesViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout SinglesListContainer { get; set; }
			public RecyclerView SinglesRecycleView { get; set; }
			public ArtistSinglesViewHolder(View itemView) : base(itemView)
			{
				SinglesListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.artist_singles_list_container);
				SinglesListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Horizontal, false);
				SinglesRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.artist_singles_list);
				SinglesRecycleView.SetLayoutManager(layoutManager);
			}
		}

		public class ArtistTopTracksViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout TopTracksListContainer { get; set; }
			public RecyclerView TopTrackRecycleView { get; set; }
			public ArtistTopTracksViewHolder(View itemView) : base(itemView)
			{
				TopTracksListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.artist_top_tracks_list_container);
				TopTracksListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Vertical, false);
				TopTrackRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.artist_top_tracks_list);
				TopTrackRecycleView.SetLayoutManager(layoutManager);
			}
		}

		public class ArtistAllTracksViewHolder : RecyclerView.ViewHolder
		{
			public LinearLayout AllTracksListContainer { get; set; }
			public RecyclerView AllTracksRecycleView { get; set; }
			public ArtistAllTracksViewHolder(View itemView) : base(itemView)
			{
				AllTracksListContainer = itemView.FindViewById<LinearLayout>(Resource.Id.artist_all_tracks_list_container);
				AllTracksListContainer.Visibility = ViewStates.Gone;
				LinearLayoutManager layoutManager = new LinearLayoutManager(ItemView.Context, LinearLayoutManager.Vertical, false);
				AllTracksRecycleView = itemView.FindViewById<RecyclerView>(Resource.Id.artist_all_tracks_list);
				AllTracksRecycleView.SetLayoutManager(layoutManager);
			}
		}
	}

	public class ArtistDetailAlbumAdapter : RecyclerView.Adapter
	{
		public List<Album> Albums { get; set; }
		private BackgroundAudioServiceConnection ServiceConnection { get; set; }

		public ArtistDetailAlbumAdapter(List<Album> albums, BackgroundAudioServiceConnection serviceConnection)
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
			View view = LayoutInflater.From(parent.Context).Inflate(Resource.Layout.artist_detail_album_item, parent, false);
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
				BackgroundAudioServiceConnection.PlaybackStatusChanged += (o, e) =>
				{
					SetSelected();
				};
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

			public class ViewHolderEvent
			{
				public int Position { get; set; }
				public Album Album { get; set; }
			}
		}
	}

	public class ArtistDetailTrackAdapter : RecyclerView.Adapter
	{
		public MusicQueue Songs { get; set; }
		private BackgroundAudioServiceConnection ServiceConnection { get; set; }

		public ArtistDetailTrackAdapter(MusicQueue songs, BackgroundAudioServiceConnection serviceConnection)
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
			h.SetSelected(position);
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			View view = LayoutInflater.From(parent.Context).Inflate(Resource.Layout.artist_detail_song_item, parent, false);
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
			public LinearLayout ItemRoot { get; set; }
			public ImageView Image { get; set; }
			public TextView Title { get; set; }
			public TextView Album { get; set; }
			public MusicQueue Songs { get; set; }
			public bool Configured { get; set; }
			private BackgroundAudioServiceConnection ServiceConnection { get; }

			public ViewHolder(View itemView, Action<ViewHolderEvent> listener, BackgroundAudioServiceConnection serviceConnection) : base(itemView)
			{
				ItemRoot = itemView.FindViewById<LinearLayout>(Resource.Id.item_root);
				Image = itemView.FindViewById<ImageView>(Resource.Id.image_view);
				Title = itemView.FindViewById<TextView>(Resource.Id.title);
				Album = itemView.FindViewById<TextView>(Resource.Id.album);
				ServiceConnection = serviceConnection;
				itemView.Click += (sender, e) => listener(new ViewHolderEvent { Position = LayoutPosition, Songs = Songs });
				BackgroundAudioServiceConnection.PlaybackStatusChanged += (o, e) => { SetSelected(LayoutPosition); };
			}

			public void SetSelected(int position)
			{
				if (Songs == null || Songs.Count == 0 || position < 0 || position >= Songs.Count) return;
				bool selected = Songs[position].IsSelected || ServiceConnection != null && ServiceConnection.CurrentSong != null && ServiceConnection.CurrentSong.Id.Equals(Songs[position].Id);

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
				public MusicQueue Songs { get; set; }
			}
		}
	}
}