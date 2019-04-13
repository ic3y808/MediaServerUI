using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Reflection;
using Android.App;
using Android.Content;
using Android.Database;
using Android.Graphics;
using Android.Hardware;
using Android.OS;
using Android.Provider;
using Android.Renderscripts;
using Android.Widget;
using Microsoft.AppCenter.Crashes;
using Alloy.Models;
using Alloy.Providers;

using Bumptech.Glide;
using Exception = System.Exception;
using Math = System.Math;
using String = System.String;
using StringBuilder = System.Text.StringBuilder;
using Type = System.Type;

namespace Alloy.Helpers
{
	public static class Extensions
	{
		private static bool hasUpdated;
		private static DateTime lastUpdate;
		private static float last_x;
		private static float last_y;
		private static float last_z;
		private static SensorManager sensorManager;
		private static ISensorEventListener currentListener;
		const int ShakeDetectionTimeLapse = 250;
		const double ShakeThreshold = 800;
		private static Bitmap defaultBitmapArt;

		private static Random rng = new Random();

		public static int GetProgressPercentage(this long currentDuration, long totalDuration)
		{
			return GetProgressPercentage((int)currentDuration, totalDuration);
		}

		public static int GetProgressPercentage(this int currentDuration, long totalDuration)
		{
			long currentSeconds = currentDuration / 1000;
			long totalSeconds = (int)(totalDuration / 1000);

			// calculating percentage
			double percentage = (((double)currentSeconds) / totalSeconds) * 100;

			// return percentage
			return (int)percentage;
		}

		public static int ProgressToTimer(this int progress, int totalDuration)
		{
			int td = totalDuration / 1000;
			int currentDuration = (int)((double)progress / 100 * td);
			return currentDuration * 1000;
		}

		public static void Move<T>(this List<T> list, int oldIndex, int newIndex)
		{
			if ((oldIndex == newIndex) || (0 > oldIndex) || (oldIndex >= list.Count) || (0 > newIndex) ||
				(newIndex >= list.Count)) return;

			int i;
			T tmp = list[oldIndex];
			if (oldIndex < newIndex)
			{
				for (i = oldIndex; i < newIndex; i++)
				{
					list[i] = list[i + 1];
				}
			}
			else
			{
				for (i = oldIndex; i > newIndex; i--)
				{
					list[i] = list[i - 1];
				}
			}
			list[newIndex] = tmp;
		}

		public static Bitmap Blur(this Bitmap image, int radius)
		{
			if (image == null) return null;
			Bitmap inputBitmap = image.Copy(image.GetConfig(), true);
			Bitmap outputBitmap = image.Copy(image.GetConfig(), true);

			RenderScript rs = RenderScript.Create(Application.Context);
			ScriptIntrinsicBlur theIntrinsic = ScriptIntrinsicBlur.Create(rs, Element.U8_4(rs));
			Allocation tmpIn = Allocation.CreateFromBitmap(rs, inputBitmap);
			inputBitmap.Recycle();
			inputBitmap.Dispose();
			Allocation tmpOut = Allocation.CreateFromBitmap(rs, outputBitmap);
			theIntrinsic.SetRadius(Math.Max(0, Math.Min(25, radius)));
			theIntrinsic.SetInput(tmpIn);
			theIntrinsic.ForEach(tmpOut);
			tmpOut.CopyTo(outputBitmap);
			tmpIn.Dispose();
			tmpOut.Dispose();
			int x = image.Width / 2 - (int)(image.Width * 0.25f);


			outputBitmap = Bitmap.CreateBitmap(outputBitmap, x, 0, (int)(image.Width * 0.25f), image.Height);


			return outputBitmap;
		}

		public static Dictionary<string, Bitmap> ImageCache { get; set; }

		public static Bitmap GetImageBitmapFromUrl(string url)
		{
			if (ImageCache == null) ImageCache = new Dictionary<string, Bitmap>();
			if (ImageCache.ContainsKey(url))
			{
				return ImageCache[url];
			}

			Bitmap imageBitmap = null;

			using (WebClient webClient = new WebClient())
			{
				byte[] imageBytes = webClient.DownloadData(url);
				if (imageBytes != null && imageBytes.Length > 0)
				{
					imageBitmap = BitmapFactory.DecodeByteArray(imageBytes, 0, imageBytes.Length);
				}
			}
			if (imageBitmap == null) imageBitmap = GetDefaultAlbumArtEfficiently();
			ImageCache[url] = imageBitmap;
			return imageBitmap;
		}

		public static Bitmap GetAlbumArt(this Song song)
		{
			try
			{
				return GetBitmap(MusicProvider.GetAlbumArt(new Dictionary<string, object> { { "track_id", song.Id } }));
			}
			catch (Exception e)
			{
				Crashes.TrackError(e);
				return null;
			}
		}

