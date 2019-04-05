using System.Collections.Generic;
using Android.OS;
using Android.Views;
using Android.Widget;
using Alloy.Adapters;
using Alloy.Helpers;
using Alloy.Models;
using Alloy.Providers;
using Alloy.Services;
using Android.Content;
using Android.Graphics;
using Android.Graphics.Drawables;
using Android.Support.V4.Widget;
using Android.Support.V7.Widget;

namespace Alloy.Fragments
{
	public class ArtistDetailFragment : FragmentBase
	{
		private View root_view;
		private Context context;
		private ArtistDetailAlbumAdapter albumsAdapter;
		private ArtistDetailAlbumAdapter epsAdapter;
		private ArtistDetailAlbumAdapter singlesAdapter;
		private ArtistDetailTrackAdapter topTracksAdapter;
		private RecyclerView albumRecycleView;
		private RecyclerView epsRecycleView;
		private RecyclerView singlesRecycleView;
		private RecyclerView topTracksView;
		private ArtistContainer artist;

		private TextView artistName;
		private TextView artistSize;
		private TextView trackCount;
		private TextView playCount;
		private ImageView artistImage;
		private ImageView backgroundImage;
		private ImageView favoriteButton;
		private LinearLayout albumsListContainer;
		private LinearLayout epsListContainer;
		private LinearLayout singlesListContainer;
		private LinearLayout topTracksListContainer;
		private Drawable favorite, notFavorite;


		public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
		{
			MusicProvider.ArtistStartRefresh += MusicProvider_ArtistStartRefresh;
			MusicProvider.ArtistRefreshed += MusicProvider_ArtistRefreshed;
			root_view = inflater.Inflate(Resource.Layout.artist_details_layout, container, false);
			Artist bundle = (Artist)Arguments.GetParcelable("artist");

			artistName = root_view.FindViewById<TextView>(Resource.Id.artist_name);

			artistSize = root_view.FindViewById<TextView>(Resource.Id.artist_size);
			trackCount = root_view.FindViewById<TextView>(Resource.Id.artist_track_count);
			playCount = root_view.FindViewById<TextView>(Resource.Id.artist_play_count);
			artistImage = root_view.FindViewById<ImageView>(Resource.Id.artist_image);
			backgroundImage = root_view.FindViewById<ImageView>(Resource.Id.artist_header_image);
			favoriteButton = root_view.FindViewById<ImageView>(Resource.Id.artist_favorite_button);
			favoriteButton.Click += FavoriteButton_Click;
			favorite = Context.GetDrawable(Resource.Drawable.favorite);
			notFavorite = Context.GetDrawable(Resource.Drawable.not_favorite);
			albumsListContainer = root_view.FindViewById<LinearLayout>(Resource.Id.artist_albums_list_container);
			epsListContainer = root_view.FindViewById<LinearLayout>(Resource.Id.artist_eps_list_container);
			singlesListContainer = root_view.FindViewById<LinearLayout>(Resource.Id.artist_singles_list_container);
			topTracksListContainer = root_view.FindViewById<LinearLayout>(Resource.Id.artist_top_tracks_list_container);

			albumsListContainer.Visibility = ViewStates.Gone;
			epsListContainer.Visibility = ViewStates.Gone;
			singlesListContainer.Visibility = ViewStates.Gone;
			topTracksListContainer.Visibility = ViewStates.Gone;

			LinearLayoutManager layoutManager = new LinearLayoutManager(Context, LinearLayoutManager.Horizontal, false);
			albumRecycleView = root_view.FindViewById<RecyclerView>(Resource.Id.artist_albums_list);
			albumRecycleView.SetLayoutManager(layoutManager);
			RegisterForContextMenu(albumRecycleView);

			LinearLayoutManager layoutManager2 = new LinearLayoutManager(Context, LinearLayoutManager.Horizontal, false);
			singlesRecycleView = root_view.FindViewById<RecyclerView>(Resource.Id.artist_singles_list);
			singlesRecycleView.SetLayoutManager(layoutManager2);
			RegisterForContextMenu(singlesRecycleView);

			LinearLayoutManager layoutManager3 = new LinearLayoutManager(Context, LinearLayoutManager.Horizontal, false);
			epsRecycleView = root_view.FindViewById<RecyclerView>(Resource.Id.artist_eps_list);
			epsRecycleView.SetLayoutManager(layoutManager3);
			RegisterForContextMenu(epsRecycleView);

			LinearLayoutManager layoutManager4 = new LinearLayoutManager(Context, LinearLayoutManager.Vertical, false);
			topTracksView = root_view.FindViewById<RecyclerView>(Resource.Id.artist_top_tracks_list);
			topTracksView.SetLayoutManager(layoutManager4);
			RegisterForContextMenu(topTracksView);

			CreateToolbar(root_view, Resource.String.artist_detail_title, true);


			artistName.SetText(bundle.Name, TextView.BufferType.Normal);
			artistSize.SetText("Loading...", TextView.BufferType.Normal);


			CheckFavorite(bundle);
			MusicProvider.GetArtist(bundle);
			return root_view;
		}

		private void FavoriteButton_Click(object sender, System.EventArgs e)
		{
			if (artist.Artist.Starred)
			{
				MusicProvider.RemoveStar(artist.Artist);
			}
			else
			{
				MusicProvider.AddStar(artist.Artist);
			}
			CheckFavorite();
		}

		private void CheckFavorite(Artist a = null)
		{
			if (a != null)
			{
				favoriteButton.SetImageDrawable(a.Starred ? favorite : notFavorite);
			}
			else
			{
				favoriteButton.SetImageDrawable(artist.Artist.Starred ? favorite : notFavorite);
			}
		}

