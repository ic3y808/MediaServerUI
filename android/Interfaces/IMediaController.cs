using Android.Media;
using Alloy.Models;

namespace Alloy.Interfaces
{
	public interface IMediaController
	{
		void Play();
		void Pause();
		void Play(Song song);
		void Play(int index, IQueue queue);
		void PlayNextSong();
		void PlayPreviousSong();
		MediaPlayer MediaPlayer { get; set; }
	}
}