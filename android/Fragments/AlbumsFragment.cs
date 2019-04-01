using Android.OS;
using Android.Support.V4.Widget;
using Android.Views;
using Android.Widget;
using Alloy.Adapters;
using Alloy.Helpers;
using Alloy.Models;
using Alloy.Providers;
using Alloy.Services;

namespace Alloy.Fragments
{
	public class AlbumsFragment : FragmentBase
	{
		private View root_view;
		private ListView listView;
		private AlbumsAdapter adapter;
		private SwipeRefreshLayout refreshLayout;

		public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
		{
			base.OnCreateView(inflater, container, savedInstanceState);
			root_view = inflater.Inflate(Resource.Layout.albums_layout, container, false);
			listView = root_view.FindViewById<ListView>(Resource.Id.albums_list);

			refreshLayout = (SwipeRefreshLayout)root_view.FindViewById(Resource.Id.swipe_container);
			refreshLayout.SetOnRefreshListener(this);
			refreshLayout.SetColorSchemeResources(Resource.Color.colorPrimary, Android.Resource.Color.HoloGreenDark, Android.Resource.Color.HoloOrangeDark, Android.Resource.Color.HoloBlueDark);


			RegisterForContextMenu(listView);
			adapter = new AlbumsAdapter();

			listView.Adapter = adapter;
			listView.ItemClick += MListView_ItemClick;

			CreateToolbar(root_view, Resource.String.albums_title);

			if (MusicProvider.Albums.Count == 0)
			{
				refreshLayout.Refreshing = true;
				Utils.Run(MusicProvider.RefreshAlbums);
			}

			return root_view;
		}

		public override void ScrollToNowPlaying()
		{
			base.ScrollToNowPlaying();
			listView.ClearChoices();
			for (int i = 0; i < adapter.Count; i++)
			{
				Album item = adapter[i];
				item.IsSelected = false;
			}

			if (ServiceConnection.CurrentSong != null)
			{
				for (int i = 0; i < adapter.Count; i++)
				{
					var item = adapter[i];
					if (ServiceConnection.CurrentSong.Album.Equals(item.Name))
					{
						item.IsSelected = true;
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
			if (v.Id == Resource.Id.albums_list)
			{
				MenuInflater inflater = Activity.MenuInflater;
				inflater.Inflate(Resource.Menu.multi_context_menu, menu);
			}
		}

		private void MListView_ItemClick(object sender, AdapterView.ItemClickEventArgs e)
		{
			Album album = MusicProvider.Albums[e.Position];
			Bundle b = new Bundle();
			b.PutParcelable("artist", album);
			FragmentManager.ChangeTo(new AlbumDetailFragment(), true, "Artist Details", b);
		}

		public override void OnRefreshed()
		{
			refreshLayout.Refreshing = true;
			MusicProvider.RefreshAlbums();
		}

		public override void LibraryLoaded()
		{
			base.LibraryLoaded();
			refreshLayout.Refreshing = false;
		}
	}
}