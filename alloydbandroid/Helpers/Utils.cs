using System;
using System.Net;
using Android.Annotation;
using Android.App;
using Android.Content.Res;
using Android.OS;
using Android.Util;
using Java.Lang;
using Environment = Android.OS.Environment;
using File = Java.IO.File;
using LayoutDirection = Android.Views.LayoutDirection;
using Math = System.Math;

namespace Alloy.Helpers
{
	public static class Utils
	{
		public static int toPixels(Resources res, float dp)
		{
			return (int)(dp * res.DisplayMetrics.Density);
		}

		public static int toScreenPixels(Resources res, float sp)
		{
			return (int)TypedValue.ApplyDimension(ComplexUnitType.Sp, sp, res.DisplayMetrics);
		}

		public static int DpToPx(int dp)
		{
			DisplayMetrics displayMetrics = Application.Context.Resources.DisplayMetrics;
			return (int)Math.Round(dp * (displayMetrics.Xdpi / (double)DisplayMetricsDensity.Default));
		}

		[TargetApi(Value = (int)BuildVersionCodes.JellyBeanMr1)]
		public static bool isRtl(Resources res)
		{
			LayoutDirection dir = res.Configuration.LayoutDirection;
			return (Build.VERSION.SdkInt >= BuildVersionCodes.JellyBeanMr1) && (dir == LayoutDirection.Rtl);
		}
		
		public static File getProgramDirectory()
		{
			return new File(Environment.ExternalStorageDirectory, "Android/data/com.d3bug.alloy");
		}
		
		public static void RunDelayed(Action action, int delay)
		{
			new Handler(Looper.MainLooper).PostDelayed(new Runnable(action), delay);
		}

		public static void Run(Action action)
		{
			new Handler(Looper.MainLooper).Post(new Runnable(action));
		}
		
		public static void UnlockSsl(bool shouldUnlock)
		{
			if (!shouldUnlock) return;
			ServicePointManager.ServerCertificateValidationCallback = (sender, certificate, chain, errors) => true;
		}
	}
}