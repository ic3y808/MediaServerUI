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
	public class ArtistsDetailAdapter : BaseAdapter<Song>
	{
		private LayoutInflater layoutInflater;
		private MusicQueue ArtistTracks;
		public BackgroundAudioServiceConnection serviceConnection;

		public ArtistsDetailAdapter(MusicQueue artistTracks, BackgroundAudioServiceConnection connection)
		{
			serviceConnection = connection;
			
			layoutInflater = LayoutInflater.From(Application.Context);
			this.ArtistTracks = artistTracks;
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
			} else convertView.FindViewById<RelativeLayout>(Resource.Id.main_layout).SetBackgroundColor(Color.Transparent);
			return convertView;
		}

		public override int Count => ArtistTracks.Count;

		public override Song this[int position] => ArtistTracks[position];
	}
}