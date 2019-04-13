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
		public BackgroundAudioServiceConnection ServiceConnection { get; }

		public MainPlaylistAdapter(BackgroundAudioServiceConnection serviceConnection)
		{
			ServiceConnection = serviceConnection;
			BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { NotifyDataSetChanged(); };
		}
		public override long GetItemId(int position)
		{
			return position;
		}

		public override View GetView(int position, View convertView, ViewGroup parent)
		{
			if (ServiceConnection == null || ServiceConnection?.MainQueue.Count == 0) return convertView;

			if (convertView == null)
			{
				convertView = LayoutInflater.From(Application.Context).Inflate(Resource.Layout.general_list_row, null);
			}

			convertView.FindViewById<TextView>(Resource.Id.title).Text = ServiceConnection.MainQueue[position].Title;
			convertView.FindViewById<TextView>(Resource.Id.artist).Text = ServiceConnection.MainQueue[position].Artist;
			convertView.FindViewById<TextView>(Resource.Id.right_side_count).Text = ServiceConnection.MainQueue[position].Duration.ToTimeFromSeconds();
			ServiceConnection.MainQueue[position].GetAlbumArt(convertView.FindViewById<ImageView>(Resource.Id.album_art));

			if (ServiceConnection.MainQueue[position].IsSelected)
			{
				convertView.FindViewById<RelativeLayout>(Resource.Id.main_layout).SetBackgroundResource(Resource.Color.menu_selection_color);
			}
			else convertView.FindViewById<RelativeLayout>(Resource.Id.main_layout).SetBackgroundColor(Color.Transparent);

			return convertView;
		}

		public override int Count {
			get
			{
				if (ServiceConnection == null || ServiceConnection?.MainQueue == null) return 0;
				return ServiceConnection.MainQueue.Count;
			}
		}

		public override Song this[int position] => ServiceConnection.MainQueue[position];
	}
}