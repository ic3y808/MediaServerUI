using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Alloy.Helpers;
using Alloy.Interfaces;
using Alloy.Models;
using Alloy.Providers;
using Android.App;
using Android.Content;
using Android.Media;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;

namespace Alloy.Services
{
	public class MediaPlayerService
	{
		public MediaPlayer MediaPlayer { get; set; }
		public Queue MainQueue { get; set; }
		private Song currentSong;
		private long pausedPosition;
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

		public void PrepareSong(Song song)
		{
			//backgroundAudioService.MediaPlayer.SetDataSource(MusicProvider.GetStreamUri(song));

			int result = Utils.Retry.Do(() =>
			{
				//backgroundAudioService.MediaPlayer.PrepareAsync();
				return 0;
			}, TimeSpan.FromSeconds(1), 25);

		}


		public void PrepareQueue(Queue queue)
		{
			foreach (Song song in queue)
			{
				
			}
		}

		public void Play(int index, Queue queue)
		{
			if (loading) return;
			loading = true;

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





			//new PlayLoader(this).Execute();
		}

	}
}