using System;
using System.Collections.Generic;
using Alloy.Adapters;
using Android.App;
using Android.Content;
using Android.Gms.Cast.Framework;
using Android.Hardware;
using Android.Support.V4.View;
using Android.Support.V4.Widget;
using Android.Support.V7.App;
using Android.Views;
using Android.Widget;
using Alloy.Compat;
using Alloy.Helpers;
using Alloy.Models;
using Alloy.Providers;
using Alloy.Services;
using Android.Database;
using Android.Graphics;
using Android.OS;
using Android.Provider;
using Android.Views.InputMethods;
using Bumptech.Glide;
using Bumptech.Glide.Load.Engine;
using Java.Interop;
using SimpleCursorAdapter = Android.Support.V4.Widget.SimpleCursorAdapter;
using Toolbar = Android.Support.V7.Widget.Toolbar;
using Newtonsoft.Json;

namespace Alloy.Fragments
{
	public abstract class FragmentBase : Fragment, Android.Hardware.ISensorEventListener, SwipeRefreshLayout.IOnRefreshListener
	{
		public BackgroundAudioServiceConnection ServiceConnection;
		public static IMenuItem MediaRouteButton;
		private Android.Support.V7.Widget.SearchView searchView;
		public bool HasBack { get; set; }

		public override void OnResume()
		{
			base.OnResume();
			BindService();
		}

		public override void OnPause()
		{
			base.OnPause();
			Removehanders();
			Extensions.ResetShake();
		}

		public override void OnDestroy()
		{
			base.OnDestroy();
			Removehanders();
			Extensions.ResetShake();
		}

		public override void OnDestroyView()
		{
			base.OnDestroyView();
			Removehanders();
			Extensions.ResetShake();
		}

		public override void OnStop()
		{
			base.OnStop();
			Removehanders();
			Extensions.ResetShake();
		}

		private void Removehanders()
		{
			BackgroundAudioServiceConnection.PlaybackStatusChanged -= BackgroundAudioServiceConnection_PlaybackStatusChanged;
			MusicProvider.SearchStart -= MusicProvider_SearchStart;
			MusicProvider.SearchResultsRecieved -= MusicProvider_SearchResultsRecieved;
		}

		private void AddHandlers()
		{
			BackgroundAudioServiceConnection.PlaybackStatusChanged += BackgroundAudioServiceConnection_PlaybackStatusChanged;
			MusicProvider.SearchStart += MusicProvider_SearchStart;
			MusicProvider.SearchResultsRecieved += MusicProvider_SearchResultsRecieved;
		}

		public override bool OnContextItemSelected(IMenuItem item)
		{
			AdapterView.AdapterContextMenuInfo info = (AdapterView.AdapterContextMenuInfo)item.MenuInfo;
			ContextMenuItemSelected(item, info);
			return base.OnContextItemSelected(item);
		}

		public override void OnCreateContextMenu(IContextMenu menu, View v, IContextMenuContextMenuInfo menuInfo)
		{
			base.OnCreateContextMenu(menu, v, menuInfo);
			ContextMenuCreated(menu, v, menuInfo);

		}

		public void Cleanup()
		{
			Removehanders();
		}

		public void CreateToolbar(View root_view, int title, bool hasBack = false)
		{
			HasBack = hasBack;
			SetHasOptionsMenu(true);
			((AppCompatActivity)Activity).SetSupportActionBar(root_view.FindViewById<Toolbar>(Resource.Id.main_toolbar));
			((AppCompatActivity)Activity).SupportActionBar.SetHomeButtonEnabled(true);
			((AppCompatActivity)Activity).SupportActionBar.SetTitle(title);
			var mSlideDrawable = new SlideDrawable(Application.Context.GetDrawable(Resource.Drawable.ic_drawer));
			mSlideDrawable.setIsRtl(false);
			var mActionBarHelper = new ActionBarHelper((AppCompatActivity)Activity);
			var mThemeUpIndicator = mActionBarHelper.getThemeUpIndicator();
			if (HasBack)
				mActionBarHelper.setDisplayShowHomeAsUpEnabled(true);
			else
			{
				mActionBarHelper.setActionBarUpIndicator(mSlideDrawable, title);
				mActionBarHelper.setDisplayShowHomeAsUpEnabled(true);
			}
		}

		private void BindService()
		{
			Extensions.ResetShake();
			Extensions.StartShake(Activity, this);

			if (ServiceConnection == null)
			{
				ServiceConnection = new BackgroundAudioServiceConnection();
				ServiceConnection.ServiceConnected += ServiceConnection_ServiceConnected;
				Intent serviceToStart = new Intent(Application.Context, typeof(BackgroundAudioService));
				Activity.BindService(serviceToStart, ServiceConnection, Bind.AutoCreate);

			}

			if (ServiceConnection != null && ServiceConnection.IsConnected)
			{
				ServiceConnection_ServiceConnected(null, true);
			}
		}

