using System;
using Android.App;
using Android.Content;
using Android.Content.PM;
using Android.Gms.Cast.Framework;
using Android.Graphics;
using Android.Graphics.Drawables;
using Android.OS;
using Android.Support.Design.Widget;
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
using Spotlight;
using Alloy.Adapters;
using Alloy.Interfaces;
using Alloy.Models;
using Alloy.Widgets;
using SlideUpPanelLibrary;
using Exception = System.Exception;
using Object = Java.Lang.Object;

namespace Alloy
{
	[Activity(Label = "@string/app_name", Theme = "@style/AppTheme.NoActionBar", LaunchMode = LaunchMode.SingleInstance, NoHistory = false, ConfigurationChanges = ConfigChanges.Orientation | ConfigChanges.KeyboardHidden | ConfigChanges.ScreenSize)]
	[IntentFilter(new[] { Intent.ActionView, }, Categories = new[] { Intent.CategoryDefault }, DataScheme = "file", DataMimeTypes = new[] { "audio/*", "application/ogg", "application/x-ogg", "application/x-vorbis", "application/x-flac" })]
	[IntentFilter(new[] { Intent.ActionView, }, Categories = new[] { Intent.CategoryDefault, Intent.CategoryBrowsable }, DataScheme = "content", DataMimeTypes = new[] { "audio/*", "application/ogg", "application/x-ogg", "application/x-vorbis", "application/x-flac" })]
	[IntentFilter(new[] { Intent.ActionView, }, Categories = new[] { Intent.CategoryDefault, Intent.CategoryBrowsable }, DataScheme = "http", DataMimeTypes = new[] { "audio/*", "audio/mp3", "audio/x-mp3", "audio/mpeg", "audio/mp4", "audio/mp4a-latm", "audio/x-wav", "audio/ogg", "audio/webm", "application/ogg", "application/x-ogg" })]
	[IntentFilter(new[] { Intent.ActionView, }, Categories = new[] { Intent.CategoryDefault, Intent.CategoryBrowsable }, DataScheme = "sshttp", DataMimeTypes = new[] { "audio/*", "audio/mp3", "audio/x-mp3", "audio/mpeg", "audio/mp4", "audio/mp4a-latm" })]
	public class MainActivity : AppCompatActivity, ICastStateListener, IAppVisibilityListener, ISessionManagerListener, IMenuListener, PanelSlideListener, View.IOnClickListener
	{
		private BackgroundAudioServiceConnection serviceConnection;
		private ImageView primaryBackground;
		private ImageView secondaryBackground;
		private DrawerLayout drawerLayout;
		private CustomToggle drawerToggle;
		private SlidingUpPanelLayout mainLayout;
		private NavigationView navigationView;
		private CurrentBackground currentBackground;
		private CastContext castContext;
		private CastSession castSession;
		private ListView mainMenu;
		private MenuAdapter mainMenuaAdapter;
		private TextView titleTextView;
		private TextView subtitleTextView;
		private TextView extraInfoTextView;
		private ImageView albumArtImageView;
		private ImageButton playPauseImageButton;
		private ImageButton nextImageButton;
		private ImageButton previousImageButton;
		//private SimpleHTTPServer castServer;
		private MainPlaylistAdapter playlistAdapter;
		private CastStates lastState = CastStates.NoDevicesAvailable;

		protected override void OnCreate(Bundle savedInstanceState)
		{
			base.OnCreate(savedInstanceState);
			AppCenter.Start(Application.Context.GetString(Resource.String.appcenter_api), typeof(Analytics), typeof(Crashes));
			SetContentView(Resource.Layout.activity_main);

			primaryBackground = FindViewById<ImageView>(Resource.Id.primary_background);
			secondaryBackground = FindViewById<ImageView>(Resource.Id.secondary_background);

			drawerLayout = (DrawerLayout)FindViewById(Resource.Id.drawer_layout);

			mainLayout = (SlidingUpPanelLayout)FindViewById(Resource.Id.main_layout);
			mainLayout.setAnchorPoint(0.7f);
			mainLayout.addPanelSlideListener(this);
			mainLayout.setFadeOnClickListener(this);

			mainMenu = (ListView)FindViewById(Resource.Id.main_menu_list);


			titleTextView = FindViewById<TextView>(Resource.Id.title);
			titleTextView.Selected = true;

			subtitleTextView = FindViewById<TextView>(Resource.Id.artist);
			extraInfoTextView = FindViewById<TextView>(Resource.Id.extra_info);
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
			}