		private void MusicProvider_ArtistRefreshed(object sender, ArtistContainer e)
		{
			if (e != null)
			{
				artist = e;

				artistName.SetText(artist.Artist.Name, TextView.BufferType.Normal);
				artistSize.SetText(artist.Size, TextView.BufferType.Normal);
				trackCount.SetText(artist.Tracks.Count.ToString(), TextView.BufferType.Normal);
				playCount.SetText(artist.TotalPlays.ToString(), TextView.BufferType.Normal);

				Bitmap art = artist.Artist.GetAlbumArt();
				Bitmap art2 = art.Blur(50);

				artistImage.SetImageBitmap(art);
				backgroundImage.SetImageBitmap(art2);
				CheckFavorite();

				if (artist.Albums.Count > 0)
				{
					albumsListContainer.Visibility = ViewStates.Visible;
					albumsAdapter = new ArtistDetailAlbumAdapter(artist.Albums);
					albumRecycleView.SetAdapter(albumsAdapter);
					albumsAdapter.ItemClick += Album_ItemClick;
					Adapters.Adapters.SetAdapters(Activity, albumsAdapter);
				}
				if (artist.EPs.Count > 0)
				{
					epsListContainer.Visibility = ViewStates.Visible;
					epsAdapter = new ArtistDetailAlbumAdapter(artist.EPs);
					epsAdapter.ItemClick += Album_ItemClick;
					epsRecycleView.SetAdapter(epsAdapter);
					Adapters.Adapters.SetAdapters(Activity, epsAdapter);
				}
				if (artist.Singles.Count > 0)
				{
					singlesListContainer.Visibility = ViewStates.Visible;
					singlesAdapter = new ArtistDetailAlbumAdapter(artist.Singles);
					singlesAdapter.ItemClick += Album_ItemClick;
					singlesRecycleView.SetAdapter(singlesAdapter);
					Adapters.Adapters.SetAdapters(Activity, singlesAdapter);
				}

				if (artist.PopularTracks.Count > 0)
				{
					topTracksListContainer.Visibility = ViewStates.Visible;
					topTracksAdapter = new ArtistDetailTrackAdapter(artist.PopularTracks, ServiceConnection);
					topTracksAdapter.ItemClick += Song_ItemClick;
					topTracksView.SetAdapter(topTracksAdapter);
					Adapters.Adapters.SetAdapters(Activity, topTracksAdapter);
				}
			}
		}

		private void MusicProvider_ArtistStartRefresh(object sender, System.EventArgs e)
		{

		}

		public override void OnRefreshed()
		{
			MusicProvider.GetArtist((Artist)Arguments.GetParcelable("artist"));
		}

		public override void ScrollToNowPlaying()
		{
			base.ScrollToNowPlaying();


			Adapters.Adapters.UpdateAdapters();
			albumRecycleView.Invalidate();
			epsRecycleView.Invalidate();
			singlesRecycleView.Invalidate();
			topTracksView.Invalidate();
		}

		public override void PlaybackStatusChanged(StatusEventArg args)
		{
			base.PlaybackStatusChanged(args);
			Adapters.Adapters.UpdateAdapters();
			albumRecycleView.Invalidate();
			epsRecycleView.Invalidate();
			singlesRecycleView.Invalidate();
			topTracksView.Invalidate();
		}

		public override void ServiceConnected()
		{
			base.ServiceConnected();
			Adapters.Adapters.SetAdapters(Activity, albumsAdapter);
			Adapters.Adapters.SetAdapters(Activity, epsAdapter);
			Adapters.Adapters.SetAdapters(Activity, singlesAdapter);
			Adapters.Adapters.SetAdapters(Activity, topTracksAdapter);
			ScrollToNowPlaying();
		}

		public override void ContextMenuCreated(IContextMenu menu, View v, IContextMenuContextMenuInfo menuInfo)
		{
			base.ContextMenuCreated(menu, v, menuInfo);
			if (v.Id == Resource.Id.artist_albums_list)
			{
				MenuInflater inflater = Activity.MenuInflater;
				inflater.Inflate(Resource.Menu.multi_context_menu, menu);
			}
			if (v.Id == Resource.Id.artist_singles_list)
			{
				MenuInflater inflater = Activity.MenuInflater;
				inflater.Inflate(Resource.Menu.multi_context_menu, menu);
			}
			if (v.Id == Resource.Id.artist_eps_list)
			{
				MenuInflater inflater = Activity.MenuInflater;
				inflater.Inflate(Resource.Menu.multi_context_menu, menu);
			}
			if (v.Id == Resource.Id.artist_top_tracks_list)
			{
				MenuInflater inflater = Activity.MenuInflater;
				inflater.Inflate(Resource.Menu.multi_context_menu, menu);
			}
		}

		public override void ContextMenuItemSelected(IMenuItem item, AdapterView.AdapterContextMenuInfo info)
		{


		}

		private void Album_ItemClick(object sender, ArtistDetailAlbumAdapter.ViewHolder.ViewHolderEvent e)
		{
			Bundle b = new Bundle();
			b.PutParcelable("album", e.Album);
			FragmentManager.ChangeTo(new AlbumDetailFragment(), true, "Album Details", b);
		}

		private void Song_ItemClick(object sender, ArtistDetailTrackAdapter.ViewHolder.ViewHolderEvent e)
		{
			ServiceConnection?.Play(e.Position, e.Songs);
		}
	}
}