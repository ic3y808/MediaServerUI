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
using Alloy.Interfaces;
using Alloy.Models;
using Android.Graphics;
using Android.Support.V7.Preferences;
using Microsoft.AppCenter.Crashes;
using Newtonsoft.Json;
using Debug = System.Diagnostics.Debug;
using Extensions = Alloy.Helpers.Extensions;
using IQueue = Alloy.Interfaces.IQueue;
using Path = System.IO.Path;
using Stream = System.IO.Stream;


namespace Alloy.Providers
{


	public class MusicProvider
	{
		public static IQueue AllSongs { get; set; }
		public static IQueue Favorites { get; set; }
		public static List<Genre> Genres { get; set; }
		public static List<Album> Albums { get; set; }
		public static List<Artist> Artists { get; set; }


		public static event EventHandler ArtistsStartRefresh;
		public static event EventHandler<string> ArtistsRefreshed;
		public static event EventHandler AlbumsStartRefresh;
		public static event EventHandler<string> AlbumsRefreshed;
		public static event EventHandler ArtistStartRefresh;
		public static event EventHandler<ArtistContainer> ArtistRefreshed;
		public static event EventHandler AlbumStartRefresh;
		public static event EventHandler<AlbumContainer> AlbumRefreshed;
		public static event EventHandler SearchStart;
		public static event EventHandler<SearchResult> SearchResultsRecieved;


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
			return "http://127.0.0.1:4000";

			ISharedPreferences sp = PreferenceManager.GetDefaultSharedPreferences(Application.Context);
			return sp.GetString("alloydbhost", "");
		}
		public static string GetApiKey()
		{
			return "b1413ebe481e48880a466ffe8523060a";

			ISharedPreferences sp = PreferenceManager.GetDefaultSharedPreferences(Application.Context);
			return sp.GetString("alloydbapikey", "");
		}

		public static string ProcessApiRequest(ApiRequestType t)
		{
			switch (t)
			{
				case ApiRequestType.Artist:
					return $"{GetHost()}/api/v1/browse/artist";
				case ApiRequestType.Artists:
					return $"{GetHost()}/api/v1/browse/artists";
				case ApiRequestType.ArtistsIndex:
					return $"{GetHost()}/api/v1/browse/artists_index";
				case ApiRequestType.Album:
					return $"{GetHost()}/api/v1/browse/album";
				case ApiRequestType.Albums:
					return $"{GetHost()}/api/v1/browse/albums";
				case ApiRequestType.Genres:
					return $"{GetHost()}/api/v1/browse/genres";
				case ApiRequestType.Genre:
					return $"{GetHost()}/api/v1/browse/genre";
				case ApiRequestType.Stream:
					return $"{GetHost()}/api/v1/media/stream";
				case ApiRequestType.CoverArt:
					return $"{GetHost()}/api/v1/media/cover_art";
				case ApiRequestType.Star:
					return $"{GetHost()}/api/v1/annotation/star";
				case ApiRequestType.UnStar:
					return $"{GetHost()}/api/v1/annotation/unstar";
				case ApiRequestType.AddHistory:
					return $"{GetHost()}/api/v1/browse/history";
				case ApiRequestType.AddPlay:
					return $"{GetHost()}/api/v1/annotation/add_play";
				case ApiRequestType.Search:
					return $"{GetHost()}/api/v1/search";

				default:
					return null;
			}
		}



		public static string ApiRequest(ApiRequestType rt, Dictionary<string, object> paramsDictionary, RequestType requestType, string jsonObject = "", object id2 = null)
		{
			string json = "";
			try
			{
				UriBuilder uriBuilder;
				Extensions.HttpValueCollection parameters = new Extensions.HttpValueCollection();

				parameters["api_key"] = GetApiKey();

				uriBuilder = new UriBuilder(ProcessApiRequest(rt));

				if (paramsDictionary != null)
				{
					foreach (KeyValuePair<string, object> o in paramsDictionary)
					{
						parameters[o.Key] = o.Value as string;
					}
				}

				uriBuilder.Query = parameters.ToString();

				Debug.WriteLine("API REQUEST: " + uriBuilder.Uri + "\n");


				HttpWebRequest request = (HttpWebRequest)WebRequest.Create(uriBuilder.Uri);

				request.Method = requestType.ToString();
				request.ContentType = "application/x-www-form-urlencoded";

				if (requestType.ToString() == "PUT" && jsonObject != "")
				{
					using (StreamWriter streamWriter = new StreamWriter(request.GetRequestStream()))
						streamWriter.Write(jsonObject);
				}

				HttpWebResponse response;
				try { response = (HttpWebResponse)request.GetResponse(); }
				catch (Exception e)
				{
					Crashes.TrackError(e);
					return string.Empty;
				}

				Stream stream = response.GetResponseStream();
				try
				{
					if (response.Headers["Content-Encoding"] != null && (response.Headers["Content-Encoding"].Equals("gzip") || response.Headers["Content-Encoding"].Equals("deflate")))
						if (stream != null)
							stream = new GZipStream(stream, CompressionMode.Decompress);
				}
				catch (Exception e) { Crashes.TrackError(e); }



				if (stream == null) return null;
				using (StreamReader reader = new StreamReader(stream))
				{
					try { json = reader.ReadToEnd(); }
					catch (Exception e) { Crashes.TrackError(e); }
				}

				stream.Dispose();
			}
			catch (Exception e) { Crashes.TrackError(e); }
			return json;
		}

