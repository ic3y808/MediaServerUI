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
using Toolbar = Android.Support.V7.Widget.Toolbar;

namespace Alloy.Fragments
{
	public abstract class FragmentBase : Fragment, Android.Hardware.ISensorEventListener, SwipeRefreshLayout.IOnRefreshListener
	{
		public BackgroundAudioServiceConnection ServiceConnection;
		public static IMenuItem MediaRouteButton;
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
			MusicProvider.LibraryLoaded -= LibraryLoaded;
		}

		private void AddHandlers()
		{
			BackgroundAudioServiceConnection.PlaybackStatusChanged += BackgroundAudioServiceConnection_PlaybackStatusChanged;
			MusicProvider.LibraryLoaded += LibraryLoaded;
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

		private void LibraryLoaded(object sender, System.EventArgs e)
		{
			LibraryLoaded();
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
		public virtual void LibraryLoaded() { }
		public virtual void ServiceConnected() { }
		public virtual void OnRefreshed() { }
		public virtual void ContextMenuCreated(IContextMenu menu, View v, IContextMenuContextMenuInfo menuInfo) { }
		public virtual void ContextMenuItemSelected(IMenuItem item, AdapterView.AdapterContextMenuInfo info) { }
	}


}