		public static void GetAlbumArt(this Song song, ImageView view)
		{
			try { Glide.With(Application.Context).Load(MusicProvider.GetAlbumArt(new Dictionary<string, object> { { "track_id", song.Id } })).Into(view); }
			catch (Exception e)
			{
				Crashes.TrackError(e);
			}
		}

		public static void GetAlbumArt(this Artist artist, ImageView view)
		{
			try { Glide.With(Application.Context).Load(MusicProvider.GetAlbumArt(new Dictionary<string, object> { { "artist_id", artist.Id } })).Into(view); }
			catch (Exception e)
			{
				Crashes.TrackError(e);
			}
		}

		public static void GetAlbumArt(this Genre genre, ImageView view)
		{
			try { Glide.With(Application.Context).Load(MusicProvider.GetAlbumArt(new Dictionary<string, object> { { "genre_id", genre.Id } })).Into(view); }
			catch (Exception e)
			{
				Crashes.TrackError(e);
			}
		}

		public static void GetAlbumArt(this Album album, ImageView view)
		{
			try { Glide.With(Application.Context).Load(MusicProvider.GetAlbumArt(new Dictionary<string, object> { { "album_id", album.Id } })).Into(view); }
			catch (Exception e)
			{
				Crashes.TrackError(e);
			}
		}

		public static Bitmap GetDefaultAlbumArtEfficiently()
		{
			return defaultBitmapArt ?? (defaultBitmapArt = BitmapFactory.DecodeResource(Application.Context.Resources, Resource.Drawable.wave));
		}

		public static void StartForegroundServiceComapt<T>(this Context context, Bundle args) where T : Service
		{
			Intent intent = new Intent(context, typeof(T));
			if (args != null)
			{
				intent.PutExtras(args);
			}
			if (Build.VERSION.SdkInt >= BuildVersionCodes.O)
			{
				context.StartForegroundService(intent);
			}
			else
			{
				context.StartService(intent);
			}
		}

		public static void StartForegroundServiceComapt<T>(this Context context) where T : Service
		{
			Intent intent = new Intent(context, typeof(T));
			if (Build.VERSION.SdkInt >= BuildVersionCodes.O)
			{
				context.StartForegroundService(intent);
			}
			else
			{
				context.StartService(intent);
			}
		}

		public static void ChangeTo(this FragmentManager fragmentManager, Fragment otherFragment)
		{
			FragmentTransaction fragmentTx = fragmentManager.BeginTransaction();
			fragmentTx.Replace(Resource.Id.flContent, otherFragment);
			fragmentTx.Commit();
		}

		public static void ChangeTo(this FragmentManager fragmentManager, Fragment otherFragment, bool stack, string name)
		{
			FragmentTransaction fragmentTx = fragmentManager.BeginTransaction();
			if (stack)
			{
				fragmentTx.AddToBackStack(name);
			}
			fragmentTx.Replace(Resource.Id.flContent, otherFragment);
			fragmentTx.Commit();
		}

		public static void ChangeTo(this FragmentManager fragmentManager, Fragment otherFragment, bool stack, string name, Bundle bundle)
		{
			FragmentTransaction fragmentTx = fragmentManager.BeginTransaction();
			if (stack)
			{
				fragmentTx.AddToBackStack(name);
			}
			if (bundle != null) { otherFragment.Arguments = bundle; }
			fragmentTx.Replace(Resource.Id.flContent, otherFragment);
			fragmentTx.Commit();
		}

		public static void Shuffle<T>(this IList<T> list)
		{
			int n = list.Count;
			while (n > 1)
			{
				n--;
				int k = rng.Next(n + 1);
				T value = list[k];
				list[k] = list[n];
				list[n] = value;
			}
		}

		public class HttpValueCollection : Dictionary<string, string>
		{
			public override string ToString()
			{

				if (Count == 0)
				{
					return string.Empty;
				}

				StringBuilder stringBuilder = new StringBuilder();

				foreach (KeyValuePair<string, string> item in this)
				{
					string key = item.Key;
					string value = item.Value;
					key = WebUtility.UrlDecode(key);
					if (stringBuilder.Length > 0)
					{
						stringBuilder.Append('&');
					}
					stringBuilder.Append((key != null) ? (key + "=") : string.Empty);
					if (string.IsNullOrEmpty(value)) continue;
					value = WebUtility.UrlEncode(value);
					stringBuilder.Append(value);
				}

				return stringBuilder.ToString();
			}
		}