		private void MusicProvider_SearchStart(object sender, System.EventArgs e)
		{

		}

		public void getCursorFromList(List<Tuple<string, string, string, string, string>> items, ref MatrixCursor cursor)
		{
			foreach (var item in items)
			{
				cursor.NewRow()

					.Add(BaseColumns.Id, item.Item1)
					.Add("type", item.Item2)
					.Add(SearchManager.SuggestColumnText1, item.Item3)
					.Add(SearchManager.SuggestColumnDuration, item.Item4)
					.Add(SearchManager.SuggestColumnIntentData, JsonConvert.SerializeObject(item.Item5));
			}
		}


		private void MusicProvider_SearchResultsRecieved(object sender, SearchResult e)
		{
			if (e == null) return;
			int id = 0;
			string[] columns = { BaseColumns.Id,
				"type",
				SearchManager.SuggestColumnText1,
				SearchManager.SuggestColumnDuration,
				SearchManager.SuggestColumnIntentData,
			};

			MatrixCursor matrix = new MatrixCursor(columns);

			List<Tuple<string, string, string, string, string>> items = new List<Tuple<string, string, string, string, string>>();

			items.Add(new Tuple<string, string, string, string, string>(id++.ToString(), "seperator", "Albums", null, null));
			for (int i = 0; i < e.Artists.Count; i++)
			{
				items.Add(new Tuple<string, string, string, string, string>(id++.ToString(), "artist", e.Artists[i].Name, null, JsonConvert.SerializeObject(e.Artists[i])));
			}

			//for (int i = 0; i < e.Albums.Count; i++)
			//{
			//	items.Add(new Tuple<string, string, string, string, string>(id++.ToString(), "album", e.Albums[i].Name, null, JsonConvert.SerializeObject(e.Albums[i])));
			//}

			//for (int i = 0; i < e.Genres.Count; i++)
			//{
			//	items.Add(new Tuple<string, string, string, string, string>( id++.ToString(), "genre", e.Genres[i].Name, null, JsonConvert.SerializeObject(e.Genres[i])));
			//}

			//for (int i = 0; i < e.Tracks.Count; i++)
			//{
			//	items.Add(new Tuple<string, string, string, string, string>( id++.ToString(), "track", e.Tracks[i].Title, null, JsonConvert.SerializeObject(e.Tracks[i])));
			//}

			getCursorFromList(items, ref matrix);


			//cursor.NewRow().Add()

			//cursor.AddRow(new Java.Lang.Object[] { "seperator", id++, "Albums", null, null });
			//for (int i = 0; i < e.Albums.Count; i++)
			//{
			//	Java.Lang.Object[] tmp = { "album", id++, e.Albums[i].Name, null, JsonConvert.SerializeObject(e.Albums[i]) };
			//	cursor.AddRow(tmp);
			//}
			//cursor.AddRow(new Java.Lang.Object[] { "seperator", id++, "Genres", null, null });
			//for (int i = 0; i < e.Genres.Count; i++)
			//{
			//	Java.Lang.Object[] tmp = { "genre", id++, e.Genres[i].Name, null, JsonConvert.SerializeObject(e.Genres[i]) };
			//	cursor.AddRow(tmp);
			//}
			//cursor.AddRow(new Java.Lang.Object[] { "seperator", id++, "Tracks", null, null });
			//for (int i = 0; i < e.Tracks.Count; i++)
			//{
			//	Java.Lang.Object[] tmp = { "track", id++, e.Tracks[i].Title, e.Tracks[i].Duration, JsonConvert.SerializeObject(e.Tracks[i]) };
			//	cursor.AddRow(tmp);
			//}
			SearchAdapter suggestionAdapter = new SearchAdapter(Context, matrix);

			searchView.SuggestionsAdapter = suggestionAdapter;
			//searchView.SuggestionsAdapter.ChangeCursor(matrix);
			//searchView.SuggestionsAdapter.SwapCursor(cursor);

		}

		public override bool OnOptionsItemSelected(IMenuItem item)
		{
			var id = item.ItemId;

			switch (id)
			{
				case Android.Resource.Id.Home:
					{
						if (HasBack)
						{
							if (FragmentManager.BackStackEntryCount > 0)
							{
								Cleanup();
								FragmentManager.PopBackStack();
							}
						}
						else
						{
							DrawerLayout drawer = Activity.FindViewById<DrawerLayout>(Resource.Id.drawer_layout);
							drawer.OpenDrawer(GravityCompat.Start);
						}
					}
					break;

			}
			return base.OnOptionsItemSelected(item);
		}

