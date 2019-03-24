using System;
using System.Collections.Generic;
using Android.App;
using Android.Content;
using Microsoft.AppCenter.Crashes;

namespace Alloy.Helpers
{
	public static class StorageHelpers
	{
		public static List<string> GetAvaliableStorages()
		{
			List<string> list = null;
			try
			{
				var storageManager = (Android.OS.Storage.StorageManager)Application.Context.GetSystemService(Context.StorageService);

				var volumeList = (Java.Lang.Object[])storageManager.Class.GetDeclaredMethod("getVolumeList").Invoke(storageManager);

				list = new List<string>();

				foreach (var storage in volumeList)
				{
					Java.IO.File info = (Java.IO.File)storage.Class.GetDeclaredMethod("getPathFile").Invoke(storage);

					if ((bool)storage.Class.GetDeclaredMethod("isEmulated").Invoke(storage) == false && info.TotalSpace > 0)
					{
						list.Add(info.Path);
					}
				}
			}
			catch (Exception e)
			{
				Crashes.TrackError(e);
			}

			return list;
		}
	}
}