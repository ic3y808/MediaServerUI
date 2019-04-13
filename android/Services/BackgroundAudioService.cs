﻿using System;
using Android.App;
using Android.Bluetooth;
using Android.Content;
using Android.Gms.Cast;
using Android.Gms.Cast.Framework;
using Android.Gms.Cast.Framework.Media;
using Android.Media;
using Android.OS;
using Android.Support.V4.Media.Session;
using Microsoft.AppCenter.Crashes;
using Alloy.Helpers;
using Alloy.Interfaces;
using Alloy.Models;
using Alloy.Recievers;
using Alloy.Providers;
using MediaMetadata = Android.Media.MediaMetadata;
using Object = Java.Lang.Object;

namespace Alloy.Services
{
	[Service]
	[IntentFilter(new[] { ActionPlayNew, ActionPlayPause, ActionPrevious, ActionNext, ActionUpdateMetaData, ActionStarTrack, ActionExit })]
	public class BackgroundAudioService : Service, AudioManager.IOnAudioFocusChangeListener, IMediaController, ICastStateListener, IAppVisibilityListener, ISessionManagerListener, RemoteMediaClient.IListener, RemoteMediaClient.IProgressListener
	{
		public const string ActionPlayNew = "com.xamarin.action.PLAY_NEW";
		public const string ActionPlayPause = "com.xamarin.action.PLAY_PAUSE";
		public const string ActionStarTrack = "com.xamarin.action.STAR_TRACK";
		public const string ActionNext = "com.xamarin.action.NEXT";
		public const string ActionPrevious = "com.xamarin.action.PREVIOUS";
		public const string ActionExit = "com.xamarin.action.EXIT";
		public const string ActionUpdateMetaData = "com.xamarin.action.UPDATE_META";

		public event EventHandler<StatusEventArg> PlaybackStatusChanged;

		public IQueue MainQueue { get; set; }
		public RemoteMediaClient Remote { get; set; }

		private NoisyAudioReciever noisyReceiver;
		private HeadsetPlugReceiver headsetPlugReceiver;
		private BluetoothIntentReceiver bluetoothReceiver;
		private MediaButtonReciever mediaButtonReciever;
		public NotificationService notificationService;
		private CastSession castSession;
		public MediaSessionCompat MediaSession { get; set; }
		private PlaybackStateCompat.Builder mediaStateBuilder;
		private Song currentSong;
		private long pausedPosition;
		private int currentIdleReason;
		public static string CHANNEL_ID = "media_playback_channel";
		public static string MEDIA_NAME = "Media playback";
		public static string MEDIA_CHANNEL_DESCRIPTION = "Media playback controls";
		public static int NOTIFICATION_ID = 165164465;
		private bool loading;

		public Song CurrentSong
		{
			get => currentSong;
			set
			{
				currentSong = value;
				currentSong.IsSelected = true;
				if (Remote != null)
					CurrentQueueSong = currentSong.QueueItem();
			}
		}

		public MediaQueueItem CurrentQueueSong { get; set; }

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
			notificationService = new NotificationService(this);
			InitMediaPlayer();
			InitBluetoothReceiver();
			InitMediaButtonReceiver();
			InitHeadsetPlugReceiver();
			InitMediaSession();
			InitCast();
			Reset();
		}