		public class AlbumLoader : AsyncTask<object, object, int>
		{
			private Album album;
			private AlbumContainer result;
			public AlbumLoader(Album album)
			{
				this.album = album;
			}

			protected override int RunInBackground(params object[] @params)
			{
				try
				{
					Utils.UnlockSsl(true);
					string request = ApiRequest(ApiRequestType.Album, new Dictionary<string, object> { { "id", album.Id } }, RequestType.GET);
					result = JsonConvert.DeserializeObject<AlbumContainer>(request);
					result.Album.Art = result.Album.GetAlbumArt();
					foreach (Song track in result.Tracks)
					{
						track.Art = result.Album.Art;
					}

					Utils.UnlockSsl(false);
					return 0;
				}
				catch (Exception e) { Crashes.TrackError(e); }
				return 1;
			}

			protected override void OnPostExecute(int refreshResult)
			{
				base.OnPostExecute(refreshResult);
				if (refreshResult != 0) return;
				AlbumRefreshed?.Invoke(null, result);
				Alloy.Adapters.Adapters.UpdateAdapters();
			}
		}

		public class AlbumsLoader : AsyncTask<object, Song, int>
		{
			protected override int RunInBackground(params object[] @params)
			{
				try
				{
					Utils.UnlockSsl(true);
					string request = ApiRequest(ApiRequestType.Albums, null, RequestType.GET);
					Albums = JsonConvert.DeserializeObject<AlbumList>(request).Albums;
					Utils.UnlockSsl(false);
				}
				catch (Exception e) { Crashes.TrackError(e); }
				return 0;
			}

			protected override void OnPostExecute(int result)
			{
				Alloy.Adapters.Adapters.UpdateAdapters();
				AlbumsRefreshed?.Invoke(null, null);
				base.OnPostExecute(result);
			}
		}

		public class ArtistLoader : AsyncTask<object, object, int>
		{
			private Artist artist;
			private ArtistContainer result;
			public ArtistLoader(Artist artist)
			{
				this.artist = artist;
			}

			protected override int RunInBackground(params object[] @params)
			{
				try
				{
					Utils.UnlockSsl(true);
					string request = ApiRequest(ApiRequestType.Artist, new Dictionary<string, object> { { "id", artist.Id } }, RequestType.GET);
					result = JsonConvert.DeserializeObject<ArtistContainer>(request);

					foreach (Album album in result.Albums)
					{
						album.Art = album.GetAlbumArt();
						foreach (Song albumTrack in album.Tracks)
						{
							if (albumTrack.Art == null) albumTrack.Art = album.Art;
						}
						if (result.Tracks.Count <= 0) continue;
						foreach (Song resultTrack in result.Tracks)
						{
							if (resultTrack.AlbumId == album.Id) { resultTrack.Art = album.Art ?? resultTrack.GetAlbumArt(); }
						}
					}
					foreach (Album album in result.EPs)
					{
						album.Art = album.GetAlbumArt();
						foreach (Song albumTrack in album.Tracks)
						{
							if (albumTrack.Art == null) albumTrack.Art = album.Art;

						}
					}
					foreach (Album album in result.Singles)
					{
						album.Art = album.GetAlbumArt();
						foreach (Song albumTrack in album.Tracks)
						{
							if (albumTrack.Art == null) albumTrack.Art = album.Art;

						}
					}
					foreach (Song track in result.PopularTracks)
					{
						track.Art = track.GetAlbumArt();
					}

					Utils.UnlockSsl(false);
					return 0;
				}
				catch (Exception e) { Crashes.TrackError(e); }
				return 1;
			}

			protected override void OnPostExecute(int refreshResult)
			{
				base.OnPostExecute(refreshResult);
				if (refreshResult != 0) return;
				ArtistRefreshed?.Invoke(null, result);
				Alloy.Adapters.Adapters.UpdateAdapters();
			}
		}

		public class ArtistsLoader : AsyncTask<object, Song, int>
		{
			protected override int RunInBackground(params object[] @params)
			{
				try
				{
					Utils.UnlockSsl(true);

					string request = ApiRequest(ApiRequestType.Artists, null, RequestType.GET);

					Artists = JsonConvert.DeserializeObject<ArtistList>(request).Artists;

					Utils.UnlockSsl(false);
				}
				catch (Exception e) { Crashes.TrackError(e); }
				return 0;
			}

