using System;
using System.Collections;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using NUnit.Framework;
using Xamarin.UITest;

namespace Tests
{
	public class AppInitializer
	{
		public static string PathToApk { get; set; }

		public static IApp StartApp(Platform platform)
		{


			PathToApk = Environment.GetEnvironmentVariable("apkPath");
			Debug.WriteLine("environment apk path: " + PathToApk);
			if (string.IsNullOrEmpty(PathToApk))
			{
				string currentFile = new Uri(Assembly.GetExecutingAssembly().CodeBase).LocalPath;
				var directoryInfo = new FileInfo(currentFile).Directory;
				if (directoryInfo?.Parent?.Parent?.Parent != null)
				{
					string dir = directoryInfo.Parent.Parent.Parent.FullName;
					PathToApk = Path.Combine(dir, "Alloy", "bin", "Debug", "com.d3bug.alloy-Signed.apk");
					Debug.WriteLine("local apk path: " + PathToApk);
				}
			}

			if (string.IsNullOrEmpty(PathToApk))
			{
				Debug.WriteLine("Failed to find apkPath");
			}

			if (platform == Platform.Android)
			{
				return ConfigureApp
					.Android
					.EnableLocalScreenshots()
					.ApkFile(PathToApk)
					.StartApp();
			}

			return null;
		}
	}
}