		public static Bitmap GetBitmap(this string url)
		{
			Bitmap imageBitmap = null;
			using (WebClient webClient = new WebClient())
			{
				if (string.IsNullOrEmpty(url)) return null;
				byte[] imageBytes = webClient.DownloadData(url);
				if (imageBytes != null && imageBytes.Length > 0)
				{
					imageBitmap = BitmapFactory.DecodeByteArray(imageBytes, 0, imageBytes.Length);
				}
			}

			return imageBitmap;
		}

		public static object CopyPropertiesTo(this object source, object destination)
		{
			if (source == null) return null;
			if (destination == null) return null;
			Type typeDest = destination.GetType();
			Type typeSrc = source.GetType();

			// Iterate the Properties of the source instance and  
			// populate them from their desination counterparts  
			PropertyInfo[] srcProps = typeSrc.GetProperties();
			foreach (PropertyInfo srcProp in srcProps)
			{
				if (!srcProp.CanRead)
				{
					continue;
				}
				PropertyInfo targetProperty = typeDest.GetProperty(srcProp.Name);
				if (targetProperty == null)
				{
					continue;
				}
				if (!targetProperty.CanWrite)
				{
					continue;
				}
				if (targetProperty.GetSetMethod(true) != null && targetProperty.GetSetMethod(true).IsPrivate)
				{
					continue;
				}
				if ((targetProperty.GetSetMethod().Attributes & MethodAttributes.Static) != 0)
				{
					continue;
				}
				if (!targetProperty.PropertyType.IsAssignableFrom(srcProp.PropertyType))
				{
					continue;
				}

				// Passed all tests, lets set the value
				targetProperty.SetValue(destination, srcProp.GetValue(source, null), null);
			}

			return destination;
		}

		public static Song CopyProperties(this object source)
		{
			if (source == null) return null;
			// If any this null throw an exception
			Song destination = new Song();

			// Getting the Types of the objects
			Type typeDest = destination.GetType();
			Type typeSrc = source.GetType();

			// Iterate the Properties of the source instance and  
			// populate them from their desination counterparts  
			PropertyInfo[] srcProps = typeSrc.GetProperties();
			foreach (PropertyInfo srcProp in srcProps)
			{
				if (!srcProp.CanRead)
				{
					continue;
				}
				PropertyInfo targetProperty = typeDest.GetProperty(srcProp.Name);
				if (targetProperty == null)
				{
					continue;
				}
				if (!targetProperty.CanWrite)
				{
					continue;
				}
				if (targetProperty.GetSetMethod(true) != null && targetProperty.GetSetMethod(true).IsPrivate)
				{
					continue;
				}
				if ((targetProperty.GetSetMethod().Attributes & MethodAttributes.Static) != 0)
				{
					continue;
				}
				if (!targetProperty.PropertyType.IsAssignableFrom(srcProp.PropertyType))
				{
					continue;
				}

				// Passed all tests, lets set the value
				targetProperty.SetValue(destination, srcProp.GetValue(source, null), null);
			}

			return destination;
		}

		public static string ToTimeFromSeconds(this int l)
		{
			TimeSpan duration = TimeSpan.FromSeconds(l);
			string duration_string;

			if (duration.Hours > 0)
				duration_string = duration.Hours + ":" + duration.Minutes.ToString("00") + ":" + duration.Seconds.ToString("00");
			else
				duration_string = duration.Minutes.ToString("00") + ":" + duration.Seconds.ToString("00");

			return duration_string;
		}
		public static string ToTime(this long l)
		{
			TimeSpan duration = TimeSpan.FromMilliseconds(l);
			string duration_string;

			if (duration.Hours > 0)
				duration_string = duration.Hours + ":" + duration.Minutes.ToString("00") + ":" + duration.Seconds.ToString("00");
			else
				duration_string = duration.Minutes.ToString("00") + ":" + duration.Seconds.ToString("00");

			return duration_string;
		}

		public static string ToTime(this int l)
		{
			return ToTime((long)l);
		}

		public static string ToTime(this int? l)
		{
			if (!l.HasValue) return "00:00";
			TimeSpan duration = TimeSpan.FromSeconds(l.Value);
			return ToTime((long)duration.TotalMilliseconds);
		}

