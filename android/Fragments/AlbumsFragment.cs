using System;
using Android.OS;
using Android.Support.V4.Widget;
using Android.Views;
using Android.Widget;
using Alloy.Adapters;
using Alloy.Helpers;
using Alloy.Models;
using Alloy.Providers;
using Alloy.Services;
using Alloy.Widgets;
using Android.App;
using Android.Support.V7.Widget;

namespace Alloy.Fragments
{
	public class AlbumsFragment : FragmentBase
	{
		private View root_view;
		private FastScrollRecyclerView albumsList;
		private LinearLayoutManager mainLayoutManager;
		private AlbumsAdapter adapter;
		private SwipeRefreshLayout refreshLayout;

		public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
		{
			base.OnCreateView(inflater, container, savedInstanceState);
			root_view = inflater.Inflate(Resource.Layout.albums_layout, container, false);
			albumsList = root_view.FindViewById<FastScrollRecyclerView>(Resource.Id.albums_list);

			refreshLayout = (SwipeRefreshLayout)root_view.FindViewById(Resource.Id.swipe_container);
			refreshLayout.SetOnRefreshListener(this);
			refreshLayout.SetColorSchemeResources(Resource.Color.colorPrimary, Android.Resource.Color.HoloGreenDark, Android.Resource.Color.HoloOrangeDark, Android.Resource.Color.HoloBlueDark);

			RegisterForContextMenu(albumsList);
			adapter = new AlbumsAdapter(ServiceConnection);
			adapter.ItemClick += OnItemClick;

			mainLayoutManager = new LinearLayoutManager(Context) { AutoMeasureEnabled = false };

			albumsList.HasFixedSize = true;
			albumsList.SetLayoutManager(mainLayoutManager);
			albumsList.SetItemAnimator(new DefaultItemAnimator());
			albumsList.FocusableInTouchMode = true;
			albumsList.SetAdapter(adapter);

			DividerItemDecoration itemDecoration = new DividerItemDecoration(Context, DividerItemDecoration.Vertical);
			itemDecoration.SetDrawable(Application.Context.GetDrawable(Resource.Drawable.list_divider));
			albumsList.AddItemDecoration(itemDecoration);

			CreateToolbar(root_view, Resource.String.albums_title);

			return root_view;
		}
		public override void ScrollToNowPlaying()
		{
			//try
			//{
			//	int first = mainLayoutManager.FindFirstCompletelyVisibleItemPosition();
			//	int last = mainLayoutManager.FindLastVisibleItemPosition();
			//	if (MusicProvider.AllSongs.IndexOf(ServiceConnection.CurrentSong) < first || MusicProvider.AllSongs.IndexOf(ServiceConnection.CurrentSong) > last)
			//		mainLayoutManager.ScrollToPosition(MusicProvider.AllSongs.IndexOf(ServiceConnection.CurrentSong));
			//}
			//catch (Exception ee) { Crashes.TrackError(ee); }
		}

		public override void PlaybackStatusChanged(StatusEventArg args)
		{
			base.PlaybackStatusChanged(args);
			adapter.NotifyDataSetChanged();
		}

		public override void ServiceConnected()
		{
			base.ServiceConnected();
			MusicProvider.AlbumsRefreshed += MusicProvider_AlbumsRefreshed;
			MusicProvider.AlbumsStartRefresh += MusicProvider_AlbumsStartRefresh;
			Adapters.Adapters.SetAdapters(Activity, adapter);

			if (MusicProvider.Albums == null || MusicProvider.Albums.Count == 0)
			{
				Utils.Run(MusicProvider.RefreshAlbums);
			}
		}

		private void MusicProvider_AlbumsStartRefresh(object sender, EventArgs e)
		{
			refreshLayout.Refreshing = true;
		}

		private void MusicProvider_AlbumsRefreshed(object sender, string e)
		{
			refreshLayout.Refreshing = false;
			adapter?.NotifyDataSetChanged();
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

		public override void ContextMenuItemSelected(IMenuItem item, AdapterView.AdapterContextMenuInfo info)
		{

		}

		private void OnItemClick(object sender, AlbumViewHolder.AlbumViewHolderEvent e)
		{
			Bundle b = new Bundle();
			b.PutParcelable("album", MusicProvider.Albums[e.Position]);
			FragmentManager.ChangeTo(new AlbumDetailFragment(), true, "Album Details", b);
		}

		public override void OnRefreshed()
		{
			refreshLayout.Refreshing = true;
			MusicProvider.RefreshAlbums();
		}
	}
}