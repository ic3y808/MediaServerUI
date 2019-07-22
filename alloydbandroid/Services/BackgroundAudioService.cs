using System;
using System.Collections.Generic;
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
using Android.Util;
using Java.IO;
using Java.Lang;
using Exception = System.Exception;

namespace Alloy.Services
{
	[Service]
	[IntentFilter(new[] { ActionPlayNew, ActionPlayPause, ActionPrevious, ActionNext, ActionUpdateMetaData, ActionStarTrack, ActionExit })]
	public class BackgroundAudioService : Service, MediaPlayer.IOnCompletionListener,
		MediaPlayer.IOnPreparedListener, MediaPlayer.IOnErrorListener, MediaPlayer.IOnSeekCompleteListener,
		MediaPlayer.IOnInfoListener, MediaPlayer.IOnBufferingUpdateListener, AudioManager.IOnAudioFocusChangeListener, IMediaController
	{
		public const string ActionPlayNew = "com.xamarin.action.PLAY_NEW";
		public const string ActionPlayPause = "com.xamarin.action.PLAY_PAUSE";
		public const string ActionStarTrack = "com.xamarin.action.STAR_TRACK";
		public const string ActionNext = "com.xamarin.action.NEXT";
		public const string ActionPrevious = "com.xamarin.action.PREVIOUS";
		public const string ActionExit = "com.xamarin.action.EXIT";
		public const string ActionUpdateMetaData = "com.xamarin.action.UPDATE_META";

		public event EventHandler<StatusEventArg> PlaybackStatusChanged;

		public List<Song> MainQueue { get; set; }
		public int CurrentQueuePosition { get; set; }
		public NotificationService NotificationService1 { get; set; }
		public MediaSessionCompat MediaSession { get; set; }

		private NoisyAudioReciever noisyReceiver;
		private HeadsetPlugReceiver headsetPlugReceiver;
		private MediaButtonReciever mediaButtonReciever;
		public MediaPlayer mediaPlayer;
		private int pausedPosition;
		public const string CHANNEL_ID = "mediaStateBuilder";
		public const string MEDIA_NAME = "Media playback";
		public const string MEDIA_CHANNEL_DESCRIPTION = "Media playback controls";
		public const int NOTIFICATION_ID = 165164465;
		private bool loading;

		private Song currentSong;
		public Song CurrentSong
		{
			get
			{
				if (MainQueue == null || MainQueue.Count == 0) return null;
				return MainQueue[CurrentQueuePosition];
			}
			set { currentSong = value; }
		}

		public int CurrentPosition
		{
			get
			{
				if (mediaPlayer == null || !mediaPlayer.IsPlaying) return 0;
				return mediaPlayer.CurrentPosition;
			}
		}

		public int Duration
		{
			get
			{
				if (mediaPlayer == null || !mediaPlayer.IsPlaying) return 0;
				return mediaPlayer.Duration;
			}
		}

		public bool IsPlaying => mediaPlayer != null && mediaPlayer.IsPlaying;

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
			MainQueue = new Queue();
			InitMediaPlayer();
			InitBluetoothReceiver();
			InitMediaButtonReceiver();
			InitHeadsetPlugReceiver();
			InitMediaSession();
		}

		public override void OnDestroy()
		{
			base.OnDestroy();
			if (mediaButtonReciever != null) UnregisterReceiver(mediaButtonReciever);
			if (headsetPlugReceiver != null) UnregisterReceiver(headsetPlugReceiver);
			if (noisyReceiver != null) UnregisterReceiver(noisyReceiver);
			Services.NotificationService.CloseNotification();
			if (mediaPlayer != null)
			{
				mediaPlayer.Stop();
				mediaPlayer.Release();
			}
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
			//switch (focusChange)
			//{
			//	case AudioFocus.Loss:
			//		{
			//			if (MediaPlayer != null && MediaPlayer.IsPlaying) Pause();
			//			break;
			//		}
			//	case AudioFocus.LossTransient:
			//		{
			//			if (MediaPlayer != null && MediaPlayer.IsPlaying) Pause();

			//			break;
			//		}
			//	case AudioFocus.LossTransientCanDuck:
			//		{
			//			MediaPlayer?.SetVolume(0.3f, 0.3f);
			//			break;
			//		}
			//	case AudioFocus.Gain:
			//		{
			//			if (MediaPlayer != null && !MediaPlayer.IsPlaying)
			//			{
			//				Play();
			//				MediaPlayer.SetVolume(1.0f, 1.0f);
			//			}

			//			break;
			//		}
			//}
		}

