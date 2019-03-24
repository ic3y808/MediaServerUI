using Android.OS;
using Android.Views;
using Android.Widget;
using Alloy.Adapters;
using Alloy.Models;
using Alloy.Services;

namespace Alloy.Fragments
{
	public class AlbumDetailFragment : FragmentBase
	{
		private View root_view;
		private ListView listView;
		private AlbumDetailAdapter adapter;

		public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
		{
			var album = Arguments.GetParcelable("artist") as Album;
			root_view = inflater.Inflate(Resource.Layout.album_detail_layout, container, false);
			listView = root_view.FindViewById<ListView>(Resource.Id.album_tracks_list);
			root_view.FindViewById<TextView>(Resource.Id.title).SetText(album.AlbumName, TextView.BufferType.Normal);
			root_view.FindViewById<ImageView>(Resource.Id.album_art).SetImageBitmap(album.Art);
			RegisterForContextMenu(listView);
			adapter = new AlbumDetailAdapter(album, ServiceConnection);

			listView.Adapter = adapter;
			listView.ItemClick += ListView_ItemClick;

			CreateToolbar(root_view, Resource.String.album_detail_title, true);

			return root_view;
		}

		public override void ScrollToNowPlaying()
		{
			base.ScrollToNowPlaying();
			listView.ClearChoices();
			for (int i = 0; i < adapter.Count; i++)
			{
				var item = adapter[i];
				item.IsSelected = false;
			}

			if (ServiceConnection.CurrentSong != null)
			{
				for (int i = 0; i < adapter.Count; i++)
				{
					var item = adapter[i];
					if (ServiceConnection.CurrentSong.Id.Equals(item.Id))
					{
						item.IsSelected = true;
						//listView.SetItemChecked(i, true);
						break;
					}
				}
			}
			Adapters.Adapters.UpdateAdapters();
			listView.Invalidate();
		}

		public override void PlaybackStatusChanged(StatusEventArg args)
		{
			base.PlaybackStatusChanged(args);
			adapter.NotifyDataSetChanged();
		}

		public override void ServiceConnected()
		{
			base.ServiceConnected();
			Adapters.Adapters.SetAdapters(Activity, adapter);
		}

		public override void ContextMenuCreated(IContextMenu menu, View v, IContextMenuContextMenuInfo menuInfo)
		{
			base.ContextMenuCreated(menu, v, menuInfo);
			if (v.Id == Resource.Id.album_tracks_list)
			{
				MenuInflater inflater = Activity.MenuInflater;
				inflater.Inflate(Resource.Menu.song_context_menu, menu);
			}
		}

		private void ListView_ItemClick(object sender, AdapterView.ItemClickEventArgs e)
		{
			if (adapter.AlbumTracks[e.Position].IsSelected)
			{

			}
			else
			{
				ServiceConnection.Play(e.Position, adapter.AlbumTracks);
			}
		}
	}
}