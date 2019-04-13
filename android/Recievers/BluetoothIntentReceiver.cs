using Android.App;
using Android.Bluetooth;
using Android.Content;
using Alloy.Services;
using Android.Util;

namespace Alloy.Recievers
{
	[BroadcastReceiver(Enabled = true)]
	[IntentFilter(new[] { BluetoothDevice.ActionAclConnected, BluetoothDevice.ActionAclDisconnectRequested, BluetoothDevice.ActionAclDisconnected })]
	public class BluetoothIntentReceiver : BroadcastReceiver
	{
		public BackgroundAudioService ServiceProvider { get; set; }
		private const string TAG = "BluetoothIntentReceiver";

		public BluetoothIntentReceiver()
		{
			//must provide default
		}

		public BluetoothIntentReceiver(BackgroundAudioService serviceProvider)
		{
			ServiceProvider = serviceProvider;
		}

		public override void OnReceive(Context context, Intent intent)
		{
			int state = intent.GetIntExtra("android.bluetooth.a2dp.extra.SINK_STATE", -1);
			BluetoothDevice device = intent.GetParcelableExtra(BluetoothDevice.ExtraDevice) as BluetoothDevice;
			string action = intent.Action;
			string name = device != null ? device.Name : "None";
			Log.Debug(TAG, $"Sink State: {state}; Action:{action}; Device: {name}");

			bool actionConnected = false;
			bool actionDisconnected = false;

			if (BluetoothDevice.ActionAclConnected.Equals(action))
			{
				actionConnected = true;
				ServiceProvider.Play();
			}
			else if (BluetoothDevice.ActionAclDisconnected.Equals(action) || BluetoothDevice.ActionAclDisconnectRequested.Equals(action))
			{
				actionDisconnected = true;
				ServiceProvider.Pause();
			}
			System.Diagnostics.Debug.WriteLine($"BluetoothDevice actionConnected {actionConnected} actionDisconnected {actionDisconnected}");
		}
	}
}