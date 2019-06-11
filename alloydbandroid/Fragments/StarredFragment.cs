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
		private StarredAdapter starredAdapter;
		private RecyclerView starredContentView;
		private SwipeRefreshLayout refreshLayout;

		public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
		{
			MusicProvider.StarredStartRefresh += MusicProvider_StarredStartRefresh;
			MusicProvider.StarredRefreshed += MusicProvider_StarredRefreshed;
			View root_view = inflater.Inflate(Resource.Layout.starred_layout, container, false);

			refreshLayout = (SwipeRefreshLayout)root_view.FindViewById(Resource.Id.swipe_container);
			refreshLayout.SetOnRefreshListener(this);
			refreshLayout.SetColorSchemeResources(Resource.Color.colorPrimary, Android.Resource.Color.HoloGreenDark, Android.Resource.Color.HoloOrangeDark, Android.Resource.Color.HoloBlueDark);

			LinearLayoutManager layoutManager = new LinearLayoutManager(Context, LinearLayoutManager.Vertical, false);
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
		}

		public override void ScrollToNowPlaying()
		{
			base.ScrollToNowPlaying();
			Adapters.Adapters.UpdateAdapters();
		}

		public override void PlaybackStatusChanged(StatusEventArg args)
		{
			base.PlaybackStatusChanged(args);
			starredAdapter.NotifyDataSetChanged();
			Adapters.Adapters.UpdateAdapters();
		}

		public override void ServiceConnected()
		{
			base.ServiceConnected();

			ScrollToNowPlaying();

			starredAdapter = new StarredAdapter(Activity, ServiceConnection);
			starredContentView.SetAdapter(starredAdapter);
			starredAdapter.TrackClick += Track_ItemClick;
			starredAdapter.AlbumClick += Album_ItemClick;
			starredAdapter.ArtistClick += Artist_ItemClick;
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
		}

		public override void OnRefreshed()
		{
			MusicProvider.RefreshStarred();
		}

		private void Artist_ItemClick(object sender, StarredArtistAdapter.ViewHolder.ViewHolderEvent e)
		{
			Bundle b = new Bundle();
			b.PutParcelable("artist", e.Artist);
			FragmentManager.ChangeTo(new ArtistDetailFragment(), true, "Artist Details", b);
		}
		
		private void Album_ItemClick(object sender, StarredAlbumAdapter.ViewHolder.ViewHolderEvent e)
		{
			Bundle b = new Bundle();
			b.PutParcelable("album", e.Album);
			FragmentManager.ChangeTo(new AlbumDetailFragment(), true, "Album Details", b);
		}

		private void Track_ItemClick(object sender, StarredTrackAdapter.ViewHolder.ViewHolderEvent e)
		{
			ServiceConnection?.Play(e.Position, e.Songs);
		}
	}
}