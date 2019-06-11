using Android.OS;
using Android.Support.V4.Widget;
using Android.Support.V7.Widget;
using Android.Views;
using Alloy.Adapters;
using Alloy.Helpers;
using Alloy.Models;
using Alloy.Providers;

using Alloy.Services;

namespace Alloy.Fragments
{
	public class FreshFragment : FragmentBase
	{
		private RecyclerView freshContentView;
		private SwipeRefreshLayout refreshLayout;


		public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
		{
			MusicProvider.FreshStartRefresh += MusicProvider_FreshStartRefresh;
			MusicProvider.FreshRefreshed += MusicProvider_FreshRefreshed;
			MusicProvider.ChartsStartRefresh += MusicProvider_ChartsStartRefresh;
			MusicProvider.ChartsRefreshed += MusicProvider_ChartsRefreshed;
			View root_view = inflater.Inflate(Resource.Layout.fresh_layout, container, false);

			refreshLayout = (SwipeRefreshLayout)root_view.FindViewById(Resource.Id.swipe_container);
			refreshLayout.SetOnRefreshListener(this);
			refreshLayout.SetColorSchemeResources(Resource.Color.colorPrimary, Android.Resource.Color.HoloGreenDark, Android.Resource.Color.HoloOrangeDark, Android.Resource.Color.HoloBlueDark);

			LinearLayoutManager layoutManager = new LinearLayoutManager(Context, LinearLayoutManager.Vertical, false);
			freshContentView = root_view.FindViewById<RecyclerView>(Resource.Id.fresh_content_list);
			freshContentView.SetLayoutManager(layoutManager);
			RegisterForContextMenu(freshContentView);
			CreateToolbar(root_view, Resource.String.fresh_title);

			return root_view;
		}

		private void MusicProvider_ChartsStartRefresh(object sender, System.EventArgs e)
		{
			refreshLayout.Refreshing = true;
		}

		private void MusicProvider_ChartsRefreshed(object sender, Charts e)
		{
			refreshLayout.Refreshing = false;
		}

		private void MusicProvider_FreshStartRefresh(object sender, System.EventArgs e)
		{
			refreshLayout.Refreshing = true;
		}

		private void MusicProvider_FreshRefreshed(object sender, Fresh e)
		{
			refreshLayout.Refreshing = false;
		}

		public override void ScrollToNowPlaying()
		{
			Adapters.Adapters.UpdateAdapters();
		}

		public override void PlaybackStatusChanged(StatusEventArg args)
		{
			base.PlaybackStatusChanged(args);
			Adapters.Adapters.UpdateAdapters();
		}

		public override void ServiceConnected()
		{
			FreshAdapter freshAdapter = new FreshAdapter(Activity, ServiceConnection);
			freshContentView.SetAdapter(freshAdapter);
			freshAdapter.TrackClick += Track_ItemClick;
			freshAdapter.AlbumClick += Album_ItemClick;
			freshAdapter.ArtistClick += Artist_ItemClick;
			Adapters.Adapters.SetAdapters(Activity, freshAdapter);

			ScrollToNowPlaying();

			//if (MusicProvider.Fresh == null ||
			//	MusicProvider.Fresh.Albums == null ||
			//	MusicProvider.Fresh.Artists == null ||
			//	MusicProvider.Fresh.Tracks == null)
			//{
			//	Utils.Run(MusicProvider.RefreshFresh);
			//}
			//if (MusicProvider.Charts == null ||
			//	MusicProvider.Charts.NeverPlayed == null ||
			//	MusicProvider.Charts.NeverPlayedAlbums == null ||
			//	MusicProvider.Charts.TopTracks == null)
			//{
			//	Utils.Run(MusicProvider.RefreshCharts);
			//}
		}

		public override void OnRefreshed()
		{
			MusicProvider.RefreshFresh();
			MusicProvider.RefreshCharts();
		}

		private void Artist_ItemClick(object sender, FreshArtistAdapter.ViewHolder.ViewHolderEvent e)
		{
			Bundle b = new Bundle();
			b.PutParcelable("artist", e.Artist);
			FragmentManager.ChangeTo(new ArtistDetailFragment(), true, "Artist Details", b);
		}

		private void Album_ItemClick(object sender, FreshAlbumAdapter.ViewHolder.ViewHolderEvent e)
		{
			Bundle b = new Bundle();
			b.PutParcelable("album", e.Album);
			FragmentManager.ChangeTo(new AlbumDetailFragment(), true, "Album Details", b);
		}

		private void Track_ItemClick(object sender, TrackViewHolderEvent e)
		{
			Utils.Run(() => ServiceConnection?.Play(e.Position, e.Songs));
		}
	}
}