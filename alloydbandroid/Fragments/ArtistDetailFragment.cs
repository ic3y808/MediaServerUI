using Android.OS;
using Android.Views;
using Alloy.Adapters;
using Alloy.Helpers;
using Alloy.Models;
using Alloy.Providers;

using Alloy.Services;
using Android.Support.V4.Widget;
using Android.Support.V7.Widget;

namespace Alloy.Fragments
{
	public class ArtistDetailFragment : FragmentBase
	{
		private ArtistDetailAdapter artistDetailAdapter;
		private RecyclerView artistContentView;
		private SwipeRefreshLayout refreshLayout;

		public override string Name => "ArtistDetail";

		public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
		{
			MusicProvider.ArtistStartRefresh += MusicProvider_ArtistStartRefresh;
			MusicProvider.ArtistRefreshed += MusicProvider_ArtistRefreshed;
			View root_view = inflater.Inflate(Resource.Layout.artist_detail_layout, container, false);

			refreshLayout = (SwipeRefreshLayout)root_view.FindViewById(Resource.Id.swipe_container);
			refreshLayout.SetOnRefreshListener(this);
			refreshLayout.SetColorSchemeResources(Resource.Color.colorPrimary, Android.Resource.Color.HoloGreenDark, Android.Resource.Color.HoloOrangeDark, Android.Resource.Color.HoloBlueDark);


			Artist bundle = (Artist)Arguments.GetParcelable("artist");
			LinearLayoutManager layoutManager = new LinearLayoutManager(Context, LinearLayoutManager.Vertical, false);
			artistContentView = root_view.FindViewById<RecyclerView>(Resource.Id.artist_content_list);
			artistContentView.SetLayoutManager(layoutManager);
			RegisterForContextMenu(artistContentView);
			CreateToolbar(root_view, Resource.String.artist_detail_title, true);
			MusicProvider.GetArtist(bundle);
			return root_view;
		}

		private void MusicProvider_ArtistRefreshed(object sender, ArtistContainer e)
		{
			if (e == null) { return; }
			if (artistDetailAdapter != null)
			{
				artistDetailAdapter.TrackClick -= Track_ItemClick;
				artistDetailAdapter.AlbumClick -= Album_ItemClick;
				artistDetailAdapter.PlayArtist -= PlayArtist_Click;
			}
			artistDetailAdapter = new ArtistDetailAdapter(Activity, e, ServiceConnection);
			artistContentView.SetAdapter(artistDetailAdapter);
			artistDetailAdapter.TrackClick += Track_ItemClick;
			artistDetailAdapter.AlbumClick += Album_ItemClick;
			artistDetailAdapter.PlayArtist += PlayArtist_Click;
			Adapters.Adapters.SetAdapters(Activity, artistDetailAdapter);
			refreshLayout.Refreshing = false;
		}

		private void PlayArtist_Click(object sender, ArtistContainer e)
		{
			ServiceConnection.Play(0, e.Tracks.ToQueue());
		}

		private void MusicProvider_ArtistStartRefresh(object sender, System.EventArgs e)
		{
			refreshLayout.Refreshing = true;
		}

		public override void OnRefreshed()
		{
			MusicProvider.GetArtist((Artist)Arguments.GetParcelable("artist"));
		}

		public override void ScrollToNowPlaying()
		{
			base.ScrollToNowPlaying();
			Adapters.Adapters.UpdateAdapters();
		}

		public override void PlaybackStatusChanged(StatusEventArg args)
		{
			base.PlaybackStatusChanged(args);
			Adapters.Adapters.UpdateAdapters();
		}

		public override void ServiceConnected()
		{
			base.ServiceConnected();
			Adapters.Adapters.SetAdapters(Activity, artistDetailAdapter);
			ScrollToNowPlaying();
		}

		private void Album_ItemClick(object sender, ArtistDetailAlbumAdapter.ViewHolder.ViewHolderEvent e)
		{
			Bundle b = new Bundle();
			b.PutParcelable("album", e.Album);
			FragmentManager.ChangeTo(new AlbumDetailFragment(), true, "Album Details", b);
		}

		private void Track_ItemClick(object sender, ArtistDetailTrackAdapter.ViewHolder.ViewHolderEvent e)
		{
			ServiceConnection?.Play(e.Position, e.Songs.ToQueue());
		}
	}
}