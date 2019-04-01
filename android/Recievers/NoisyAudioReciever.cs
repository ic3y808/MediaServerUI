using Android.App;
using Android.Content;
using Android.Media;
using Alloy.Services;

namespace Alloy.Recievers
{
	//[BroadcastReceiver(Enabled = true)]
	//[IntentFilter(new[] { Android.Content.Intent.ActionMediaButton, AudioManager.ActionAudioBecomingNoisy })]
	public class NoisyAudioReciever : BroadcastReceiver
	{
		private BackgroundAudioService service;
		public NoisyAudioReciever(BackgroundAudioService service)
		{
			this.service = service; 
		}

		public NoisyAudioReciever()
		{
			
		}

		public override void OnReceive(Context context, Intent intent)
		{
			if (!AudioManager.ActionAudioBecomingNoisy.Equals(intent.Action)) return;
			if (service != null && service.MediaPlayer != null && service.MediaPlayer.IsPlaying)
			{
				service.Pause();
			}
		}
	}
}