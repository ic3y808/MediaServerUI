using System;
using Android.Bluetooth;
using Android.Content;

namespace Alloy.Models
{
	public class HeadsetDeviceManager
	{
		private BluetoothDevice mLastConnectedBluetoothDevice;
		private int mLastConnectedHeadsetType = -1;

		public void setLastConnectedHeadset(Intent intent)
		{
			String action = intent.Action;
			if (BluetoothA2dp.ActionConnectionStateChanged.Equals(action))
			{
				if (intent.GetIntExtra(Android.Bluetooth.BluetoothA2dp.InterfaceConsts.ExtraState, 0) == 2)
				{
					this.mLastConnectedHeadsetType = 1;
					this.mLastConnectedBluetoothDevice = (BluetoothDevice)intent.GetParcelableExtra(Android.Bluetooth.BluetoothDevice.ExtraDevice);
				}
			}
			else if (Intent.ActionHeadsetPlug.Equals(action) && intent.GetIntExtra("state", 0) == 1)
			{
				this.mLastConnectedHeadsetType = 0;
				this.mLastConnectedBluetoothDevice = null;
			}
		}

		public bool isDisconnectedLastHeadset(Intent intent)
		{
			String action = intent.Action;
			if (BluetoothA2dp.ActionConnectionStateChanged.Equals(action))
			{
				BluetoothDevice device = (BluetoothDevice)intent.GetParcelableExtra(Android.Bluetooth.BluetoothDevice.ExtraDevice);
				if (intent.GetIntExtra(Android.Bluetooth.BluetoothA2dp.InterfaceConsts.ExtraState, 0) == 0 && this.mLastConnectedHeadsetType == 1 && device.Equals(this.mLastConnectedBluetoothDevice))
				{
					return true;
				}
				return false;
			}
			else if (!Intent.ActionHeadsetPlug.Equals(action))
			{
				return false;
			}
			else
			{
				if (intent.GetIntExtra("state", 0) == 0 && this.mLastConnectedHeadsetType == 0)
				{
					return true;
				}
				return false;
			}
		}

		public bool isConnected()
		{
			return this.mLastConnectedHeadsetType != -1;
		}

		public static bool IsConnectedEvent(Intent intent)
		{
			String action = intent.Action;
			if (BluetoothA2dp.ActionConnectionStateChanged.Equals(action))
			{
				if (intent.GetIntExtra(Android.Bluetooth.BluetoothA2dp.InterfaceConsts.ExtraState, 0) == 2)
				{
					return true;
				}
				return false;
			}
			if (!Intent.ActionHeadsetPlug.Equals(action))
			{
				return false;
			}
			return intent.GetIntExtra("state", 0) == 1;
		}

		public static bool isDisconnectedEvent(Intent intent)
		{
			String action = intent.Action;
			if (BluetoothA2dp.ActionConnectionStateChanged.Equals(action))
			{
				if (intent.GetIntExtra(Android.Bluetooth.BluetoothA2dp.InterfaceConsts.ExtraState, 0) == 0)
				{
					return true;
				}
				return false;
			}

			if (!Intent.ActionHeadsetPlug.Equals(action))
			{
				return false;
			}

			if (intent.GetIntExtra("state", 0) != 0)
			{
				return false;
			}
			return true;
		}
	}
}