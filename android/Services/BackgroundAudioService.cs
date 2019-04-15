using System;
using Android.App;
using Android.Bluetooth;
using Android.Content;
using Android.Media;
using Android.OS;
using Android.Support.V4.Media.Session;
using Microsoft.AppCenter.Crashes;
using Alloy.Helpers;
using Alloy.Interfaces;
using Alloy.Models;
using Alloy.Recievers;
using Alloy.Providers;

namespace Alloy.Services
{
	[Service]
	[IntentFilter(new[] { ActionPlayNew, ActionPlayPause, ActionPrevious, ActionNext, ActionUpdateMetaData, ActionStarTrack, ActionExit })]
	public class BackgroundAudioService : Service, AudioManager.IOnAudioFocusChangeListener, IMediaController
	{
		public const string ActionPlayNew = "com.xamarin.action.PLAY_NEW";
		public const string ActionPlayPause = "com.xamarin.action.PLAY_PAUSE";
		public const string ActionStarTrack = "com.xamarin.action.STAR_TRACK";
		public const string ActionNext = "com.xamarin.action.NEXT";
		public const string ActionPrevious = "com.xamarin.action.PREVIOUS";
		public const string ActionExit = "com.xamarin.action.EXIT";
		public const string ActionUpdateMetaData = "com.xamarin.action.UPDATE_META";

		public event EventHandler<StatusEventArg> PlaybackStatusChanged;

		public Queue MainQueue { get; set; }
		public NotificationService NotificationService1 { get; set; }
		public MediaSessionCompat MediaSession { get; set; }

		private NoisyAudioReciever noisyReceiver;
		private HeadsetPlugReceiver headsetPlugReceiver;
		private MediaButtonReciever mediaButtonReciever;
		private Song currentSong;
		private long pausedPosition;
		public const string CHANNEL_ID = "mediaStateBuilder";
		public const string MEDIA_NAME = "Media playback";
		public const string MEDIA_CHANNEL_DESCRIPTION = "Media playback controls";
		public const int NOTIFICATION_ID = 165164465;
		private bool loading;

		public Song CurrentSong
		{
			get => currentSong;
			set
			{
				currentSong = value;
				currentSong.IsSelected = true;
			}
		}

		public IBinder Binder { get; private set; }

		public override IBinder OnBind(Intent intent)
		{
			Binder = new BackgroundAudioServiceBinder(this);
			return Binder;
		}

		public override void OnCreate()
		{
			base.OnCreate();
			MainQueue = null;
			NotificationService1 = new NotificationService(this);
			InitMediaPlayer();
			InitBluetoothReceiver();
			InitMediaButtonReceiver();
			InitHeadsetPlugReceiver();
			InitMediaSession();
			Reset();
		}

		public override void OnDestroy()
		{
			base.OnDestroy();
			if (mediaButtonReciever != null) UnregisterReceiver(mediaButtonReciever);
			if (headsetPlugReceiver != null) UnregisterReceiver(headsetPlugReceiver);
			if (noisyReceiver != null) UnregisterReceiver(noisyReceiver);
			Services.NotificationService.CloseNotification();
		}

		public void RequestAudioFocus()
		{
			AudioAttributes mPlaybackAttributes = new AudioAttributes.Builder()
				.SetUsage(AudioUsageKind.Media)
				.SetContentType(AudioContentType.Music)
				.Build();
			AudioFocusRequestClass mFocusRequest = new AudioFocusRequestClass.Builder(AudioFocus.Gain)
				.SetAudioAttributes(mPlaybackAttributes)
				.SetAcceptsDelayedFocusGain(true)
				.SetOnAudioFocusChangeListener(this)
				.Build();
			AudioFocusRequest res = ((AudioManager)GetSystemService(AudioService)).RequestAudioFocus(mFocusRequest);

			switch (res)
			{
				case AudioFocusRequest.Delayed:
					break;
				case AudioFocusRequest.Failed:
					break;
				case AudioFocusRequest.Granted:
					break;
			}
		}

