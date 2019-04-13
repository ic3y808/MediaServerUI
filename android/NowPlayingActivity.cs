using System;
using System.Linq;
using System.Timers;
using Android.App;
using Android.Content;
using Android.Content.PM;
using Android.Gms.Cast.Framework.Media;
using Android.Graphics;
using Android.Graphics.Drawables;
using Android.OS;
using Android.Support.V7.Widget;
using Android.Views;
using Android.Views.Animations;
using Android.Widget;
using Microsoft.AppCenter.Crashes;
using Alloy.Adapters;
using Alloy.Helpers;
using Alloy.Models;
using Alloy.Providers;
using Alloy.Services;
using Android.Gms.Cast;
using Extensions = Alloy.Helpers.Extensions;

namespace Alloy
{
	[Activity(Label = "Alloy", LaunchMode = LaunchMode.SingleTask)]
	public class NowPlayingActivity : Activity, RemoteMediaClient.IProgressListener, RecyclerView.IOnChildAttachStateChangeListener
	{
		private TextView artistTextView;
		private readonly int backgroundContrast = 200;
		private TextView durationTextView;
		private ImageView favoritesButton;
		private ImageButton nextImageButton;
		private NowPlayingAdapter nowPlayingAdapter;
		private LinearLayoutManager nowPlayingLayoutManager;
		private RecyclerView nowPlayingList;
		private ImageButton playPauseImageButton;
		private ImageButton previousImageButton;
		private SeekBar seekBar;
		private BackgroundAudioServiceConnection serviceConnection;
		private TextView titleTextView;
		private Timer updateTimer;
		private CurrentBackground currentBackground;
		private ImageView primaryBackground;
		private ImageView secondaryBackground;

		protected override void OnCreate(Bundle savedInstanceState)
		{
			base.OnCreate(savedInstanceState);
			SetContentView(Resource.Layout.now_playing_layout);

			nowPlayingList = FindViewById<RecyclerView>(Resource.Id.current_queue);
			nowPlayingList.HasFixedSize = true;
			nowPlayingLayoutManager = new LinearLayoutManager(Application.Context, 0, false) { AutoMeasureEnabled = false };
			nowPlayingList.SetLayoutManager(nowPlayingLayoutManager);
			nowPlayingList.SetItemAnimator(new DefaultItemAnimator());
			nowPlayingList.FocusableInTouchMode = true;
			nowPlayingList.ScrollChange += NowPlayingList_ScrollChange;

			nowPlayingList.AddOnChildAttachStateChangeListener(this);

			PageHelper helper = new PageHelper();
			helper.AttachToRecyclerView(nowPlayingList);

			primaryBackground = FindViewById<ImageView>(Resource.Id.primary_background);
			secondaryBackground = FindViewById<ImageView>(Resource.Id.secondary_background);

			playPauseImageButton = (ImageButton)FindViewById(Resource.Id.play_pause_button);
			playPauseImageButton.Click += PlayPauseImageButton_Click;
			playPauseImageButton.Enabled = true;

			nextImageButton = (ImageButton)FindViewById(Resource.Id.next_button);
			nextImageButton.Click += NextImageButton_Click;
			nextImageButton.Enabled = true;

			previousImageButton = (ImageButton)FindViewById(Resource.Id.previous_button);
			previousImageButton.Click += PreviousImageButton_Click;
			previousImageButton.Enabled = true;

			favoritesButton = (ImageView)FindViewById(Resource.Id.favorite_button);
			favoritesButton.Click += StarButton_Click;
			favoritesButton.Enabled = true;

			seekBar = (SeekBar)FindViewById(Resource.Id.seekBar);
			seekBar.ProgressChanged += SeekBar_ProgressChanged;

			artistTextView = FindViewById<TextView>(Resource.Id.artist);
			if (artistTextView != null) artistTextView.Selected = true;

			titleTextView = FindViewById<TextView>(Resource.Id.title);
			if (titleTextView != null) titleTextView.Selected = true;

			durationTextView = FindViewById<TextView>(Resource.Id.duration);

			currentBackground = CurrentBackground.None;

			updateTimer = new Timer(500);
			updateTimer.Elapsed += UpdateTimer_Elapsed;
		}

