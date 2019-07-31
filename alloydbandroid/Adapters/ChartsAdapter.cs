using System;
using Android.OS;
using Android.Support.V4.Widget;
using Android.Support.V7.Widget;
using Android.Views;
using Alloy.Models;
using Alloy.Providers;
using Alloy.Services;
using Android.Content;
using Android.Runtime;
using Android.Support.V4.App;
using Java.Lang;
using Fragment = Android.Support.V4.App.Fragment;
using FragmentManager = Android.Support.V4.App.FragmentManager;
using Object = Java.Lang.Object;


namespace Alloy.Adapters
{
	public class ChartsCardFragment : Fragment
	{
		private SwipeRefreshLayout refreshLayout;
		private MaterialRippleAdapter adapter;
		private event EventHandler<MaterialRippleAdapter.TrackViewHolderEvent> trackClick;
		private event EventHandler<MaterialRippleAdapter.AlbumViewHolderEvent> albumClick;
		public int Position { get; set; }

		public ChartsCardFragment(EventHandler<MaterialRippleAdapter.TrackViewHolderEvent> trackClick, EventHandler<MaterialRippleAdapter.AlbumViewHolderEvent> albumClick)
		{
			this.trackClick = trackClick;
			this.albumClick = albumClick;
			MusicProvider.ChartsStartRefresh += MusicProvider_ChartsStartRefresh;
			MusicProvider.ChartsRefreshed += MusicProvider_ChartsRefreshed;
			BackgroundAudioServiceConnection.ServiceConnected += BackgroundAudioServiceConnection_ServiceConnected;
		}

		public override void OnResume()
		{
			base.OnResume();
			SetDataSource();
		}

		public override void OnAttach(Context context)
		{
			base.OnAttach(context);
			SetDataSource();
		}

		private void BackgroundAudioServiceConnection_ServiceConnected(object sender, bool e)
		{
			if (e) { SetDataSource(); }
		}

		private void MusicProvider_ChartsStartRefresh(object sender, EventArgs e)
		{
			refreshLayout.Refreshing = true;
		}

		private void MusicProvider_ChartsRefreshed(object sender, Charts e)
		{
			SetDataSource();
			refreshLayout.Refreshing = false;
		}

		private void SetDataSource()
		{
			if (adapter == null) return;
			switch (Position)
			{
				case 0:
					adapter.Songs = MusicProvider.Charts.NeverPlayed;
					break;
				case 1:
					adapter.Albums = MusicProvider.Charts.NeverPlayedAlbums;
					break;
				case 2:
					adapter.Songs = MusicProvider.Charts.TopTracks;
					break;
			}
			Adapters.UpdateAdapters();
		}

		public static ChartsCardFragment newInstance(int position, EventHandler<MaterialRippleAdapter.TrackViewHolderEvent> trackClick, EventHandler<MaterialRippleAdapter.AlbumViewHolderEvent> albumClick)
		{
			ChartsCardFragment f = new ChartsCardFragment(trackClick, albumClick);
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
					rootView = inflater.Inflate(Resource.Layout.track_list_layout, container, false);
					break;
				case 1:
					rootView = inflater.Inflate(Resource.Layout.album_list_layout, container, false);
					break;
				case 2:
					rootView = inflater.Inflate(Resource.Layout.track_list_layout, container, false);
					break;
			}


			if (rootView == null) return base.OnCreateView(inflater, container, savedInstanceState);


			refreshLayout = rootView.FindViewById<SwipeRefreshLayout>(Resource.Id.swipe_container);
			refreshLayout.Refresh += RefreshLayout_Refresh;
			RecyclerView recyclerView;

			switch (Position)
			{
				case 0:
				case 2:
					recyclerView = rootView.FindViewById<RecyclerView>(Resource.Id.track_list);
					adapter = new MaterialRippleAdapter();
					adapter.TrackClick += (sender, e) => { trackClick?.Invoke(sender, e); };
					recyclerView.SetAdapter(adapter);
					recyclerView.SetLayoutManager(new LinearLayoutManager(Context));
					recyclerView.HasFixedSize = true;
					Adapters.SetAdapters(Activity, adapter);
					break;
				case 1:
					recyclerView = rootView.FindViewById<RecyclerView>(Resource.Id.album_list);
					adapter = new MaterialRippleAdapter();
					adapter.AlbumClick += (sender, e) => { albumClick?.Invoke(sender, e); };
					recyclerView.SetAdapter(adapter);
					recyclerView.SetLayoutManager(new LinearLayoutManager(Context));
					recyclerView.HasFixedSize = true;
					Adapters.SetAdapters(Activity, adapter);
					break;
			}



			return rootView;

		}

		private void RefreshLayout_Refresh(object sender, EventArgs e)
		{
			MusicProvider.RefreshCharts();
		}
	}

	public class ChartsAdapter : FragmentStatePagerAdapter
	{
		public event EventHandler<MaterialRippleAdapter.TrackViewHolderEvent> TrackClick;
		public event EventHandler<MaterialRippleAdapter.AlbumViewHolderEvent> AlbumClick;

		public ChartsAdapter(FragmentManager fm) : base(fm)
		{
		}

		public override int GetItemPosition(Object @object)
		{
			if (@object is ChartsCardFragment fragment) { return fragment.Position; }

			return base.GetItemPosition(@object);
		}

		private readonly ICharSequence[] TITLES = CharSequence.ArrayFromStringArray(new[] { "Never Played Tracks", "Never Played Albums", "Top Tracks" });

		public override ICharSequence GetPageTitleFormatted(int position)
		{
			return TITLES[position];
		}

		public override Fragment GetItem(int position)
		{
			return ChartsCardFragment.newInstance(position, TrackClick, AlbumClick);
		}

		public override int Count => TITLES.Length;
	}
}
