using System;
using Android.App;
using Android.OS;
using Android.Support.V7.Widget;
using Android.Widget;
using Microsoft.AppCenter.Crashes;
using Alloy.Models;
using Album = Alloy.Models.Album;
using Artist = Alloy.Models.Artist;
using Genre = Alloy.Models.Genre;

namespace Alloy.Adapters
{
	public static class Adapters
	{
		public static RecyclerView.Adapter[] RecyclerAdapters { get; set; }
		public static BaseAdapter<Song>[] PlaylistAdapters { get; set; }
		public static BaseAdapter<Song>[] ListAdapters { get; set; }
		public static BaseAdapter<Album>[] AlbumAdapters { get; set; }
		public static BaseAdapter<Artist>[] ArtistAdapters { get; set; }
		public static BaseAdapter<Genre>[] GenreAdapters { get; set; }
		public static Activity CurrentActivity { get; set; }

		public static void SetAdapters(Activity activity, params RecyclerView.Adapter[] addedAdapters)
		{
			CurrentActivity = activity;
			RecyclerAdapters = addedAdapters;
		}

		public static void SetAdapters(Activity activity, params BaseAdapter<Song>[] addedAdapters)
		{
			CurrentActivity = activity;
			ListAdapters = addedAdapters;
		}

		public static void SetAdapters(Activity activity, params BaseAdapter<Album>[] addedAdapters)
		{
			CurrentActivity = activity;
			AlbumAdapters = addedAdapters;
		}

		public static void SetAdapters(Activity activity, params BaseAdapter<Artist>[] addedAdapters)
		{
			CurrentActivity = activity;
			ArtistAdapters = addedAdapters;
		}

		public static void SetAdapters(Activity activity, params BaseAdapter<Genre>[] addedAdapters)
		{
			CurrentActivity = activity;
			GenreAdapters = addedAdapters;
		}

		public static void SetPlaylistAdapters(Activity activity, params BaseAdapter<Song>[] addedAdapters)
		{
			CurrentActivity = activity;
			PlaylistAdapters = addedAdapters;
		}

		private static void Update()
		{
			try
			{
				if (Alloy.Adapters.Adapters.RecyclerAdapters != null)
				{
					lock (Alloy.Adapters.Adapters.RecyclerAdapters)
						foreach (var adapter in Alloy.Adapters.Adapters.RecyclerAdapters) { adapter.NotifyDataSetChanged(); }
				}

				if (Alloy.Adapters.Adapters.PlaylistAdapters != null)
					lock (Alloy.Adapters.Adapters.PlaylistAdapters)
						foreach (var adapter in Alloy.Adapters.Adapters.PlaylistAdapters) { adapter.NotifyDataSetChanged(); }

				if (Alloy.Adapters.Adapters.ListAdapters != null)
					lock (Alloy.Adapters.Adapters.ListAdapters)
						foreach (var adapter in Alloy.Adapters.Adapters.ListAdapters) { adapter.NotifyDataSetChanged(); }

				if (Alloy.Adapters.Adapters.ArtistAdapters != null)
					lock (Alloy.Adapters.Adapters.ArtistAdapters)
						foreach (var adapter in Alloy.Adapters.Adapters.ArtistAdapters) { adapter.NotifyDataSetChanged(); }

				if (Alloy.Adapters.Adapters.AlbumAdapters != null)
					lock (Alloy.Adapters.Adapters.AlbumAdapters)
						foreach (var adapter in Alloy.Adapters.Adapters.AlbumAdapters) { adapter.NotifyDataSetChanged(); }

				if (Alloy.Adapters.Adapters.GenreAdapters != null)
					lock (Alloy.Adapters.Adapters.GenreAdapters)
						foreach (var adapter in Alloy.Adapters.Adapters.GenreAdapters) { adapter.NotifyDataSetChanged(); }
			}
			catch (Exception e) { Crashes.TrackError(e); }
		}

		public static void UpdateAdapters()
		{
			if (Looper.MyLooper() == Looper.MainLooper) { Update(); }
			else
			{
				CurrentActivity.RunOnUiThread(Update);
			}
		}
	}
}