		public override void OnBackPressed()
		{
			updateTimer.Stop();
			updateTimer.Elapsed -= UpdateTimer_Elapsed;
			BackgroundAudioServiceConnection.PlaybackStatusChanged -= BackgroundAudioServiceConnection_PlaybackStatusChanged;
			UnbindService();
			Intent intent = new Intent(Application.Context, typeof(MainActivity));
			StartActivity(intent);
			base.OnBackPressed();
		}

		protected override void OnResume()
		{
			base.OnResume();
			BindService();
		}

		protected override void OnPause()
		{
			updateTimer.Stop();
			updateTimer.Elapsed -= UpdateTimer_Elapsed;
			BackgroundAudioServiceConnection.PlaybackStatusChanged -= BackgroundAudioServiceConnection_PlaybackStatusChanged;
			UnbindService();
			base.OnPause();
		}

		protected override void OnDestroy()
		{
			updateTimer.Stop();
			updateTimer.Elapsed -= UpdateTimer_Elapsed;
			BackgroundAudioServiceConnection.PlaybackStatusChanged -= BackgroundAudioServiceConnection_PlaybackStatusChanged;
			UnbindService();
			base.OnDestroy();
		}

		protected override void OnStop()
		{
			updateTimer.Stop();
			updateTimer.Elapsed -= UpdateTimer_Elapsed;
			BackgroundAudioServiceConnection.PlaybackStatusChanged -= BackgroundAudioServiceConnection_PlaybackStatusChanged;
			UnbindService();
			base.OnStop();
		}

		private void BindService()
		{
			if (serviceConnection == null)
			{
				serviceConnection = new BackgroundAudioServiceConnection();
				serviceConnection.ServiceConnected += ServiceConnection_ServiceConnected;
				Intent serviceToStart = new Intent(Application.Context, typeof(BackgroundAudioService));
				BindService(serviceToStart, serviceConnection, Bind.AutoCreate);
			}

			if (nowPlayingAdapter == null)
			{
				nowPlayingAdapter = new NowPlayingAdapter(serviceConnection);
				nowPlayingAdapter.ItemClick += OnItemClick;
				nowPlayingList.SetAdapter(nowPlayingAdapter);
			}

			if (serviceConnection != null && serviceConnection.IsConnected)
			{
				ServiceConnection_ServiceConnected(null, true);
			}

		}

		private void UnbindService()
		{
			if (serviceConnection != null && serviceConnection.IsConnected)
			{
				serviceConnection.Remote?.RemoveProgressListener(this);
				UnbindService(serviceConnection);
				serviceConnection = null;
			}
		}

		private void BackgroundAudioServiceConnection_PlaybackStatusChanged(object sender, StatusEventArg e)
		{
			ScrollToNowPlaying();
			SetPlaying();
			SetFavorite();
			UpdateColors();
			UpdateInfo();
		}

		private void ServiceConnection_ServiceConnected(object sender, bool e)
		{
			if (!e) return;
			BackgroundAudioServiceConnection.PlaybackStatusChanged += BackgroundAudioServiceConnection_PlaybackStatusChanged;
			if (serviceConnection.Remote != null)
			{
				serviceConnection.Remote.AddProgressListener(this, 500);
			}
			else
			{
				updateTimer = new Timer(500);
				updateTimer.Elapsed += UpdateTimer_Elapsed;
				updateTimer.Start();
			}

			SetPlaying();
			SetFavorite();
			ScrollToNowPlaying();
			UpdateColors();
			UpdateInfo();
		}

		private void NowPlayingList_ScrollChange(object sender, View.ScrollChangeEventArgs e)
		{
			try
			{
				if (serviceConnection == null || !serviceConnection.IsConnected || serviceConnection.CurrentSong == null) return;

				int item = nowPlayingLayoutManager.FindFirstCompletelyVisibleItemPosition();
				if (item < 0) return;
				if (item >= serviceConnection.MainQueue.Count - 1) serviceConnection.MainQueue.GetMoreData();
				int index = serviceConnection.MainQueue.IndexOf(serviceConnection.CurrentSong);

				if (item == index) return;
				if (item < index)
				{
					ScrollTo(serviceConnection.GetPreviousSong());
				}
				else if (item > index)
				{
					ScrollTo(serviceConnection.GetNextSong());
				}
				Utils.Run(() =>
				{
					if (item < index)
						serviceConnection.PlayPreviousSong();
					else if (item > index) serviceConnection.PlayNextSong();
				});
			}
			catch (Exception ee) { Crashes.TrackError(ee); }
		}

