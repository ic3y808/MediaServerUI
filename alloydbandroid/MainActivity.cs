using System;
using System.Diagnostics;
using System.Net.Http;
using System.Threading.Tasks;
using Android.App;
using Android.Content;
using Android.Content.PM;
using Android.Graphics;
using Android.Graphics.Drawables;
using Android.OS;
using Android.Support.V4.Media.Session;
using Android.Support.V4.View;
using Android.Support.V4.Widget;
using Android.Support.V7.App;
using Android.Views;
using Android.Views.Animations;
using Android.Widget;
using Java.Util;
using Alloy.Fragments;
using Alloy.Helpers;
using Alloy.Providers;
using Alloy.Services;
using Microsoft.AppCenter;
using Microsoft.AppCenter.Analytics;
using Microsoft.AppCenter.Crashes;
using Alloy.Adapters;
using Alloy.Interfaces;
using Alloy.Models;

using Alloy.Widgets;
using Android.Runtime;
using Java.IO;
using Debug = System.Diagnostics.Debug;
using Exception = System.Exception;

namespace Alloy
{
	[Activity(Label = "@string/app_name", Theme = "@style/AppTheme.NoActionBar", LaunchMode = LaunchMode.SingleInstance, NoHistory = false, ConfigurationChanges = ConfigChanges.Orientation | ConfigChanges.KeyboardHidden | ConfigChanges.ScreenSize)]
	[IntentFilter(new[] { Intent.ActionView, }, Categories = new[] { Intent.CategoryDefault }, DataScheme = "file", DataMimeTypes = new[] { "audio/*", "application/ogg", "application/x-ogg", "application/x-vorbis", "application/x-flac" })]
	[IntentFilter(new[] { Intent.ActionView, }, Categories = new[] { Intent.CategoryDefault, Intent.CategoryBrowsable }, DataScheme = "content", DataMimeTypes = new[] { "audio/*", "application/ogg", "application/x-ogg", "application/x-vorbis", "application/x-flac" })]
	[IntentFilter(new[] { Intent.ActionView, }, Categories = new[] { Intent.CategoryDefault, Intent.CategoryBrowsable }, DataScheme = "http", DataMimeTypes = new[] { "audio/*", "audio/mp3", "audio/x-mp3", "audio/mpeg", "audio/mp4", "audio/mp4a-latm", "audio/x-wav", "audio/ogg", "audio/webm", "application/ogg", "application/x-ogg" })]
	[IntentFilter(new[] { Intent.ActionView, }, Categories = new[] { Intent.CategoryDefault, Intent.CategoryBrowsable }, DataScheme = "sshttp", DataMimeTypes = new[] { "audio/*", "audio/mp3", "audio/x-mp3", "audio/mpeg", "audio/mp4", "audio/mp4a-latm" })]
	[IntentFilter(new[] { Intent.ActionManageNetworkUsage, }, Categories = new[] { Intent.CategoryDefault })]
	public class MainActivity : AppCompatActivity //, IMenuListener, PanelSlideListener
	{
		private BackgroundAudioServiceConnection serviceConnection;
		private ImageView primaryBackground;
		private ImageView secondaryBackground;
		private CurrentBackground currentBackground;
		private MenuAdapter mainMenuaAdapter;
		private TextView titleTextView;
		private TextView subtitleTextView;
		private ImageView albumArtImageView;
		private ImageButton playPauseImageButton;
		private ImageButton starImageButton;
		private Drawable starred, notStarred, play, pause;
		private MainPlaylistAdapter playlistAdapter;
		private bool loadingBackground = false;

		public class LogTraceListener : System.Diagnostics.TraceListener
		{
			public override void Write(string message)
			{
				Android.Util.Log.WriteLine(Android.Util.LogPriority.Debug, "alloy", message);
			}

			public override void WriteLine(string message)
			{
				Android.Util.Log.WriteLine(Android.Util.LogPriority.Debug, "alloy", message);
			}
		}

