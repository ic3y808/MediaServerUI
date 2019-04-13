using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net;
using Android.OS;
using Alloy.Helpers;
using Alloy.Models;
using Microsoft.AppCenter.Crashes;
using Newtonsoft.Json;
using Debug = System.Diagnostics.Debug;
using Extensions = Alloy.Helpers.Extensions;
using Stream = System.IO.Stream;

namespace Alloy.Providers
{
	public class MusicProvider
	{
		public static List<Genre> Genres { get; set; }
		public static List<Album> Albums { get; set; }
		public static List<Artist> Artists { get; set; }
		public static Starred Starred { get; set; }
		public static Fresh Fresh { get; set; }
		public static Charts Charts { get; set; }

		public static event EventHandler ArtistsStartRefresh;
		public static event EventHandler<string> ArtistsRefreshed;
		public static event EventHandler AlbumsStartRefresh;
		public static event EventHandler<string> AlbumsRefreshed;
		public static event EventHandler GenresStartRefresh;
		public static event EventHandler<string> GenresRefreshed;
		public static event EventHandler ArtistStartRefresh;
		public static event EventHandler<ArtistContainer> ArtistRefreshed;
		public static event EventHandler AlbumStartRefresh;
		public static event EventHandler<AlbumContainer> AlbumRefreshed;
		public static event EventHandler GenreStartRefresh;
		public static event EventHandler<GenreContainer> GenreRefreshed;
		public static event EventHandler StarredStartRefresh;
		public static event EventHandler<Starred> StarredRefreshed;
		public static event EventHandler FreshStartRefresh;
		public static event EventHandler<Fresh> FreshRefreshed;
		public static event EventHandler ChartsStartRefresh;
		public static event EventHandler<Charts> ChartsRefreshed;
		public static event EventHandler SearchStart;
		public static event EventHandler<SearchResult> SearchResultsRecieved;

		static MusicProvider()
		{
			Genres = new List<Genre>();
			Albums = new List<Album>();
			Artists = new List<Artist>();
		}
		public static string GetHost()
		{
			return "http://127.0.0.1:4000";

			//TODO change loading from preferences
			//ISharedPreferences sp = PreferenceManager.GetDefaultSharedPreferences(Application.Context);
			//return sp.GetString("alloydbhost", "");
		}

		public static string GetApiKey()
		{
			return "b1413ebe481e48880a466ffe8523060a";
			//TODO change loading from preferences
			//ISharedPreferences sp = PreferenceManager.GetDefaultSharedPreferences(Application.Context);
			//return sp.GetString("alloydbapikey", "");
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
				case ApiRequestType.Starred:
					return $"{GetHost()}/api/v1/browse/starred";
				case ApiRequestType.Fresh:
					return $"{GetHost()}/api/v1/browse/fresh";
				case ApiRequestType.Charts:
					return $"{GetHost()}/api/v1/browse/charts";

				default:
					return null;
			}
		}

