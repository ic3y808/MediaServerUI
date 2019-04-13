using Android.OS;
using Android.Views;
using Alloy.Adapters;
using Alloy.Models;
using Alloy.Providers;
using Alloy.Services;
using Android.Support.V4.Widget;
using Android.Support.V7.Widget;

namespace Alloy.Fragments
{
	public class GenreDetailFragment : FragmentBase
	{
		private GenreDetailAdapter genreDetailAdapter;
		private RecyclerView genreContentView;
		private SwipeRefreshLayout refreshLayout;

		public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
		{
			MusicProvider.GenreStartRefresh += MusicProvider_GenreStartRefresh;
			MusicProvider.GenreRefreshed += MusicProvider_GenreRefreshed;
			View root_view = inflater.Inflate(Resource.Layout.genre_detail_layout, container, false);

			refreshLayout = (SwipeRefreshLayout)root_view.FindViewById(Resource.Id.swipe_container);
			refreshLayout.SetOnRefreshListener(this);
			refreshLayout.SetColorSchemeResources(Resource.Color.colorPrimary, Android.Resource.Color.HoloGreenDark, Android.Resource.Color.HoloOrangeDark, Android.Resource.Color.HoloBlueDark);


			Genre bundle = (Genre)Arguments.GetParcelable("genre");
			LinearLayoutManager layoutManager = new LinearLayoutManager(Context, LinearLayoutManager.Vertical, false);
			genreContentView = root_view.FindViewById<RecyclerView>(Resource.Id.genre_content_list);
			genreContentView.SetLayoutManager(layoutManager);
			RegisterForContextMenu(genreContentView);
			CreateToolbar(root_view, Resource.String.genre_detail_title, true);
			MusicProvider.GetGenre(bundle);
			return root_view;
		}

		private void MusicProvider_GenreRefreshed(object sender, GenreContainer e)
		{
			if (e == null) { return; }
			if (genreDetailAdapter != null)
			{
				genreDetailAdapter.TrackClick -= Track_ItemClick;
			}
			genreDetailAdapter = new GenreDetailAdapter(Activity, e, ServiceConnection);
			genreContentView.SetAdapter(genreDetailAdapter);
			genreDetailAdapter.TrackClick += Track_ItemClick;
			Adapters.Adapters.SetAdapters(Activity, genreDetailAdapter);
			refreshLayout.Refreshing = false;
		}

		private void MusicProvider_GenreStartRefresh(object sender, System.EventArgs e)
		{
			refreshLayout.Refreshing = true;
		}

		public override void OnRefreshed()
		{
			MusicProvider.GetGenre((Genre)Arguments.GetParcelable("genre"));
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
			Adapters.Adapters.SetAdapters(Activity, genreDetailAdapter);
			ScrollToNowPlaying();
		}

		private void Track_ItemClick(object sender, GenreDetailTrackAdapter.ViewHolder.ViewHolderEvent e)
		{
			ServiceConnection?.Play(e.Position, e.Songs);
		}
	}
}