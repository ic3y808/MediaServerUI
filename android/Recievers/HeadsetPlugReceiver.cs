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
			var hd = HeadsetDeviceManager.IsConnectedEvent(intent);

			//screen off
			var isInteractive = UiUtils.IsInteractive(context);

			// noisy audio
			var noisyAudio = AudioManager.ActionAudioBecomingNoisy.Equals(intent.Action);
			
			//lockscreen
			var myKM = (KeyguardManager)context.GetSystemService(Context.KeyguardService);
			var atLockscreen = myKM.InKeyguardRestrictedInputMode();

			//media player
			var hasPosition = service?.CurrentSong != null;
			var p = service?.MediaPlayer?.IsPlaying;
			var isPlaying = (p.HasValue && p.Value);

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

		private void startService(Context context, Intent intent)
		{
			//bool readyScreenOffMusic = SettingManager.getInstance().getBoolean("ready_screen_off_music", false);
			//System.Diagnostics.Debug.WriteLine(" startService() - readyScreenOffMusic : " + readyScreenOffMusic);
			//if (readyScreenOffMusic)
			//{
			//	Intent i = new Intent(context, typeof(ScreenOffMusic));
			//	i.PutExtra("extra_bundle", intent);
			//	context.StartService(i);
			//}
		}
	}
}