		public static string ApiRequest(ApiRequestType rt, Dictionary<string, object> paramsDictionary, RequestType requestType)
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
			private readonly Album album;
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
				Adapters.Adapters.UpdateAdapters();
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
				Adapters.Adapters.UpdateAdapters();
				AlbumsRefreshed?.Invoke(null, null);
				base.OnPostExecute(result);
			}
		}

		public class ArtistLoader : AsyncTask<object, object, int>
		{
			private readonly Artist artist;
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
				Adapters.Adapters.UpdateAdapters();
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
				catch (Exception e)
				{
					Crashes.TrackError(e);
				}
				return 0;
			}

			protected override void OnPostExecute(int result)
			{
				Adapters.Adapters.UpdateAdapters();
				ArtistsRefreshed?.Invoke(null, null);
				base.OnPostExecute(result);
			}
		}

		public class GenreLoader : AsyncTask<object, Song, int>
		{
			private readonly Genre genre;
			private GenreContainer result;
			public GenreLoader(Genre genre)
			{
				this.genre = genre;
			}

			protected override int RunInBackground(params object[] @params)
			{

				try
				{
					Utils.UnlockSsl(true);
					string request = ApiRequest(ApiRequestType.Genre, new Dictionary<string, object> { { "id", genre.Id } }, RequestType.GET);
					result = JsonConvert.DeserializeObject<GenreContainer>(request);
					Utils.UnlockSsl(false);
				}
				catch (Exception e) { Crashes.TrackError(e); }

				return 0;
			}

			protected override void OnProgressUpdate(params Song[] values)
			{
				Adapters.Adapters.UpdateAdapters();
				base.OnProgressUpdate(values);
			}

			protected override void OnPostExecute(int refreshResult)
			{
				base.OnPostExecute(refreshResult);
				if (refreshResult != 0) return;
				GenreRefreshed?.Invoke(null, result);
				Adapters.Adapters.UpdateAdapters();
			}
		}

		public class GenresLoader : AsyncTask<object, Song, int>
		{
			protected override int RunInBackground(params object[] @params)
			{
				try
				{
					Utils.UnlockSsl(true);
					string request = ApiRequest(ApiRequestType.Genres, null, RequestType.GET);
					List<Genre> result = JsonConvert.DeserializeObject<GenreList>(request).Genres;
					Genres = result.OrderBy(x => x.Name).ToList();
					Utils.UnlockSsl(false);
				}
				catch (Exception e) { Crashes.TrackError(e); }
				return 0;
			}

			protected override void OnPostExecute(int result)
			{
				Adapters.Adapters.UpdateAdapters();
				GenresRefreshed?.Invoke(null, null);
				base.OnPostExecute(result);
			}
		}

		public class SearchLoader : AsyncTask<object, Song, int>
		{
			private readonly string query;
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
				Adapters.Adapters.UpdateAdapters();
				base.OnPostExecute(result);
			}
		}

		public class StarredLoader : AsyncTask<object, object, int>
		{
			protected override int RunInBackground(params object[] @params)
			{
				try
				{
					Utils.UnlockSsl(true);
					string request = ApiRequest(ApiRequestType.Starred, null, RequestType.GET);
					StarredContainer result = JsonConvert.DeserializeObject<StarredContainer>(request);
					Starred = result.Starred;
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
				StarredRefreshed?.Invoke(null, Starred);
				Adapters.Adapters.UpdateAdapters();
			}
		}

		public class FreshLoader : AsyncTask<object, object, int>
		{
			private bool isLoading;
			protected override int RunInBackground(params object[] @params)
			{
				if (isLoading) return 1;
				try
				{
					Utils.UnlockSsl(true);
					string request = ApiRequest(ApiRequestType.Fresh, null, RequestType.GET);
					FreshContainer result = JsonConvert.DeserializeObject<FreshContainer>(request);
					result.Fresh.Tracks.Shuffle();
					Fresh = result.Fresh;
					Utils.UnlockSsl(false);
					return 0;
				}
				catch (Exception e) { Crashes.TrackError(e); }
				return 1;
			}

			protected override void OnPostExecute(int refreshResult)
			{
				base.OnPostExecute(refreshResult);
				if (refreshResult != 0) { return; }
				isLoading = false;
				FreshRefreshed?.Invoke(null, Fresh);
				Adapters.Adapters.UpdateAdapters();
			}
		}

		public class ChartsLoader : AsyncTask<object, object, int>
		{
			protected override int RunInBackground(params object[] @params)
			{
				try
				{
					Utils.UnlockSsl(true);
					string request = ApiRequest(ApiRequestType.Charts, null, RequestType.GET);
					ChartsContainer result = JsonConvert.DeserializeObject<ChartsContainer>(request);
					Charts = result.Charts;
					Utils.UnlockSsl(false);
					return 0;
				}
				catch (Exception e)
				{
					Crashes.TrackError(e);
					Debug.WriteLine(e.Message);
				}
				return 1;
			}

			protected override void OnPostExecute(int refreshResult)
			{
				base.OnPostExecute(refreshResult);
				if (refreshResult != 0) return;
				ChartsRefreshed?.Invoke(null, Charts);
				Adapters.Adapters.UpdateAdapters();
			}
		}

		public static void RefreshArtists()
		{
			ArtistsStartRefresh?.Invoke(null, null);
			new ArtistsLoader().Execute();
		}

		public static void RefreshAlbums()
		{
			AlbumsStartRefresh?.Invoke(null, null);
			new AlbumsLoader().Execute();
		}

		public static void RefreshGenres()
		{
			GenresStartRefresh?.Invoke(null, null);
			new GenresLoader().Execute();
		}

		public static void RefreshStarred()
		{
			StarredStartRefresh?.Invoke(null, null);
			new StarredLoader().Execute();
		}

		public static void RefreshFresh()
		{
			FreshStartRefresh?.Invoke(null, null);
			new FreshLoader().Execute();
		}

		public static void RefreshCharts()
		{
			ChartsStartRefresh?.Invoke(null, null);
			new ChartsLoader().Execute();
		}

		public static void FullRefresh()
		{
			RefreshFresh();
			RefreshCharts();
			RefreshStarred();
			RefreshArtists();
			RefreshAlbums();
			RefreshGenres();
		}

		public static void GetArtist(Artist artist)
		{
			ArtistStartRefresh?.Invoke(null, null);
			Adapters.Adapters.Clear();
			new ArtistLoader(artist).Execute();
		}

		public static void GetAlbum(Album album)
		{
			AlbumStartRefresh?.Invoke(null, null);
			Adapters.Adapters.Clear();
			new AlbumLoader(album).Execute();
		}

		public static void GetGenre(Genre genre)
		{
			GenreStartRefresh?.Invoke(null, null);
			Adapters.Adapters.Clear();
			new GenreLoader(genre).Execute();
		}

		public static string GetStreamUri(Song song)
		{
			Extensions.HttpValueCollection parameters = new Extensions.HttpValueCollection();

			parameters["api_key"] = GetApiKey();
			UriBuilder uriBuilder = new UriBuilder(ProcessApiRequest(ApiRequestType.Stream));
			parameters["id"] = song.Id;

			uriBuilder.Query = parameters.ToString();
			return uriBuilder.Uri.ToString();
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
				ApiRequest(ApiRequestType.AddPlay, new Dictionary<string, object> { { "id", id } }, RequestType.PUT);
				Utils.UnlockSsl(false);
			}
			catch (Exception e) { Crashes.TrackError(e); }
		}

		public static void AddStar(Dictionary<string, object> @params)
		{
			try
			{
				Utils.UnlockSsl(true);
				ApiRequest(ApiRequestType.Star, @params, RequestType.PUT);
				Utils.UnlockSsl(false);
			}
			catch (Exception e) { Crashes.TrackError(e); }
		}

		public static void RemoveStar(Dictionary<string, object> @params)
		{
			try
			{
				Utils.UnlockSsl(true);
				ApiRequest(ApiRequestType.UnStar, @params, RequestType.PUT);
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
				ApiRequest(ApiRequestType.AddHistory, new Dictionary<string, object>
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
				Utils.UnlockSsl(false);
			}
			catch (Exception e) { Crashes.TrackError(e); }
		}

		public static void Search(string query)
		{
			SearchStart?.Invoke(null, null);
			Adapters.Adapters.Clear();
			new SearchLoader(query).Execute();
		}
	}
}