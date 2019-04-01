using System.Collections.Generic;
using Android.OS;
using Android.Views;
using Android.Widget;
using Alloy.Adapters;
using Alloy.Helpers;
using Alloy.Models;
using Alloy.Providers;
using Alloy.Services;
using Android.Support.V4.Widget;

namespace Alloy.Fragments
{
	public class ArtistDetailFragment : FragmentBase
	{
		private View root_view;
		private ListView listView;
		private ArtistsDetailAdapter adapter;
		private SwipeRefreshLayout refreshLayout;

		public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
		{
			Artist artist = Arguments.GetParcelable("artist") as Artist;

			root_view = inflater.Inflate(Resource.Layout.artist_detail_layout, container, false);
			listView = root_view.FindViewById<ListView>(Resource.Id.artist_track_list);

			refreshLayout = (SwipeRefreshLayout)root_view.FindViewById(Resource.Id.swipe_container);
			refreshLayout.SetOnRefreshListener(this);
			refreshLayout.SetColorSchemeResources(Resource.Color.colorPrimary, Android.Resource.Color.HoloGreenDark, Android.Resource.Color.HoloOrangeDark, Android.Resource.Color.HoloBlueDark);

			root_view.FindViewById<TextView>(Resource.Id.title).SetText(artist.Name, TextView.BufferType.Normal);
			root_view.FindViewById<ImageView>(Resource.Id.album_art).SetImageBitmap(MusicProvider.GetAlbumArt(new Dictionary<string, object>() { { "artist_id", artist.Id } }));


			RegisterForContextMenu(listView);
			adapter = new ArtistsDetailAdapter(artist);
			adapter.NotifyDataSetChanged();
			ArtistsDetailAdapter.ArtistLoaded += ArtistsDetailAdapter_ArtistLoaded;
			listView.Adapter = adapter;
			listView.ItemClick += ListView_ItemClick;

			CreateToolbar(root_view, Resource.String.artist_detail_title, true);


			if (adapter.ArtistTracks.Count == 0)
			{
				refreshLayout.Refreshing = true;
				adapter.RefreshArtist();
			}

			return root_view;
		}

		private void ArtistsDetailAdapter_ArtistLoaded(object sender, System.EventArgs e)
		{
			refreshLayout.Refreshing = false;
		}

		public override void OnRefreshed()
		{
			refreshLayout.Refreshing = true;
			adapter.RefreshArtist();
		}

		public override void ScrollToNowPlaying()
		{
			base.ScrollToNowPlaying();

			for (int i = 0; i < adapter.Count; i++)
			{
				Song item = adapter[i];
				item.IsSelected = false;
			}

			if (ServiceConnection.CurrentSong != null)
			{
				for (int i = 0; i < adapter.Count; i++)
				{
					Song item = adapter[i];
					if (ServiceConnection.CurrentSong.Id.Equals(item.Id))
					{
						item.IsSelected = true;
						//listView.SetItemChecked(i, true);
						break;
					}
				}
			}
			Adapters.Adapters.UpdateAdapters();
			listView.Invalidate();
		}

		public override void PlaybackStatusChanged(StatusEventArg args)
		{
			base.PlaybackStatusChanged(args);
			Adapters.Adapters.UpdateAdapters();
			listView.Invalidate();
		}

		public override void ServiceConnected()
		{
			base.ServiceConnected();
			Adapters.Adapters.SetAdapters(Activity, adapter);
			ScrollToNowPlaying();
		}

		public override void ContextMenuItemSelected(IMenuItem item, AdapterView.AdapterContextMenuInfo info)
		{



		}

		public override void ContextMenuCreated(IContextMenu menu, View v, IContextMenuContextMenuInfo menuInfo)
		{
			base.ContextMenuCreated(menu, v, menuInfo);
			if (v.Id == Resource.Id.artist_track_list)
			{
				MenuInflater inflater = Activity.MenuInflater;
				inflater.Inflate(Resource.Menu.song_context_menu, menu);
			}
		}

		private void ListView_ItemClick(object sender, AdapterView.ItemClickEventArgs e)
		{
			if (adapter.ArtistTracks[e.Position].IsSelected)
			{

			}
			else
			{
				ServiceConnection.Play(e.Position, adapter.ArtistTracks);
			}
		}
	}
}