		public static MemoryStream GetImageForTag(this string url)
		{
			try
			{
				if (string.IsNullOrEmpty(url)) { return null; }

				if (url.Contains("large")) url = url.Replace("large", "t500x500");
				const int bytesToRead = 100;

				WebRequest request = WebRequest.Create(new Uri(url, UriKind.Absolute));
				request.Timeout = -1;
				WebResponse response = request.GetResponse();
				Stream responseStream = response.GetResponseStream();
				if (responseStream != null)
				{
					MemoryStream memoryStream;
					byte[] bytebuffer = new byte[bytesToRead];
					using (BinaryReader reader = new BinaryReader(responseStream))
					{
						memoryStream = new MemoryStream();

						int bytesRead = reader.Read(bytebuffer, 0, bytesToRead);

						while (bytesRead > 0)
						{
							memoryStream.Write(bytebuffer, 0, bytesRead);
							bytesRead = reader.Read(bytebuffer, 0, bytesToRead);
						}
					}

					return memoryStream;
				}
			}
			catch (Exception e)
			{
				Crashes.TrackError(e);
			}

			return null;
		}

		public static void ResetShake()
		{
			StopShake();
			hasUpdated = false;
			lastUpdate = DateTime.MinValue;
			last_x = 0.0f;
			last_y = 0.0f;
			last_z = 0.0f;
		}

		public static void StartShake(Activity activity, ISensorEventListener listener)
		{
			if (currentListener != null)
			{
				StopShake();
			}
			currentListener = listener;
			if (sensorManager == null) sensorManager = activity.GetSystemService(Context.SensorService) as SensorManager;
			if (sensorManager == null) return;
			Sensor sensor = sensorManager.GetDefaultSensor(SensorType.Accelerometer);
			sensorManager.RegisterListener(listener, sensor, SensorDelay.Game);
		}

		public static void StopShake()
		{
			if (currentListener == null) return;
			if (sensorManager == null) return;
			sensorManager.UnregisterListener(currentListener);
			currentListener = null;
		}

		public static bool WasShaken(this SensorEvent e)
		{
			if (e.Sensor.Type == SensorType.Accelerometer)
			{
				float x = e.Values[0];
				float y = e.Values[1];
				float z = e.Values[2];

				DateTime curTime = DateTime.Now;
				if (hasUpdated == false)
				{
					hasUpdated = true;
					lastUpdate = curTime;
					last_x = x;
					last_y = y;
					last_z = z;
				}
				else
				{
					if ((curTime - lastUpdate).TotalMilliseconds > ShakeDetectionTimeLapse)
					{
						float diffTime = (float)(curTime - lastUpdate).TotalMilliseconds;
						lastUpdate = curTime;
						float total = x + y + z - last_x - last_y - last_z;
						float speed = Math.Abs(total) / diffTime * 10000;

						if (speed > ShakeThreshold) { return true; }

						last_x = x;
						last_y = y;
						last_z = z;
					}
				}
			}

			return false;
		}

		public static Color GetDominateColor(this Bitmap b)
		{
			Bitmap newBitmap = Bitmap.CreateScaledBitmap(b, 1, 1, true);
			int color = newBitmap.GetPixel(0, 0);

			newBitmap.Recycle();
			return Color.Argb(255, Color.GetRedComponent(color), Color.GetGreenComponent(color), Color.GetBlueComponent(color));
		}

		public static float Square(float n)
		{
			return n * n;
		}

		public static Color WithAlpha(this Color color, int alpha)
		{
			return Color.Argb(alpha, color.R, color.G, color.B);
		}

		public static Color Contrasting(this Color color, int amount)
		{
			return OverlaidWith((color.GetBrightness() >= 0.5f
				? Color.Black
				: Color.White).WithAlpha(amount));
		}

		public static int Luminance(this Color color)
		{
			int lum = (77 * ((color.R >> 16) & 255)
					   + 150 * ((color.G >> 8) & 255)
					   + 29 * ((color.B) & 255)) >> 8;
			return lum;
		}

		public static Color OverlaidWith(this Color src)
		{
			if (src.A <= 0)
				return src;

			int invA = 0xff - src.A;
			int resA = 0xff - (((0xff - src.A) * invA) >> 8);

			if (resA <= 0)
				return src;

			int da = (invA * src.A) / resA;

			return Color.Argb(da, src.R, src.G, src.B);
		}

		public static string RealPath(this Android.Net.Uri contentUri)
		{
			ICursor cursor = null;
			try
			{
				String[] proj = { MediaStore.Images.Media.InterfaceConsts.Data };
				cursor = Application.Context.ContentResolver.Query(contentUri, proj, null, null, null);
				int column_index = cursor.GetColumnIndexOrThrow(MediaStore.Audio.Media.InterfaceConsts.Data);
				cursor.MoveToFirst();
				if (cursor.Count == 0)
				{
					cursor.Close();
					return null;
				}
				return cursor.GetString(column_index);
			}
			finally
			{
				if (cursor != null)
				{
					cursor.Close();
				}
			}
		}



		public static void Toast(this string text)
		{
			Android.Widget.Toast.MakeText(Application.Context, text, ToastLength.Long);
		}
	}
}