using Android.App;
using Android.Bluetooth;
using Android.Content;
using Android.Media;
using Java.Lang;
using Alloy.Common;
using Alloy.Models;
using Alloy.Services;

namespace Alloy.Recievers
{
	[BroadcastReceiver(Enabled = true)]
	[IntentFilter(new[] { Intent.ActionHeadsetPlug, BluetoothA2dp.ActionConnectionStateChanged, AudioManager.ActionAudioBecomingNoisy })]
	public class HeadsetPlugReceiver : BroadcastReceiver
	{
		private readonly BackgroundAudioService service;

		public HeadsetPlugReceiver(BackgroundAudioService service)
		{
			this.service = service;
		}

		public HeadsetPlugReceiver(){}

		public override void OnReceive(Context context, Intent intent)
		{
			PackageUtil.SetPackageDoNotKill(Class.FromType(typeof(HeadsetPlugReceiver)), context, false);
		
			//headset device
			bool hd = HeadsetDeviceManager.IsConnectedEvent(intent);

			//screen off
			bool isInteractive = UiUtils.IsInteractive(context);

			// noisy audio
			bool noisyAudio = AudioManager.ActionAudioBecomingNoisy.Equals(intent.Action);
			
			//lockscreen
			KeyguardManager myKM = (KeyguardManager)context.GetSystemService(Context.KeyguardService);
			bool atLockscreen = myKM.InKeyguardRestrictedInputMode();

			//media player
			bool hasPosition = service?.CurrentSong != null;
			bool? p = service?.MediaPlayer?.IsPlaying;
			bool isPlaying = (p.HasValue && p.Value);

			if (!hd && (!isInteractive || atLockscreen) && hasPosition && isPlaying)
			{
				service?.Pause();
			}
			else if (hd && (!isInteractive || atLockscreen) && hasPosition && !isPlaying)
			{
				service?.Play();
			}
			else if (noisyAudio && (!isInteractive || atLockscreen) && hasPosition && isPlaying) { service?.Pause(); }
		}
	}
}