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

		private HeadsetPlugReceiver headsetPlugReceiver;
		private MediaButtonReciever mediaButtonReciever;
		private MediaPlayer mediaPlayer;
		private int pausedPosition;
		public const string CHANNEL_ID = "mediaStateBuilder";
		public const string MEDIA_NAME = "Media playback";
		public const string MEDIA_CHANNEL_DESCRIPTION = "Media playback controls";
		public const int NOTIFICATION_ID = 165164465;
		private bool loading;
		private PowerManager.WakeLock wakeLock;

		public Song CurrentSong
		{
			get
			{
				if (MainQueue == null || MainQueue.Count == 0) return null;
				return MainQueue[CurrentQueuePosition];
			}
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
			MainQueue = new List<Song>();
			InitMediaPlayer();
			GetWakeLock();
			InitBluetoothReceiver();
			InitMediaButtonReceiver();
			InitHeadsetPlugReceiver();
			InitMediaSession();
		}

		public override void OnDestroy()
		{
			base.OnDestroy();
			ReleaseWakeLock();
			if (mediaButtonReciever != null) UnregisterReceiver(mediaButtonReciever);
			if (headsetPlugReceiver != null) UnregisterReceiver(headsetPlugReceiver);
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
				CurrentQueuePosition = index;

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

		public void GetWakeLock()
		{
			var _powerManager = (PowerManager)GetSystemService(PowerService);
			wakeLock = _powerManager.NewWakeLock(WakeLockFlags.Partial, "Alloy");
		}

		public void ReleaseWakeLock()
		{
			if (wakeLock != null && wakeLock.IsHeld)
				wakeLock.Release();
		}

		public void InitMediaPlayer()
		{
			try
			{
				if (mediaPlayer == null)
				{
					mediaPlayer = new MediaPlayer();
				}
				else { mediaPlayer.Reset(); }
				mediaPlayer.SetWakeMode(Application.Context, WakeLockFlags.Partial);
				mediaPlayer.SetScreenOnWhilePlaying(false);
				mediaPlayer.SetOnCompletionListener(this);
				mediaPlayer.SetOnErrorListener(this);
				mediaPlayer.SetOnPreparedListener(this);
				mediaPlayer.SetOnBufferingUpdateListener(this);
				mediaPlayer.SetOnSeekCompleteListener(this);
				mediaPlayer.SetOnInfoListener(this);
				mediaPlayer.SetVolume(1.0f, 1.0f);
				mediaPlayer.SetAudioAttributes(new AudioAttributes.Builder().SetUsage(AudioUsageKind.Media).SetContentType(AudioContentType.Music).SetLegacyStreamType(Stream.Music).Build());
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
			// not currently used
		}
	}
}