			nextImageButton = (ImageButton)FindViewById(Resource.Id.next_button);
			if (nextImageButton != null)
			{
				nextImageButton.Click += NextImageButton_Click;
				nextImageButton.Enabled = true;
			}

			previousImageButton = (ImageButton)FindViewById(Resource.Id.previous_button);
			if (previousImageButton != null)
			{
				previousImageButton.Click += PreviousImageButton_Click;
				previousImageButton.Enabled = true;
			}

			ArrayList items = new ArrayList();
			items.Add(new Category(Resource.String.quick_access_header));
			items.Add(new Item(Resource.String.fresh_fragment_id, Resource.String.fresh_fragment_title, Resource.Drawable.all_music));
			items.Add(new Item(Resource.String.starred_fragment_id, Resource.String.starred_fragment_title, Resource.Drawable.favorites));
			items.Add(new Category(Resource.String.local_music_header));
			items.Add(new Item(Resource.String.local_artists_fragment_id, Resource.String.local_artists_fragment_title, Resource.Drawable.artists));
			items.Add(new Item(Resource.String.local_albums_fragment_id, Resource.String.local_albums_fragment_title, Resource.Drawable.albums));
			items.Add(new Item(Resource.String.local_genres_fragment_id, Resource.String.local_genres_fragment_title, Resource.Drawable.genres));

		
			mainMenuaAdapter = new MenuAdapter(this, items);
			mainMenu.Adapter = mainMenuaAdapter;
			mainMenu.SetSelection(1);
			mainMenu.ItemClick += MainMenu_ItemClick;
			navigationView = FindViewById<NavigationView>(Resource.Id.nav_view);

			drawerToggle = new CustomToggle(this, drawerLayout, Resource.String.app_name, Resource.String.app_name) { Layout = mainLayout };
			drawerLayout.AddDrawerListener(drawerToggle);
			currentBackground = CurrentBackground.None;

			CastContext.GetSharedInstance(this).AddCastStateListener(this);
			CastContext.GetSharedInstance(this).AddAppVisibilityListener(this);
			CastContext.GetSharedInstance(this).SessionManager.AddSessionManagerListener(this);

			DatabaseProvider.StartDatabase();

			FragmentManager.BackStackChanged += FragmentManager_BackStackChanged;
			//if (Intent != null)
			//{
			//	var tab_name = Intent.GetStringExtra("tab_name");
			//	if (!string.IsNullOrEmpty(tab_name))
			//		ChangeFragment(tab_name);
			//	else ChangeFragment(Resource.String.fresh_fragment_id, false);
			//}
			//else
			//{
				ChangeFragment(Resource.String.local_artists_fragment_id, false);
			//}
		}

		protected override void OnNewIntent(Intent intent)
		{
			var tab_name = intent.GetStringExtra("tab_name");

			//ChangeFragment(tab_name);
			base.OnNewIntent(intent);
		}

		private void MainMenu_ItemClick(object sender, AdapterView.ItemClickEventArgs e)
		{
			if (mainMenuaAdapter.GetItem(e.Position) is Item)
			{
				Item item = mainMenuaAdapter.GetItem(e.Position) as Item;
				var itemText = item.TextView.Text;
				ChangeFragment(item.Id);
			}

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
					fragment = new FavoritesFragment();
					break;
				case Resource.String.local_artists_fragment_id:
					fragment = new ArtistsFragment();
					break;
				case Resource.String.local_albums_fragment_id:
					fragment = new AlbumsFragment();
					break;
				case Resource.String.local_genres_fragment_id:
					fragment = new GenresFragment();
					break;
		
			}

