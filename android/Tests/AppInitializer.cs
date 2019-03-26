using System;
using System.Collections;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using NUnit.Framework;
using Xamarin.UITest;
using Xamarin.UITest.Configuration;

namespace Tests
{
	public class AppInitializer
	{
		public static string PathToApk { get; set; }

		public static IApp StartApp(Platform platform)
		{
			if (string.IsNullOrEmpty(PathToApk))
			{
				Debug.WriteLine("Failed to find apkPath");
			}

			if (platform == Platform.Android)
			{
				return ConfigureApp.Android
					.InstalledApp("com.d3bug.alloy")
					.EnableLocalScreenshots()
					.StartApp(AppDataMode.Clear);
			}
			return null;
		}
	}
}