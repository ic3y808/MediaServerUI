using System;
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
	public class AlbumDetailFragment : FragmentBase
	{
		private View root_view;
		private Context context;

		private AlbumDetailTrackAdapter albumTracksAdapter;
		private RecyclerView albumtracksRecycleView;

		private AlbumContainer album;

		private TextView albumName;
		private TextView albumSize;
		private TextView trackCount;
		private TextView playCount;
		private ImageView albumImage;
		private ImageView backgroundImage;
		private ImageView favoriteButton;
		private Drawable favorite, notFavorite;

		public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
		{
			MusicProvider.AlbumStartRefresh += MusicProvider_AlbumStartRefresh;
			MusicProvider.AlbumRefreshed += MusicProvider_AlbumRefreshed;
			root_view = inflater.Inflate(Resource.Layout.album_detail_layout, container, false);

			Album bundle = null;

			try
			{
				bundle = (Album)Arguments.GetParcelable("album");
			}
			catch (Exception e)
			{
				try
				{
					Song bundle2 = (Song)Arguments.GetParcelable("track");
					if (bundle2 != null)
					{ bundle = new Album { Id = bundle2.AlbumId }; }
				}
				catch (Exception e2)
				{

				}
			}
			
			albumName = root_view.FindViewById<TextView>(Resource.Id.album_name);

			albumSize = root_view.FindViewById<TextView>(Resource.Id.album_size);
			trackCount = root_view.FindViewById<TextView>(Resource.Id.album_track_count);
			playCount = root_view.FindViewById<TextView>(Resource.Id.album_play_count);
			albumImage = root_view.FindViewById<ImageView>(Resource.Id.album_image);
			backgroundImage = root_view.FindViewById<ImageView>(Resource.Id.album_header_image);
			favoriteButton = root_view.FindViewById<ImageView>(Resource.Id.album_favorite_button);
			favoriteButton.Click += FavoriteButton_Click;
			favorite = Context.GetDrawable(Resource.Drawable.star_g);
			notFavorite = Context.GetDrawable(Resource.Drawable.star_o);

			LinearLayoutManager layoutManager = new LinearLayoutManager(Context, LinearLayoutManager.Vertical, false);
			albumtracksRecycleView = root_view.FindViewById<RecyclerView>(Resource.Id.album_tracks_list);
			albumtracksRecycleView.SetLayoutManager(layoutManager);
			RegisterForContextMenu(albumtracksRecycleView);

			CreateToolbar(root_view, Resource.String.artist_detail_title, true);

			if (bundle == null) return root_view;

			albumName.SetText(bundle.Name, TextView.BufferType.Normal);
			albumSize.SetText("Loading...", TextView.BufferType.Normal);
			CheckFavorite(bundle);
			MusicProvider.GetAlbum(bundle);

			return root_view;
		}

		private void FavoriteButton_Click(object sender, System.EventArgs e)
		{
			if (album.Album.Starred)
			{
				MusicProvider.RemoveStar(album.Album);
			}
			else
			{
				MusicProvider.AddStar(album.Album);
			}
			CheckFavorite();
		}

		private void CheckFavorite(Album a = null)
		{
			if (a != null)
			{
				favoriteButton.SetImageDrawable(a.Starred ? favorite : notFavorite);
			}
			else
			{
				favoriteButton.SetImageDrawable(album.Album.Starred ? favorite : notFavorite);
			}
		}

		private void MusicProvider_AlbumRefreshed(object sender, AlbumContainer e)
		{
			if (e != null)
			{
				album = e;

				albumName.SetText(album.Album.Name, TextView.BufferType.Normal);
				albumSize.SetText(album.Size, TextView.BufferType.Normal);
				trackCount.SetText(album.Tracks.Count.ToString(), TextView.BufferType.Normal);
				playCount.SetText(album.TotalPlays.ToString(), TextView.BufferType.Normal);

				Bitmap art = album.Album.GetAlbumArt();
				Bitmap art2 = art.Blur(50);

				albumImage.SetImageBitmap(art);
				backgroundImage.SetImageBitmap(art2);
				CheckFavorite();


				if (album.Tracks.Count > 0)
				{
					albumTracksAdapter = new AlbumDetailTrackAdapter(album.Tracks, ServiceConnection);
					albumTracksAdapter.ItemClick += Song_ItemClick;
					albumtracksRecycleView.SetAdapter(albumTracksAdapter);
					Adapters.Adapters.SetAdapters(Activity, albumTracksAdapter);
				}
			}
		}

		private void MusicProvider_AlbumStartRefresh(object sender, System.EventArgs e)
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
			albumtracksRecycleView.Invalidate();
		}

		public override void PlaybackStatusChanged(StatusEventArg args)
		{
			base.PlaybackStatusChanged(args);
			Adapters.Adapters.UpdateAdapters();
			albumtracksRecycleView.Invalidate();
		}

		public override void ServiceConnected()
		{
			base.ServiceConnected();
			Adapters.Adapters.SetAdapters(Activity, albumTracksAdapter);
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

		private void Song_ItemClick(object sender, AlbumDetailTrackAdapter.ViewHolder.ViewHolderEvent e)
		{
			ServiceConnection?.Play(e.Position, e.Songs);
		}
	}
}