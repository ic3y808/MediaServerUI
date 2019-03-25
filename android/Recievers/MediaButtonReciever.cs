﻿using Android.App;
using Android.Content;
using Android.Views;
using Alloy.Providers;
using Alloy.Services;

namespace Alloy.Recievers
{
	[BroadcastReceiver(Enabled = true)]
	[IntentFilter(new[] { Intent.ActionMediaButton, BackgroundAudioService.ActionNext, BackgroundAudioService.ActionPlayPause,BackgroundAudioService.ActionFavorite, BackgroundAudioService.ActionPrevious, BackgroundAudioService.ActionExit })]
	public class MediaButtonReciever : BroadcastReceiver
	{
		private readonly BackgroundAudioService service;
		public MediaButtonReciever(BackgroundAudioService service)
		{
			this.service = service;
		}

		public MediaButtonReciever() { }

		public override void OnReceive(Context context, Intent intent)
		{
			switch (intent.Action)
			{
				case BackgroundAudioService.ActionPlayPause:
					if (service?.MediaPlayer != null && service.MediaPlayer.IsPlaying)
					{
						service?.Pause();
					}
					else
					{
						service?.Play();
					}

					break;
				case BackgroundAudioService.ActionPrevious:
					service?.PlayPreviousSong();
					break;
				case BackgroundAudioService.ActionNext:
					service?.PlayNextSong();
					break;
				case BackgroundAudioService.ActionFavorite:
					DatabaseProvider.SetSongFavorite(service.CurrentSong, !service.CurrentSong.Starred);
					break;
				case BackgroundAudioService.ActionExit:
					NotificationService.CloseNotification();
					Android.OS.Process.KillProcess(Android.OS.Process.MyPid());
					break;

				case Intent.ActionMediaButton:
					var keyEvent = (KeyEvent)intent.GetParcelableExtra(Intent.ExtraKeyEvent);

					switch (keyEvent.KeyCode)
					{
						case Keycode.MediaPlay:
							service?.Play();
							break;
						case Keycode.MediaPlayPause:
							if (service?.MediaPlayer != null && service.MediaPlayer.IsPlaying)
							{
								service?.Pause();
							}
							else
							{
								service?.Play();
							}
							break;
						case Keycode.MediaNext:
							service?.PlayNextSong();
							break;
						case Keycode.MediaPrevious:
							service?.PlayPreviousSong();
							break;
					}
					break;
			}
		}
	}
}