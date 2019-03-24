using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
using System.Reflection;
using Android.App;
using Android.Content;
using Android.Media;
using Android.OS;
using Android.Widget;
using Alloy.Common;
using Alloy.Helpers;
using Alloy.Models;
using Android.Graphics;
using Android.Support.V7.Preferences;
using Microsoft.AppCenter.Crashes;
using Newtonsoft.Json;
using Debug = System.Diagnostics.Debug;
using Extensions = Alloy.Helpers.Extensions;
using IQueue = Alloy.Interfaces.IQueue;
using Path = System.IO.Path;


namespace Alloy.Providers
{
	public class MusicQueue : IQueue
	{
		public override void GetMoreData()
		{

		}

		public override void Refresh()
		{

		}

		public override string NextHref { get; set; }
	}

	public class MusicProvider
	{
		public static IQueue AllSongs { get; set; }
		public static IQueue Favorites { get; set; }
		public static List<Genre> Genres { get; set; }
		public static List<Album> Albums { get; set; }
		public static List<Artist> Artists { get; set; }
		public static event EventHandler LibraryLoaded;

		static MusicProvider()
		{
			AllSongs = new MusicQueue();
			Favorites = new MusicQueue();
			Genres = new List<Genre>();
			Albums = new List<Album>();
			Artists = new List<Artist>();
		}

		public static string GetHost()
		{
			ISharedPreferences sp = PreferenceManager.GetDefaultSharedPreferences(Application.Context);
			return sp.GetString("alloydbhost", "");
		}

		public static string ProcessApiRequest(ApiRequestType t)
		{
			switch (t)
			{
				case ApiRequestType.Artist:
					return $"{GetHost()}/api/v1/browse/artist";
				case ApiRequestType.Artists:
					return $"{GetHost()}/api/v1/browse/artists"; 
				case ApiRequestType.Stream:
					return $"{GetHost()}/api/v1/media/stream";
				case ApiRequestType.CoverArt:
					return $"{GetHost()}/api/v1/media/cover_art";

				default:
					return null;
			}
		}



		public static string ApiRequest(ApiRequestType rt, Dictionary<string, object> paramsDictionary, RequestType requestType, string jsonObject = "", object id2 = null)
		{
			var json = "";
			try
			{
				UriBuilder uriBuilder;
				var parameters = new Extensions.HttpValueCollection();
				ISharedPreferences sp = PreferenceManager.GetDefaultSharedPreferences(Application.Context);
				string apiKey = sp.GetString("alloydbapikey", "");
				parameters["api_key"] = apiKey;

				uriBuilder = new UriBuilder(ProcessApiRequest(rt));

				if (paramsDictionary != null)
				{
					foreach (var o in paramsDictionary)
					{
						parameters[o.Key] = o.Value as string;
					}
				}

				uriBuilder.Query = parameters.ToString();

				Debug.WriteLine("API REQUEST: " + uriBuilder.Uri + "\n");


				var request = (HttpWebRequest)WebRequest.Create(uriBuilder.Uri);

				request.Method = requestType.ToString();
				request.ContentType = "application/x-www-form-urlencoded";

				if (requestType.ToString() == "PUT" && jsonObject != "")
				{
					using (var streamWriter = new StreamWriter(request.GetRequestStream()))
						streamWriter.Write(jsonObject);
				}

				HttpWebResponse response;
				try { response = (HttpWebResponse)request.GetResponse(); }
				catch (Exception e)
				{
					Crashes.TrackError(e);
					return string.Empty;
				}

				var stream = response.GetResponseStream();
				try
				{
					if (response.Headers["Content-Encoding"] != null && (response.Headers["Content-Encoding"].Equals("gzip") || response.Headers["Content-Encoding"].Equals("deflate")))
						if (stream != null)
							stream = new GZipStream(stream, CompressionMode.Decompress);
				}
				catch (Exception e) { Crashes.TrackError(e); }



				if (stream == null) return null;
				using (var reader = new StreamReader(stream))
				{
					try { json = reader.ReadToEnd(); }
					catch (Exception e) { Crashes.TrackError(e); }
				}

				stream.Dispose();
			}
			catch (Exception e) { Crashes.TrackError(e); }
			return json;
		}