		private void SetBackground(Song song = null)
		{
			try
			{
				Utils.Run(new Action(() =>
				{

					Animation fadeOut = AnimationUtils.LoadAnimation(Application.Context, Android.Resource.Animation.FadeOut);
					fadeOut.Duration = 3000;
					Animation fadeIn = AnimationUtils.LoadAnimation(Application.Context, Android.Resource.Animation.FadeIn);
					fadeIn.Duration = 3000;

					if (serviceConnection == null || !serviceConnection.IsConnected) return;
					Bitmap newArt = song == null ? serviceConnection.CurrentSong.GetAlbumArt().Blur() : song.GetAlbumArt().Blur();

					fadeOut.AnimationEnd += (o, e) =>
					{
						switch (currentBackground)
						{
							case CurrentBackground.None:
								currentBackground = CurrentBackground.Primary;
								break;
							case CurrentBackground.Primary:
								if (primaryBackground.Background != null)
								{
									BitmapDrawable a = primaryBackground.Background as BitmapDrawable;
									a?.Bitmap?.Recycle();
									a?.Bitmap?.Dispose();
									primaryBackground?.Background?.Dispose();
									primaryBackground.Background = null;
								}
								currentBackground = CurrentBackground.Secondary;
								break;
							case CurrentBackground.Secondary:
								if (secondaryBackground.Background != null)
								{
									BitmapDrawable a = secondaryBackground.Background as BitmapDrawable;
									a?.Bitmap?.Recycle();
									a?.Bitmap?.Dispose();
									secondaryBackground?.Background?.Dispose();
									secondaryBackground.Background = null;
								}
								currentBackground = CurrentBackground.Primary;
								break;
						}
					};

					fadeIn.AnimationEnd += (o, e) =>
					{
						System.GC.Collect();
					};

					RunOnUiThread(new Action(() =>
					{
						switch (currentBackground)
						{
							case CurrentBackground.None:

								primaryBackground.Background = new BitmapDrawable(Application.Context.Resources, newArt);
								primaryBackground.StartAnimation(fadeIn);
								secondaryBackground.StartAnimation(fadeOut);
								break;
							case CurrentBackground.Primary:
								secondaryBackground.Background = new BitmapDrawable(Application.Context.Resources, newArt);
								primaryBackground.StartAnimation(fadeOut);
								secondaryBackground.StartAnimation(fadeIn);
								break;
							case CurrentBackground.Secondary:
								primaryBackground.Background = new BitmapDrawable(Application.Context.Resources, newArt);
								primaryBackground.StartAnimation(fadeIn);
								secondaryBackground.StartAnimation(fadeOut);
								break;
						}
					}));
				}));
			}
			catch (Exception ee) { Crashes.TrackError(ee); }
		}

		private void ScrollToNowPlaying()
		{
			try
			{
				if (serviceConnection == null || !serviceConnection.IsConnected || serviceConnection.CurrentSong == null) return;
				int index = serviceConnection.MainQueue.IndexOf(serviceConnection.CurrentSong);
				if (index >= 0) nowPlayingLayoutManager.ScrollToPosition(index);

				foreach (MediaQueueItem item in serviceConnection.MainQueue.MediaQueue)
				{
					if (!serviceConnection.CurrentSong.QueueItem().ItemId.Equals(item.ItemId)) continue;
					nowPlayingLayoutManager.ScrollToPosition(index);
					break;
				}

			}
			catch (Exception ee) { Crashes.TrackError(ee); }
			SetBackground();
		}

		private void ScrollTo(Song song)
		{
			try
			{
				if (serviceConnection == null || !serviceConnection.IsConnected || serviceConnection.CurrentSong == null) return;
				int index = serviceConnection.MainQueue.IndexOf(song);
				if (index >= 0) nowPlayingLayoutManager.ScrollToPosition(index);
				SetBackground(song);
				UpdateColors(song);
				UpdateInfo(song);
			}
			catch (Exception ee) { Crashes.TrackError(ee); }
		}

		private void OnItemClick(object sender, NowPlayingViewHolderEvent e)
		{
		}

		public bool Closer(float a, float b)
		{
			float diff = b - a;
			return diff > 0.5f;
		}

