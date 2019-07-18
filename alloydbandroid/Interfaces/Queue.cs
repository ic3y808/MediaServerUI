using System;
using System.Collections.Generic;
using System.Linq;
using Alloy.Helpers;
using Alloy.Models;
using Alloy.Providers;
using Android.App;
using Android.Drm;
using Android.Media;

namespace Alloy.Interfaces
{
	public class Queue : List<Song>
	{
		public Dictionary<Song, MediaPlayer> Players { get; set; }
		public Song CurrentSong { get; set; }
		public System.EventHandler<MediaPlayer.BufferingUpdateEventArgs> BufferUpdate;
		public EventHandler Completion;
		public EventHandler<MediaPlayer.ErrorEventArgs> Error;
		public EventHandler<MediaPlayer.InfoEventArgs> Info;

		public Queue()
		{
			Players = new Dictionary<Song, MediaPlayer>();
		}

		public new void Add(Song song)
		{
			base.Add(song);
			Players[song] = new MediaPlayer();
			Players[song].SetDataSource(MusicProvider.GetStreamUri(song));
		}

		public void SetCurrentSong(int index)
		{
			if (CurrentSong != null) CurrentSong.IsSelected = false;
			CurrentSong = this[index];
		}

		public void PlayCurrentTrack()
		{
			Players[CurrentSong].SeekTo(0);
			Players[CurrentSong].Start();
		}

		public void Play()
		{
			Players[CurrentSong]?.Start();
		}

		public void Pause()
		{
			Players[CurrentSong]?.Pause();
		}

		public void Stop()
		{
			Players[CurrentSong]?.Pause();
			Players[CurrentSong]?.SeekTo(0);
		}

		public void Release()
		{
			foreach (KeyValuePair<Song, MediaPlayer> keyValuePair in Players)
			{
				keyValuePair.Value.Stop();
				keyValuePair.Value.Release();
				UnWire(keyValuePair.Value);
			}
			Players.Clear();
			foreach (Song song in this)
			{
				song.IsPrepared = false;
				song.IsSelected = false;
			}
			Clear();
		}

		public void Seek(int to)
		{
			Players[CurrentSong].SeekTo(to);
		}

		public bool IsPlaying => Players.Any(pair => pair.Value.IsPlaying);
		public int CurrentPosition => Players[CurrentSong].CurrentPosition;
		public int Duration => Players[CurrentSong].Duration;

		public virtual void PrepareTracks()
		{
			foreach (Song song in this)
			{
				if (song.IsPrepared) continue;
				MediaPlayer player = Players[song];
				Wire(player);
				Prepare(player, song, () =>
				{

				});
			}
		}

		public virtual void Prepare(int index, Action callback)
		{
			if (this[index].IsPrepared)
			{
				callback();
			}
			else
			{
				Song song = this[index];
				MediaPlayer player = Players[song];
				Wire(player);
				Prepare(player, song, callback);
			}
		}

		public void Wire(MediaPlayer player)
		{
			player.BufferingUpdate += BufferUpdate;
			player.Completion += Completion;
			player.Error += Error;
			player.Info += Info;
		}
		public void UnWire(MediaPlayer player)
		{
			player.BufferingUpdate -= BufferUpdate;
			player.Completion -= Completion;
			player.Error -= Error;
			player.Info -= Info;
		}

		private void Prepare(MediaPlayer player, Song song, Action callback)
		{
			player.PrepareAsync();
			player.Prepared += (s, e) =>
			{
				song.IsPrepared = true;
				callback();
			};
		}
	}
}