			protected override void OnPostExecute(int result)
			{
				Alloy.Adapters.Adapters.UpdateAdapters();
				ArtistsRefreshed?.Invoke(null, null);
				base.OnPostExecute(result);
			}
		}

		public class GenreLoader : AsyncTask<object, Song, int>
		{
			protected override int RunInBackground(params object[] @params)
			{
				try
				{
					Utils.UnlockSsl(true);
					string request = ApiRequest(ApiRequestType.Genres, null, RequestType.GET);
					Genres = JsonConvert.DeserializeObject<GenreList>(request).Genres;
					Utils.UnlockSsl(false);
				}
				catch (Exception e) { Crashes.TrackError(e); }
				return 0;
			}

			protected override void OnPostExecute(int result)
			{
				Alloy.Adapters.Adapters.UpdateAdapters();
			//	MusicProvider.GenreLoaded?.Invoke(null, null);
				base.OnPostExecute(result);
			}
		}

		public class SearchLoader : AsyncTask<object, Song, int>
		{
			private string query;
			private SearchResult results;
			public SearchLoader(string query)
			{
				this.query = query;
			}

			protected override int RunInBackground(params object[] @params)
			{
				try
				{
					Utils.UnlockSsl(true);

					string request = ApiRequest(ApiRequestType.Search, new Dictionary<string, object> { { "any", query } }, RequestType.GET);

					results = JsonConvert.DeserializeObject<SearchResult>(request);

					Utils.UnlockSsl(false);
				}
				catch (Exception e) { Crashes.TrackError(e); }
				return 0;
			}

			protected override void OnPostExecute(int result)
			{
				SearchResultsRecieved?.Invoke(null, results);
				Alloy.Adapters.Adapters.UpdateAdapters();
				base.OnPostExecute(result);
			}
		}

		public static void RefreshArtists()
		{
			////if (initial) Artists = new ArtistsQueue();
			ArtistsStartRefresh?.Invoke(null, null);
			ArtistsLoader artists = (ArtistsLoader)new ArtistsLoader().Execute();
		}

		public static void RefreshAlbums()
		{
			Albums = new List<Album>();
			AlbumsStartRefresh?.Invoke(null, null);
			AlbumsLoader albums = (AlbumsLoader)new AlbumsLoader().Execute();
		}

		public static void RefreshGenres()
		{
			Genres = new List<Genre>();
			GenreLoader genres = (GenreLoader)new GenreLoader().Execute();
		}

		public static void QuickRefresh()
		{
			Genres = new List<Genre>();
			Albums = new List<Album>();
			Artists = new List<Artist>();

			AlbumsLoader albums = (AlbumsLoader)new AlbumsLoader().Execute();
			ArtistsLoader artists = (ArtistsLoader)new ArtistsLoader().Execute();
			GenreLoader genres = (GenreLoader)new GenreLoader().Execute();
		}

		public static void GetArtist(Artist artist)
		{
			ArtistStartRefresh?.Invoke(null, null);
			Adapters.Adapters.Clear();
			ArtistLoader a = (ArtistLoader)new ArtistLoader(artist).Execute();
		}

		public static void GetAlbum(Album album)
		{
			AlbumStartRefresh?.Invoke(null, null);
			Adapters.Adapters.Clear();
			AlbumLoader a = (AlbumLoader)new AlbumLoader(album).Execute();
		}

		public static MusicQueue GetGenreTracks(Genre genre)
		{
			MusicQueue tracks = new MusicQueue();
			try
			{
				Utils.UnlockSsl(true);
				string request = ApiRequest(ApiRequestType.Genre, new Dictionary<string, object> { { "id", genre.Id } }, RequestType.GET);
				GenreContainer result = JsonConvert.DeserializeObject<GenreContainer>(request);
				tracks.AddRange(result.Tracks);
				Utils.UnlockSsl(false);
			}
			catch (Exception e) { Crashes.TrackError(e); }

			return tracks;
		}

		public static MusicQueue GetAlbumTracks(Album album)
		{
			MusicQueue tracks = new MusicQueue();
			try
			{
				Utils.UnlockSsl(true);
				string request = ApiRequest(ApiRequestType.Album, new Dictionary<string, object> { { "id", album.Id } }, RequestType.GET);
				AlbumContainer result = JsonConvert.DeserializeObject<AlbumContainer>(request);
				tracks.AddRange(result.Tracks);
				Utils.UnlockSsl(false);
			}
			catch (Exception e) { Crashes.TrackError(e); }

			return tracks;
		}

