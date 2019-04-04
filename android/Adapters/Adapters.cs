using System;
using System.Collections.Generic;
using System.Linq;
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
		public static List<RecyclerView.Adapter> RecyclerAdapters { get; set; }
		public static List<BaseAdapter<Song>> PlaylistAdapters { get; set; }
		public static List<BaseAdapter<Song>> ListAdapters { get; set; }
		public static List<BaseAdapter<Album>> AlbumAdapters { get; set; }
		public static List<BaseAdapter<Artist>> ArtistAdapters { get; set; }
		public static List<BaseAdapter<Genre>> GenreAdapters { get; set; }
		public static Activity CurrentActivity { get; set; }

		public static void SetAdapters(Activity activity, params RecyclerView.Adapter[] addedAdapters)
		{
			if(RecyclerAdapters == null) RecyclerAdapters = new List<RecyclerView.Adapter>();
			CurrentActivity = activity;
			RecyclerAdapters.AddRange(addedAdapters);
		}

		public static void SetAdapters(Activity activity, params BaseAdapter<Song>[] addedAdapters)
		{
			if (ListAdapters == null) ListAdapters = new List<BaseAdapter<Song>>();
			CurrentActivity = activity;
			ListAdapters.AddRange(addedAdapters);
		}

		public static void SetAdapters(Activity activity, params BaseAdapter<Album>[] addedAdapters)
		{
			if (AlbumAdapters == null) AlbumAdapters = new List<BaseAdapter<Album>>();
			CurrentActivity = activity;
			AlbumAdapters.AddRange(addedAdapters);
		}

		public static void SetAdapters(Activity activity, params BaseAdapter<Artist>[] addedAdapters)
		{
			if (ArtistAdapters == null) ArtistAdapters = new List<BaseAdapter<Artist>>();
			CurrentActivity = activity;
			ArtistAdapters.AddRange(addedAdapters);
		}

		public static void SetAdapters(Activity activity, params BaseAdapter<Genre>[] addedAdapters)
		{
			if (GenreAdapters == null) GenreAdapters = new List<BaseAdapter<Genre>>();
			CurrentActivity = activity;
			GenreAdapters.AddRange(addedAdapters);
		}

		public static void SetPlaylistAdapters(Activity activity, params BaseAdapter<Song>[] addedAdapters)
		{
			if (PlaylistAdapters == null) PlaylistAdapters = new List<BaseAdapter<Song>>();
			CurrentActivity = activity;
			PlaylistAdapters.AddRange(addedAdapters);
		}

		private static void Update()
		{
			try
			{
				if (RecyclerAdapters != null)
				{
					lock (RecyclerAdapters)
						foreach (var adapter in RecyclerAdapters) { adapter.NotifyDataSetChanged(); }
				}

				if (PlaylistAdapters != null)
					lock (PlaylistAdapters)
						foreach (var adapter in PlaylistAdapters) { adapter.NotifyDataSetChanged(); }

				if (ListAdapters != null)
					lock (ListAdapters)
						foreach (var adapter in ListAdapters) { adapter.NotifyDataSetChanged(); }

				if (ArtistAdapters != null)
					lock (ArtistAdapters)
						foreach (var adapter in ArtistAdapters) { adapter.NotifyDataSetChanged(); }

				if (AlbumAdapters != null)
					lock (AlbumAdapters)
						foreach (var adapter in AlbumAdapters) { adapter.NotifyDataSetChanged(); }

				if (GenreAdapters != null)
					lock (GenreAdapters)
						foreach (var adapter in GenreAdapters) { adapter.NotifyDataSetChanged(); }
			}
			catch (Exception e) { Crashes.TrackError(e); }
		}
		public static void Clear()
		{
			try
			{
				if (RecyclerAdapters != null)
					lock (RecyclerAdapters)
						RecyclerAdapters.Clear();
				if (PlaylistAdapters != null)
					lock (PlaylistAdapters)
						PlaylistAdapters.Clear();
				if (ListAdapters != null)
					lock (ListAdapters)
						ListAdapters.Clear();
				if (ArtistAdapters != null)
					lock (ArtistAdapters)
						ArtistAdapters.Clear();
				if (AlbumAdapters != null)
					lock (AlbumAdapters)
						AlbumAdapters.Clear();
				if (GenreAdapters != null)
					lock (GenreAdapters)
						GenreAdapters.Clear();
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