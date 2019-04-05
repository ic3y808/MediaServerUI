using System;
using Android.OS;
using Android.Support.V4.Widget;
using Android.Views;
using Android.Widget;
using Microsoft.AppCenter.Crashes;
using Alloy.Adapters;
using Alloy.Providers;
using Alloy.Services;

namespace Alloy.Fragments
{
	public class StarredFragment : FragmentBase
	{
		private ListView listView;
	
		private SwipeRefreshLayout refreshLayout;

		public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
		{
			base.OnCreateView(inflater, container, savedInstanceState);
			View root_view = inflater.Inflate(Resource.Layout.favorites_layout, container, false);
			listView = root_view.FindViewById<ListView>(Resource.Id.favorites_list);

			refreshLayout = (SwipeRefreshLayout)root_view.FindViewById(Resource.Id.swipe_container);
			refreshLayout.SetOnRefreshListener(this);
			refreshLayout.SetColorSchemeResources(Resource.Color.colorPrimary, Android.Resource.Color.HoloGreenDark, Android.Resource.Color.HoloOrangeDark, Android.Resource.Color.HoloBlueDark);

			RegisterForContextMenu(listView);
			


			CreateToolbar(root_view, Resource.String.starred_title);

			return root_view;
		}

		public override void ScrollToNowPlaying()
		{
			base.ScrollToNowPlaying();
			
		}

		public override void PlaybackStatusChanged(StatusEventArg args)
		{
			base.PlaybackStatusChanged(args);
			
		}

		public override void ServiceConnected()
		{
			base.ServiceConnected();
		
		}

		public override void ContextMenuCreated(IContextMenu menu, View v, IContextMenuContextMenuInfo menuInfo)
		{
			base.ContextMenuCreated(menu, v, menuInfo);
			if (v.Id == Resource.Id.favorites_list)
			{
				MenuInflater inflater = Activity.MenuInflater;
				inflater.Inflate(Resource.Menu.song_context_menu, menu);
			}
		}

		private void MListView_ItemClick(object sender, AdapterView.ItemClickEventArgs e)
		{
			if (MusicProvider.Favorites[e.Position].IsSelected)
			{

			}
			else
			{
				
					ServiceConnection.Play(e.Position, MusicProvider.Favorites);
				
			}
		}

		public override void OnRefreshed()
		{
			refreshLayout.Refreshing = true;
			//MusicProvider.RefreshFavorites();
		}

		public override void LibraryLoaded()
		{
			base.LibraryLoaded();
			refreshLayout.Refreshing = false;
		}
	}
}