		public void OnAudioFocusChange(AudioFocus focusChange)
		{
			switch (focusChange)
			{
				case AudioFocus.Loss:
					{
						if (MediaPlayer != null && MediaPlayer.IsPlaying) Pause();
						break;
					}
				case AudioFocus.LossTransient:
					{
						if (MediaPlayer != null && MediaPlayer.IsPlaying) Pause();

						break;
					}
				case AudioFocus.LossTransientCanDuck:
					{
						MediaPlayer?.SetVolume(0.3f, 0.3f);
						break;
					}
				case AudioFocus.Gain:
					{
						if (MediaPlayer != null && !MediaPlayer.IsPlaying)
						{
							Play();
							MediaPlayer.SetVolume(1.0f, 1.0f);
						}

						break;
					}
			}
		}

		public void Play()
		{
			try
			{
				MediaPlayer.Start();
				MediaPlayer.SeekTo((int)pausedPosition);

				NotificationService1.ShowNotification();
				RequestAudioFocus();
				PlaybackStatusChanged?.Invoke(this, new StatusEventArg { CurrentSong = CurrentSong, Status = BackgroundAudioStatus.Loading });
			}
			catch (Exception e)
			{
				System.Diagnostics.Debug.WriteLine(e);
				Crashes.TrackError(e);
			}
		}

		public void Pause()
		{
			try
			{

				MediaPlayer.Pause();
				pausedPosition = MediaPlayer.CurrentPosition;


				NotificationService1.ShowNotification();
				PlaybackStatusChanged?.Invoke(this, new StatusEventArg { CurrentSong = CurrentSong, Status = BackgroundAudioStatus.Paused });
			}
			catch (Exception e) { Crashes.TrackError(e); }
		}

		public void Play(Song song)
		{
			if (loading) return;
			loading = true;
			try
			{
				Reset();
				CurrentSong = song;
				MediaPlayer.SetDataSource(MusicProvider.GetStreamUri(song));
				MediaPlayer.Prepare();
			}
			catch (Exception e)
			{
				System.Diagnostics.Debug.WriteLine(e);
				Crashes.TrackError(e);
				loading = false;
			}
		}

		public void Play(int index, Queue queue)
		{
			if (loading) return;
			loading = true;
			try
			{
				Reset();

				if (MainQueue != null && MainQueue.Count > 0)
				{
					foreach (Song item in MainQueue) { item.IsSelected = false; }
				}

				MainQueue = queue;

				if (index > MainQueue.Count)
				{
					loading = false;
					return;
				}

				if (index < MainQueue.Count)
					CurrentSong = MainQueue[index];

				Utils.UnlockSsl(true);

				MediaPlayer.SetDataSource(MusicProvider.GetStreamUri(CurrentSong));
				MediaPlayer.Prepare();


				Utils.UnlockSsl(false);
			}
			catch (Exception e)
			{
				System.Diagnostics.Debug.WriteLine(e);
				Crashes.TrackError(e);
				loading = false;
			}
		}

		public void PlayNextSong()
		{
			try
			{

				if (CurrentSong == null || MainQueue.Count <= 0) return;
				CurrentSong.IsSelected = false;
				int index = MainQueue.IndexOf(CurrentSong);
				if (index >= MainQueue.Count)
				{
					MainQueue.GetMoreData();
					index = MainQueue.IndexOf(CurrentSong);
				}

				Song song = index + 1 >= MainQueue.Count ? MainQueue[0] : MainQueue[index + 1];
				if (song != null) { Play(song); }

			}
			catch (Exception e)
			{
				System.Diagnostics.Debug.WriteLine(e);
				Crashes.TrackError(e);
			}
		}

