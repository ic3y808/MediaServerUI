using System;
using System.Collections.Generic;
using Android.OS;
using Android.Support.V4.Media.Session;
using Alloy.Interfaces;
using Alloy.Models;

namespace Alloy.Services
{
	public class BackgroundAudioServiceBinder : Binder, IMediaController
	{
		public BackgroundAudioService Service { get; private set; }
		public event EventHandler<StatusEventArg> PlaybackStatusChanged;

		public BackgroundAudioServiceBinder(BackgroundAudioService service)
		{
			this.Service = service;
			service.PlaybackStatusChanged += Service_PlaybackStatusChanged;
		}

		private void Service_PlaybackStatusChanged(object sender, StatusEventArg e)
		{
			PlaybackStatusChanged?.Invoke(sender, e);
		}

		public void Play()
		{
			Service?.Play();
		}

		public void Pause()
		{
			Service?.Pause();
		}

		public void Play(int index, List<Song> queue)
		{
			Service?.Play(index, queue);
		}

		public void Seek(int to)
		{
			Service?.Seek(to);
		}

		public void PlayNextSong()
		{
			Service?.PlayNextSong();
		}

		public Song GetNextSong()
		{
			return Service?.GetNextSong();
		}

		public void PlayPreviousSong()
		{
			Service?.PlayPreviousSong();
		}

		public Song GetPreviousSong()
		{
			return Service?.GetPreviousSong();
		}

		public Song CurrentSong
		{
			get => Service.CurrentSong;
		}

		public List<Song> MainQueue
		{
			get => Service.MainQueue;
			set => Service.MainQueue = value;
		}

		public int CurrentPosition => Service.CurrentPosition;
		public int CurrentQueuePosition => Service.CurrentQueuePosition;
		public int Duration => Service.Duration;

		public MediaSessionCompat MediaSession
		{
			get => Service.MediaSession;
			set => Service.MediaSession = value;
		}

		public bool IsPlaying => Service.IsPlaying;
	}
}