		protected override void OnCreate(Bundle savedInstanceState)
		{
			base.OnCreate(savedInstanceState);
			if (!Debugger.IsAttached)
			{
				AppCenter.Start(Application.Context.GetString(Resource.String.appcenter_api), typeof(Analytics), typeof(Crashes));
			}

			System.Diagnostics.Debug.Listeners.Add(new LogTraceListener());
			AppDomain.CurrentDomain.UnhandledException += (sender, args) =>
			{
				Android.Util.Log.WriteLine(Android.Util.LogPriority.Debug, "alloy", args.ExceptionObject.ToString());
			};

			TaskScheduler.UnobservedTaskException += (sender, args) =>
			{
				Android.Util.Log.WriteLine(Android.Util.LogPriority.Debug, "alloy", args.Exception.ToString());
			};

			AndroidEnvironment.UnhandledExceptionRaiser += (sender, args) =>
			{
				Android.Util.Log.WriteLine(Android.Util.LogPriority.Debug, "alloy", args.Exception.ToString());
			};

			SetContentView(Resource.Layout.activity_main);

			primaryBackground = FindViewById<ImageView>(Resource.Id.primary_background);
			secondaryBackground = FindViewById<ImageView>(Resource.Id.secondary_background);

			DrawerLayout drawerLayout = (DrawerLayout)FindViewById(Resource.Id.drawer_layout);
			RelativeLayout mainContent = (RelativeLayout)FindViewById(Resource.Id.main_content);

			ListView mainMenu = (ListView)FindViewById(Resource.Id.main_menu_list);

			titleTextView = FindViewById<TextView>(Resource.Id.title);
			titleTextView.Selected = true;

			subtitleTextView = FindViewById<TextView>(Resource.Id.artist);
			albumArtImageView = FindViewById<ImageView>(Resource.Id.album_art);

			if (albumArtImageView != null)
			{
				albumArtImageView.Clickable = true;
				albumArtImageView.Click += AlbumArtImageView_Click;
			}

			playPauseImageButton = (ImageButton)FindViewById(Resource.Id.play_pause_button);
			if (playPauseImageButton != null)
			{
				playPauseImageButton.Click += PlayPauseImageButton_Click;
				playPauseImageButton.Enabled = true;
				play = GetDrawable(Resource.Drawable.play);
				pause = GetDrawable(Resource.Drawable.pause);
			}

			ImageButton nextImageButton = (ImageButton)FindViewById(Resource.Id.next_button);
			if (nextImageButton != null)
			{
				nextImageButton.Click += NextImageButton_Click;
				nextImageButton.Enabled = true;
			}

			starImageButton = (ImageButton)FindViewById(Resource.Id.star_button);
			if (starImageButton != null)
			{
				starImageButton.Click += StarImageButton_Click;
				starImageButton.Enabled = true;
				starred = GetDrawable(Resource.Drawable.star_g);
				notStarred = GetDrawable(Resource.Drawable.star_o);
			}

			ArrayList items = new ArrayList();
			items.Add(new Category(Resource.String.quick_access_header));
			items.Add(new Item(Resource.String.fresh_fragment_id, Resource.String.fresh_fragment_title, Resource.Drawable.fresh));
			items.Add(new Item(Resource.String.starred_fragment_id, Resource.String.starred_fragment_title, Resource.Drawable.starred));
			items.Add(new Item(Resource.String.charts_fragment_id, Resource.String.charts_title, Resource.Drawable.charts));
			items.Add(new Category(Resource.String.music_header));
			items.Add(new Item(Resource.String.artists_fragment_id, Resource.String.artists_fragment_title, Resource.Drawable.artists));
			items.Add(new Item(Resource.String.albums_fragment_id, Resource.String.albums_fragment_title, Resource.Drawable.albums));
			items.Add(new Item(Resource.String.genres_fragment_id, Resource.String.genres_fragment_title, Resource.Drawable.genres));
			items.Add(new Item(Resource.String.history_fragment_id, Resource.String.history_title, Resource.Drawable.history));

			mainMenuaAdapter = new MenuAdapter(items);
			mainMenu.Adapter = mainMenuaAdapter;
			mainMenu.SetSelection(1);
			mainMenu.ItemClick += MainMenu_ItemClick;

			CustomToggle drawerToggle = new CustomToggle(this, drawerLayout, Resource.String.app_name, Resource.String.app_name) { Layout = mainContent };
			drawerLayout.AddDrawerListener(drawerToggle);
			currentBackground = CurrentBackground.None;

			FragmentManager.BackStackChanged += FragmentManager_BackStackChanged;
			ChangeFragment(Resource.String.starred_fragment_id);
		}

