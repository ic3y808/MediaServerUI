﻿using System.Collections.Generic;
using Alloy.Models;
using Android.App;
using Android.Content;
using Android.Views;
using Alloy.Providers;
using Alloy.Services;
using Newtonsoft.Json;

namespace Alloy.Recievers
{
	[BroadcastReceiver(Enabled = true)]
	[IntentFilter(new[] { Intent.ActionMediaButton, BackgroundAudioService.ActionNext, BackgroundAudioService.ActionPlayPause, BackgroundAudioService.ActionStarTrack, BackgroundAudioService.ActionPrevious, BackgroundAudioService.ActionExit })]
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
				case BackgroundAudioService.ActionPlayNew:
					List<Song> playlist = JsonConvert.DeserializeObject<List<Song>>(intent.GetStringExtra("playlist"));
					int position = intent.GetIntExtra("position", 0);
					service.Play(position, playlist);
					break;
				case BackgroundAudioService.ActionPlayPause:
					if (service.IsPlaying)
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
				case BackgroundAudioService.ActionStarTrack:
					if (service.CurrentSong == null) return;
					if (service.CurrentSong.Starred)
					{
						MusicProvider.RemoveStar(service.CurrentSong);
					}
					else
					{
						MusicProvider.AddStar(service.CurrentSong);
					}
					service.NotificationService1.ShowNotification();
					break;
				case BackgroundAudioService.ActionExit:
					NotificationService.CloseNotification();
					Android.OS.Process.KillProcess(Android.OS.Process.MyPid());
					break;

				case Intent.ActionMediaButton:
					KeyEvent keyEvent = (KeyEvent)intent.GetParcelableExtra(Intent.ExtraKeyEvent);

					switch (keyEvent.KeyCode)
					{
						case Keycode.MediaPlay:
							service?.Play();
							break;
						case Keycode.MediaPlayPause:
							if (service.IsPlaying)
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