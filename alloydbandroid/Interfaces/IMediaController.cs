using System.Collections.Generic;
using Android.Media;
using Alloy.Models;

namespace Alloy.Interfaces
{
	public interface IMediaController
	{
		void Play();
		void Pause();
		void Play(int index, List<Song> queue);
		void PlayNextSong();
		void PlayPreviousSong();
	}
}