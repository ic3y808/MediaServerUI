using System;
using Android.App;
using Android.OS;
using Android.Support.V4.Widget;
using Android.Support.V7.Widget;
using Android.Views;
using Microsoft.AppCenter.Crashes;
using Alloy.Adapters;
using Alloy.Helpers;
using Alloy.Interfaces;
using Alloy.Models;
using Alloy.Providers;
using Alloy.Services;
using Alloy.Widgets;

namespace Alloy.Fragments
{
	public class FreshFragment : FragmentBase, OnStartDragListener
	{
		private View root_view;
		private FastScrollRecyclerView freshTracksList;

		private LinearLayoutManager mainLayoutManager;
		private SwipeRefreshLayout refreshLayout;

		public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
		{
			base.OnCreateView(inflater, container, savedInstanceState);

			root_view = inflater.Inflate(Resource.Layout.all_music_layout, container, false);

			mainLayoutManager = new LinearLayoutManager(Context) { AutoMeasureEnabled = false };
			
			freshTracksList = root_view.FindViewById<FastScrollRecyclerView>(Resource.Id.all_music_list);
			freshTracksList.HasFixedSize = true;
			freshTracksList.SetLayoutManager(mainLayoutManager);
			freshTracksList.SetItemAnimator(new DefaultItemAnimator());
			freshTracksList.FocusableInTouchMode = true;
			//freshTracksList.SetAdapter(adapter);

			refreshLayout = (SwipeRefreshLayout)root_view.FindViewById(Resource.Id.swipe_container);
			refreshLayout.SetOnRefreshListener(this);
			refreshLayout.SetColorSchemeResources(Resource.Color.colorPrimary, Android.Resource.Color.HoloGreenDark, Android.Resource.Color.HoloOrangeDark, Android.Resource.Color.HoloBlueDark);
			
			DividerItemDecoration itemDecoration = new DividerItemDecoration(Context, DividerItemDecoration.Vertical);
			itemDecoration.SetDrawable(Application.Context.GetDrawable(Resource.Drawable.list_divider));
			freshTracksList.AddItemDecoration(itemDecoration);

			CreateToolbar(root_view, Resource.String.fresh_title);

			if (MusicProvider.AllSongs.Count == 0)
			{
				refreshLayout.Refreshing = true;
		
			}

			return root_view;
		}

		public override void ScrollToNowPlaying()
		{
			try
			{
				int first = mainLayoutManager.FindFirstCompletelyVisibleItemPosition();
				int last = mainLayoutManager.FindLastVisibleItemPosition();
				if (MusicProvider.AllSongs.IndexOf(ServiceConnection.CurrentSong) < first || MusicProvider.AllSongs.IndexOf(ServiceConnection.CurrentSong) > last)
					mainLayoutManager.ScrollToPosition(MusicProvider.AllSongs.IndexOf(ServiceConnection.CurrentSong));
			}
			catch (Exception ee) { Crashes.TrackError(ee); }
		}

		public override void PlaybackStatusChanged(StatusEventArg args)
		{
			base.PlaybackStatusChanged(args);
			
		}

		public override void ServiceConnected()
		{
			base.ServiceConnected();
		}


		void OnItemClick(object sender, CustomViewHolderEvent e)
		{
			if (MusicProvider.AllSongs[e.Position].IsSelected)
			{

			}
			else ServiceConnection.Play(e.Position, MusicProvider.AllSongs);
		}

		public void OnStartDrag(RecyclerView.ViewHolder viewHolder)
		{
			try
			{
			}
			catch (Exception ee) { Crashes.TrackError(ee); }
			//itemTouchHelper.StartDrag(viewHolder);
		}

		public override void OnRefreshed()
		{
			refreshLayout.Refreshing = true;
			
		}
	}
}