		protected override void OnResume()
		{
			base.OnResume();
			View settingsFooter = FindViewById(Resource.Id.settings_footer);
			settingsFooter.Click += SettingsFooter_Click;
			BindService();
		}

		protected override void OnPostResume()
		{
			base.OnPostResume();
		}

		protected override void OnDestroy()
		{
			base.OnDestroy();
			BackgroundAudioServiceConnection.PlaybackStatusChanged -= BackgroundAudioServiceConnection_PlaybackStatusChanged;
		}

		protected override void OnStop()
		{
			base.OnStop();
			if (serviceConnection != null && serviceConnection.IsConnected)
			{
				UnbindService(serviceConnection);
				serviceConnection = null;
			}
			BackgroundAudioServiceConnection.PlaybackStatusChanged -= BackgroundAudioServiceConnection_PlaybackStatusChanged;
		}

		public override void OnBackPressed()
		{
			DrawerLayout drawer = FindViewById<DrawerLayout>(Resource.Id.drawer_layout);
			if (drawer.IsDrawerOpen(GravityCompat.Start)) { drawer.CloseDrawer(GravityCompat.Start); }
			else
			{
				if (FragmentManager.BackStackEntryCount > 0)
				{
					FragmentManager.PopBackStack();
				}
				else
				{
					MoveTaskToBack(true);
					BackgroundAudioServiceConnection.PlaybackStatusChanged -= BackgroundAudioServiceConnection_PlaybackStatusChanged;
				}
			}
		}

		protected override void OnPause()
		{
			base.OnPause();
			BackgroundAudioServiceConnection.PlaybackStatusChanged -= BackgroundAudioServiceConnection_PlaybackStatusChanged;
		}

		public override bool OnKeyDown(Keycode keyCode, KeyEvent e)
		{
			if (Build.VERSION.SdkInt >= BuildVersionCodes.Lollipop)
			{
				return base.OnKeyDown(keyCode, e);
			}

			return keyCode == Keycode.MediaPlay || base.OnKeyDown(keyCode, e);
		}

		private void MainMenu_ItemClick(object sender, AdapterView.ItemClickEventArgs e)
		{
			if (mainMenuaAdapter.GetItem(e.Position) is Item && mainMenuaAdapter.GetItem(e.Position) is Item item) ChangeFragment(item.Id);

			DrawerLayout drawer = FindViewById<DrawerLayout>(Resource.Id.drawer_layout);
			drawer.CloseDrawer(GravityCompat.Start);
		}

		private void ChangeFragment(int itemText, bool backstack = true)
		{
			Fragment fragment = null;

			switch (itemText)
			{
				case Resource.String.fresh_fragment_id:
					fragment = new FreshFragment();
					break;
				case Resource.String.starred_fragment_id:
					fragment = new StarredFragment();
					break;
				case Resource.String.artists_fragment_id:
					fragment = new ArtistsFragment();
					break;
				case Resource.String.albums_fragment_id:
					fragment = new AlbumsFragment();
					break;
				case Resource.String.genres_fragment_id:
					fragment = new GenresFragment();
					break;
				case Resource.String.history_fragment_id:
					fragment = new HistoryFragment();
					break;
				case Resource.String.charts_fragment_id:
					fragment = new ChartsFragment();
					break;

			}

			if (fragment != null)
			{
				FragmentManager.ChangeTo(fragment, backstack, Application.Context.GetString(itemText), null);
			}
		}

