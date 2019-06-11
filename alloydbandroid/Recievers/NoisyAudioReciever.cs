using Android.Content;
using Android.Media;
using Alloy.Services;

namespace Alloy.Recievers
{
	public class NoisyAudioReciever : BroadcastReceiver
	{
		private readonly BackgroundAudioService serviceConnection;
		public NoisyAudioReciever(BackgroundAudioService service)
		{
			serviceConnection = service; 
		}

		public NoisyAudioReciever()
		{
			// required
		}

		public override void OnReceive(Context context, Intent intent)
		{
			if (!AudioManager.ActionAudioBecomingNoisy.Equals(intent.Action)) return;
			if (serviceConnection != null && serviceConnection.MediaPlayer != null && serviceConnection.MediaPlayer.IsPlaying)
			{
				serviceConnection.Pause();
			}
		}
	}
}