		public void Stop()
		{
			if (mediaPlayer == null) return;
			if (mediaPlayer.IsPlaying)
			{
				mediaPlayer.Stop();
			}
			mediaPlayer.Reset();
			InitMediaPlayer();
		}

		public void Play()
		{
			try
			{
				if (!mediaPlayer.IsPlaying)
				{
					mediaPlayer.Start();
				}

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

		private void Resume()
		{
			if (!mediaPlayer.IsPlaying)
			{
				mediaPlayer.SeekTo(pausedPosition);
				mediaPlayer.Start();
			}
		}

		public void Pause()
		{
			try
			{
				mediaPlayer.Pause();
				pausedPosition = mediaPlayer.CurrentPosition;
				NotificationService1.ShowNotification();
				PlaybackStatusChanged?.Invoke(this, new StatusEventArg { CurrentSong = CurrentSong, Status = BackgroundAudioStatus.Paused });
			}
			catch (Exception e) { Crashes.TrackError(e); }
		}

		public void Play(int index)
		{
			if (index > MainQueue.Count)
			{
				loading = false;
				return;
			}

			if (MainQueue != null && MainQueue.Count > 0)
			{
				foreach (Song item in MainQueue) { item.IsSelected = false; }
			}

			if (index < MainQueue.Count)
				CurrentSong = MainQueue[index];

			try
			{
				// Set the data source to the mediaFile location
				mediaPlayer.SetDataSource(MusicProvider.GetStreamUri(CurrentSong));
			}
			catch (IOException e)
			{
				e.PrintStackTrace();
				//StopSelf();
			}
			mediaPlayer.PrepareAsync();
		}

		public void Play(int index, List<Song> queue)
		{
			if (loading) return;
			loading = true;
			Stop();
			MainQueue = queue;
			CurrentQueuePosition = index;
			CurrentSong = MainQueue[CurrentQueuePosition];
			Play(index);
		}

		public void Seek(int to)
		{
			mediaPlayer.SeekTo(to);
		}

		public void PlayNextSong()
		{
			try
			{
				if (loading || CurrentSong == null || MainQueue.Count <= 0) return;
				CurrentSong.IsSelected = false;
				int index = MainQueue.IndexOf(CurrentSong);
				index = index + 1 >= MainQueue.Count ? 0 : index + 1;
				Stop();
				CurrentQueuePosition = index;
				CurrentSong = MainQueue[CurrentQueuePosition];
				Play(index);

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
				index = index - 1 < 0 ? MainQueue.Count - 1 : index - 1;
				Stop();
				CurrentQueuePosition = index;
				CurrentSong = MainQueue[CurrentQueuePosition];
				Play(index);

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

		public void InitMediaPlayer()
		{
			try
			{
				if (mediaPlayer == null)
					mediaPlayer = new MediaPlayer();
				mediaPlayer.SetWakeMode(Application.Context, WakeLockFlags.Partial);

				//Set up MediaPlayer event listeners
				mediaPlayer.SetOnCompletionListener(this);
				mediaPlayer.SetOnErrorListener(this);
				mediaPlayer.SetOnPreparedListener(this);
				mediaPlayer.SetOnBufferingUpdateListener(this);
				mediaPlayer.SetOnSeekCompleteListener(this);
				mediaPlayer.SetOnInfoListener(this);
				//Reset so that the MediaPlayer is not pointing to another data source
				mediaPlayer.Reset();

				mediaPlayer.SetVolume(1.0f, 1.0f);
				mediaPlayer.SetAudioStreamType(Stream.Music);
				mediaPlayer.SetAudioAttributes(new AudioAttributes.Builder()
					.SetUsage(AudioUsageKind.Media)
					.SetContentType(AudioContentType.Music)
					.Build());
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
				filter.AddAction(ActionPlayNew);
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
				using (PlaybackStateCompat.Builder mediaStateBuilder = new PlaybackStateCompat.Builder())
				{
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


		public override StartCommandResult OnStartCommand(Intent intent, StartCommandFlags flags, int startId)
		{
			var a = flags;
			//try
			//{

			//	//Load data from SharedPreferences
			//	StorageUtil storage = new StorageUtil(getApplicationContext());
			//	audioList = storage.loadAudio();
			//	audioIndex = storage.loadAudioIndex();

			//	if (audioIndex != -1 && audioIndex < audioList.size())
			//	{
			//		//index is in a valid range
			//		activeAudio = audioList.get(audioIndex);
			//	}
			//	else
			//	{
			//		stopSelf();
			//	}
			//}
			//catch (NullPointerException e)
			//{
			//	stopSelf();
			//}

			////Request audio focus
			//if (requestAudioFocus() == false)
			//{
			//	//Could not gain focus
			//	stopSelf();
			//}

			//if (mediaSessionManager == null)
			//{
			//	try
			//	{
			//		initMediaSession();
			//		initMediaPlayer();
			//	}
			//	catch (RemoteException e)
			//	{
			//		e.printStackTrace();
			//		stopSelf();
			//	}
			//	buildNotification(PlaybackStatus.PLAYING);
			//}

			////Handle Intent action from MediaSession.TransportControls
			//handleIncomingActions(intent);
			return base.OnStartCommand(intent, flags, startId);
		}

		public void OnCompletion(MediaPlayer mp)
		{
			if (loading) return;
			if (CurrentSong != null) CurrentSong.IsSelected = false;
			PlayNextSong();
		}

		public void OnPrepared(MediaPlayer mp)
		{
			if (!mediaPlayer.IsPlaying)
			{
				mediaPlayer.Start();
				loading = false;
				Utils.Run(() =>
				{
					PlaybackStatusChanged?.Invoke(this, new StatusEventArg { CurrentSong = CurrentSong, Status = BackgroundAudioStatus.Playing });
					NotificationService1.ShowNotification();
					NotificationService1.UpdateMediaSessionMeta();
				});
				MusicProvider.AddPlay(CurrentSong.Id);
				MusicProvider.AddHistory("track", "played", CurrentSong.Id, CurrentSong.Title, CurrentSong.Artist, CurrentSong.ArtistId, CurrentSong.Album, CurrentSong.AlbumId, CurrentSong.Genre, CurrentSong.GenreId);
			}
		}

		public bool OnError(MediaPlayer mp, MediaError what, int extra)
		{
			//Invoked when there has been an error during an asynchronous operation
			switch (what)
			{
				case MediaError.NotValidForProgressivePlayback:
					Log.Debug("MediaPlayer Error", "MEDIA ERROR NOT VALID FOR PROGRESSIVE PLAYBACK " + extra);
					break;
				case MediaError.ServerDied:
					Log.Debug("MediaPlayer Error", "MEDIA ERROR SERVER DIED " + extra);
					break;
				case MediaError.Unknown:
					Log.Debug("MediaPlayer Error", "MEDIA ERROR UNKNOWN " + extra);
					break;
			}
			return false;
		}

		public void OnSeekComplete(MediaPlayer mp)
		{

		}

		public bool OnInfo(MediaPlayer mp, MediaInfo what, int extra)
		{
			//Utils.Run(() =>
			//{
			//	PlaybackStatusChanged?.Invoke(this, new StatusEventArg { CurrentSong = CurrentSong, Status = BackgroundAudioStatus.Playing });
			//	NotificationService1.ShowNotification();
			//	NotificationService1.UpdateMediaSessionMeta();
			//});
			return false;
		}

		public void OnBufferingUpdate(MediaPlayer mp, int percent)
		{

		}
	}
}