		public class AllMusicLoader : AsyncTask<object, Song, int>
		{
			protected override int RunInBackground(params object[] @params)
			{


				return 0;
			}

			protected override void OnProgressUpdate(params Song[] values)
			{
				Alloy.Adapters.Adapters.UpdateAdapters();
				base.OnProgressUpdate(values);
			}

			protected override void OnPostExecute(int result)
			{
				Alloy.Adapters.Adapters.UpdateAdapters();
				foreach (var s in AllSongs)
				{
					if (!s.Starred) continue;
					if (Favorites.Any(aaa => aaa.Id.Equals(s.Id))) continue;
					Favorites.Add(s);
				}
				MusicProvider.LibraryLoaded?.Invoke(null, null);
				base.OnPostExecute(result);
			}
		}

		public class AlbumLoader : AsyncTask<object, Song, int>
		{
			protected override int RunInBackground(params object[] @params)
			{

				return 0;
			}

			protected override void OnPostExecute(int result)
			{
				Alloy.Adapters.Adapters.UpdateAdapters();
				MusicProvider.LibraryLoaded?.Invoke(null, null);
				base.OnPostExecute(result);
			}
		}

		public class ArtistsLoader : AsyncTask<object, Song, int>
		{
			protected override int RunInBackground(params object[] @params)
			{
				try
				{
					Utils.UnlockSsl(true);
					var request = ApiRequest(ApiRequestType.Artists, null, RequestType.GET);
					Artists = JsonConvert.DeserializeObject<ArtistList>(request).Artists;
					Utils.UnlockSsl(false);
				}
				catch (Exception e) { Crashes.TrackError(e); }
				return 0;
			}

			protected override void OnPostExecute(int result)
			{
				Alloy.Adapters.Adapters.UpdateAdapters();
				MusicProvider.LibraryLoaded?.Invoke(null, null);
				base.OnPostExecute(result);
			}
		}

		public class GenreLoader : AsyncTask<object, Song, int>
		{
			protected override int RunInBackground(params object[] @params)
			{

				return 0;
			}

			protected override void OnPostExecute(int result)
			{
				Alloy.Adapters.Adapters.UpdateAdapters();
				MusicProvider.LibraryLoaded?.Invoke(null, null);
				base.OnPostExecute(result);
			}
		}

		public static void HardRefresh()
		{
			var mediaUri = Path.Combine(Android.OS.Environment.GetExternalStoragePublicDirectory("Music").Path);
			List<string> items = new List<string>();

			object[] attributes = Assembly.GetCallingAssembly().GetCustomAttributes(typeof(SupportedFormatAttribute), false);
			List<string> extensions = attributes.Cast<SupportedFormatAttribute>().SelectMany(attribute => attribute.Extensions).ToList();



			//foreach (var allSong in AllSongs)
			//{
			//	Java.IO.File f = new Java.IO.File(allSong.Uri.RealPath());
			//	if (!f.Exists())
			//		allSong.Delete(song => { });


			//}

			foreach (var enumerateFile in Directory.EnumerateFiles(mediaUri, "*", SearchOption.AllDirectories))
			{
				foreach (var extension in extensions)
				{
					if (enumerateFile.EndsWith(extension))
						items.Add(enumerateFile);
				}
			}

			MediaScannerConnection.ScanFile(Application.Context, items.ToArray(), null, new HardScanCallback(RefreshAllSongs));
		}

		public class HardScanCallback : Java.Lang.Object, MediaScannerConnection.IOnScanCompletedListener
		{
			private Action callback;
			private Song song;
			public HardScanCallback(Action callbackAction)
			{
				callback = callbackAction;
			}

			public void OnScanCompleted(string path, Android.Net.Uri uri)
			{
				callback();

				Adapters.Adapters.CurrentActivity.RunOnUiThread(new Action(() =>
				{
					Toast.MakeText(Application.Context, "Rescan complete", ToastLength.Short).Show();
				}));


			}
		}

