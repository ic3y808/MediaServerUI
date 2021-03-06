﻿using Android.OS;
using Android.Views;
using Alloy.Adapters;
using Alloy.Providers;

using Alloy.Services;
using Alloy.Widgets;
using Android.Support.V4.View;
using Android.Util;
using Android.Widget;

namespace Alloy.Fragments
{
	public class ChartsFragment : FragmentBase
	{
		public override string Name => "Charts";

		public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
		{
			View root_view = inflater.Inflate(Resource.Layout.pager_layout, container, false);
			PagerSlidingTabStrip tabs = root_view.FindViewById<PagerSlidingTabStrip>(Resource.Id.tabs);
			ViewPager pager = root_view.FindViewById<ViewPager>(Resource.Id.pager);
			pager.LayoutParameters = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.MatchParent);
			pager.OffscreenPageLimit = 10;
			ChartsAdapter chartsAdapter = new ChartsAdapter(ChildFragmentManager);
			chartsAdapter.TrackClick += (s, e) =>
			{
				Play(e.Songs, e.Position);
			};
			chartsAdapter.AlbumClick += (s, e) =>
			{
				ShowAlbum(e.Albums[e.Position]);
			};
			pager.Adapter = chartsAdapter;
			tabs.setViewPager(pager);
			int pageMargin = (int)TypedValue.ApplyDimension(ComplexUnitType.Dip, 4, Resources.DisplayMetrics);
			pager.PageMargin = pageMargin;
			pager.SetCurrentItem(0, false);
			CreateToolbar(root_view, Resource.String.charts_title);

			return root_view;
		}

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
			if (MusicProvider.Charts.NeverPlayed.Count == 0)
			{
				MusicProvider.RefreshCharts();
			}
		}

		public override void OnRefreshed()
		{
			MusicProvider.RefreshCharts();
		}
	}
}