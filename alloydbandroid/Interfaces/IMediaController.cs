using Android.Media;
using Alloy.Models;

namespace Alloy.Interfaces
{
	public interface IMediaController
	{
		void Play();
		void Pause();
		void Play(int index, Queue queue);
		void PlayNextSong();
		void PlayPreviousSong();
	}
}