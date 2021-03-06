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
	public class FreshFragment : FragmentBase
	{
		public override string Name => "Fresh";

		public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
		{
			View root_view = inflater.Inflate(Resource.Layout.pager_layout, container, false);
			PagerSlidingTabStrip tabs = root_view.FindViewById<PagerSlidingTabStrip>(Resource.Id.tabs);
			ViewPager pager = root_view.FindViewById<ViewPager>(Resource.Id.pager);
			pager.LayoutParameters = new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.MatchParent);
			pager.OffscreenPageLimit = 10;
			FreshAdapter freshAdapter = new FreshAdapter(ChildFragmentManager);
			freshAdapter.TrackClick += (s, e) =>
			{
				Play(e.Songs, e.Position);
			};
			freshAdapter.AlbumClick += (s, e) =>
			{
				ShowAlbum(e.Albums[e.Position]);
			};
			freshAdapter.ArtistClick += (s, e) =>
			{
				ShowArtist(e.Artists[e.Position]);
			};
			pager.Adapter = freshAdapter;
			tabs.setViewPager(pager);
			int pageMargin = (int)TypedValue.ApplyDimension(ComplexUnitType.Dip, 4, Resources.DisplayMetrics);
			pager.PageMargin = pageMargin;
			pager.SetCurrentItem(0, false);
			CreateToolbar(root_view, Resource.String.fresh_title);

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
			if (MusicProvider.Fresh.Tracks.Count == 0)
			{
				MusicProvider.RefreshFresh();
			}
		}

		public override void OnRefreshed()
		{
			MusicProvider.RefreshFresh();
		}
	}
}