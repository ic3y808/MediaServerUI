using Android.OS;
using Android.Views;
using Android.Widget;
using Alloy.Adapters;
using Alloy.Models;
using Alloy.Services;
using Android.Support.V4.Widget;

namespace Alloy.Fragments
{
	public class AlbumDetailFragment : FragmentBase
	{
		private View root_view;
		private ListView listView;
		private AlbumDetailAdapter adapter;
		private SwipeRefreshLayout refreshLayout;

		public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
		{
			Album album = Arguments.GetParcelable("artist") as Album;
			root_view = inflater.Inflate(Resource.Layout.album_detail_layout, container, false);
			listView = root_view.FindViewById<ListView>(Resource.Id.album_tracks_list);

			if (album != null)
			{
				root_view.FindViewById<TextView>(Resource.Id.title).SetText(album.Name, TextView.BufferType.Normal);
				root_view.FindViewById<ImageView>(Resource.Id.album_art).SetImageBitmap(album.Art);
				root_view.FindViewById<ImageView>(Resource.Id.album_art).SetImageBitmap(album.Art);
				adapter = new AlbumDetailAdapter(album);
			}

			refreshLayout = (SwipeRefreshLayout)root_view.FindViewById(Resource.Id.swipe_container);
			refreshLayout.SetOnRefreshListener(this);
			refreshLayout.SetColorSchemeResources(Resource.Color.colorPrimary, Android.Resource.Color.HoloGreenDark, Android.Resource.Color.HoloOrangeDark, Android.Resource.Color.HoloBlueDark);

			RegisterForContextMenu(listView);

			AlbumDetailAdapter.AlbumLoaded += AlbumDetailAdapter_AlbumLoaded;
			listView.Adapter = adapter;
			listView.ItemClick += ListView_ItemClick;

			CreateToolbar(root_view, Resource.String.album_detail_title, true);

			if (adapter.AlbumTracks.Count == 0)
			{
				refreshLayout.Refreshing = true;
				adapter.RefreshAlbum();
			}

			return root_view;
		}

		private void AlbumDetailAdapter_AlbumLoaded(object sender, System.EventArgs e)
		{
			refreshLayout.Refreshing = false;
		}

		public override void OnRefreshed()
		{
			refreshLayout.Refreshing = true;
			adapter.RefreshAlbum();
		}

		public override void ScrollToNowPlaying()
		{
			base.ScrollToNowPlaying();
			listView.ClearChoices();
			for (int i = 0; i < adapter.Count; i++)
			{
				Song item = adapter[i];
				item.IsSelected = false;
			}

			if (ServiceConnection.CurrentSong != null)
			{
				for (int i = 0; i < adapter.Count; i++)
				{
					Song item = adapter[i];
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