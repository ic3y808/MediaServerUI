using System;
using Android.OS;
using Android.Support.V4.Widget;
using Android.Views;
using Android.Widget;
using Microsoft.AppCenter.Crashes;
using Alloy.Adapters;
using Alloy.Helpers;
using Alloy.Models;
using Alloy.Providers;
using Alloy.Services;

namespace Alloy.Fragments
{
	public class ArtistsFragment : FragmentBase
	{
		private View root_view;
		private ListView listView;
		private ArtistsAdapter adapter;
		private SwipeRefreshLayout refreshLayout;

		public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
		{
			base.OnCreateView(inflater, container, savedInstanceState);
			root_view = inflater.Inflate(Resource.Layout.artists_layout, container, false);
			listView = root_view.FindViewById<ListView>(Resource.Id.artists_list);

			refreshLayout = (SwipeRefreshLayout)root_view.FindViewById(Resource.Id.swipe_container);
			refreshLayout.SetOnRefreshListener(this);
			refreshLayout.SetColorSchemeResources(Resource.Color.colorPrimary, Android.Resource.Color.HoloGreenDark, Android.Resource.Color.HoloOrangeDark, Android.Resource.Color.HoloBlueDark);
			

			
			RegisterForContextMenu(listView);
			adapter = new ArtistsAdapter(ServiceConnection);

			listView.Adapter = adapter;
			listView.ItemClick += MListView_ItemClick;

			CreateToolbar(root_view, Resource.String.artists_title);

			if (MusicProvider.Artists.Count == 0)
			{
				refreshLayout.Refreshing = true;
				Utils.Run(MusicProvider.RefreshArtists);
			}

			return root_view;
		}

		public override void ScrollToNowPlaying()
		{
			base.ScrollToNowPlaying();
			try
			{
				listView.ClearChoices();
				for (int i = 0; i < adapter.Count; i++)
				{
					Artist item = adapter[i];
					item.IsSelected = false;
				}

				if (ServiceConnection.CurrentSong != null)
				{
					for (int i = 0; i < adapter.Count; i++)
					{
						var item = adapter[i];
						if (ServiceConnection.CurrentSong.Artist.Equals(item.Name))
						{
							item.IsSelected = true;
							break;
						}
					}
				}
				Adapters.Adapters.UpdateAdapters();
				listView.Invalidate();
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
			Adapters.Adapters.SetAdapters(Activity, adapter);
		}

		public override void ContextMenuCreated(IContextMenu menu, View v, IContextMenuContextMenuInfo menuInfo)
		{
			base.ContextMenuCreated(menu, v, menuInfo);
			if (v.Id == Resource.Id.artists_list)
			{
				MenuInflater inflater = Activity.MenuInflater;
				inflater.Inflate(Resource.Menu.multi_context_menu, menu);
			}
		}

		public override void ContextMenuItemSelected(IMenuItem item, AdapterView.AdapterContextMenuInfo info)
		{
			
		}

		private void MListView_ItemClick(object sender, AdapterView.ItemClickEventArgs e)
		{
			Artist artist = MusicProvider.Artists[e.Position];
			Bundle b = new Bundle();
			b.PutParcelable("artist", artist);
			FragmentManager.ChangeTo(new ArtistDetailFragment(), true, "Artist Details", b);
		}

		public override void OnRefreshed()
		{
			refreshLayout.Refreshing = true;
			MusicProvider.RefreshArtists();
		}

		public override void LibraryLoaded()
		{
			base.LibraryLoaded();
			refreshLayout.Refreshing = false;
		}
	}
}