		public Song GetNextSong()
		{
			try
			{
				if (CurrentSong == null || MainQueue.Count <= 0) return null;
				int index = MainQueue.IndexOf(CurrentSong);
				if (index >= MainQueue.Count - 1)
				{
					MainQueue.GetMoreData();
					index = MainQueue.IndexOf(CurrentSong);
				}

				Song song = index + 1 >= MainQueue.Count - 1 ? MainQueue[0] : MainQueue[index + 1];
				return song;
			}
			catch (Exception e)
			{
				System.Diagnostics.Debug.WriteLine(e);
				Crashes.TrackError(e);
			}

			return null;
		}

		public void PlayPreviousSong()
		{
			try
			{

				if (CurrentSong == null || MainQueue.Count <= 0) return;
				CurrentSong.IsSelected = false;
				int index = MainQueue.IndexOf(CurrentSong);
				Song song = index - 1 < 0 ? MainQueue[MainQueue.Count - 1] : MainQueue[index - 1];

				Play(song);

			}
			catch (Exception e) { Crashes.TrackError(e); }
		}

		public Song GetPreviousSong()
		{
			try
			{
				if (CurrentSong == null || MainQueue.Count <= 0) return null;
				int index = MainQueue.IndexOf(CurrentSong);
				Song song = index - 1 < 0 ? MainQueue[MainQueue.Count - 1] : MainQueue[index - 1];
				return song;
			}
			catch (Exception e) { Crashes.TrackError(e); }

			return null;
		}

		public MediaPlayer MediaPlayer { get; set; }

		private void MediaPlayer_Prepared(object sender, EventArgs e)
		{
			try
			{
				Utils.UnlockSsl(true);
				MediaPlayer.Start();
				loading = false;
				PlaybackStatusChanged?.Invoke(this, new StatusEventArg { CurrentSong = CurrentSong, Status = BackgroundAudioStatus.Playing });
				NotificationService1.ShowNotification();
				NotificationService1.UpdateMediaSessionMeta();
				Utils.Run(() =>
				{
					MusicProvider.AddPlay(CurrentSong.Id);
					MusicProvider.AddHistory("track", "played", CurrentSong.Id, CurrentSong.Title, CurrentSong.Artist, CurrentSong.ArtistId, CurrentSong.Album, CurrentSong.AlbumId, CurrentSong.Genre, CurrentSong.GenreId);
				});

				Utils.UnlockSsl(false);

			}
			catch (Exception ee)
			{
				System.Diagnostics.Debug.WriteLine(ee);
				Crashes.TrackError(ee);
				loading = false;
			}
		}

		private void MediaPlayer_Completion(object sender, EventArgs e)
		{
			if (CurrentSong != null) CurrentSong.IsSelected = false;
			PlayNextSong();
		}

		public void Reset()
		{
			try
			{
				MediaPlayer?.Stop();
				MediaPlayer?.Release();


				InitMediaPlayer();
				InitHeadsetPlugReceiver();
				InitBluetoothReceiver();
			}
			catch (Exception ee) { Crashes.TrackError(ee); }
		}

		public void InitMediaPlayer()
		{
			try
			{
				MediaPlayer = new MediaPlayer();
				MediaPlayer.SetWakeMode(Application.Context, WakeLockFlags.Partial);
				MediaPlayer.SetAudioAttributes(new AudioAttributes.Builder()
					.SetUsage(AudioUsageKind.Media)
					.SetContentType(AudioContentType.Music)
					.Build());

				MediaPlayer.Completion += MediaPlayer_Completion;
				MediaPlayer.Prepared += MediaPlayer_Prepared;
				MediaPlayer.SetVolume(1.0f, 1.0f);
			}
			catch (Exception ee) { Crashes.TrackError(ee); }
		}

