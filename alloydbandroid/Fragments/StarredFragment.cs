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
	public class StarredFragment : FragmentBase
	{
		private RecyclerView starredContentView;
		private StarredTrackAdapter starredAdapter;
		private SwipeRefreshLayout refreshLayout;

		public override string Name => "Starred";

		public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
		{
			MusicProvider.StarredStartRefresh += MusicProvider_StarredStartRefresh;
			MusicProvider.StarredRefreshed += MusicProvider_StarredRefreshed;
			View root_view = inflater.Inflate(Resource.Layout.starred_layout, container, false);

			refreshLayout = (SwipeRefreshLayout)root_view.FindViewById(Resource.Id.swipe_container);
			refreshLayout.SetOnRefreshListener(this);
			refreshLayout.SetColorSchemeResources(Resource.Color.colorPrimary, Android.Resource.Color.HoloGreenDark, Android.Resource.Color.HoloOrangeDark, Android.Resource.Color.HoloBlueDark);

			LinearLayoutManager layoutManager = new LinearLayoutManager(Context);
			starredContentView = root_view.FindViewById<RecyclerView>(Resource.Id.starred_content_list);
			starredContentView.SetLayoutManager(layoutManager);
			RegisterForContextMenu(starredContentView);
			CreateToolbar(root_view, Resource.String.starred_title);
			return root_view;
		}

		private void MusicProvider_StarredStartRefresh(object sender, System.EventArgs e)
		{
			refreshLayout.Refreshing = true;
		}

		private void MusicProvider_StarredRefreshed(object sender, Starred e)
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
			starredAdapter?.NotifyDataSetChanged();
			Adapters.Adapters.UpdateAdapters();
		}

		public override void ServiceConnected()
		{
			base.ServiceConnected();

			starredAdapter = new StarredTrackAdapter(ServiceConnection);
			starredAdapter.TrackClick += StarredAdapter_TrackClick;
			starredContentView.SetAdapter(starredAdapter);
			Adapters.Adapters.SetAdapters(Activity, starredAdapter);

			if (MusicProvider.Starred == null ||
				MusicProvider.Starred.Albums == null ||
				MusicProvider.Starred.Artists == null ||
				MusicProvider.Starred.TopAlbums == null ||
				MusicProvider.Starred.TopArtists == null ||
				MusicProvider.Starred.TopTracks == null ||
				MusicProvider.Starred.Tracks == null)
			{
				Utils.Run(MusicProvider.RefreshStarred);
			}

			ScrollToNowPlaying();
		}

		private void StarredAdapter_TrackClick(object sender, TrackViewHolderEvent e)
		{
			Play(e.Songs.ToQueue(), e.Position);
		}

		public override void OnRefreshed()
		{
			MusicProvider.RefreshStarred();
		}


	}
}