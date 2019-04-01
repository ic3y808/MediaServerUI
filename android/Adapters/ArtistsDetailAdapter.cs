using System;
using Android.App;
using Android.Graphics;
using Android.Views;
using Android.Widget;
using Alloy.Helpers;
using Alloy.Models;
using Alloy.Providers;
using Alloy.Services;
using Android.OS;

namespace Alloy.Adapters
{
	public class ArtistsDetailAdapter : BaseAdapter<Song>
	{
		private LayoutInflater layoutInflater;
		public Artist Artist;
		public MusicQueue ArtistTracks;
		public static event EventHandler ArtistLoaded;

		public ArtistsDetailAdapter(Artist artist)
		{
			ArtistTracks = new MusicQueue();
			Artist = artist;
			layoutInflater = LayoutInflater.From(Application.Context);
		}

		public void RefreshArtist()
		{
			var artistLoader = (ArtistLoader)new ArtistLoader(this, Artist).Execute();
		}

		public class ViewHolder : Java.Lang.Object
		{
			public ImageView imageView;
			public TextView txtMenuName;
			public TextView artist;
			public TextView txtPrice;
		}

		public override long GetItemId(int position)
		{
			return position;
		}

		public override View GetView(int position, View convertView, ViewGroup parent)
		{
			if (ArtistTracks == null || ArtistTracks.Count == 0) return convertView;

			if (convertView == null)
			{
				convertView = layoutInflater.Inflate(Resource.Layout.general_list_row, null);
			}
			convertView.FindViewById<TextView>(Resource.Id.title).Text = ArtistTracks[position].Title;
			convertView.FindViewById<TextView>(Resource.Id.right_side_count).Text = ArtistTracks[position].Duration.ToTimeFromSeconds();
			convertView.FindViewById<ImageView>(Resource.Id.album_art).SetImageBitmap(ArtistTracks[position].Art);
			if (ArtistTracks[position].IsSelected)
			{
				convertView.FindViewById<RelativeLayout>(Resource.Id.main_layout).SetBackgroundResource(Resource.Color.menu_selection_color);
			}
			else convertView.FindViewById<RelativeLayout>(Resource.Id.main_layout).SetBackgroundColor(Color.Transparent);
			return convertView;
		}

		public override int Count => ArtistTracks.Count;

		public override Song this[int position] => ArtistTracks[position];

		public class ArtistLoader : AsyncTask<object, Song, int>
		{
			private ArtistsDetailAdapter adapter;
			private Artist artist;
			public ArtistLoader(ArtistsDetailAdapter adapter, Artist artist)
			{
				this.adapter = adapter;
				this.artist = artist;
			}

			protected override int RunInBackground(params object[] @params)
			{
				adapter.ArtistTracks = MusicProvider.GetArtistTracks(artist);

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
				ArtistLoaded?.Invoke(null, null);
				base.OnPostExecute(result);
			}
		}
	}
}