		public void InitHeadsetPlugReceiver()
		{
			try
			{
				IntentFilter filter = new IntentFilter();
				filter.AddAction(Intent.ActionHeadsetPlug);
				filter.AddAction(BluetoothA2dp.ActionConnectionStateChanged);
				filter.AddAction(AudioManager.ActionAudioBecomingNoisy);
				headsetPlugReceiver = new HeadsetPlugReceiver(this);

				RegisterReceiver(headsetPlugReceiver, filter);
			}
			catch (Exception ee) { Crashes.TrackError(ee); }
		}

		public void InitNoisyReceiver()
		{
			try
			{
				if (noisyReceiver != null)
				{
					UnregisterReceiver(noisyReceiver);
					noisyReceiver = null;
				}
				IntentFilter filter = new IntentFilter(AudioManager.ActionAudioBecomingNoisy);
				noisyReceiver = new NoisyAudioReciever(this);

				RegisterReceiver(noisyReceiver, filter);
			}
			catch (Exception ee) { Crashes.TrackError(ee); }
		}

		public void InitBluetoothReceiver()
		{
			try
			{
				IntentFilter filter = new IntentFilter(AudioManager.ActionAudioBecomingNoisy);
				BluetoothIntentReceiver bluetoothIntentReceiver = new BluetoothIntentReceiver(this);
				RegisterReceiver(bluetoothIntentReceiver, filter);
			}
			catch (Exception ee) { Crashes.TrackError(ee); }
		}

		public void InitMediaButtonReceiver()
		{
			try
			{
				IntentFilter filter = new IntentFilter();
				filter.AddAction(Intent.ActionMediaButton);
				filter.AddAction(ActionNext);
				filter.AddAction(ActionPrevious);
				filter.AddAction(ActionPlayPause);
				filter.AddAction(ActionStarTrack);
				filter.AddAction(ActionExit);
				mediaButtonReciever = new MediaButtonReciever(this);
				RegisterReceiver(mediaButtonReciever, filter);
			}
			catch (Exception ee) { Crashes.TrackError(ee); }
		}

		public class MediaSessionListener : MediaSessionCompat.Callback
		{
			private readonly BackgroundAudioService serviceConnection;
			public MediaSessionListener(BackgroundAudioService serviceConnection)
			{
				this.serviceConnection = serviceConnection;
			}

			public override void OnPause()
			{
				serviceConnection?.Pause();
			}

			public override void OnPlay()
			{
				serviceConnection?.Play();
			}

			public override void OnSkipToNext()
			{
				serviceConnection?.PlayNextSong();
			}

			public override void OnSkipToPrevious()
			{
				serviceConnection?.PlayPreviousSong();
			}

			public override void OnStop()
			{
				serviceConnection?.Pause();
			}
		}

		public void InitMediaSession()
		{
			try
			{
				MediaSession = new MediaSessionCompat(Application.Context, "AlloyMediaSession");
				MediaSession.SetCallback(new MediaSessionListener(this));

				Bundle bundle = new Bundle();
				bundle.PutBoolean("exceptMusicController", true);

				MediaSession.SetExtras(bundle);
				using (PlaybackStateCompat.Builder mediaStateBuilder = new PlaybackStateCompat.Builder()) {
					mediaStateBuilder.SetActions(
						PlaybackStateCompat.ActionPause | PlaybackStateCompat.ActionPlay | PlaybackStateCompat.ActionFastForward | PlaybackStateCompat.ActionRewind |
						PlaybackStateCompat.ActionSkipToNext | PlaybackStateCompat.ActionSkipToPrevious | PlaybackStateCompat.ActionStop | PlaybackStateCompat.ActionSetRating |
						PlaybackStateCompat.ActionSetRating | PlaybackStateCompat.ActionSetShuffleMode | PlaybackStateCompat.ActionSetRepeatMode
					);
					MediaSession.SetPlaybackState(mediaStateBuilder.Build());
				}

				MediaSession.SetFlags(MediaSessionCompat.FlagHandlesMediaButtons);
				MediaSession.Active = true;
			}
			catch (Exception ee) { Crashes.TrackError(ee); }
		}
	}
}