		public static Android.Net.Uri GetStreamUri(Song song)
		{
			UriBuilder uriBuilder;
			Extensions.HttpValueCollection parameters = new Extensions.HttpValueCollection();

			parameters["api_key"] = GetApiKey();
			uriBuilder = new UriBuilder(ProcessApiRequest(ApiRequestType.Stream));
			parameters["id"] = song.Id;

			uriBuilder.Query = parameters.ToString();
			return Android.Net.Uri.Parse(uriBuilder.Uri.ToString());
		}

		public static string GetAlbumArt(Dictionary<string, object> paramsDictionary)
		{
			UriBuilder uriBuilder;
			Extensions.HttpValueCollection parameters = new Extensions.HttpValueCollection();

			parameters["api_key"] = GetApiKey();
			uriBuilder = new UriBuilder(ProcessApiRequest(ApiRequestType.CoverArt));
			if (paramsDictionary != null)
			{
				foreach (KeyValuePair<string, object> o in paramsDictionary)
				{
					parameters[o.Key] = o.Value as string;
				}
			}

			uriBuilder.Query = parameters.ToString();
			return uriBuilder.Uri.ToString();
		}

		public static void AddPlay(string id)
		{
			try
			{
				Utils.UnlockSsl(true);
				string request = ApiRequest(ApiRequestType.AddPlay, new Dictionary<string, object> { { "id", id } }, RequestType.PUT);
				object result = JsonConvert.DeserializeObject(request);
				Utils.UnlockSsl(false);
			}
			catch (Exception e) { Crashes.TrackError(e); }
		}

		public static void AddStar(Dictionary<string, object> @params)
		{
			try
			{
				Utils.UnlockSsl(true);
				string request = ApiRequest(ApiRequestType.Star, @params, RequestType.PUT);
				object result = JsonConvert.DeserializeObject(request);
				Utils.UnlockSsl(false);
			}
			catch (Exception e) { Crashes.TrackError(e); }
		}

		public static void RemoveStar(Dictionary<string, object> @params)
		{
			try
			{
				Utils.UnlockSsl(true);
				string request = ApiRequest(ApiRequestType.UnStar, @params, RequestType.PUT);
				object result = JsonConvert.DeserializeObject(request);
				Utils.UnlockSsl(false);
			}
			catch (Exception e) { Crashes.TrackError(e); }
		}

		public static void AddStar(Artist artist)
		{
			artist.Starred = true;
			Dictionary<string, object> p = new Dictionary<string, object> { ["artist"] = artist.Id };
			AddStar(p);
		}

		public static void AddStar(Song song)
		{
			song.Starred = true;
			Dictionary<string, object> p = new Dictionary<string, object> { ["id"] = song.Id };
			AddStar(p);
		}

		public static void AddStar(Album album)
		{
			album.Starred = true;
			Dictionary<string, object> p = new Dictionary<string, object> { ["album"] = album.Id };
			AddStar(p);
		}

		public static void AddStar(Genre genre)
		{
			genre.Starred = true;
			Dictionary<string, object> p = new Dictionary<string, object> { ["genre"] = genre.Id };
			AddStar(p);
		}

		public static void RemoveStar(Artist artist)
		{
			artist.Starred = false;
			Dictionary<string, object> p = new Dictionary<string, object> { ["artist"] = artist.Id };
			RemoveStar(p);
		}

		public static void RemoveStar(Song song)
		{
			song.Starred = false;
			Dictionary<string, object> p = new Dictionary<string, object> { ["id"] = song.Id };
			RemoveStar(p);
		}

		public static void RemoveStar(Album album)
		{
			album.Starred = false;
			Dictionary<string, object> p = new Dictionary<string, object> { ["album"] = album.Id };
			RemoveStar(p);
		}

		public static void RemoveStar(Genre genre)
		{
			genre.Starred = false;
			Dictionary<string, object> p = new Dictionary<string, object> { ["genre"] = genre.Id };
			RemoveStar(p);
		}

		public static void AddHistory(string type, string action, string id, string title, string artist, string artist_id, string album, string album_id, string genre, string genre_id)
		{
			try
			{
				Utils.UnlockSsl(true);
				string request = ApiRequest(ApiRequestType.AddHistory, new Dictionary<string, object>
				{
					{ "type", type },
					{ "action", action },
					{ "id", id },
					{ "title", title },
					{ "artist", artist },
					{ "artist_id", artist_id },
					{ "album", album },
					{ "album_id", album_id },
					{ "genre", genre },
					{ "genre_id", genre_id },
				}, RequestType.PUT);
				object result = JsonConvert.DeserializeObject(request);
				Utils.UnlockSsl(false);
			}
			catch (Exception e) { Crashes.TrackError(e); }
		}

		public static void Search(string query)
		{
			SearchStart?.Invoke(null, null);
			Adapters.Adapters.Clear();
			SearchLoader a = (SearchLoader)new SearchLoader(query).Execute();
		}
	}
}