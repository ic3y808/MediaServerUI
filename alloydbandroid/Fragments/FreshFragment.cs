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
using Alloy.Widgets;
using Android.Runtime;
using Android.Support.V4.App;
using Android.Support.V4.View;
using Android.Util;
using Android.Widget;
using Java.Lang;
using Fragment = Android.Support.V4.App.Fragment;
using FragmentManager = Android.Support.V4.App.FragmentManager;
using Object = Java.Lang.Object;

namespace Alloy.Fragments
{
	public class FreshFragment : FragmentBase
	{
		private View root_view;
		private FreshAdapter freshAdapter;
		private PagerSlidingTabStrip tabs;
		private ViewPager pager;
		public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
		{
			root_view = inflater.Inflate(Resource.Layout.fresh_layout, container, false);
			tabs = root_view.FindViewById<PagerSlidingTabStrip>(Resource.Id.tabs);
			pager = root_view.FindViewById<ViewPager>(Resource.Id.pager);
			pager.LayoutParameters = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.MatchParent);
			pager.OffscreenPageLimit = 10;
			freshAdapter = new FreshAdapter(FragmentManager, ServiceConnection);
			freshAdapter.TrackClick += (s, e) =>
			 {
				 Play(e.Songs.ToQueue(), e.Position);
			 };
			pager.Adapter = freshAdapter;
			tabs.setViewPager(pager);
			int pageMargin = (int)TypedValue.ApplyDimension(ComplexUnitType.Dip, 4, Resources.DisplayMetrics);
			pager.PageMargin = pageMargin;
			pager.SetCurrentItem(0, false);
			CreateToolbar(root_view, Resource.String.fresh_title);

			return root_view;
		}

		public override string Name => "Fresh";

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
			MusicProvider.RefreshCharts();
		}

		public override void OnRefreshed()
		{
			MusicProvider.RefreshFresh();
			MusicProvider.RefreshCharts();
		}
	}

	public class FreshCardFragment : Fragment
	{
		private SwipeRefreshLayout refreshLayout;
		private RecyclerView recyclerView;
		private MaterialRippleTrackAdapter adapter;
		private BackgroundAudioServiceConnection serviceConnection;
		private event EventHandler<MaterialRippleTrackAdapter.TrackViewHolderEvent> itemClick;
		public int Position { get; set; }

		public FreshCardFragment(EventHandler<MaterialRippleTrackAdapter.TrackViewHolderEvent> itemClick, BackgroundAudioServiceConnection serviceConnection)
		{
			this.serviceConnection = serviceConnection;
			this.itemClick = itemClick;
			MusicProvider.ChartsStartRefresh += MusicProvider_ChartsStartRefresh;
			MusicProvider.ChartsRefreshed += MusicProvider_ChartsRefreshed;
		}

		private void MusicProvider_ChartsStartRefresh(object sender, EventArgs e)
		{
			refreshLayout.Refreshing = true;
		}

		private void MusicProvider_ChartsRefreshed(object sender, Charts e)
		{
			switch (Position)
			{
				case 0:
					adapter.Songs = MusicProvider.Charts.NeverPlayed;
					break;
				case 1:
					//adapter.Songs = MusicProvider.Charts.NeverPlayedAlbums;
					break;
				case 2:
					adapter.Songs = MusicProvider.Charts.TopTracks;
					break;
			}
			
			refreshLayout.Refreshing = false;
			Adapters.Adapters.UpdateAdapters();
		}

		public static FreshCardFragment newInstance(int position, EventHandler<MaterialRippleTrackAdapter.TrackViewHolderEvent> itemClick, BackgroundAudioServiceConnection serviceConnection)
		{
			FreshCardFragment f = new FreshCardFragment(itemClick, serviceConnection);
			Bundle b = new Bundle();
			b.PutInt("position", position);
			f.Arguments = b;
			return f;
		}

		public override void OnCreate(Bundle savedInstanceState)
		{
			base.OnCreate(savedInstanceState);
			Position = Arguments.GetInt("position");
		}

		public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
		{
			View rootView = null;
			switch (Position)
			{
				case 0:
					rootView = inflater.Inflate(Resource.Layout.fresh_track_layout, container, false);
					break;
				case 1:
					rootView = inflater.Inflate(Resource.Layout.fresh_album_layout, container, false);
					break;
				case 2:
					rootView = inflater.Inflate(Resource.Layout.fresh_track_layout, container, false);
					break;
			}


			if (rootView == null) return base.OnCreateView(inflater, container, savedInstanceState);

			
			refreshLayout = rootView.FindViewById<SwipeRefreshLayout>(Resource.Id.swipe_container);
			refreshLayout.Refreshing = true;
			refreshLayout.Refresh += RefreshLayout_Refresh;

			switch (Position)
			{
				case 0:
				case 2:
					recyclerView = rootView.FindViewById<RecyclerView>(Resource.Id.track_list);
					adapter = new MaterialRippleTrackAdapter(serviceConnection);
					adapter.TrackClick += (sender, e) => { itemClick?.Invoke(sender, e); };
					recyclerView.SetAdapter(adapter);
					recyclerView.SetLayoutManager(new LinearLayoutManager(Context));
					recyclerView.HasFixedSize = true;
					Adapters.Adapters.SetAdapters(Activity, adapter);
					break;
				case 1:

					break;
			}

			

			return rootView;

		}

		private void RefreshLayout_Refresh(object sender, EventArgs e)
		{
			MusicProvider.RefreshCharts();
		}
	}

	public class FreshAdapter : FragmentStatePagerAdapter
	{
		private BackgroundAudioServiceConnection serviceConnection;
		public event EventHandler<MaterialRippleTrackAdapter.TrackViewHolderEvent> TrackClick;

		public FreshAdapter(FragmentManager fm, BackgroundAudioServiceConnection serviceConnection) : base(fm)
		{
			this.serviceConnection = serviceConnection;
		}

		public override int GetItemPosition(Object @object)
		{
			if (@object is FreshCardFragment fragment) { return fragment.Position; }

			return base.GetItemPosition(@object);
		}

		private ICharSequence[] TITLES = CharSequence.ArrayFromStringArray(new[] { "Never Played Tracks", "Never Played Albums", "Top Tracks" });

		public override ICharSequence GetPageTitleFormatted(int position)
		{
			return TITLES[position];
		}

		public override Fragment GetItem(int position)
		{
			return FreshCardFragment.newInstance(position, TrackClick, serviceConnection);
		}

		public override int Count => TITLES.Length;
	}
}