using System;
using Android.OS;
using Android.Views;
using Alloy.Adapters;
using Alloy.Models;
using Alloy.Providers;

using Alloy.Services;
using Android.Support.V4.Widget;
using Android.Support.V7.Widget;
using Microsoft.AppCenter.Crashes;

namespace Alloy.Fragments
{
	public class AlbumDetailFragment : FragmentBase
	{
		private SwipeRefreshLayout refreshLayout;
		private RecyclerView albumContentView;
		private AlbumDetailAdapter albumDetailAdapter;
		private AlbumContainer album;

		public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
		{
			MusicProvider.AlbumStartRefresh += MusicProvider_AlbumStartRefresh;
			MusicProvider.AlbumRefreshed += MusicProvider_AlbumRefreshed;
			View root_view = inflater.Inflate(Resource.Layout.album_detail_layout, container, false);

			refreshLayout = (SwipeRefreshLayout)root_view.FindViewById(Resource.Id.swipe_container);
			refreshLayout.SetOnRefreshListener(this);
			refreshLayout.SetColorSchemeResources(Resource.Color.colorPrimary, Android.Resource.Color.HoloGreenDark, Android.Resource.Color.HoloOrangeDark, Android.Resource.Color.HoloBlueDark);



			Album bundle = null;

			try
			{
				bundle = (Album)Arguments.GetParcelable("album");
			}
			catch (Exception e)
			{
				Crashes.TrackError(e);
				try
				{
					Song bundle2 = (Song)Arguments.GetParcelable("track");
					if (bundle2 != null)
					{ bundle = new Album { Id = bundle2.AlbumId }; }
				}
				catch (Exception e2)
				{
					Crashes.TrackError(e2);
				}
			}


			LinearLayoutManager layoutManager = new LinearLayoutManager(Context, LinearLayoutManager.Vertical, false);
			albumContentView = root_view.FindViewById<RecyclerView>(Resource.Id.album_content_list);
			albumContentView.SetLayoutManager(layoutManager);
			RegisterForContextMenu(albumContentView);
			CreateToolbar(root_view, Resource.String.album_detail_title, true);
			MusicProvider.GetAlbum(bundle);
			return root_view;
		}

		private void MusicProvider_AlbumRefreshed(object sender, AlbumContainer e)
		{
			if (e != null)
			{
				album = e;
				if (albumDetailAdapter != null)
				{
					albumDetailAdapter.TrackClick -= Track_ItemClick;
					albumDetailAdapter.PlayAlbum -= AlbumDetailAdapter_PlayAlbum;

				}
				albumDetailAdapter = new AlbumDetailAdapter(Activity, album, ServiceConnection);
				BackgroundAudioServiceConnection.PlaybackStatusChanged += (o, arg) =>
				{
					albumDetailAdapter.NotifyDataSetChanged();
				};
				albumContentView.SetAdapter(albumDetailAdapter);
				albumDetailAdapter.TrackClick += Track_ItemClick;
				albumDetailAdapter.PlayAlbum += AlbumDetailAdapter_PlayAlbum;
				Adapters.Adapters.SetAdapters(Activity, albumDetailAdapter);
				refreshLayout.Refreshing = false;
			}
		}

		private void AlbumDetailAdapter_PlayAlbum(object sender, EventArgs e)
		{
			ServiceConnection?.Play(0, album.Tracks);
		}

		private void Track_ItemClick(object sender, AlbumDetailTrackAdapter.ViewHolder.ViewHolderEvent e)
		{
			ServiceConnection?.Play(e.Position, e.Songs);
		}

		private void MusicProvider_AlbumStartRefresh(object sender, EventArgs e)
		{
			refreshLayout.Refreshing = true;
		}

		public override void OnRefreshed()
		{
			Album bundle = null;
			try
			{
				bundle = (Album)Arguments.GetParcelable("album");
			}
			catch (Exception e)
			{
				Crashes.TrackError(e);
				try
				{
					Song bundle2 = (Song)Arguments.GetParcelable("track");
					if (bundle2 != null)
					{ bundle = new Album { Id = bundle2.AlbumId }; }
				}
				catch (Exception e2)
				{
					Crashes.TrackError(e2);
				}
			}
			MusicProvider.GetAlbum(bundle);
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
			Adapters.Adapters.SetAdapters(Activity, albumDetailAdapter);
			ScrollToNowPlaying();
		}
	}
}