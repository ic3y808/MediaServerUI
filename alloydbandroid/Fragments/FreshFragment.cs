using System;
using System.Collections.Generic;
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
using Android.App;
using Android.Content;
using Android.Graphics;
using Android.Runtime;
using Android.Support.V4.App;
using Android.Support.V4.View;
using Android.Util;
using Android.Widget;
using Java.Lang;
using ActionMenuView = Android.Support.V7.Widget.ActionMenuView;
using Fragment = Android.Support.V4.App.Fragment;
using FragmentManager = Android.Support.V4.App.FragmentManager;
using Object = Java.Lang.Object;

namespace Alloy.Fragments
{
	public class FreshFragment : FragmentBase
	{
		//private RecyclerView freshContentView;
		//private SwipeRefreshLayout refreshLayout;

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
			freshAdapter = new FreshAdapter(FragmentManager, ServiceConnection);
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

			//freshAdapter = new FreshAdapter(Activity, ServiceConnection);
			//freshContentView.SetAdapter(freshAdapter);
			//freshAdapter.TrackClick += Track_ItemClick;
			//freshAdapter.AlbumClick += Album_ItemClick;
			//freshAdapter.ArtistClick += Artist_ItemClick;

			////MusicProvider.RefreshFresh();


			if (MusicProvider.Fresh == null ||
				MusicProvider.Fresh.Albums == null ||
				MusicProvider.Fresh.Artists == null ||
				MusicProvider.Fresh.Tracks == null)
			{
				//MusicProvider.RefreshFresh();
			}
			//if (MusicProvider.Charts == null ||
			//	MusicProvider.Charts.NeverPlayed == null ||
			//	MusicProvider.Charts.NeverPlayedAlbums == null ||
			//	MusicProvider.Charts.TopTracks == null)
			//{
			MusicProvider.RefreshCharts();
			//}
		}

		public override void OnRefreshed()
		{
			MusicProvider.RefreshFresh();
			MusicProvider.RefreshCharts();
		}
	}

	public class SuperAwesomeCardFragment : Fragment
	{

		private static string ARG_POSITION = "position";

		RecyclerView recyclerView;
		FreshNeverPlayedAdapter adapter;

		private int position;
		private BackgroundAudioServiceConnection serviceConnection;

		public SuperAwesomeCardFragment(BackgroundAudioServiceConnection serviceConnection)
		{
			this.serviceConnection = serviceConnection;
			MusicProvider.ChartsRefreshed += MusicProvider_ChartsRefreshed;
		}

		private void MusicProvider_ChartsRefreshed(object sender, Charts e)
		{
			Adapters.Adapters.UpdateAdapters();
		}

		public static SuperAwesomeCardFragment newInstance(int position, BackgroundAudioServiceConnection serviceConnection)
		{
			SuperAwesomeCardFragment f = new SuperAwesomeCardFragment(serviceConnection);
			Bundle b = new Bundle();
			b.PutInt(ARG_POSITION, position);
			f.Arguments = b;
			return f;
		}


		public override void OnCreate(Bundle savedInstanceState)
		{
			base.OnCreate(savedInstanceState);
			position = Arguments.GetInt(ARG_POSITION);

		}

		public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
		{
			View rootView = inflater.Inflate(Resource.Layout.fresh_never_played_tracks, container, false);

			recyclerView = rootView.FindViewById<RecyclerView>(Resource.Id.fresh_never_played_tracks_list);
			adapter = new FreshNeverPlayedAdapter();
			recyclerView.SetAdapter(adapter);
			recyclerView.SetLayoutManager(new LinearLayoutManager(Context));
			recyclerView.HasFixedSize = true;
			Adapters.Adapters.SetAdapters(Activity, adapter);


			ViewCompat.SetElevation(rootView, 50);
			return rootView;
		}

		public class FreshNeverPlayedAdapter : RecyclerView.Adapter
		{

			public override long GetItemId(int position)
			{
				return position;
			}

			public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
			{
				ViewHolder h = (ViewHolder)holder;
				h.Songs = MusicProvider.Charts.NeverPlayed;
				//MusicProvider.Charts.NeverPlayed[position].GetAlbumArt(h.Image);
				h.Title.Text = MusicProvider.Charts.NeverPlayed[position].Title;
				h.Artist.Text = MusicProvider.Charts.NeverPlayed[position].Artist;
				h.Album.Text = MusicProvider.Charts.NeverPlayed[position].Album;
				if (MusicProvider.Charts.NeverPlayed[position].IsSelected)
				{
					h.ItemView.FindViewById<LinearLayout>(Resource.Id.item_root).SetBackgroundResource(Resource.Color.menu_selection_color);
				}
				else h.ItemView.FindViewById<LinearLayout>(Resource.Id.item_root).SetBackgroundColor(Color.Transparent);
			}

			public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
			{
				View view = LayoutInflater.From(parent.Context).Inflate(Resource.Layout.fresh_song_item, parent, false);
				return new ViewHolder(view);
			}

			public override int ItemCount
			{
				get
				{
					if (MusicProvider.Charts == null || MusicProvider.Charts.NeverPlayed == null) return 0;
					return MusicProvider.Charts.NeverPlayed.Count;
				}
			}

			public class ViewHolder : RecyclerView.ViewHolder
			{
				public LinearLayout ItemRoot { get; set; }
				public ImageView Image { get; set; }
				public TextView Title { get; set; }
				public TextView Artist { get; set; }
				public TextView Album { get; set; }
				public List<Song> Songs { get; set; }

				public ViewHolder(View itemView) : base(itemView)
				{
					ItemRoot = itemView.FindViewById<LinearLayout>(Resource.Id.item_root);
					Image = itemView.FindViewById<ImageView>(Resource.Id.image_view);
					Title = itemView.FindViewById<TextView>(Resource.Id.title);
					Artist = itemView.FindViewById<TextView>(Resource.Id.artist);
					Album = itemView.FindViewById<TextView>(Resource.Id.album);
				}
			}
		}
	}

	public class FreshAdapter : FragmentPagerAdapter
	{
		private BackgroundAudioServiceConnection serviceConnection;

		public FreshAdapter(FragmentManager fm, BackgroundAudioServiceConnection serviceConnection) : base(fm)
		{
			this.serviceConnection = serviceConnection;
		}

		private ICharSequence[] TITLES = CharSequence.ArrayFromStringArray(new[] { "Never Played Tracks", "Never Played Albums", "Top Tracks" });

		public override ICharSequence GetPageTitleFormatted(int position)
		{
			return TITLES[position];
		}

		public override Fragment GetItem(int position)
		{
			return SuperAwesomeCardFragment.newInstance(position, serviceConnection);
		}

		public override int Count => TITLES.Length;
	}
}