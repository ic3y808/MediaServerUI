using Android.App;
using Android.Graphics;
using Android.Views;
using Android.Widget;
using Alloy.Helpers;
using Alloy.Models;
using Alloy.Providers;

namespace Alloy.Adapters
{
	class GenreDetailAdapter : BaseAdapter<Song>
	{
		private LayoutInflater layoutInflater;
		public MusicQueue GenreTracks;

		public GenreDetailAdapter(Genre genre)
		{
			layoutInflater = LayoutInflater.From(Application.Context);
			GenreTracks = new MusicQueue();
			
			foreach (var song in MusicProvider.AllSongs)
			{
				if (song.Genre != null && song.Genre.Contains(genre.Title)) GenreTracks.Add(song);
			}
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
			convertView.FindViewById<ImageView>(Resource.Id.album_art).SetImageBitmap(GenreTracks[position].Art);

			if (GenreTracks[position].IsSelected)
			{
				convertView.FindViewById<RelativeLayout>(Resource.Id.main_layout).SetBackgroundResource(Resource.Color.menu_selection_color);
			}
			else convertView.FindViewById<RelativeLayout>(Resource.Id.main_layout).SetBackgroundColor(Color.Transparent);

			return convertView;
		}

		public override int Count => GenreTracks.Count;

		public override Song this[int position] => GenreTracks[position];
	}
}