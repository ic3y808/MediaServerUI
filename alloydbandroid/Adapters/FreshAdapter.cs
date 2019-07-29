using System;
using Android.OS;
using Android.Support.V4.Widget;
using Android.Support.V7.Widget;
using Android.Views;
using Alloy.Models;
using Alloy.Providers;
using Alloy.Services;
using Android.Runtime;
using Android.Support.V4.App;
using Java.Lang;
using Fragment = Android.Support.V4.App.Fragment;
using FragmentManager = Android.Support.V4.App.FragmentManager;
using Object = Java.Lang.Object;


namespace Alloy.Adapters
{
	public class FreshCardFragment : Fragment
	{
		private SwipeRefreshLayout refreshLayout;
		private RecyclerView recyclerView;
		private MaterialRippleAdapter adapter;
		private event EventHandler<MaterialRippleAdapter.TrackViewHolderEvent> trackClick;
		private event EventHandler<MaterialRippleAdapter.AlbumViewHolderEvent> albumClick;
		private event EventHandler<MaterialRippleAdapter.ArtistViewHolderEvent> artistClick;
		public int Position { get; set; }

		public FreshCardFragment(EventHandler<MaterialRippleAdapter.TrackViewHolderEvent> trackCLick, EventHandler<MaterialRippleAdapter.AlbumViewHolderEvent> albumClick, EventHandler<MaterialRippleAdapter.ArtistViewHolderEvent> artistClick)
		{
			this.trackClick = trackCLick;
			this.albumClick = albumClick;
			this.artistClick = artistClick;
			MusicProvider.FreshStartRefresh += MusicProvider_FreshStartRefresh;
			MusicProvider.FreshRefreshed += MusicProvider_FreshRefreshed;
			BackgroundAudioServiceConnection.ServiceConnected += BackgroundAudioServiceConnection_ServiceConnected;
		}



		private void MusicProvider_FreshStartRefresh(object sender, EventArgs e)
		{
			refreshLayout.Refreshing = true;
		}

		private void BackgroundAudioServiceConnection_ServiceConnected(object sender, bool e)
		{
			if (e) { SetDataSource(); }
		}

		private void MusicProvider_FreshRefreshed(object sender, Fresh e)
		{
			SetDataSource();
			refreshLayout.Refreshing = false;
		}

		private void SetDataSource()
		{
			switch (Position)
			{
				case 0:
					adapter.Songs = MusicProvider.Fresh.Tracks;
					break;
				case 1:
					adapter.Albums = MusicProvider.Fresh.Albums;
					break;
				case 2:
					adapter.Artists = MusicProvider.Fresh.Artists;
					break;
			}
			Adapters.UpdateAdapters();
		}

		public static FreshCardFragment newInstance(int position, EventHandler<MaterialRippleAdapter.TrackViewHolderEvent> trackClick, EventHandler<MaterialRippleAdapter.AlbumViewHolderEvent> albumClick, EventHandler<MaterialRippleAdapter.ArtistViewHolderEvent> artistClick)
		{
			FreshCardFragment f = new FreshCardFragment(trackClick, albumClick, artistClick);
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
					rootView = inflater.Inflate(Resource.Layout.artists_list_layout, container, false);
					break;
			}


			if (rootView == null) return base.OnCreateView(inflater, container, savedInstanceState);


			refreshLayout = rootView.FindViewById<SwipeRefreshLayout>(Resource.Id.swipe_container);
			refreshLayout.Refresh += RefreshLayout_Refresh;

			switch (Position)
			{
				case 0:
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
				case 2:
					recyclerView = rootView.FindViewById<RecyclerView>(Resource.Id.artist_list);
					adapter = new MaterialRippleAdapter();
					adapter.ArtistClick += (sender, e) => { artistClick?.Invoke(sender, e); };
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
			MusicProvider.RefreshFresh();
		}
	}

	public class FreshAdapter : FragmentStatePagerAdapter
	{
		public event EventHandler<MaterialRippleAdapter.TrackViewHolderEvent> TrackClick;
		public event EventHandler<MaterialRippleAdapter.AlbumViewHolderEvent> AlbumClick;
		public event EventHandler<MaterialRippleAdapter.ArtistViewHolderEvent> ArtistClick;

		public FreshAdapter(FragmentManager fm) : base(fm)
		{
		}

		public override int GetItemPosition(Object @object)
		{
			if (@object is FreshCardFragment fragment) { return fragment.Position; }

			return base.GetItemPosition(@object);
		}

		private ICharSequence[] TITLES = CharSequence.ArrayFromStringArray(new[] { "Tracks", "Albums", "Artists" });

		public override ICharSequence GetPageTitleFormatted(int position)
		{
			return TITLES[position];
		}

		public override Fragment GetItem(int position)
		{
			return FreshCardFragment.newInstance(position, TrackClick, AlbumClick, ArtistClick);
		}

		public override int Count => TITLES.Length;
	}
}
