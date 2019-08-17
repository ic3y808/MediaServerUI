using System.Collections.Generic;
using Android.OS;
using Android.Support.V4.Widget;
using Android.Views;
using Alloy.Adapters;
using Alloy.Helpers;
using Alloy.Models;
using Alloy.Providers;
using Alloy.Services;
using Android.Support.V7.Widget;

namespace Alloy.Fragments
{
	public class HistoryFragment : FragmentBase
	{
		private HistoryAdapter historyAdapter;
		private RecyclerView historyContentView;
		private SwipeRefreshLayout refreshLayout;

		public override string Name => "History";

		public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
		{
			MusicProvider.HistoryStartRefresh += MusicProvider_HistoryStartRefresh;
			MusicProvider.HistoryRefreshed += MusicProvider_HistoryRefreshed;
			View root_view = inflater.Inflate(Resource.Layout.history_layout, container, false);

			refreshLayout = (SwipeRefreshLayout)root_view.FindViewById(Resource.Id.swipe_container);
			refreshLayout.SetOnRefreshListener(this);
			refreshLayout.SetColorSchemeResources(Resource.Color.colorPrimary, Android.Resource.Color.HoloGreenDark, Android.Resource.Color.HoloOrangeDark, Android.Resource.Color.HoloBlueDark);

			LinearLayoutManager layoutManager = new LinearLayoutManager(Context, LinearLayoutManager.Vertical, false);
			historyContentView = root_view.FindViewById<RecyclerView>(Resource.Id.history_content_list);
			historyContentView.SetLayoutManager(layoutManager);
			RegisterForContextMenu(historyContentView);
			CreateToolbar(root_view, Resource.String.history_title);

			return root_view;
		}

		private void MusicProvider_HistoryStartRefresh(object sender, System.EventArgs e)
		{
			refreshLayout.Refreshing = true;
		}

		private void MusicProvider_HistoryRefreshed(object sender, List<History> e)
		{
			refreshLayout.Refreshing = false;
			Adapters.Adapters.UpdateAdapters();
		}

		public override void ScrollToNowPlaying()
		{
			base.ScrollToNowPlaying();
			Adapters.Adapters.UpdateAdapters();
		}

		public override void PlaybackStatusChanged(StatusEventArg args)
		{
			base.PlaybackStatusChanged(args);
			historyAdapter.NotifyDataSetChanged();
			Adapters.Adapters.UpdateAdapters();
		}

		public override void ServiceConnected()
		{
			base.ServiceConnected();

			ScrollToNowPlaying();

			historyAdapter = new HistoryAdapter(Activity, ServiceConnection);
			historyContentView.SetAdapter(historyAdapter);
			historyAdapter.TrackClick += Track_ItemClick;
			Adapters.Adapters.SetAdapters(Activity, historyAdapter);

			if (MusicProvider.History == null || MusicProvider.History.Count == 0)
			{
				Utils.Run(MusicProvider.RefreshHistory);
			}
		}

		public override void OnRefreshed()
		{
			MusicProvider.RefreshHistory();
		}

		private void Track_ItemClick(object sender, HistoryTrackViewHolderEvent e)
		{
			ServiceConnection?.Play(e.Position, e.Songs);
		}
	}
}