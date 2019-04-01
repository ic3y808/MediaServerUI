using Android.App;
using Android.Graphics;
using Android.Views;
using Android.Widget;
using Alloy.Models;
using Alloy.Providers;

namespace Alloy.Adapters
{
	public class AlbumsAdapter : BaseAdapter<Album>
	{
		private LayoutInflater layoutInflater;

		public AlbumsAdapter()
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
			if (MusicProvider.Albums == null || MusicProvider.Albums.Count == 0) return convertView;

			if (convertView == null) // otherwise create a new one
			{
				convertView = layoutInflater.Inflate(Resource.Layout.general_list_row, null);
			}
			convertView.FindViewById<TextView>(Resource.Id.title).Text = MusicProvider.Albums[position].Name;
			convertView.FindViewById<TextView>(Resource.Id.artist).Visibility = ViewStates.Gone;
			convertView.FindViewById<TextView>(Resource.Id.right_side_count).Text = MusicProvider.Albums[position].TrackCount.ToString();
			convertView.FindViewById<ImageView>(Resource.Id.album_art).SetImageBitmap(MusicProvider.Albums[position].Art);

			if (MusicProvider.Albums[position].IsSelected)
			{
				convertView.FindViewById<RelativeLayout>(Resource.Id.main_layout).SetBackgroundResource(Resource.Color.menu_selection_color);
			}
			else convertView.FindViewById<RelativeLayout>(Resource.Id.main_layout).SetBackgroundColor(Color.Transparent);

			return convertView;
		}

		public override int Count => MusicProvider.Albums.Count;

		public override Album this[int position] => MusicProvider.Albums[position];
	}
}