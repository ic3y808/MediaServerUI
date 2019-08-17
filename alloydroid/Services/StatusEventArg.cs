using Alloy.Models;

namespace Alloy.Services
{
	public class StatusEventArg
	{
		public Song CurrentSong { get; set; }
		public BackgroundAudioStatus Status { get; set; }
	}
}