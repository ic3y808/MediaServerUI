using Android.Content;
using Android.Graphics;
using Android.Views;
using Android.Widget;
using Alloy.Helpers;
using Alloy.Models;
using Alloy.Providers;
using Alloy.Services;

namespace Alloy.Adapters
{
	public class FavoritesAdapter : BaseAdapter<Song>
	{
		private LayoutInflater layoutInflater;
		public BackgroundAudioServiceConnection serviceConnection;

		public FavoritesAdapter(Context context, BackgroundAudioServiceConnection connection)
		{
			layoutInflater = LayoutInflater.From(context);
			serviceConnection = connection;
		}

		public override long GetItemId(int position)
		{
			return position;
		}

		public override View GetView(int position, View convertView, ViewGroup parent)
		{
			if (MusicProvider.Favorites == null || MusicProvider.Favorites.Count == 0) return convertView;

			if (convertView == null) // otherwise create a new one
			{
				convertView = layoutInflater.Inflate(Resource.Layout.general_list_row, null);
			}
			convertView.FindViewById<TextView>(Resource.Id.artist).Text = MusicProvider.Favorites[position].Artist;
			convertView.FindViewById<TextView>(Resource.Id.title).Text = MusicProvider.Favorites[position].Title;
			convertView.FindViewById<TextView>(Resource.Id.right_side_count).Text = MusicProvider.Favorites[position].Duration.ToTimeFromSeconds();
			
			if (MusicProvider.Favorites[position].Art == null)
			{
				convertView.FindViewById<ImageView>(Resource.Id.album_art).SetImageResource(Resource.Drawable.wave);
			}
			else
			{
				convertView.FindViewById<ImageView>(Resource.Id.album_art).SetImageBitmap(MusicProvider.Favorites[position].Art);
			}

			if (MusicProvider.Favorites[position].IsSelected)
			{
				convertView.FindViewById<RelativeLayout>(Resource.Id.main_layout).SetBackgroundResource(Resource.Color.menu_selection_color);
			}
			else convertView.FindViewById<RelativeLayout>(Resource.Id.main_layout).SetBackgroundColor(Color.Transparent);

			return convertView;
		}

		public override int Count => MusicProvider.Favorites.Count;

		public override Song this[int position] => MusicProvider.Favorites[position];
	}
}