using System.Collections.Generic;
using Android.App;
using Android.Graphics;
using Android.Views;
using Android.Widget;
using Alloy.Models;
using Alloy.Providers;
using Alloy.Services;

namespace Alloy.Adapters
{
	public class ArtistsAdapter : BaseAdapter<Artist>
	{
		private LayoutInflater layoutInflater;
		public BackgroundAudioServiceConnection serviceConnection;

		public ArtistsAdapter(BackgroundAudioServiceConnection connection)
		{
			layoutInflater = LayoutInflater.From(Application.Context);
			serviceConnection = connection;
		}

		public override long GetItemId(int position)
		{
			return position;
		}

		public override View GetView(int position, View convertView, ViewGroup parent)
		{
			if (MusicProvider.Artists == null || MusicProvider.Artists.Count == 0) return convertView;

			if (convertView == null) // otherwise create a new one
			{
				convertView = layoutInflater.Inflate(Resource.Layout.general_list_row, null);
			}
			convertView.FindViewById<TextView>(Resource.Id.title).Text = MusicProvider.Artists[position].Name;
			convertView.FindViewById<TextView>(Resource.Id.artist).Visibility = ViewStates.Gone;
			convertView.FindViewById<TextView>(Resource.Id.right_side_count).Text = MusicProvider.Artists[position].TrackCount.ToString();
			convertView.FindViewById<ImageView>(Resource.Id.album_art).SetImageBitmap(MusicProvider.Artists[position].Art);

			if (MusicProvider.Artists[position].IsSelected)
			{
				convertView.FindViewById<RelativeLayout>(Resource.Id.main_layout).SetBackgroundResource(Resource.Color.menu_selection_color);
			}
			else convertView.FindViewById<RelativeLayout>(Resource.Id.main_layout).SetBackgroundColor(Color.Transparent);

			return convertView;
		}

		public override int Count => MusicProvider.Artists.Count;

		public override Artist this[int position] => MusicProvider.Artists[position];
	}
}