		public override void OnCreateOptionsMenu(IMenu menu, MenuInflater inflater)
		{

			base.OnCreateOptionsMenu(menu, inflater);
			inflater.Inflate(Resource.Menu.general_toolbar, menu);
			MediaRouteButton = CastButtonFactory.SetUpMediaRouteButton(Application.Context, menu, Resource.Id.media_route_menu_item);
			IMenuItem search = menu.FindItem(Resource.Id.action_search);
			searchView = (Android.Support.V7.Widget.SearchView)search.ActionView;
			searchView.QueryTextChange += SearchView_QueryTextChange;
			searchView.QueryTextSubmit += SearchView_QueryTextSubmit;

	
			searchView.SuggestionClick += SearchView_SuggestionClick;
			searchView.SuggestionSelect += SearchView_SuggestionSelect;
			//SearchManager searchManager = Context.GetSystemService(Context.SearchService).JavaCast<SearchManager>();
			//searchView.SetSearchableInfo(searchManager.GetSearchableInfo(ComponentName()));

		}

		private void SearchView_SuggestionSelect(object sender, Android.Support.V7.Widget.SearchView.SuggestionSelectEventArgs e)
		{
			var res = e;
		}

		private void SearchView_SuggestionClick(object sender, Android.Support.V7.Widget.SearchView.SuggestionClickEventArgs e)
		{
			ICursor item = searchView.SuggestionsAdapter.GetItem(e.Position).JavaCast<ICursor>();
			string type = item.GetString(0);
			string data = item.GetString(4);
			Bundle b = new Bundle();
			if (!string.IsNullOrEmpty(data))
			{
				switch (type)
				{
					case "artist":
						Artist artist = JsonConvert.DeserializeObject<Artist>(data);
						searchView.SetQuery(artist.Name, true);
						b.PutParcelable("artist", artist);
						FragmentManager.ChangeTo(new ArtistDetailFragment(), true, "Artist Details", b);
						break;
					case "album":
						Album album = JsonConvert.DeserializeObject<Album>(data);
						searchView.SetQuery(album.Name, true);
						b.PutParcelable("album", album);
						FragmentManager.ChangeTo(new AlbumDetailFragment(), true, "Album Details", b);
						break;
					case "genre":
						Genre genre = JsonConvert.DeserializeObject<Genre>(data);
						searchView.SetQuery(genre.Name, true);
						b.PutParcelable("genre", genre);
						FragmentManager.ChangeTo(new GenreDetailFragment(), true, "Genre Details", b);
						break;
					case "track":
						Song track = JsonConvert.DeserializeObject<Song>(data);
						searchView.SetQuery(track.Title, true);
						b.PutParcelable("album", track);
						FragmentManager.ChangeTo(new AlbumDetailFragment(), true, "Album Details", b);
						break;
				}
			}
			InputMethodManager imm = (InputMethodManager)Context.GetSystemService(Context.InputMethodService);
			View currentFocus = Activity.CurrentFocus;
			if (currentFocus != null)
			{
				imm.HideSoftInputFromWindow(currentFocus.WindowToken, HideSoftInputFlags.None);
			}
			e.Handled = true;
		}

		private void SearchView_QueryTextSubmit(object sender, Android.Support.V7.Widget.SearchView.QueryTextSubmitEventArgs e)
		{
			var q = e.Query;
		}

		private void SearchView_QueryTextChange(object sender, Android.Support.V7.Widget.SearchView.QueryTextChangeEventArgs e)
		{
			if (string.IsNullOrEmpty(e.NewText)) return;
			e.Handled = true;
			MusicProvider.Search(e.NewText);
		}

		private void BackgroundAudioServiceConnection_PlaybackStatusChanged(object sender, StatusEventArg e)
		{
			PlaybackStatusChanged(e);
			ScrollToNowPlaying();
		}

		private void ServiceConnection_ServiceConnected(object sender, bool e)
		{
			if (e)
			{
				AddHandlers();
				ServiceConnected();
				if (ServiceConnection.CurrentSong == null) return;
				ScrollToNowPlaying();
			}
		}

		public void OnAccuracyChanged(Sensor sensor, SensorStatus accuracy)
		{
			
		}

		public void OnSensorChanged(SensorEvent e)
		{
			if (e.WasShaken()) Activity.RunOnUiThread(ScrollToNowPlaying);
		}

		public void OnRefresh()
		{
			OnRefreshed();
		}

		public virtual void ScrollToNowPlaying() { }
		public virtual void PlaybackStatusChanged(StatusEventArg args) { }
		public virtual void ServiceConnected() { }
		public virtual void OnRefreshed() { }
		public virtual void ContextMenuCreated(IContextMenu menu, View v, IContextMenuContextMenuInfo menuInfo) { }
		public virtual void ContextMenuItemSelected(IMenuItem item, AdapterView.AdapterContextMenuInfo info) { }

		public Bitmap GetArtwork(string url)
		{
			return (Bitmap) Glide.With(Application.Context)
				.AsBitmap()
				.Load(url)
				.Submit(-1, -1).Get();
		}
	}


}