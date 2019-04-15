using System;
using Android.OS;
using Android.Support.V4.Widget;
using Android.Views;
using Alloy.Adapters;
using Alloy.Helpers;
using Alloy.Providers;

using Alloy.Services;
using Alloy.Widgets;
using Android.App;
using Android.Support.V7.Widget;
using Microsoft.AppCenter.Crashes;

namespace Alloy.Fragments
{
	public class AlbumsFragment : FragmentBase
	{
		private LinearLayoutManager mainLayoutManager;
		private AlbumsAdapter adapter;
		private SwipeRefreshLayout refreshLayout;

		public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
		{
			base.OnCreateView(inflater, container, savedInstanceState);
			View root_view = inflater.Inflate(Resource.Layout.albums_layout, container, false);
			FastScrollRecyclerView albumsList = root_view.FindViewById<FastScrollRecyclerView>(Resource.Id.albums_list);

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
			try
			{
				for (int i = 0; i < MusicProvider.Albums.Count; i++)
				{
					if (!MusicProvider.Albums[i].Id.Equals(ServiceConnection.CurrentSong.AlbumId)) continue;
					mainLayoutManager.ScrollToPosition(i);
					break;
				}
			}
			catch (Exception ee) { Crashes.TrackError(ee); }
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

		private void MusicProvider_AlbumsRefreshed(object sender, EventArgs e)
		{
			refreshLayout.Refreshing = false;
			adapter?.NotifyDataSetChanged();
		}

		private void OnItemClick(object sender, AlbumsAdapter.AlbumViewHolder.AlbumViewHolderEvent e)
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