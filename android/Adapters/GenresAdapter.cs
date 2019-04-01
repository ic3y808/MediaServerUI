using Android.App;
using Android.Graphics;
using Android.Views;
using Android.Widget;
using Alloy.Models;
using Alloy.Providers;

namespace Alloy.Adapters
{
	public class GenresAdapter : BaseAdapter<Genre>
	{
		private LayoutInflater layoutInflater;

		public GenresAdapter()
		{
			layoutInflater = LayoutInflater.From(Application.Context);
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
			if (MusicProvider.Genres == null || MusicProvider.Genres.Count == 0) return convertView;

			if (convertView == null) 
			{
				convertView = layoutInflater.Inflate(Resource.Layout.general_list_row, null);
			}
			convertView.FindViewById<TextView>(Resource.Id.title).Text = MusicProvider.Genres[position].Name;
			convertView.FindViewById<ImageView>(Resource.Id.album_art).SetImageBitmap(MusicProvider.Genres[position].Art);
			convertView.FindViewById<TextView>(Resource.Id.right_side_count).Text = MusicProvider.Genres[position].TrackCount.ToString();

			if (MusicProvider.Genres[position].IsSelected)
			{
				convertView.FindViewById<RelativeLayout>(Resource.Id.main_layout).SetBackgroundResource(Resource.Color.menu_selection_color);
			}
			else convertView.FindViewById<RelativeLayout>(Resource.Id.main_layout).SetBackgroundColor(Color.Transparent);

			return convertView;
		}

		public override int Count => MusicProvider.Genres.Count;

		public override Genre this[int position] => MusicProvider.Genres[position];
	}
}