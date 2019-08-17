using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Alloy.Models;
using Android.Graphics;
using Android.OS;
using Android.Widget;
using Java.Lang;
using File = Java.IO.File;

namespace Alloy.Helpers
{
	class ImageLoader
	{
#pragma warning disable 1998
		public static async Task LoadImageIntoView(ImageView view, string url, string cacheKey, object o)
#pragma warning restore 1998
		{
			File existingImage = App.Cache.get(cacheKey);
			if (existingImage != null)
			{
				Bitmap fileBitmap = BitmapFactory.DecodeFile(existingImage.AbsolutePath);
				view.SetImageBitmap(fileBitmap);
				if (o is Song song) { song.Art = fileBitmap; }
				if (o is Artist artist) { artist.Art = fileBitmap; }
				if (o is Album album) { album.Art = fileBitmap; }
			}
			else
			{
				view.SetImageBitmap(Extensions.GetDefaultAlbumArtEfficiently());
				new LoadImageToViewTask(view, url, cacheKey).Execute(o);
			}
		}


		public class LoadImageToViewTask : AsyncTask<object, string, Bitmap>
		{
			private readonly string url;
			private readonly ImageView view;
			private readonly string cacheKey;
	
			public LoadImageToViewTask(ImageView view, string url, string cacheKey)
			{
				this.url = url;
				this.view = view;
				this.cacheKey = cacheKey;
			}

			private string ExportBitmapAsPNG(Bitmap bitmap, string key)
			{
				string sdCardPath = System.Environment.GetFolderPath(System.Environment.SpecialFolder.Personal);
				string filePath = System.IO.Path.Combine(sdCardPath, key + ".png");
				FileStream stream = new FileStream(filePath, FileMode.Create);
				bitmap.Compress(Bitmap.CompressFormat.Png, 100, stream);
				stream.Close();
				return filePath;
			}

			protected override Bitmap RunInBackground(params object[] @params)
			{
				HttpClient client = new HttpClient();
				Task<HttpResponseMessage> task = client.GetAsync(url);
				task.Wait();

				HttpResponseMessage response = task.Result;
				if (!response.IsSuccessStatusCode) return null;
				Task<byte[]> stream = response.Content.ReadAsByteArrayAsync();
				stream.Wait();
				Bitmap bitmap = BitmapFactory.DecodeByteArray(stream.Result, 0, stream.Result.Length);
				if (bitmap == null || bitmap.Width <= 1 || bitmap.Height <= 1) return bitmap;
				App.Cache.put(cacheKey, new File(ExportBitmapAsPNG(bitmap, cacheKey)));

				if (@params[0] is Song song) { song.Art = bitmap; }
				if (@params[0] is Artist artist) { artist.Art = bitmap; }
				if (@params[0] is Album album) { album.Art = bitmap; }
				new Handler(Looper.MainLooper).PostDelayed(new Runnable(() =>
				{
					view.SetImageBitmap(bitmap);
				}), 0);

				return bitmap;
			}
		}
	}
}