		private void UpdateColors(Song song = null)
		{
			try
			{
				Drawable thumb = seekBar.Thumb;
				Color color = Color.White;
				Color contrasting = Color.Black;
				Color textContrasting = Color.Black;

				if (song != null)
				{
					Bitmap art = song.GetAlbumArt();
					color = Extensions.GetDominateColor(art);
					contrasting = color.Contrasting(backgroundContrast);
				}
				else if (serviceConnection == null || !serviceConnection.IsConnected || serviceConnection.CurrentSong == null) { return; }
				else
				{
					color = Extensions.GetDominateColor(serviceConnection.CurrentSong.Art);
					contrasting = color.Contrasting(backgroundContrast);
				}

				bool closer = Closer(contrasting.GetBrightness(), 1.0f);

				textContrasting = closer ? Color.Black : Color.White;

				seekBar.ProgressDrawable = new ColorDrawable(color);
				thumb.SetColorFilter(textContrasting, PorterDuff.Mode.SrcAtop);
				playPauseImageButton.SetColorFilter(color, PorterDuff.Mode.Multiply);
				previousImageButton.SetColorFilter(color, PorterDuff.Mode.Multiply);
				nextImageButton.SetColorFilter(color, PorterDuff.Mode.Multiply);
				favoritesButton.SetColorFilter(color, PorterDuff.Mode.Multiply);
				titleTextView.SetBackgroundColor(color);
				titleTextView.SetTextColor(textContrasting);
				artistTextView.SetBackgroundColor(color);
				artistTextView.SetTextColor(textContrasting);
				durationTextView.SetBackgroundColor(color);
				durationTextView.SetTextColor(textContrasting);
			}
			catch (Exception ee) { Crashes.TrackError(ee); }
		}

		private void UpdateInfo(Song song = null)
		{
			try
			{
				string title = "";
				string artist = "";
				string duration = "";
				if (serviceConnection?.Remote != null)
				{
					//serviceConnection.Remote.MediaInfo.Metadata.
					title = "";
					artist = "";
					duration = "00:00 / fix me";
				}
				else if (song != null)
				{
					title = song.Title;
					artist = song.Artist;
					duration = "00:00 / " + serviceConnection.CurrentSong.Duration.ToTimeFromSeconds();
				}
				else if (serviceConnection == null || !serviceConnection.IsConnected || serviceConnection.CurrentSong == null) { return; }
				else
				{
					title = serviceConnection.CurrentSong.Title;
					artist = serviceConnection.CurrentSong.Artist;
					if (serviceConnection.Remote != null)
					{
						duration = serviceConnection.Remote.ApproximateStreamPosition.ToTime() + " / " + serviceConnection.Remote.StreamDuration.ToTime();
					}
					else if (serviceConnection.MediaPlayer != null)
					{
						duration = serviceConnection.MediaPlayer.CurrentPosition.ToTime() + " / " + serviceConnection.CurrentSong.Duration.ToTimeFromSeconds();
					}

				}

				titleTextView?.SetText(title, TextView.BufferType.Normal);
				artistTextView?.SetText(artist, TextView.BufferType.Normal);
				durationTextView?.SetText(duration, TextView.BufferType.Normal);
			}
			catch (Exception ee) { Crashes.TrackError(ee); }
		}

		private void StarButton_Click(object sender, EventArgs e)
		{
			Utils.Run(() =>
			{
				if (serviceConnection == null || !serviceConnection.IsConnected || serviceConnection.CurrentSong == null) return;

				if (serviceConnection.CurrentSong.Starred)
				{
					MusicProvider.RemoveStar(serviceConnection.CurrentSong);
				}
				else
				{
					MusicProvider.AddStar(serviceConnection.CurrentSong);
				}
				serviceConnection.CurrentSong.Starred = !serviceConnection.CurrentSong.Starred;

				SetFavorite();
			});
		}

		private void UpdateTimer_Elapsed(object sender, ElapsedEventArgs e)
		{
			if (serviceConnection == null || !serviceConnection.IsConnected) return;
			if (serviceConnection.MediaPlayer != null)
			{
				int val = serviceConnection.MediaPlayer.CurrentPosition.GetProgressPercentage(serviceConnection.MediaPlayer.Duration);
				RunOnUiThread(() =>
				{
					seekBar.Progress = val;
					UpdateInfo();
				});
			}
		}