			if (fragment != null)
			{
				FragmentManager.ChangeTo(fragment, backstack);
			}
		}


		protected override void OnResume()
		{
			base.OnResume();

			DatabaseProvider.StartDatabase();

			//mediaRouteButton = (MediaRouteButton)FindViewById(Resource.Id.media_route_button);
			//CastButtonFactory.SetUpMediaRouteButton(Application.Context, mediaRouteButton);
			//mediaRouteButton.SetRemoteIndicatorDrawable(Application.Context.GetDrawable(Resource.Drawable.cast_default));
			castContext = CastContext.GetSharedInstance(this);

			if (castSession == null)
			{
				castSession = CastContext.GetSharedInstance(this).SessionManager.CurrentCastSession;
			}

			View settingsFooter = FindViewById(Resource.Id.settings_footer);
			settingsFooter.Click += SettingsFooter_Click;
			BindService();
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
				Utils.Run(() =>
				{
					Animation fadeOut = AnimationUtils.LoadAnimation(Application.Context, Android.Resource.Animation.FadeOut);
					fadeOut.Duration = 3000;
					Animation fadeIn = AnimationUtils.LoadAnimation(Application.Context, Android.Resource.Animation.FadeIn);
					fadeIn.Duration = 3000;
					if (serviceConnection?.CurrentSong == null) return;
					var newArt = serviceConnection.CurrentSong.Art.Blur(25);

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
									var a = primaryBackground.Background as BitmapDrawable;
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
									var a = secondaryBackground.Background as BitmapDrawable;
									a?.Bitmap?.Recycle();
									a?.Bitmap?.Dispose();
									secondaryBackground.Background.Dispose();
									secondaryBackground.Background = null;
								}
								currentBackground = CurrentBackground.Primary;
								break;
						}
					};

					fadeIn.AnimationEnd += (o, e) =>
					{
						System.GC.Collect();
					};

					RunOnUiThread(new Action(() =>
					{
						switch (currentBackground)
						{
							case CurrentBackground.None:

								primaryBackground.Background = new BitmapDrawable(Application.Context.Resources, newArt);
								primaryBackground.StartAnimation(fadeIn);
								secondaryBackground.StartAnimation(fadeOut);
								break;
							case CurrentBackground.Primary:
								secondaryBackground.Background = new BitmapDrawable(Application.Context.Resources, newArt);
								primaryBackground.StartAnimation(fadeOut);
								secondaryBackground.StartAnimation(fadeIn);
								break;
							case CurrentBackground.Secondary:
								primaryBackground.Background = new BitmapDrawable(Application.Context.Resources, newArt);
								primaryBackground.StartAnimation(fadeIn);
								secondaryBackground.StartAnimation(fadeOut);
								break;
						}
					}));
				});
			}
			catch (Exception ee) { Crashes.TrackError(ee); }
		}

		private void BackgroundAudioServiceConnection_PlaybackStatusChanged(object sender, StatusEventArg e)
		{
			if (serviceConnection == null || !serviceConnection.IsConnected || serviceConnection.CurrentSong == null) return;
			SetBackground();
			SetPlaying();
			SetMetaData();
			SetMainPlaylist();
		}

		private void ServiceConnection_ServiceConnected(object sender, bool e)
		{
			if (e)
			{
				BackgroundAudioServiceConnection.PlaybackStatusChanged += BackgroundAudioServiceConnection_PlaybackStatusChanged;
				MediaControllerCompat.SetMediaController(this, serviceConnection.MediaSession.Controller);
			}
			if (serviceConnection == null || !serviceConnection.IsConnected || serviceConnection.CurrentSong == null) return;
			SetBackground();
			SetPlaying();
			SetMetaData();
			SetMainPlaylist();
		}

		private void AlbumArtImageView_Click(object sender, System.EventArgs e)
		{
			Intent intent = new Intent(Application.Context, typeof(NowPlayingActivity));
			intent.AddFlags(ActivityFlags.ClearTop);
			StartActivity(intent);
		}

		public void SetPlaying()
		{
			if (serviceConnection != null && serviceConnection.IsConnected)
			{
				if (serviceConnection.Remote != null)
				{
					if (serviceConnection.Remote.IsPlaying)
					{
						playPauseImageButton?.SetImageResource(Resource.Drawable.pause);
					}
					else
					{
						playPauseImageButton?.SetImageResource(Resource.Drawable.play);
					}
				}
				else if (serviceConnection.MediaPlayer != null)
				{
					if (serviceConnection.MediaPlayer.IsPlaying)
					{
						playPauseImageButton?.SetImageResource(Resource.Drawable.pause);
					}
					else
					{
						playPauseImageButton?.SetImageResource(Resource.Drawable.play);
					}
				}
			}
		}

		private void PlayPauseImageButton_Click(object sender, System.EventArgs e)
		{
			if (serviceConnection != null && serviceConnection.IsConnected)
			{
				if (serviceConnection.Remote != null)
				{
					if (serviceConnection.Remote.IsPlaying) { serviceConnection.Pause(); }
					else { serviceConnection.Play(); }
				}
				else if (serviceConnection.MediaPlayer != null)
				{
					if (serviceConnection.MediaPlayer.IsPlaying) { serviceConnection.Pause(); }
					else { serviceConnection.Play(); }
				}
			}
			SetPlaying();
		}

		private void PreviousImageButton_Click(object sender, System.EventArgs e)
		{
			if (serviceConnection != null && serviceConnection.IsConnected)
			{
				if (serviceConnection.Remote != null)
				{
					if (serviceConnection.Remote.IsPlaying) { serviceConnection.PlayPreviousSong(); }
				}
				else if (serviceConnection.MediaPlayer != null)
				{
					if (serviceConnection.MediaPlayer.IsPlaying) { serviceConnection.PlayPreviousSong(); }
				}
			}
		}

		private void NextImageButton_Click(object sender, System.EventArgs e)
		{
			if (serviceConnection != null && serviceConnection.IsConnected)
			{
				if (serviceConnection.Remote != null)
				{
					if (serviceConnection.Remote.IsPlaying) { serviceConnection.PlayNextSong(); }
				}
				else if (serviceConnection.MediaPlayer != null)
				{
					if (serviceConnection.MediaPlayer.IsPlaying) { serviceConnection.PlayNextSong(); }
				}
			}
		}

		public void SetMetaData()
		{
			if (serviceConnection?.CurrentSong != null)
			{
				albumArtImageView?.SetImageBitmap(serviceConnection.CurrentSong.Art);
				titleTextView?.SetText(serviceConnection.CurrentSong.Title, TextView.BufferType.Normal);
				subtitleTextView?.SetText(serviceConnection.CurrentSong.Artist, TextView.BufferType.Normal);
			}

			SetPlaying();
		}

		public void SetMainPlaylist()
		{
			ListView lv = (ListView)FindViewById(Resource.Id.main_playlist);
			if (playlistAdapter == null)
			{
				playlistAdapter = new MainPlaylistAdapter(serviceConnection);
				lv.Adapter = playlistAdapter;
				lv.ItemClick += (sender, e) =>
				{
					serviceConnection.Play(e.Position, serviceConnection.MainQueue);
				};

			}
			
			if (serviceConnection?.MainQueue != null)
			{
				Adapters.Adapters.SetAdapters(this, playlistAdapter);
			}
		}

		protected override void OnDestroy()
		{
			base.OnDestroy();
			DatabaseProvider.StopDatabase();
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

			CastContext.GetSharedInstance(this).RemoveAppVisibilityListener(this);
			CastContext.GetSharedInstance(this).RemoveCastStateListener(this);
			CastContext.GetSharedInstance(this).SessionManager.RemoveSessionManagerListener(this);
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
			CastContext.GetSharedInstance(this).SessionManager.RemoveSessionManagerListener(this);
		}

		public override bool OnKeyDown(Keycode keyCode, KeyEvent e)
		{

			if (Build.VERSION.SdkInt >= BuildVersionCodes.Lollipop)
			{
				return base.OnKeyDown(keyCode, e);
			}
			switch (keyCode)
			{
				case Keycode.MediaPlay:
					//yourMediaController.dispatchMediaButtonEvent(event);

					return true;


			}
			return base.OnKeyDown(keyCode, e);
		}

		private void FragmentManager_BackStackChanged(object sender, EventArgs e)
		{
			//activeMenuItem?.SetChecked(false);
			if (FragmentManager.BackStackEntryCount == 0)
			{
				//activeMenuItem = navigationView.Menu.GetItem(0);
				//activeMenuItem?.SetChecked(true);
			}
			else
			{
				//var name = FragmentManager.GetBackStackEntryAt(FragmentManager.BackStackEntryCount - 1).Name;
				//for (var i = 0; i < navigationView.Menu.Size(); i++)
				//{
				//	var item = navigationView.Menu.GetItem(i);
				//	if (!item.ToString().Equals(name)) continue;
				//	activeMenuItem = item;
				//	activeMenuItem?.SetChecked(true);
				//	break;
				//}
			}
		}

		private void SettingsFooter_Click(object sender, EventArgs e)
		{
			//activeMenuItem?.SetChecked(false);
			//activeMenuItem = null;
			var fragment = new SettingsFragment();
			FragmentManager.ChangeTo(fragment, true, "Settings");
			DrawerLayout drawer = FindViewById<DrawerLayout>(Resource.Id.drawer_layout);
			drawer.CloseDrawer(GravityCompat.Start);
		}

		public void OnCastStateChanged(int newState)
		{
			CastStates cs = (CastStates)newState;
			if (cs != CastStates.NoDevicesAvailable)
			{

				//var overlay = new Android.Gms.Cast.Framework.IntroductoryOverlayBuilder(this, FragmentBase.MediaRouteButton);
				//overlay.SetTitleText("Cast");
				//var aa = overlay.Build();
				//aa.Show();
				//IntroductoryOverlayBuilder.Build()
				//IIntroductoryOverlay overlay = new IIntroductoryOverlay.Builder(activity, mMediaRouteMenuItem)
				//	.setTitleText(R.string.cast_intro_overlay_text)
				//	.setOnDismissed(onOverlayDismissedListener)
				//	.setSingleTime()
				//	.build();
				//overlay.show();
				Utils.Run(() =>
				{
					var spotLight = new SpotlightView.Builder(this)
						.IntroAnimationDuration(400)
						.EnableRevealAnimation(true)
						.PerformClick(true)
						.FadeinTextDuration(200)
						//.setTypeface(FontUtil.get(this, "RemachineScript_Personal_Use"))
						.HeadingTvColor(Color.ParseColor("#eb273f"))
						.HeadingTvSize(32)
						.HeadingTvText("Cast?")
						.SubHeadingTvColor(Color.ParseColor("#ffffff"))
						.SubHeadingTvSize(16)
						.SubHeadingTvText("You know you want to")
						.MaskColor(Color.ParseColor("#dc000000"))
						.Target(FragmentBase.MediaRouteButton.ActionView)
						.LineAnimDuration(200)
						.LineAndArcColor(Color.ParseColor("#eb273f"))
						.DismissOnTouch(true)
						.DismissOnBackPress(true)
						.EnableDismissAfterShown(true)
						.UsageId("castspotlight") //UNIQUE ID
						.ShowTargetArc(true)
						.Show();

				});

			}
			if (cs != CastStates.Connected) { StartServer(); }
			if (lastState == CastStates.Connected && (cs == CastStates.NotConnected || cs == CastStates.NoDevicesAvailable)) { StopServer(); }

			lastState = cs;
			System.Diagnostics.Debug.WriteLine("OnCastStateChanged " + cs);
		}

		public void OnAppEnteredBackground()
		{
			System.Diagnostics.Debug.WriteLine("OnAppEnteredBackground");
		}

		public void OnAppEnteredForeground()
		{
			System.Diagnostics.Debug.WriteLine("OnAppEnteredForeground");
		}

		public void OnSessionEnded(Object session, int error)
		{
			System.Diagnostics.Debug.WriteLine("OnSessionEnded");
			//mediaRouteButton?.SetRemoteIndicatorDrawable(Application.Context.GetDrawable(Resource.Drawable.cast_default));
			if (session == castSession)
			{
				castSession = null;
			}
		}

		public void OnSessionEnding(Object session)
		{
			System.Diagnostics.Debug.WriteLine("OnSessionEnding");
		}

		public void OnSessionResumeFailed(Object session, int error)
		{
			System.Diagnostics.Debug.WriteLine("OnSessionResumeFailed");
			//mediaRouteButton?.SetRemoteIndicatorDrawable(Application.Context.GetDrawable(Resource.Drawable.cast_default));
		}

		public void OnSessionResumed(Object session, bool wasSuspended)
		{
			System.Diagnostics.Debug.WriteLine("OnSessionResumed");
			castSession = (CastSession)session;
			//mediaRouteButton?.SetRemoteIndicatorDrawable(Application.Context.GetDrawable(Resource.Drawable.cast_connected));
			StartServer();
		}

		public void OnSessionResuming(Object session, string sessionId)
		{
			System.Diagnostics.Debug.WriteLine("OnSessionResuming");
		}

		public void OnSessionStartFailed(Object session, int error)
		{
			System.Diagnostics.Debug.WriteLine("OnSessionStartFailed");
			//mediaRouteButton?.SetRemoteIndicatorDrawable(Application.Context.GetDrawable(Resource.Drawable.cast_default));
		}

		public void OnSessionStarted(Object session, string sessionId)
		{
			System.Diagnostics.Debug.WriteLine("OnSessionStarted");
			castSession = (CastSession)session;
			//mediaRouteButton?.SetRemoteIndicatorDrawable(Application.Context.GetDrawable(Resource.Drawable.cast_connected));
			StartServer();
		}

		public void OnSessionStarting(Object session)
		{
			System.Diagnostics.Debug.WriteLine("OnSessionStarting");
		}

		public void OnSessionSuspended(Object session, int reason)
		{
			System.Diagnostics.Debug.WriteLine("OnSessionSuspended");
			//mediaRouteButton?.SetRemoteIndicatorDrawable(Application.Context.GetDrawable(Resource.Drawable.cast_default));
		}

		public void OnStatusUpdated()
		{
			if (serviceConnection.Remote != null)
			{
				if (serviceConnection.Remote.IdleReason == Android.Gms.Cast.MediaStatus.IdleReasonFinished)
				{
					serviceConnection.PlayNextSong();
				}
			}
		}

		private void StartServer()
		{
			var pathFile = Android.OS.Environment.GetExternalStoragePublicDirectory(Android.OS.Environment.DirectoryMusic);
			var absolutePath = pathFile.AbsolutePath;

			//if (castServer == null) castServer = new SimpleHTTPServer(absolutePath, 8001);
		}

		private void StopServer()
		{
			//if (castServer != null) castServer.Stop();
		}

		public void OnActiveViewChanged(View v)
		{

		}

		public void onPanelSlide(View panel, float slideOffset)
		{
			
		}

		public void onPanelStateChanged(View panel, SlidingUpPanelLayout.PanelState previousState, SlidingUpPanelLayout.PanelState newState)
		{

		}

		public void OnClick(View v)
		{
			
		}
	}
}