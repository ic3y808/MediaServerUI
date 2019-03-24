using Android.App;
using Android.Content;
using Alloy.Providers;
using Alloy.Services;

namespace Alloy.Recievers
{
	[BroadcastReceiver(Enabled = false, Process = ":provider")]
	[IntentFilter(new[] { Intent.ActionMediaScannerScanFile, Intent.ActionMediaScannerStarted, Intent.ActionMediaScannerFinished }, DataScheme = "file")]
	public class MusicSyncReceiver : BroadcastReceiver
	{
		private BackgroundAudioService service;
		public MusicSyncReceiver(BackgroundAudioService service)
		{
			this.service = service;
		}

		public MusicSyncReceiver()
		{

		}

		public override void OnReceive(Context context, Intent intent)
		{
			if (Intent.ActionMediaScannerScanFile.Equals(intent.Action))
			{
				System.Diagnostics.Debug.WriteLine("ActionMediaScannerScanFile");
			}
			if (Intent.ActionMediaScannerStarted.Equals(intent.Action))
			{
				System.Diagnostics.Debug.WriteLine("ActionMediaScannerStarted");
			}
			if (Intent.ActionMediaScannerFinished.Equals(intent.Action))
			{
				System.Diagnostics.Debug.WriteLine("ActionMediaScannerFinished");
				MusicProvider.RefreshAllSongs();
			}

		}
	}
}