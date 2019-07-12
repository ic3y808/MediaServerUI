using System;
using Android.OS;
using Android.Support.V4.Widget;
using Android.Views;
using Alloy.Adapters;
using Alloy.Helpers;
using Alloy.Models;
using Alloy.Providers;

using Alloy.Services;
using Alloy.Widgets;
using Android.App;
using Android.Support.V7.Widget;
using Microsoft.AppCenter.Crashes;

namespace Alloy.Fragments
{
	public class GenresFragment : FragmentBase
	{
		private LinearLayoutManager mainLayoutManager;
		private GenresAdapter adapter;
		private SwipeRefreshLayout refreshLayout;

		public override string Name => "Genres";

		public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
		{
			base.OnCreateView(inflater, container, savedInstanceState);
			View root_view = inflater.Inflate(Resource.Layout.genres_layout, container, false);
			FastScrollRecyclerView genresList = root_view.FindViewById<FastScrollRecyclerView>(Resource.Id.genres_list);

			refreshLayout = (SwipeRefreshLayout)root_view.FindViewById(Resource.Id.swipe_container);
			refreshLayout.SetOnRefreshListener(this);
			refreshLayout.SetColorSchemeResources(Resource.Color.colorPrimary, Android.Resource.Color.HoloGreenDark, Android.Resource.Color.HoloOrangeDark, Android.Resource.Color.HoloBlueDark);

			RegisterForContextMenu(genresList);
			adapter = new GenresAdapter(ServiceConnection);
			adapter.ItemClick += OnItemClick;

			mainLayoutManager = new LinearLayoutManager(Context) { AutoMeasureEnabled = false };

			genresList.HasFixedSize = true;
			genresList.SetLayoutManager(mainLayoutManager);
			genresList.SetItemAnimator(new DefaultItemAnimator());
			genresList.FocusableInTouchMode = true;
			genresList.SetAdapter(adapter);

			DividerItemDecoration itemDecoration = new DividerItemDecoration(Context, DividerItemDecoration.Vertical);
			itemDecoration.SetDrawable(Application.Context.GetDrawable(Resource.Drawable.list_divider));
			genresList.AddItemDecoration(itemDecoration);

			CreateToolbar(root_view, Resource.String.genres_title);

			return root_view;
		}

		public override void ScrollToNowPlaying()
		{
			try
			{
				for (int i = 0; i < MusicProvider.Genres.Count; i++)
				{
					if (!MusicProvider.Genres[i].Id.Equals(ServiceConnection.CurrentSong.GenreId)) continue;
					mainLayoutManager.ScrollToPosition(i);
					break;
				}
			}
			catch (Exception ee) { Crashes.TrackError(ee); }
		}

		public override void PlaybackStatusChanged(StatusEventArg args)
		{
			base.PlaybackStatusChanged(args);
			adapter.NotifyDataSetChanged();
		}

		public override void ServiceConnected()
		{
			base.ServiceConnected();
			MusicProvider.GenresRefreshed += MusicProvider_GenresRefreshed;
			MusicProvider.GenresStartRefresh += MusicProvider_GenresStartRefresh;
			Adapters.Adapters.SetAdapters(Activity, adapter);

			if (MusicProvider.Genres == null || MusicProvider.Genres.Count == 0)
			{
				Utils.Run(MusicProvider.RefreshGenres);
			}
		}

		private void MusicProvider_GenresStartRefresh(object sender, EventArgs e)
		{
			refreshLayout.Refreshing = true;
		}

		private void MusicProvider_GenresRefreshed(object sender, EventArgs e)
		{
			refreshLayout.Refreshing = false;
			adapter?.NotifyDataSetChanged();
		}
		
		private void OnItemClick(object sender, GenresAdapter.GenreViewHolder.GenreViewHolderEvent e)
		{
			Genre genre = MusicProvider.Genres[e.Position];
			Bundle b = new Bundle();
			b.PutParcelable("genre", genre);
			FragmentManager.ChangeTo(new GenreDetailFragment(), true, "Genre Details", b);
		}

		public override void OnRefreshed()
		{
			refreshLayout.Refreshing = true;
			MusicProvider.RefreshGenres();
		}
	}
}