using System;
using Android.App;
using Android.Graphics;
using Android.Views;
using Android.Widget;
using Alloy.Helpers;
using Alloy.Models;
using Alloy.Providers;

using Android.OS;

namespace Alloy.Adapters
{
	class GenreDetailAdapter : BaseAdapter<Song>
	{
		private LayoutInflater layoutInflater;
		public Genre Genre;
		public MusicQueue GenreTracks;
		public static event EventHandler GenreLoaded;

		public GenreDetailAdapter(Genre genre)
		{
			GenreTracks = new MusicQueue();
			Genre = genre;
			layoutInflater = LayoutInflater.From(Application.Context);
		}

		public void RefreshGenre()
		{
			GenreLoader artistLoader = (GenreLoader)new GenreLoader(this, Genre).Execute();
		}

		public override long GetItemId(int position)
		{
			return position;
		}

		public override View GetView(int position, View convertView, ViewGroup parent)
		{
			if (GenreTracks == null || GenreTracks.Count == 0) return convertView;

			if (convertView == null) // otherwise create a new one
			{
				convertView = layoutInflater.Inflate(Resource.Layout.general_list_row, null);
			}
			convertView.FindViewById<TextView>(Resource.Id.title).Text = GenreTracks[position].Title;
			convertView.FindViewById<TextView>(Resource.Id.artist).Text = GenreTracks[position].Artist;
			convertView.FindViewById<TextView>(Resource.Id.right_side_count).Text = GenreTracks[position].Duration.ToTimeFromSeconds();
			GenreTracks[position].GetAlbumArt(convertView.FindViewById<ImageView>(Resource.Id.album_art));

			if (GenreTracks[position].IsSelected)
			{
				convertView.FindViewById<RelativeLayout>(Resource.Id.main_layout).SetBackgroundResource(Resource.Color.menu_selection_color);
			}
			else convertView.FindViewById<RelativeLayout>(Resource.Id.main_layout).SetBackgroundColor(Color.Transparent);

			return convertView;
		}

		public override int Count => GenreTracks.Count;

		public override Song this[int position] => GenreTracks[position];
		public class GenreLoader : AsyncTask<object, Song, int>
		{
			private GenreDetailAdapter adapter;
			private Genre genre;
			public GenreLoader(GenreDetailAdapter adapter, Genre genre)
			{
				this.adapter = adapter;
				this.genre = genre;
			}

			protected override int RunInBackground(params object[] @params)
			{
				adapter.GenreTracks = MusicProvider.GetGenreTracks(genre);

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
				GenreLoaded?.Invoke(null, null);
				base.OnPostExecute(result);
			}
		}
	}
}