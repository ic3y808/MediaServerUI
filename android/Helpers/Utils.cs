using System;
using System.IO;
using System.Net;
using System.Text;
using System.Xml;
using System.Xml.Serialization;
using Android.Annotation;
using Android.Content.Res;
using Android.OS;
using Android.Util;
using Java.Lang;
using Environment = Android.OS.Environment;
using File = Java.IO.File;
using Uri = Android.Net.Uri;

namespace Alloy.Helpers
{
	public class Utils
	{
		private static Uri ALBUM_ART_URI = Uri.Parse("content://media/external/audio/albumart");
		private static string[] FILE_SYSTEM_UNSAFE = { "/", "\\", "..", ":", "\"", "?", "*", "<", ">", "|" };
		private static string[] FILE_SYSTEM_UNSAFE_DIR = { "\\", "..", ":", "\"", "?", "*", "<", ">", "|" };

		private static char[] HEX_DIGITS = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' };


		public static int toPixels(Resources res, float dp)
		{
			return (int)(dp * res.DisplayMetrics.Density);
		}

		public static int toScreenPixels(Resources res, float sp)
		{
			return (int)TypedValue.ApplyDimension(ComplexUnitType.Sp, sp, res.DisplayMetrics);
		}

		[TargetApi(Value = (int)BuildVersionCodes.JellyBeanMr1)]
		public static bool isRtl(Resources res)
		{
			var dir = res.Configuration.LayoutDirection;
			return (Build.VERSION.SdkInt >= BuildVersionCodes.JellyBeanMr1) && (dir == Android.Views.LayoutDirection.Rtl);
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

		private string UTF8ByteArrayToString(byte[] characters)
		{

			UTF8Encoding encoding = new UTF8Encoding();
			string constructedString = encoding.GetString(characters);
			return (constructedString);
		}

		private static byte[] StringToUTF8ByteArray(string pXmlString)
		{
			UTF8Encoding encoding = new UTF8Encoding();
			byte[] byteArray = encoding.GetBytes(pXmlString);
			return byteArray;
		}

		public static T DeserializeXML<T>(string xmlContent)
		{
			XmlSerializer serializer = new XmlSerializer(typeof(T));
			MemoryStream memoryStream = new MemoryStream(StringToUTF8ByteArray(xmlContent));
			XmlTextWriter xmlTextWriter = new XmlTextWriter(memoryStream, Encoding.UTF8);
			var st  = serializer.Deserialize(memoryStream);
			var sst = (T) st;

			return sst;
		}

		public static void UnlockSsl(bool shouldUnlock)
		{
			if (!shouldUnlock) return;
			ServicePointManager.ServerCertificateValidationCallback = (sender, certificate, chain, errors) => true;
		}
	}
}