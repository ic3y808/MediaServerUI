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
using Alloy.Widgets;
using Android.App;
using Android.Support.V7.Widget;

namespace Alloy.Fragments
{
	public class ArtistsFragment : FragmentBase
	{
		private View root_view;
		private FastScrollRecyclerView artistsList;
		private LinearLayoutManager mainLayoutManager;
		private ArtistsAdapter adapter;
		private SwipeRefreshLayout refreshLayout;

		public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
		{
			base.OnCreateView(inflater, container, savedInstanceState);
			root_view = inflater.Inflate(Resource.Layout.artists_layout, container, false);
			artistsList = root_view.FindViewById<FastScrollRecyclerView>(Resource.Id.artists_list);

			refreshLayout = (SwipeRefreshLayout)root_view.FindViewById(Resource.Id.swipe_container);
			refreshLayout.SetOnRefreshListener(this);
			refreshLayout.SetColorSchemeResources(Resource.Color.colorPrimary, Android.Resource.Color.HoloGreenDark, Android.Resource.Color.HoloOrangeDark, Android.Resource.Color.HoloBlueDark);

			RegisterForContextMenu(artistsList);
			adapter = new ArtistsAdapter(ServiceConnection);
			adapter.ItemClick += OnItemClick;

			mainLayoutManager = new LinearLayoutManager(Context) { AutoMeasureEnabled = false };

			artistsList.HasFixedSize = true;
			artistsList.SetLayoutManager(mainLayoutManager);
			artistsList.SetItemAnimator(new DefaultItemAnimator());
			artistsList.FocusableInTouchMode = true;
			artistsList.SetAdapter(adapter);

			DividerItemDecoration itemDecoration = new DividerItemDecoration(Context, DividerItemDecoration.Vertical);
			itemDecoration.SetDrawable(Application.Context.GetDrawable(Resource.Drawable.list_divider));
			artistsList.AddItemDecoration(itemDecoration);

			CreateToolbar(root_view, Resource.String.artists_title);



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
			MusicProvider.ArtistsRefreshed += MusicProvider_ArtistsRefreshed;
			MusicProvider.ArtistsStartRefresh += MusicProvider_ArtistsStartRefresh;
			Adapters.Adapters.SetAdapters(Activity, adapter);

			if (MusicProvider.Artists == null || MusicProvider.Artists.Count == 0)
			{
				Utils.Run(MusicProvider.RefreshArtists);
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
			MusicProvider.RefreshArtists();
		}
	}
}