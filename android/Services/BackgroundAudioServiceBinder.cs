using System;
using Android.Gms.Cast;
using Android.Gms.Cast.Framework.Media;
using Android.Media;
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

		public void Play(Song song)
		{
			Service?.Play(song);
		}

		public void Play(int index, IQueue queue)
		{
			Service?.Play(index, queue);
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

		public MediaPlayer MediaPlayer
		{
			get => Service.MediaPlayer;
			set => Service.MediaPlayer = value;
		}

		public Song CurrentSong
		{
			get => Service.CurrentSong;
			set => Service.CurrentSong = value;
		}

		public MediaQueueItem CurrentQueueSong
		{
			get => Service.CurrentQueueSong;
			set => Service.CurrentQueueSong = value;
		}

		public IQueue MainQueue
		{
			get => Service.MainQueue;
			set => Service.MainQueue = value;
		}

		public RemoteMediaClient Remote
		{
			get => Service.Remote;
			set => Service.Remote = value;
		}

		public MediaSessionCompat MediaSession
		{
			get => Service.MediaSession;
			set => Service.MediaSession = value;
		}
	}
}