		public override void OnDestroy()
		{
			base.OnDestroy();
			if (mediaButtonReciever != null) UnregisterReceiver(mediaButtonReciever);
			if (headsetPlugReceiver != null) UnregisterReceiver(headsetPlugReceiver);
			if (noisyReceiver != null) UnregisterReceiver(noisyReceiver);
			StopCast();
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
				if (Remote != null)
				{
					Remote.Seek(pausedPosition);
					Remote.Play();
				}
				else
				{
					MediaPlayer.Start();
					MediaPlayer.SeekTo((int) pausedPosition);
				}

				notificationService.ShowNotification();
				RequestAudioFocus();
				PlaybackStatusChanged?.Invoke(this, new StatusEventArg() {CurrentSong = CurrentSong, Status = BackgroundAudioStatus.Loading});
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
				if (Remote != null)
				{
					Remote.Pause();
					pausedPosition = Remote.ApproximateStreamPosition;
				}
				else
				{
					MediaPlayer.Pause();
					pausedPosition = MediaPlayer.CurrentPosition;
				}

				notificationService.ShowNotification();
				PlaybackStatusChanged?.Invoke(this, new StatusEventArg() { CurrentSong = CurrentSong, Status = BackgroundAudioStatus.Paused });
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

		public void Play(int index, IQueue queue)
		{
			if (loading) return;
			loading = true;
			try
			{
				if (Remote == null) Reset();

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
				if (Remote != null)
				{
					CurrentSong = MainQueue[index];
					Adapters.Adapters.CurrentActivity.RunOnUiThread(() =>
					{
						Android.Gms.Cast.MediaMetadata meta = new Android.Gms.Cast.MediaMetadata(Android.Gms.Cast.MediaMetadata.MediaTypeMusicTrack);
						meta.PutString(MediaMetadata.MetadataKeyArtist, CurrentSong.Artist);
						meta.PutString(MediaMetadata.MetadataKeyAlbumArtist, CurrentSong.Artist);
						meta.PutString(MediaMetadata.MetadataKeyAlbum, CurrentSong.Album);
						meta.PutString(MediaMetadata.MetadataKeyTitle, CurrentSong.Title);
						meta.PutString(MediaMetadata.MetadataKeyDisplayTitle, CurrentSong.Title);

						//if (!string.IsNullOrEmpty(CurrentSong.Artwork)) meta.AddImage(new WebImage(Uri.Parse(CurrentSong.Artwork.Replace("large", "t500x500"))));

						//jsonObj = new JSONObject();
						//jsonObj.Put("description", CurrentSong.Description);


						//string url = "";


						//MediaInfo info = new MediaInfo.Builder(url)
						//	//.SetCustomData(jsonObj)
						//	.SetMetadata(meta)
						//	.SetStreamDuration(CurrentSong.Duration)
						//	.SetStreamType(MediaInfo.StreamTypeBuffered)
						//	.SetContentType("audio/mp3")
						//	.Build();

						//MediaQueueItem queueItem = new MediaQueueItem.Builder(info)
						//	.SetAutoplay(true)
						//	.SetPreloadTime(20)
						//	.Build();
						//if (CurrentSong.IsSubsonicTrack || CurrentSong.IsSoundcloudTrack)
						//{
						//	MainQueue.ToRemoteMediaQueue();
						//}
						//else
						//{
						//	MainQueue.ToLocalMediaQueue();
						//}

						//IResult result = await Remote.QueueLoad(MainQueue.MediaQueue, index, 0, jsonObj);
						//Android.Gms.Common.Apis.IResult result = await Remote.LoadAsync(info, true, 0, jsonObj);
						//if (result.Status.IsSuccess)
						//{
						//	//notificationService.ShowPlayingNotification();
						//	//PlaybackStatusChanged(this, new StatusEventArg() { CurrentSong = CurrentSong });
						//}
						loading = false;
					});
				}
				else
				{
					MediaPlayer.SetDataSource(MusicProvider.GetStreamUri(CurrentSong));
					MediaPlayer.Prepare();
				}

				Utils.UnlockSsl(false);
			}
			catch (Exception e)
			{
				System.Diagnostics.Debug.WriteLine(e);
				Crashes.TrackError(e);
				loading = false;
			}
		}


        //TODO unknown if still used, needs tested. 
		//public class CastPlayResult : Java.Lang.Object, IResultCallback, RemoteMediaClient.IMediaChannelResult
		//{
		//	private BackgroundAudioService service;
		//	public CastPlayResult(BackgroundAudioService service)
		//	{
		//		this.service = service;
		//	}
		//	public void OnResult(Object result)
		//	{
		//		var res = result;
		//		loading = false;

		//		service.MediaPlayer.SetDataSource(MusicProvider.GetStreamUri(service.CurrentSong));
		//		service.MediaPlayer.Prepare();
		//	}

		//	public Statuses Status { get; }
		//	public JSONObject CustomData { get; }
		//}

		public void PlayNextSong()
		{
			try
			{
				if (Remote != null) { Remote.QueueNext(null); }
				else
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
				if (Remote != null) { Remote.QueuePrev(null); }
				else
				{
					if (CurrentSong == null || MainQueue.Count <= 0) return;
					CurrentSong.IsSelected = false;
					int index = MainQueue.IndexOf(CurrentSong);
					Song song = index - 1 < 0 ? MainQueue[MainQueue.Count - 1] : MainQueue[index - 1];

					Play(song);
				}
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
				PlaybackStatusChanged?.Invoke(this, new StatusEventArg() {CurrentSong = CurrentSong, Status = BackgroundAudioStatus.Playing});
				notificationService.ShowNotification();
				notificationService.UpdateMediaSessionMeta();
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
				bluetoothReceiver = new BluetoothIntentReceiver(this);

				RegisterReceiver(bluetoothReceiver, filter);
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
			private BackgroundAudioService serviceConnection;
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
				mediaStateBuilder = new PlaybackStateCompat.Builder();
				mediaStateBuilder.SetActions(
					PlaybackStateCompat.ActionPause | PlaybackStateCompat.ActionPlay | PlaybackStateCompat.ActionFastForward | PlaybackStateCompat.ActionRewind |
					PlaybackStateCompat.ActionSkipToNext | PlaybackStateCompat.ActionSkipToPrevious | PlaybackStateCompat.ActionStop | PlaybackStateCompat.ActionSetRating |
					PlaybackStateCompat.ActionSetRating | PlaybackStateCompat.ActionSetShuffleMode | PlaybackStateCompat.ActionSetRepeatMode
					);
				MediaSession.SetPlaybackState(mediaStateBuilder.Build());
				MediaSession.SetFlags(MediaSessionCompat.FlagHandlesMediaButtons);
				MediaSession.Active = true;
			}
			catch (Exception ee) { Crashes.TrackError(ee); }
		}

		public void InitCast()
		{
			CastContext.GetSharedInstance(this).AddCastStateListener(this);
			CastContext.GetSharedInstance(this).AddAppVisibilityListener(this);
			CastContext.GetSharedInstance(this).SessionManager.AddSessionManagerListener(this);
		}

		public void StopCast()
		{
			CastContext.GetSharedInstance(this).RemoveCastStateListener(this);
			CastContext.GetSharedInstance(this).RemoveAppVisibilityListener(this);
			CastContext.GetSharedInstance(this).SessionManager.RemoveSessionManagerListener(this);
			Remote?.RemoveListener(this);
		}

		public void OnCastStateChanged(int newState)
		{

		}

		public void OnAppEnteredBackground()
		{
		}

		public void OnAppEnteredForeground()
		{
		}

		public void OnSessionEnded(Object session, int error)
		{
			if (session == castSession)
			{
				Remote?.RemoveListener(this);
				Remote = null;
				castSession = null;
			}
		}

		public void OnSessionEnding(Object session)
		{
		}

		public void OnSessionResumeFailed(Object session, int error)
		{
		}

		public void OnSessionResumed(Object session, bool wasSuspended)
		{
			castSession = (CastSession)session;
			Remote = castSession?.RemoteMediaClient;
			Remote?.AddListener(this);
		}

		public void OnSessionResuming(Object session, string sessionId)
		{
		}

		public void OnSessionStartFailed(Object session, int error)
		{
		}

		public void OnSessionStarted(Object session, string sessionId)
		{
			castSession = (CastSession)session;
			Remote = castSession?.RemoteMediaClient;
			Remote?.AddListener(this);
		}

		public void OnSessionStarting(Object session)
		{
		}

		public void OnSessionSuspended(Object session, int reason)
		{
		}

		public void OnAdBreakStatusUpdated()
		{
		}

		public void OnMetadataUpdated()
		{
		}

		public void OnPreloadStatusUpdated()
		{
		}

		public void OnQueueStatusUpdated()
		{
			if (MainQueue == null || Remote == null || Remote.CurrentItem == null) return;
			CurrentQueueSong = Remote.CurrentItem;
			foreach (Song item in MainQueue)
			{
				if (!CurrentQueueSong.ItemId.Equals(item.QueueItem().ItemId)) continue;
				CurrentSong = item;
				break;
			}

			PlaybackStatusChanged?.Invoke(this, new StatusEventArg() {CurrentSong = CurrentSong, Status = BackgroundAudioStatus.None});
		}

		public void OnSendingRemoteMediaRequest()
		{
		}

		public void OnStatusUpdated()
		{
			if (Remote != null)
			{
				Adapters.Adapters.CurrentActivity.RunOnUiThread(() =>
				{
					int status = Remote.PlayerState;
					int idleReason = Remote.IdleReason;

					switch (status)
					{
						case MediaStatus.PlayerStateIdle:
							if (idleReason == MediaStatus.IdleReasonFinished && currentIdleReason == MediaStatus.IdleReasonFinished)
							{
								//PlayNextSong();
							}
							break;
						case MediaStatus.PlayerStateBuffering:
							currentIdleReason = MediaStatus.IdleReasonFinished;
							break;
						case MediaStatus.PlayerStatePlaying:
							currentIdleReason = MediaStatus.IdleReasonFinished;
							PlaybackStatusChanged?.Invoke(this, new StatusEventArg() {CurrentSong = CurrentSong, Status = BackgroundAudioStatus.None});
							break;
						case MediaStatus.PlayerStatePaused:
							PlaybackStatusChanged?.Invoke(this, new StatusEventArg() {CurrentSong = CurrentSong, Status = BackgroundAudioStatus.None});
							break;
					}
				});
			}
		}

		public void OnProgressUpdated(long progressMs, long durationMs)
		{
			System.Diagnostics.Debug.WriteLine("OnProgressUpdated " + progressMs + "  " + durationMs);
		}
	}
}