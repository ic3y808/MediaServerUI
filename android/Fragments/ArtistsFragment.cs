using System;
using Android.OS;
using Android.Support.V4.Widget;
using Android.Views;
using Android.Widget;
using Microsoft.AppCenter.Crashes;
using Alloy.Adapters;
using Alloy.Helpers;
using Alloy.Models;
using Alloy.Providers;
using Alloy.Services;
using Android.Support.V7.Widget;

namespace Alloy.Fragments
{
	public class ArtistsFragment : FragmentBase
	{
		private View root_view;
		private RecyclerView artistsList;
		private LinearLayoutManager artistsLayoutManager;
		private ArtistsAdapter adapter;
		private SwipeRefreshLayout refreshLayout;

		public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
		{
			base.OnCreateView(inflater, container, savedInstanceState);
			root_view = inflater.Inflate(Resource.Layout.artists_layout, container, false);
			artistsList = root_view.FindViewById<RecyclerView>(Resource.Id.artists_list);

			artistsList.HasFixedSize = true;
			artistsLayoutManager = new LinearLayoutManager(root_view.Context) { AutoMeasureEnabled = true };
			artistsList.SetLayoutManager(artistsLayoutManager);
			artistsList.SetItemAnimator(new DefaultItemAnimator());
			artistsList.FocusableInTouchMode = true;

			refreshLayout = (SwipeRefreshLayout)root_view.FindViewById(Resource.Id.swipe_container);
			refreshLayout.SetOnRefreshListener(this);
			refreshLayout.SetColorSchemeResources(Resource.Color.colorPrimary, Android.Resource.Color.HoloGreenDark, Android.Resource.Color.HoloOrangeDark, Android.Resource.Color.HoloBlueDark);




			RegisterForContextMenu(artistsList);
			adapter = new ArtistsAdapter(ServiceConnection);
			adapter.ItemClick += OnItemClick;
			artistsList.SetAdapter(adapter);
			artistsList.ScrollChange += ArtistsList_ScrollChange;

			CreateToolbar(root_view, Resource.String.artists_title);



			return root_view;
		}

		private void ArtistsList_ScrollChange(object sender, View.ScrollChangeEventArgs e)
		{
			var totalItemCount = MusicProvider.Artists.Count;
			var lastVisibleItem = artistsLayoutManager.FindLastVisibleItemPosition() + 1;
			if (refreshLayout == null || refreshLayout.Refreshing || totalItemCount > lastVisibleItem + MusicProvider.MaxCachedArtists) return;
			refreshLayout.Refreshing = true;
			MusicProvider.RefreshArtists(true);
		}

		public override void ScrollToNowPlaying()
		{
			//base.ScrollToNowPlaying();
			//try
			//{
			//	listView.ClearChoices();
			//	for (int i = 0; i < adapter.Count; i++)
			//	{
			//		Artist item = adapter[i];
			//		item.IsSelected = false;
			//	}
			//
			//	if (ServiceConnection.CurrentSong != null)
			//	{
			//		for (int i = 0; i < adapter.Count; i++)
			//		{
			//			var item = adapter[i];
			//			if (ServiceConnection.CurrentSong.Artist.Equals(item.Name))
			//			{
			//				item.IsSelected = true;
			//				break;
			//			}
			//		}
			//	}
			//	Adapters.Adapters.UpdateAdapters();
			//	listView.Invalidate();
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
			MusicProvider.ArtistsRefreshed += MusicProvider_ArtistsRefreshed;
			MusicProvider.ArtistsStartRefresh += MusicProvider_ArtistsStartRefresh;
			Adapters.Adapters.SetAdapters(Activity, adapter);

			if (MusicProvider.Artists.Count == 0)
			{

				Utils.Run(() => { MusicProvider.RefreshArtists(true); });
			}
		}

		private void MusicProvider_ArtistsStartRefresh(object sender, EventArgs e)
		{
			refreshLayout.Refreshing = true;
		}

		private void MusicProvider_ArtistsRefreshed(object sender, string e)
		{
			refreshLayout.Refreshing = false;
			adapter?.NotifyDataSetChanged();
		}

		public override void ContextMenuCreated(IContextMenu menu, View v, IContextMenuContextMenuInfo menuInfo)
		{
			base.ContextMenuCreated(menu, v, menuInfo);
			if (v.Id == Resource.Id.artists_list)
			{
				MenuInflater inflater = Activity.MenuInflater;
				inflater.Inflate(Resource.Menu.multi_context_menu, menu);
			}
		}

		public override void ContextMenuItemSelected(IMenuItem item, AdapterView.AdapterContextMenuInfo info)
		{

		}

		private void OnItemClick(object sender, CustomViewHolderEvent e)
		{
			Artist artist = MusicProvider.Artists[e.Position];
			Bundle b = new Bundle();
			b.PutParcelable("artist", artist);
			FragmentManager.ChangeTo(new ArtistDetailFragment(), true, "Artist Details", b);
		}

		public override void OnRefreshed()
		{
			refreshLayout.Refreshing = true;
			MusicProvider.RefreshArtists(true);
		}

		public override void LibraryLoaded()
		{
			base.LibraryLoaded();
			refreshLayout.Refreshing = false;
		}
	}
}