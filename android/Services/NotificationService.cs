using System;
using Android.App;
using Android.Content;
using Android.OS;
using Android.Support.V4.App;
using Android.Support.V4.Media;
using Android.Support.V4.Media.Session;
using Microsoft.AppCenter.Crashes;
using Alloy.Helpers;



namespace Alloy.Services
{
	public class NotificationService
	{
		private readonly BackgroundAudioService audioService;

		public NotificationService(BackgroundAudioService audioService)
		{
			this.audioService = audioService;
			this.audioService.PlaybackStatusChanged += AudioService_PlaybackStatusChanged;
		}

		private void AudioService_PlaybackStatusChanged(object sender, StatusEventArg e)
		{
			ShowNotification();
		}

		private NotificationCompat.Builder GenerateBuilder()
		{
			PendingIntent reOpenApp = PendingIntent.GetActivity(Application.Context, 0, new Intent(Application.Context, typeof(MainActivity)), PendingIntentFlags.UpdateCurrent);
			NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(Application.Context, BackgroundAudioService.CHANNEL_ID);
			notificationBuilder
				.SetVisibility((int)NotificationVisibility.Public)
				.SetOnlyAlertOnce(true)
				.SetContentIntent(reOpenApp)
				.SetOngoing(true)
				.SetAutoCancel(false)
				.SetSmallIcon(Resource.Mipmap.ic_launcher)
				.SetStyle(new Android.Support.V4.Media.App.NotificationCompat.MediaStyle()
				.SetShowActionsInCompactView(0, 1, 2, 3));
			return notificationBuilder;
		}

		private void GenerateIntents(ref NotificationCompat.Builder builder)
		{
			PendingIntent pIntentPrev = PendingIntent.GetBroadcast(Application.Context, (int)DateTime.Now.Ticks, new Intent(BackgroundAudioService.ActionPrevious), PendingIntentFlags.CancelCurrent);
			PendingIntent pIntentNext = PendingIntent.GetBroadcast(Application.Context, (int)DateTime.Now.Ticks, new Intent(BackgroundAudioService.ActionNext), PendingIntentFlags.CancelCurrent);
			PendingIntent pIntentPlayPause = PendingIntent.GetBroadcast(Application.Context, (int)DateTime.Now.Ticks, new Intent(BackgroundAudioService.ActionPlayPause), PendingIntentFlags.CancelCurrent);
			PendingIntent pIntentFavorite = PendingIntent.GetBroadcast(Application.Context, (int)DateTime.Now.Ticks, new Intent(BackgroundAudioService.ActionStarTrack), PendingIntentFlags.CancelCurrent);
			PendingIntent pIntentExit = PendingIntent.GetBroadcast(Application.Context, (int)DateTime.Now.Ticks, new Intent(BackgroundAudioService.ActionExit), PendingIntentFlags.CancelCurrent);
			builder
			.SetStyle(new Android.Support.V4.Media.App.NotificationCompat.MediaStyle()
			.SetMediaSession(audioService.MediaSession.SessionToken)
			.SetShowCancelButton(true)
			.SetCancelButtonIntent(pIntentExit));

			builder.AddAction(audioService.CurrentSong.Starred ? new NotificationCompat.Action(Resource.Drawable.ic_favorite, "Favorite", pIntentFavorite) : new NotificationCompat.Action(Resource.Drawable.ic_favorite_border, "Favorite", pIntentFavorite));

			builder.AddAction(new NotificationCompat.Action(Android.Resource.Drawable.IcMediaPrevious, "Previous", pIntentPrev));

			builder.AddAction(audioService.MediaPlayer.IsPlaying ? new NotificationCompat.Action(Android.Resource.Drawable.IcMediaPause, "Pause", pIntentPlayPause) : new NotificationCompat.Action(Android.Resource.Drawable.IcMediaPlay, "Play", pIntentPlayPause));
			
			builder
			.AddAction(new NotificationCompat.Action(Android.Resource.Drawable.IcMediaNext, "Next", pIntentNext))
			.AddAction(new NotificationCompat.Action(Android.Resource.Drawable.IcMenuCloseClearCancel, "Close", pIntentExit))
			.SetDeleteIntent(pIntentExit);			
		}

