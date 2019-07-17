using System;
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
	public class ChartsFragment : FragmentBase
	{
		private RecyclerView chartsContentView;
		private SwipeRefreshLayout refreshLayout;
		private ChartsAdapter chartsAdapter;

		public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
		{
			MusicProvider.ChartsStartRefresh += MusicProvider_ChartsStartRefresh;
			MusicProvider.ChartsRefreshed += MusicProvider_ChartsRefreshed;
			View root_view = inflater.Inflate(Resource.Layout.charts_layout, container, false);

			refreshLayout = (SwipeRefreshLayout)root_view.FindViewById(Resource.Id.swipe_container);
			refreshLayout.SetOnRefreshListener(this);
			refreshLayout.SetColorSchemeResources(Resource.Color.colorPrimary, Android.Resource.Color.HoloGreenDark, Android.Resource.Color.HoloOrangeDark, Android.Resource.Color.HoloBlueDark);

			LinearLayoutManager layoutManager = new LinearLayoutManager(Context, LinearLayoutManager.Vertical, false);
			chartsContentView = root_view.FindViewById<RecyclerView>(Resource.Id.charts_content_list);
			chartsContentView.SetLayoutManager(layoutManager);
			RegisterForContextMenu(chartsContentView);
			CreateToolbar(root_view, Resource.String.charts_title);

			return root_view;
		}

		private void MusicProvider_ChartsStartRefresh(object sender, System.EventArgs e)
		{
			refreshLayout.Refreshing = true;
		}

		private void MusicProvider_ChartsRefreshed(object sender, Charts e)
		{
			refreshLayout.Refreshing = false;
			ScrollToNowPlaying();
			Adapters.Adapters.SetAdapters(Activity, chartsAdapter);
		}

		public override string Name => "Charts";

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
			chartsAdapter = new ChartsAdapter(Activity, ServiceConnection);
			chartsContentView.SetAdapter(chartsAdapter);
			chartsAdapter.TrackClick += Track_ItemClick;
			chartsAdapter.AlbumClick += Album_ItemClick;
			chartsAdapter.ArtistClick += Artist_ItemClick;

			//MusicProvider.RefreshCharts();

			if (MusicProvider.Charts == null ||
				MusicProvider.Charts.NeverPlayed == null ||
				MusicProvider.Charts.NeverPlayedAlbums == null ||
				MusicProvider.Charts.TopTracks == null)
			{
				MusicProvider.RefreshCharts();
			}
		}

		public override void OnRefreshed()
		{
			MusicProvider.RefreshCharts();
		}

		private void Artist_ItemClick(object sender, ChartsArtistAdapter.ViewHolder.ViewHolderEvent e)
		{
			Bundle b = new Bundle();
			b.PutParcelable("artist", e.Artist);
			FragmentManager.ChangeTo(new ArtistDetailFragment(), true, "Artist Details", b);
		}

		private void Album_ItemClick(object sender, ChartsAlbumAdapter.ViewHolder.ViewHolderEvent e)
		{
			Bundle b = new Bundle();
			b.PutParcelable("album", e.Album);
			FragmentManager.ChangeTo(new AlbumDetailFragment(), true, "Album Details", b);
		}

		private void Track_ItemClick(object sender, TrackViewHolderEvent e)
		{
			Utils.Run(() => ServiceConnection?.Play(e.Position, e.Songs.ToQueue()));
		}
	}
}