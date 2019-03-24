using System.Collections.Generic;
using Android.OS;
using Android.Views;
using Android.Widget;
using Alloy.Adapters;
using Alloy.Models;
using Alloy.Providers;
using Alloy.Services;

namespace Alloy.Fragments
{
	public class ArtistDetailFragment : FragmentBase
	{
		private View root_view;
		private ListView listView;
		private ArtistsDetailAdapter adapter;
		private MusicQueue tracks;

		public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
		{
			var artist = Arguments.GetParcelable("artist") as Artist;
			tracks = MusicProvider.GetArtistTracks(artist);
			root_view = inflater.Inflate(Resource.Layout.artist_detail_layout, container, false);
			listView = root_view.FindViewById<ListView>(Resource.Id.artist_track_list);
			root_view.FindViewById<TextView>(Resource.Id.title).SetText(artist.Name, TextView.BufferType.Normal);
			root_view.FindViewById<ImageView>(Resource.Id.album_art).SetImageBitmap(MusicProvider.GetAlbumArt(new Dictionary<string, object>() { { "artist_id", artist.Id } }));
			RegisterForContextMenu(listView);
			adapter = new ArtistsDetailAdapter(tracks, ServiceConnection);

			listView.Adapter = adapter;
			listView.ItemClick += ListView_ItemClick;

			CreateToolbar(root_view, Resource.String.artist_detail_title, true);

			return root_view;
		}

		public override void ScrollToNowPlaying()
		{
			base.ScrollToNowPlaying();

			for (int i = 0; i < adapter.Count; i++)
			{
				var item = adapter[i];
				item.IsSelected = false;
			}

			if (ServiceConnection.CurrentSong != null)
			{
				for (int i = 0; i < adapter.Count; i++)
				{
					var item = adapter[i];
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
			if (tracks[e.Position].IsSelected)
			{

			}
			else
			{
				ServiceConnection.Play(e.Position, tracks);
			}
		}
	}
}