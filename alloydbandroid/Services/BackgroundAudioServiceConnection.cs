using System;
using Android.Content;
using Android.Media;
using Android.OS;
using Android.Support.V4.Media.Session;
using Alloy.Interfaces;
using Alloy.Models;

namespace Alloy.Services
{
	public class BackgroundAudioServiceConnection : Java.Lang.Object, IServiceConnection, IMediaController
	{
		private static BackgroundAudioServiceBinder binder;
		public static event EventHandler<StatusEventArg> PlaybackStatusChanged;
		public event EventHandler<bool> ServiceConnected;

		public BackgroundAudioServiceConnection()
		{
			IsConnected = false;
		}

		public bool IsConnected { get; private set; }

		public static BackgroundAudioServiceBinder Binder
		{
			get => binder;
			private set
			{
				binder = value;
				Binder.PlaybackStatusChanged += Binder_PlaybackStatusChanged;
			}
		}

		private static void Binder_PlaybackStatusChanged(object sender, StatusEventArg e)
		{
			PlaybackStatusChanged?.Invoke(null, e);
		}

		public void OnServiceConnected(ComponentName name, IBinder service)
		{
			Binder = service as BackgroundAudioServiceBinder;
			IsConnected = Binder != null;

			ServiceConnected?.Invoke(this, IsConnected);
		}

		public void OnServiceDisconnected(ComponentName name)
		{
			IsConnected = false;
			Binder = null;
		}

		public void Play()
		{
			Binder?.Service.Play();
		}

		public void Pause()
		{
			Binder?.Service.Pause();
		}

		public void Play(int index, Queue queue)
		{
			Binder?.Service.Play(index, queue);
		}

		public void PlayNextSong()
		{
			Binder?.Service.PlayNextSong();
		}

		public Song GetNextSong()
		{
			return Binder?.Service.GetNextSong();
		}

		public void PlayPreviousSong()
		{
			Binder?.Service.PlayPreviousSong();
		}

		public Song GetPreviousSong()
		{
			return Binder?.Service.GetPreviousSong();
		}

		public MediaPlayer MediaPlayer
		{
			get => Binder.MediaPlayer;
			set => Binder.MediaPlayer = value;
		}

		public Song CurrentSong
		{
			get => Binder.CurrentSong;
			set => Binder.CurrentSong = value;
		}
		
		public Queue MainQueue
		{
			get => Binder.MainQueue;
			set => Binder.MainQueue = value;
		}

		public MediaSessionCompat MediaSession
		{
			get => Binder.MediaSession;
			set => Binder.MediaSession = value;
		}

		public bool IsPlaying => Binder.IsPlaying;
	}
}