using System;
using Android.App;
using Android.Content;
using Android.Graphics;
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
		BackgroundAudioService audioService;

		public NotificationService(BackgroundAudioService audioService)
		{
			this.audioService = audioService;
			this.audioService.PlaybackStatusChanged += AudioService_PlaybackStatusChanged;
		}

		private void AudioService_PlaybackStatusChanged(object sender, StatusEventArg e)
		{
			if (audioService.MediaPlayer.IsPlaying) ShowPlayingNotification();
			else ShowPausedNotification();
		}

		public void ShowPlayingNotification()
		{
			try
			{
				if (Android.OS.Build.VERSION.SdkInt >= BuildVersionCodes.O)
				{
					CreateChannel();
				}

				var reOpenApp = PendingIntent.GetActivity(Application.Context, 0, new Intent(Application.Context, typeof(MainActivity)), PendingIntentFlags.UpdateCurrent);

				var artist = "";
				var album = "";
				var title = "";
				Bitmap art = null;
				if (audioService.CurrentSong != null)
				{
					artist = audioService.CurrentSong.Artist;
					album = audioService.CurrentSong.Album;
					title = audioService.CurrentSong.Title;
					art = audioService.CurrentSong.Art;
				}

				PendingIntent pIntentPrev = PendingIntent.GetBroadcast(Application.Context, (int)DateTime.Now.Ticks, new Intent(BackgroundAudioService.ActionPrevious), PendingIntentFlags.CancelCurrent);
				PendingIntent pIntentNext = PendingIntent.GetBroadcast(Application.Context, (int)DateTime.Now.Ticks, new Intent(BackgroundAudioService.ActionNext), PendingIntentFlags.CancelCurrent);
				PendingIntent pIntentPlayPause = PendingIntent.GetBroadcast(Application.Context, (int)DateTime.Now.Ticks, new Intent(BackgroundAudioService.ActionPlayPause), PendingIntentFlags.CancelCurrent);
				PendingIntent pIntentFavorite = PendingIntent.GetBroadcast(Application.Context, (int)DateTime.Now.Ticks, new Intent(BackgroundAudioService.ActionFavorite), PendingIntentFlags.CancelCurrent);
				PendingIntent pIntentExit = PendingIntent.GetBroadcast(Application.Context, (int)DateTime.Now.Ticks, new Intent(BackgroundAudioService.ActionExit), PendingIntentFlags.CancelCurrent);

				NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(Application.Context, BackgroundAudioService.CHANNEL_ID);
				notificationBuilder
					.SetStyle(new Android.Support.V4.Media.App.NotificationCompat.MediaStyle()
					.SetMediaSession(audioService.MediaSession.SessionToken)
					.SetShowCancelButton(true)
					.SetCancelButtonIntent(pIntentExit))
					.SetVisibility((int)NotificationVisibility.Public)
					.SetOnlyAlertOnce(true)
					.SetContentIntent(reOpenApp)
					.SetContentTitle(album)
					.SetContentText(artist)
					.SetSubText(title)
					.SetLargeIcon(art)
					.SetOngoing(true)
					.SetAutoCancel(false)
					.SetSmallIcon(Resource.Mipmap.ic_launcher)
					.AddAction(new NotificationCompat.Action(Android.Resource.Drawable.IcMediaPrevious, "Previous", pIntentPrev))
					.AddAction(new NotificationCompat.Action(Android.Resource.Drawable.IcMediaPause, "Pause", pIntentPlayPause))
					.AddAction(new NotificationCompat.Action(Android.Resource.Drawable.IcMediaNext, "Next", pIntentNext))
				
					.AddAction(new NotificationCompat.Action(Android.Resource.Drawable.IcMenuCloseClearCancel, "Close", pIntentExit))
					.SetDeleteIntent(pIntentExit);

				if (audioService.CurrentSong != null)
				{
					if ( audioService.CurrentSong.Starred)
					{
						notificationBuilder.AddAction(new NotificationCompat.Action(Resource.Drawable.ic_favorite, "Favorite", pIntentFavorite));
					}
					else
					{
						notificationBuilder.AddAction(new NotificationCompat.Action(Resource.Drawable.ic_favorite_border, "Favorite", pIntentFavorite));
					}
				}

				NotificationManager notificationManager = (NotificationManager)Application.Context.GetSystemService(Context.NotificationService);

				notificationBuilder.SetStyle(new Android.Support.V4.Media.App.NotificationCompat.MediaStyle()
					.SetShowActionsInCompactView(0, 1, 2, 3)
					.SetMediaSession(audioService.MediaSession.SessionToken));

				notificationManager.Notify(BackgroundAudioService.NOTIFICATION_ID, notificationBuilder.Build());
				UpdateMediaSessionMeta();
			}
			catch (Exception ee) { Crashes.TrackError(ee); }
		}

		public void ShowPausedNotification()
		{
			try
			{
				if (Build.VERSION.PreviewSdkInt >= (int)BuildVersionCodes.O)
				{
					CreateChannel();
				}

				var reOpenApp = PendingIntent.GetActivity(Application.Context, 0, new Intent(Application.Context, typeof(MainActivity)), PendingIntentFlags.UpdateCurrent);

				var artist = "";
				var album = "";
				var title = "";
				Bitmap art = null;

				if (audioService.CurrentSong != null)
				{
					artist = audioService.CurrentSong.Artist;
					album = audioService.CurrentSong.Album;
					title = audioService.CurrentSong.Title;
					art = audioService.CurrentSong.Art;
				}

				PendingIntent pIntentPrev = PendingIntent.GetBroadcast(Application.Context, (int)DateTime.Now.Ticks, new Intent(BackgroundAudioService.ActionPrevious), PendingIntentFlags.CancelCurrent);
				PendingIntent pIntentNext = PendingIntent.GetBroadcast(Application.Context, (int)DateTime.Now.Ticks, new Intent(BackgroundAudioService.ActionNext), PendingIntentFlags.CancelCurrent);
				PendingIntent pIntentPlayPause = PendingIntent.GetBroadcast(Application.Context, (int)DateTime.Now.Ticks, new Intent(BackgroundAudioService.ActionPlayPause), PendingIntentFlags.CancelCurrent);
				PendingIntent pIntentFavorite = PendingIntent.GetBroadcast(Application.Context, (int)DateTime.Now.Ticks, new Intent(BackgroundAudioService.ActionPlayPause), PendingIntentFlags.CancelCurrent);
				PendingIntent pIntentExit = PendingIntent.GetBroadcast(Application.Context, (int)DateTime.Now.Ticks, new Intent(BackgroundAudioService.ActionExit), PendingIntentFlags.CancelCurrent);

				NotificationCompat.Builder notificationBuilder =
					new NotificationCompat.Builder(Application.Context, BackgroundAudioService.CHANNEL_ID);
				notificationBuilder
					.SetStyle(
						new Android.Support.V4.Media.App.NotificationCompat.MediaStyle()
							.SetMediaSession(audioService.MediaSession.SessionToken)
							.SetShowCancelButton(true)
							.SetCancelButtonIntent(pIntentExit))
					.SetVisibility((int)NotificationVisibility.Public)
					.SetOnlyAlertOnce(true)
					.SetContentIntent(reOpenApp)
					.SetContentTitle(album)
					.SetContentText(artist)
					.SetSubText(title)
					.SetLargeIcon(art)
					.SetOngoing(true)
					.SetAutoCancel(false)
					.SetSmallIcon(Resource.Mipmap.ic_launcher)
					.AddAction(new NotificationCompat.Action(Android.Resource.Drawable.IcMediaPrevious, "Previous", pIntentPrev))
					.AddAction(new NotificationCompat.Action(Android.Resource.Drawable.IcMediaPlay, "Play", pIntentPlayPause))
					.AddAction(new NotificationCompat.Action(Android.Resource.Drawable.IcMediaNext, "Next", pIntentNext))
					.AddAction(new NotificationCompat.Action(Android.Resource.Drawable.IcMenuCloseClearCancel, "Close", pIntentExit))
					.SetDeleteIntent(pIntentExit);

				notificationBuilder.SetStyle(new Android.Support.V4.Media.App.NotificationCompat.MediaStyle()
					.SetShowActionsInCompactView(0, 1, 2, 3)
					.SetMediaSession(audioService.MediaSession.SessionToken));

				if ( audioService.CurrentSong != null && audioService.CurrentSong.Starred)
				{
					notificationBuilder.AddAction(new NotificationCompat.Action(Resource.Drawable.ic_favorite, "Favorite", pIntentFavorite));
				}
				else
				{
					notificationBuilder.AddAction(new NotificationCompat.Action(Resource.Drawable.ic_favorite_border, "Favorite", pIntentFavorite));
				}

				NotificationManager notificationManager = (NotificationManager)Application.Context.GetSystemService(Context.NotificationService);
				notificationManager.Notify(BackgroundAudioService.NOTIFICATION_ID, notificationBuilder.Build());
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
					.PutBitmap(MediaMetadataCompat.MetadataKeyArt, audioService.CurrentSong.Art)
					.Build();

				PlaybackStateCompat state = new PlaybackStateCompat.Builder()
					.SetActions(PlaybackStateCompat.ActionPlay | PlaybackStateCompat.ActionPlayPause | PlaybackStateCompat.ActionPause |
								PlaybackStateCompat.ActionSkipToNext | PlaybackStateCompat.ActionSkipToPrevious)
					.SetState(PlaybackStateCompat.StatePlaying, audioService.MediaPlayer.CurrentPosition.ProgressToTimer(audioService.MediaPlayer.Duration), 1.0f, SystemClock.ElapsedRealtime())
					.Build();
				audioService.MediaSession.SetMetadata(metadata);
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
				NotificationImportance importance = NotificationImportance.Low;
				NotificationChannel mChannel = new NotificationChannel(id, name, importance);
				mChannel.Description = description;
				mChannel.SetShowBadge(false);
				mChannel.LockscreenVisibility = NotificationVisibility.Public;
				notificationManager.CreateNotificationChannel(mChannel);
			}
			catch (Exception ee) { Crashes.TrackError(ee); }
		}
	}
}