		private void GenerateMetadata(ref NotificationCompat.Builder builder)
		{
			if (audioService.CurrentSong == null) return;
			builder
				.SetContentTitle(audioService.CurrentSong.Album)
				.SetContentText(audioService.CurrentSong.Artist)
				.SetSubText(audioService.CurrentSong.Title)
				.SetLargeIcon(audioService.CurrentSong.GetAlbumArt());
		}


		public void ShowNotification()
		{
			try
			{
				if (Build.VERSION.SdkInt >= BuildVersionCodes.O)
				{
					CreateChannel();
				}
				NotificationManager notificationManager = (NotificationManager)Application.Context.GetSystemService(Context.NotificationService);
				NotificationCompat.Builder builder = GenerateBuilder();
				GenerateIntents(ref builder);
				GenerateMetadata(ref builder);
				UpdateMediaSessionMeta();
				notificationManager.Notify(BackgroundAudioService.NOTIFICATION_ID, builder.Build());
			}
			catch (Exception ee) { Crashes.TrackError(ee); }
		}

		public static void CloseNotification()
		{
			try
			{
				NotificationManagerCompat.From(Application.Context).Cancel(1);
				NotificationManager notificationManager = (NotificationManager)Application.Context.GetSystemService(Context.NotificationService);
				notificationManager.Cancel(BackgroundAudioService.NOTIFICATION_ID);
			}
			catch (Exception ee) { Crashes.TrackError(ee); }
		}

		public void UpdateMediaSessionMeta()
		{
			try
			{
				if (audioService.CurrentSong == null) return;
				MediaMetadataCompat metadata = new MediaMetadataCompat.Builder()
					.PutString(MediaMetadataCompat.MetadataKeyTitle, audioService.CurrentSong.Title)
					.PutString(MediaMetadataCompat.MetadataKeyArtist, audioService.CurrentSong.Artist)
					.PutString(MediaMetadataCompat.MetadataKeyAlbum, audioService.CurrentSong.Album)
					.PutLong(MediaMetadataCompat.MetadataKeyDuration, audioService.CurrentSong.Duration)
					.PutBitmap(MediaMetadataCompat.MetadataKeyArt, audioService.CurrentSong.GetAlbumArt())
					.Build();

				PlaybackStateCompat state = new PlaybackStateCompat.Builder()
					.SetActions(PlaybackStateCompat.ActionPlay | PlaybackStateCompat.ActionPlayPause | PlaybackStateCompat.ActionPause | PlaybackStateCompat.ActionSkipToNext | PlaybackStateCompat.ActionSkipToPrevious)
					.SetState(PlaybackStateCompat.StatePlaying, audioService.MediaPlayer.CurrentPosition.ProgressToTimer(audioService.MediaPlayer.Duration), 1.0f, SystemClock.ElapsedRealtime())
					.Build();
				audioService.MediaSession.SetMetadata(metadata);
				audioService.MediaSession.SetPlaybackState(state);
			}
			catch (Exception ee) { Crashes.TrackError(ee); }
		}

		private static void CreateChannel()
		{
			try
			{
				NotificationManager notificationManager = (NotificationManager)Application.Context.GetSystemService(Context.NotificationService);
				string id = BackgroundAudioService.CHANNEL_ID;
				string name = BackgroundAudioService.MEDIA_NAME;
				string description = BackgroundAudioService.MEDIA_CHANNEL_DESCRIPTION;
				NotificationChannel mChannel = new NotificationChannel(id, name, NotificationImportance.Low) {Description = description};
				mChannel.SetShowBadge(false);
				mChannel.LockscreenVisibility = NotificationVisibility.Public;
				notificationManager.CreateNotificationChannel(mChannel);
			}
			catch (Exception ee) { Crashes.TrackError(ee); }
		}
	}
}