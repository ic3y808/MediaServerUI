using Android.App;
using Android.Graphics;
using Android.Views;
using Android.Widget;
using Alloy.Helpers;
using Alloy.Models;
using Alloy.Providers;
using Alloy.Services;

namespace Alloy.Adapters
{
	public class AlbumDetailAdapter : BaseAdapter<Song>
	{
		private LayoutInflater layoutInflater;
		public MusicQueue AlbumTracks;
		public BackgroundAudioServiceConnection serviceConnection;

		public AlbumDetailAdapter(Album album, BackgroundAudioServiceConnection connection)
		{
			serviceConnection = connection;
		
			layoutInflater = LayoutInflater.From(Application.Context);
			AlbumTracks = new MusicQueue();

			if (MusicProvider.AllSongs == null) return;
			foreach (var song in MusicProvider.AllSongs)
			{
				if (string.IsNullOrEmpty(album?.AlbumName) || string.IsNullOrEmpty(song?.Album)) continue;
				if (song.Album.Contains(album.AlbumName)) AlbumTracks.Add(song);
			}
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
			if (AlbumTracks == null || AlbumTracks.Count == 0) return convertView;

			if (convertView == null) // otherwise create a new one
			{
				convertView = layoutInflater.Inflate(Resource.Layout.general_list_row, null);
			}
			convertView.FindViewById<TextView>(Resource.Id.title).Text = AlbumTracks[position].Title;
			convertView.FindViewById<TextView>(Resource.Id.artist).Text = AlbumTracks[position].Artist;
			convertView.FindViewById<TextView>(Resource.Id.right_side_count).Text = AlbumTracks[position].Duration.ToTimeFromSeconds();
			convertView.FindViewById<ImageView>(Resource.Id.album_art).SetImageBitmap(AlbumTracks[position].Art);

			if (AlbumTracks[position].IsSelected)
			{
				convertView.FindViewById<RelativeLayout>(Resource.Id.main_layout).SetBackgroundResource(Resource.Color.menu_selection_color);
			}
			else convertView.FindViewById<RelativeLayout>(Resource.Id.main_layout).SetBackgroundColor(Color.Transparent);

			return convertView;
		}

		public override int Count => AlbumTracks.Count;

		public override Song this[int position] => AlbumTracks[position];
	}
}