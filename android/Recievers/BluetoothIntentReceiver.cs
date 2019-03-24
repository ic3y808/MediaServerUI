using Android.App;
using Android.Bluetooth;
using Android.Content;
using Alloy.Services;

namespace Alloy.Recievers
{
	[BroadcastReceiver(Enabled = true)]
	[IntentFilter(new[] { Android.Bluetooth.BluetoothDevice.ActionAclConnected, Android.Bluetooth.BluetoothDevice.ActionAclDisconnectRequested, Android.Bluetooth.BluetoothDevice.ActionAclDisconnected })]
	public class BluetoothIntentReceiver : BroadcastReceiver
	{
		private BackgroundAudioService service;
		public BluetoothIntentReceiver(BackgroundAudioService service)
		{
			this.service = service; 
		}

		public BluetoothIntentReceiver()
		{
			
		}

		public override void OnReceive(Context context, Intent intent)
		{
			int state = intent.GetIntExtra("android.bluetooth.a2dp.extra.SINK_STATE", -1);
			BluetoothDevice device = intent.GetParcelableExtra(BluetoothDevice.ExtraDevice) as BluetoothDevice;
			string action = intent.Action;
			string name = device != null ? device.Name : "None";

			//Log.Debug(TAG, String.format("Sink State: %d; Action: %s; Device: %s", state, action, name));

			bool actionConnected = false;
			bool actionDisconnected = false;

			if (BluetoothDevice.ActionAclConnected.Equals(action))
			{
				actionConnected = true;
			}
			else if (BluetoothDevice.ActionAclDisconnected.Equals(action) || BluetoothDevice.ActionAclDisconnectRequested.Equals(action))
			{
				actionDisconnected = true;
			}
			System.Diagnostics.Debug.WriteLine($"BluetoothDevice actionConnected {actionConnected} actionDisconnected {actionDisconnected}");
			//bool connected = state == Android.Bluetooth.BluetoothA2dp.STATE_CONNECTED || actionConnected;
			//bool disconnected = state == android.bluetooth.BluetoothA2dp.STATE_DISCONNECTED || actionDisconnected;

			
		}
	}
}