		private void SeekBar_ProgressChanged(object sender, SeekBar.ProgressChangedEventArgs e)
		{
			if (!e.FromUser || !serviceConnection.IsConnected) return;
			if (serviceConnection.Remote != null)
			{
				serviceConnection.Remote.Seek(e.Progress.ProgressToTimer((int)serviceConnection.Remote.StreamDuration));
			}
			else if (serviceConnection.MediaPlayer != null)
			{
				int time = e.Progress.ProgressToTimer(serviceConnection.MediaPlayer.Duration);
				serviceConnection.MediaPlayer.SeekTo(time);
			}

		}

		public void SetPlaying()
		{
			if (serviceConnection == null || !serviceConnection.IsConnected) return;
			if (serviceConnection.Remote != null)
			{
				if (serviceConnection.Remote.IsPlaying)
					playPauseImageButton?.SetImageResource(Resource.Drawable.pause);
				else
					playPauseImageButton?.SetImageResource(Resource.Drawable.play);
			}
			else if (serviceConnection.MediaPlayer != null)
			{
				if (serviceConnection.MediaPlayer.IsPlaying)
					playPauseImageButton?.SetImageResource(Resource.Drawable.pause);
				else
					playPauseImageButton?.SetImageResource(Resource.Drawable.play);
			}

		}

		private void PlayPauseImageButton_Click(object sender, EventArgs e)
		{
			if (serviceConnection == null || !serviceConnection.IsConnected) return;
			if (serviceConnection.Remote != null)
			{
				if (serviceConnection.Remote.IsPlaying)
					serviceConnection.Pause();
				else
					serviceConnection.Play();
			}
			else if (serviceConnection.MediaPlayer != null)
			{

				if (serviceConnection.MediaPlayer.IsPlaying)
					serviceConnection.Pause();
				else
					serviceConnection.Play();
			}


			SetPlaying();
		}

		private void PreviousImageButton_Click(object sender, EventArgs e)
		{
			if (serviceConnection == null || !serviceConnection.IsConnected) return;
			if (serviceConnection.CurrentSong != null)
				ScrollTo(serviceConnection.GetPreviousSong());
			if (serviceConnection.Remote != null)
			{
				if (serviceConnection.Remote.IsPlaying)
					serviceConnection.PlayPreviousSong();
			}
			else if (serviceConnection.MediaPlayer != null)
			{
				if (serviceConnection.MediaPlayer.IsPlaying)
					Utils.Run(() => { serviceConnection.PlayPreviousSong(); });
			}
		}

		private void NextImageButton_Click(object sender, EventArgs e)
		{
			if (serviceConnection == null || !serviceConnection.IsConnected) return;
			if (serviceConnection.CurrentSong != null)
				ScrollTo(serviceConnection.GetNextSong());
			if (serviceConnection.Remote != null)
			{
				if (serviceConnection.Remote.IsPlaying)
					serviceConnection.PlayNextSong();
			}
			else if (serviceConnection.MediaPlayer != null)
			{
				if (serviceConnection.MediaPlayer.IsPlaying)
					Utils.Run(() => { serviceConnection.PlayNextSong(); });
			}
		}

		private void SetFavorite()
		{
			favoritesButton.SetImageResource(Resource.Drawable.star_o);
			if (serviceConnection == null || !serviceConnection.IsConnected || serviceConnection.CurrentSong == null) return;
			if (serviceConnection.CurrentSong.Starred) favoritesButton.SetImageResource(Resource.Drawable.favorite);
		}

		public void OnProgressUpdated(long progressMs, long durationMs)
		{
			if (serviceConnection == null || !serviceConnection.IsConnected) return;
			if (serviceConnection.Remote != null)
			{
				int val = progressMs.GetProgressPercentage(durationMs);
				RunOnUiThread(() =>
				{
					seekBar.Progress = (int)val;
					UpdateInfo();
				});
			}
		}

		public void OnChildViewAttachedToWindow(View view)
		{
			//VideoView video_view = view.FindViewById<VideoView>(Resource.Id.video_view);
			//if (video_view != null)
			//{
			//	video_view.Start();
			//}
		}

		public void OnChildViewDetachedFromWindow(View view)
		{
			//VideoView video_view = view.FindViewById<VideoView>(Resource.Id.video_view);
			//if (video_view != null)
			//{
			//	video_view.Pause();
			//}
		}
	}
}