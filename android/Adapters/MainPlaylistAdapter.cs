using Alloy.Helpers;
using Alloy.Models;

using Alloy.Services;
using Android.App;
using Android.Graphics;
using Android.Views;
using Android.Widget;

namespace Alloy.Adapters
{
	public class MainPlaylistAdapter : BaseAdapter<Song>
	{
		private BackgroundAudioServiceConnection serviceConnection;

		public MainPlaylistAdapter(BackgroundAudioServiceConnection serviceConnection)
		{
			this.serviceConnection = serviceConnection;
			BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { NotifyDataSetChanged(); };
		}
		public override long GetItemId(int position)
		{
			return position;
		}

		public override View GetView(int position, View convertView, ViewGroup parent)
		{
			if (serviceConnection == null || serviceConnection?.MainQueue.Count == 0) return convertView;

			if (convertView == null) // otherwise create a new one
			{
				convertView = LayoutInflater.From(Application.Context).Inflate(Resource.Layout.general_list_row, null);
			}

			convertView.FindViewById<TextView>(Resource.Id.title).Text = serviceConnection.MainQueue[position].Title;
			convertView.FindViewById<TextView>(Resource.Id.artist).Text = serviceConnection.MainQueue[position].Artist;
			convertView.FindViewById<TextView>(Resource.Id.right_side_count).Text = serviceConnection.MainQueue[position].Duration.ToTimeFromSeconds();
			serviceConnection.MainQueue[position].GetAlbumArt(convertView.FindViewById<ImageView>(Resource.Id.album_art));

			if (serviceConnection.MainQueue[position].IsSelected)
			{
				convertView.FindViewById<RelativeLayout>(Resource.Id.main_layout).SetBackgroundResource(Resource.Color.menu_selection_color);
			}
			else convertView.FindViewById<RelativeLayout>(Resource.Id.main_layout).SetBackgroundColor(Color.Transparent);

			return convertView;
		}

		public override int Count {
			get
			{
				if (serviceConnection == null || serviceConnection?.MainQueue == null) return 0;
				return serviceConnection.MainQueue.Count;
			}
		}

		public override Song this[int position] => serviceConnection.MainQueue[position];
	}
}