		public static void RefreshAllSongs()
		{
			AllSongs = new MusicQueue();
			Favorites = new MusicQueue();

			var allMusic = (AllMusicLoader)new AllMusicLoader().Execute();
		}

		public static void RefreshArtists()
		{
			Artists = new List<Artist>();
			var artists = (ArtistsLoader)new ArtistsLoader().Execute();
		}

		public static void RefreshAlbums()
		{
			Albums = new List<Album>();
			var albums = (AlbumLoader)new AlbumLoader().Execute();
		}

		public static void RefreshGenres()
		{
			Genres = new List<Genre>();
			var genres = (GenreLoader)new GenreLoader().Execute();
		}

		public static void QuickRefresh()
		{
			Genres = new List<Genre>();
			Albums = new List<Album>();
			Artists = new List<Artist>();

			var albums = (AlbumLoader)new AlbumLoader().Execute();
			var artists = (ArtistsLoader)new ArtistsLoader().Execute();
			var genres = (GenreLoader)new GenreLoader().Execute();
		}

		public static MusicQueue GetArtistTracks(Artist artist)
		{
			var tracks = new MusicQueue();
			try
			{
				Utils.UnlockSsl(true);
				var request = ApiRequest(ApiRequestType.Artist, new Dictionary<string, object> { { "id", artist.Id } }, RequestType.GET);
				ArtistContainer result = JsonConvert.DeserializeObject<ArtistContainer>(request);
				tracks.AddRange(result.Tracks);
				Utils.UnlockSsl(false);
			}
			catch (Exception e) { Crashes.TrackError(e); }

			return tracks;
		}

		public static MusicQueue GetGenreTracks(Genre genre)
		{
			var tracks = new MusicQueue();
			tracks.AddRange(AllSongs.Where(t => t.Genre.Equals(genre.Title)));
			return tracks;
		}

		public static MusicQueue GetAlbumTracks(Album album)
		{
			var tracks = new MusicQueue();
			tracks.AddRange(AllSongs.Where(t => t.Genre.Equals(album.AlbumName)));
			return tracks;
		}

		public static Android.Net.Uri GetStreamUri(Song song)
		{
			UriBuilder uriBuilder;
			var parameters = new Extensions.HttpValueCollection();
			ISharedPreferences sp = PreferenceManager.GetDefaultSharedPreferences(Application.Context);
			string apiKey = sp.GetString("alloydbapikey", "");
			parameters["api_key"] = apiKey;
			uriBuilder = new UriBuilder(ProcessApiRequest(ApiRequestType.Stream));
			parameters["id"] = song.Id;

			uriBuilder.Query = parameters.ToString();
			return Android.Net.Uri.Parse(uriBuilder.Uri.ToString());
		}

		public static Bitmap GetImageBitmapFromUrl(string url)
		{
			Bitmap imageBitmap = null;

			using (var webClient = new WebClient())
			{
				var imageBytes = webClient.DownloadData(url);
				if (imageBytes != null && imageBytes.Length > 0)
				{
					imageBitmap = BitmapFactory.DecodeByteArray(imageBytes, 0, imageBytes.Length);
				}
			}

			return imageBitmap;
		}


		public static Android.Graphics.Bitmap GetAlbumArt(Dictionary<string, object> paramsDictionary)
		{
			UriBuilder uriBuilder;
			var parameters = new Extensions.HttpValueCollection();
			ISharedPreferences sp = PreferenceManager.GetDefaultSharedPreferences(Application.Context);
			string apiKey = sp.GetString("alloydbapikey", "");
			parameters["api_key"] = apiKey;
			uriBuilder = new UriBuilder(ProcessApiRequest(ApiRequestType.CoverArt));
			if (paramsDictionary != null)
			{
				foreach (var o in paramsDictionary)
				{
					parameters[o.Key] = o.Value as string;
				}
			}

			uriBuilder.Query = parameters.ToString();
			return GetImageBitmapFromUrl(uriBuilder.Uri.ToString());
		}
	}
}