		private void BindService()
		{
			if (serviceConnection == null)
			{
				serviceConnection = new BackgroundAudioServiceConnection();
				serviceConnection.ServiceConnected += ServiceConnection_ServiceConnected;

				Intent serviceToStart = new Intent(Application.Context, typeof(BackgroundAudioService));
				BindService(serviceToStart, serviceConnection, Bind.AutoCreate);

			}

			if (serviceConnection != null && serviceConnection.IsConnected)
			{
				ServiceConnection_ServiceConnected(null, true);
			}
		}

		private void SetBackground()
		{
			try
			{
				Utils.Run(async () =>
				{
					Animation fadeOut = AnimationUtils.LoadAnimation(Application.Context, Android.Resource.Animation.FadeOut);
					fadeOut.Duration = 3000;
					Animation fadeIn = AnimationUtils.LoadAnimation(Application.Context, Android.Resource.Animation.FadeIn);
					fadeIn.Duration = 3000;
					if (serviceConnection?.CurrentSong == null) return;
					Bitmap bitmap = await serviceConnection.CurrentSong.GetAlbumArt();
					Bitmap newArt = bitmap.Blur(25);

					fadeOut.AnimationEnd += (o, e) =>
					{
						switch (currentBackground)
						{
							case CurrentBackground.None:
								currentBackground = CurrentBackground.Primary;
								break;
							case CurrentBackground.Primary:
								if (primaryBackground.Background != null)
								{
									BitmapDrawable a = primaryBackground.Background as BitmapDrawable;
									a?.Bitmap?.Recycle();
									a?.Bitmap?.Dispose();
									primaryBackground.Background.Dispose();
									primaryBackground.Background = null;
								}
								currentBackground = CurrentBackground.Secondary;
								break;
							case CurrentBackground.Secondary:
								if (secondaryBackground.Background != null)
								{
									BitmapDrawable a = secondaryBackground.Background as BitmapDrawable;
									a?.Bitmap?.Recycle();
									a?.Bitmap?.Dispose();
									secondaryBackground.Background.Dispose();
									secondaryBackground.Background = null;
								}
								currentBackground = CurrentBackground.Primary;
								break;
						}
					};

					RunOnUiThread(() =>
					{
						switch (currentBackground)
						{
							case CurrentBackground.None:
							case CurrentBackground.Secondary:
								primaryBackground.Background = new BitmapDrawable(Application.Context.Resources, newArt);
								primaryBackground.StartAnimation(fadeIn);
								secondaryBackground.StartAnimation(fadeOut);
								break;
							case CurrentBackground.Primary:
								secondaryBackground.Background = new BitmapDrawable(Application.Context.Resources, newArt);
								primaryBackground.StartAnimation(fadeOut);
								secondaryBackground.StartAnimation(fadeIn);
								break;

						}
					});
				});
			}
			catch (Exception ee) { Crashes.TrackError(ee); }
		}

		private void BackgroundAudioServiceConnection_PlaybackStatusChanged(object sender, StatusEventArg e)
		{
			if (serviceConnection == null || !serviceConnection.IsConnected || serviceConnection.CurrentSong == null) return;
			UpdateMeta(true, true, true, true);
		}

		private void ServiceConnection_ServiceConnected(object sender, bool e)
		{
			if (e)
			{
				BackgroundAudioServiceConnection.PlaybackStatusChanged += BackgroundAudioServiceConnection_PlaybackStatusChanged;
				MediaControllerCompat.SetMediaController(this, serviceConnection.MediaSession.Controller);
			}
			if (serviceConnection == null || !serviceConnection.IsConnected || serviceConnection.CurrentSong == null) return;
			UpdateMeta(true, true, true, true);
		}

