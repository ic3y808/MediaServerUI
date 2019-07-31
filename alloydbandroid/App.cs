using System;
using Alloy.Helpers.DiskLRUCache;
using Android.App;
using Android.Runtime;
using Java.IO;
using Microsoft.AppCenter.Crashes;

namespace Alloy
{
	[Application(Enabled = true, AllowClearUserData = true)]
	public class App : Application
	{
		protected App(IntPtr javaReference, JniHandleOwnership transfer) : base(javaReference, transfer)
		{
		}

		private static long CACHE_SIZE = 1024 * 1000000; // in bytes

		public override void OnCreate()
		{
			base.OnCreate();
			File cacheDir = CacheDir;
			try
			{
				Cache = DiskLruCache.create(cacheDir, CACHE_SIZE);
			}
			catch (IOException e)
			{
				Crashes.TrackError(e);
			}
		}

		public static DiskLruCache Cache { get; private set; }
	}
}