		private void AlbumArtImageView_Click(object sender, EventArgs e)
		{
			Intent intent = new Intent(Application.Context, typeof(NowPlayingActivity));
			intent.AddFlags(ActivityFlags.ClearTop);
			StartActivity(intent);
		}

		private void PlayPauseImageButton_Click(object sender, EventArgs e)
		{
			if (serviceConnection != null && serviceConnection.IsConnected)
				if (serviceConnection.IsPlaying) { serviceConnection.Pause(); }
				else { serviceConnection.Play(); }

			UpdateMeta(true, true, false, false);
		}

		private void StarImageButton_Click(object sender, EventArgs e)
		{
			Utils.Run(() =>
			{
				if (serviceConnection != null && serviceConnection.IsConnected && serviceConnection.CurrentSong != null)
				{
					if (serviceConnection.CurrentSong.Starred) { MusicProvider.RemoveStar(serviceConnection.CurrentSong); }
					else { MusicProvider.AddStar(serviceConnection.CurrentSong); }

					CheckFavorite();
				}
			});
		}

		private void CheckFavorite()
		{
			if (serviceConnection != null && serviceConnection.IsConnected && serviceConnection.CurrentSong != null) { starImageButton?.SetImageDrawable(serviceConnection.CurrentSong.Starred ? starred : notStarred); }
		}

		private void NextImageButton_Click(object sender, EventArgs e)
		{
			if (serviceConnection != null && serviceConnection.IsConnected && serviceConnection.CurrentSong != null) serviceConnection.PlayNextSong();
		}

		private void FragmentManager_BackStackChanged(object sender, EventArgs e)
		{
			// TODO fix backstack and menu highlight
			//activeMenuItem?.SetChecked(false);
			//if (FragmentManager.BackStackEntryCount == 0)
			//{
			//activeMenuItem = navigationView.Menu.GetItem(0);
			//activeMenuItem?.SetChecked(true);
			//}
			//else
			//{
			//var name = FragmentManager.GetBackStackEntryAt(FragmentManager.BackStackEntryCount - 1).Name;
			//for (var i = 0; i < navigationView.Menu.Size(); i++)
			//{
			//	var item = navigationView.Menu.GetItem(i);
			//	if (!item.ToString().Equals(name)) continue;
			//	activeMenuItem = item;
			//	activeMenuItem?.SetChecked(true);
			//	break;
			//}
			//}
		}

		private void SettingsFooter_Click(object sender, EventArgs e)
		{
			//activeMenuItem?.SetChecked(false);
			//activeMenuItem = null;
			SettingsFragment fragment = new SettingsFragment();
			FragmentManager.ChangeTo(fragment, true, "Settings", null);
			DrawerLayout drawer = FindViewById<DrawerLayout>(Resource.Id.drawer_layout);
			drawer.CloseDrawer(GravityCompat.Start);
		}

		public void SetPlaying()
		{
			if (serviceConnection == null || !serviceConnection.IsConnected) return;
			playPauseImageButton?.SetImageDrawable(serviceConnection.IsPlaying ? pause : play);
		}

		public void SetMetaData()
		{
			if (serviceConnection?.CurrentSong != null)
			{
				serviceConnection.CurrentSong.GetAlbumArt(albumArtImageView);
				titleTextView?.SetText(serviceConnection.CurrentSong.Title, TextView.BufferType.Normal);
				subtitleTextView?.SetText(serviceConnection.CurrentSong.Artist, TextView.BufferType.Normal);
			}
		}

		public void UpdateMeta(bool setPlaying, bool setMetaData, bool checkFavorite, bool setBackground)
		{
			try
			{
				if (setPlaying) { SetPlaying(); }

				if (setMetaData) { SetMetaData(); }

				if (checkFavorite) { CheckFavorite(); }

				if (setBackground) { SetBackground(); }
				
			}
			catch (Exception e)
			{
				Crashes.TrackError(e);
			}
		}
	}
}