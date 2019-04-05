using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Alloy.Fragments;
using Alloy.Helpers;
using Android.App;
using Android.Content;
using Android.Gms.Cast.Framework;
using Android.Graphics;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Spotlight;
using Object = Java.Lang.Object;

namespace Alloy.Providers
{
	public class CastContentProvider : Java.Lang.Object, ICastStateListener, ISessionManagerListener, IAppVisibilityListener
	{
		private CastStates lastState = CastStates.NoDevicesAvailable;
		private CastContext castContext;
		private CastSession castSession;
		private Activity activity;
		//private SimpleHTTPServer castServer;

		public CastContentProvider(Activity activity)
		{
			this.activity = activity;
			CastContext.GetSharedInstance(activity).AddCastStateListener(this);
			CastContext.GetSharedInstance(activity).AddAppVisibilityListener(this);
			CastContext.GetSharedInstance(activity).SessionManager.AddSessionManagerListener(this);

		}

		public void OnResume()
		{
			castContext = CastContext.GetSharedInstance(activity);

			if (castSession == null)
			{
				castSession = CastContext.GetSharedInstance(activity).SessionManager.CurrentCastSession;
			}
		}

		public void OnStop()
		{
			CastContext.GetSharedInstance(activity).RemoveAppVisibilityListener(this);
			CastContext.GetSharedInstance(activity).RemoveCastStateListener(this);
			CastContext.GetSharedInstance(activity).SessionManager.RemoveSessionManagerListener(this);
		}

		public void OnPause()
		{
			CastContext.GetSharedInstance(activity).SessionManager.RemoveSessionManagerListener(this);
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
					var spotLight = new SpotlightView.Builder(activity)
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

		public void OnSessionEnded(Java.Lang.Object session, int error)
		{
			System.Diagnostics.Debug.WriteLine("OnSessionEnded");
			//mediaRouteButton?.SetRemoteIndicatorDrawable(Application.Context.GetDrawable(Resource.Drawable.cast_default));
			if (session == castSession)
			{
				castSession = null;
			}
		}

		public void OnSessionEnding(Java.Lang.Object session)
		{
			System.Diagnostics.Debug.WriteLine("OnSessionEnding");
		}

		public void OnSessionResumeFailed(Java.Lang.Object session, int error)
		{
			System.Diagnostics.Debug.WriteLine("OnSessionResumeFailed");
			//mediaRouteButton?.SetRemoteIndicatorDrawable(Application.Context.GetDrawable(Resource.Drawable.cast_default));
		}

		public void OnSessionResumed(Java.Lang.Object session, bool wasSuspended)
		{
			System.Diagnostics.Debug.WriteLine("OnSessionResumed");
			castSession = (CastSession)session;
			//mediaRouteButton?.SetRemoteIndicatorDrawable(Application.Context.GetDrawable(Resource.Drawable.cast_connected));
			StartServer();
		}

		public void OnSessionResuming(Java.Lang.Object session, string sessionId)
		{
			System.Diagnostics.Debug.WriteLine("OnSessionResuming");
		}

		public void OnSessionStartFailed(Java.Lang.Object session, int error)
		{
			System.Diagnostics.Debug.WriteLine("OnSessionStartFailed");
			//mediaRouteButton?.SetRemoteIndicatorDrawable(Application.Context.GetDrawable(Resource.Drawable.cast_default));
		}

		public void OnSessionStarted(Java.Lang.Object session, string sessionId)
		{
			System.Diagnostics.Debug.WriteLine("OnSessionStarted");
			castSession = (CastSession)session;
			//mediaRouteButton?.SetRemoteIndicatorDrawable(Application.Context.GetDrawable(Resource.Drawable.cast_connected));
			StartServer();
		}

		public void OnSessionStarting(Java.Lang.Object session)
		{
			System.Diagnostics.Debug.WriteLine("OnSessionStarting");
		}

		public void OnSessionSuspended(Object session, int reason)
		{
			System.Diagnostics.Debug.WriteLine("OnSessionSuspended");
			//mediaRouteButton?.SetRemoteIndicatorDrawable(Application.Context.GetDrawable(Resource.Drawable.cast_default));
		}

		public void OnAppEnteredBackground()
		{
			System.Diagnostics.Debug.WriteLine("OnAppEnteredBackground");
		}

		public void OnAppEnteredForeground()
		{
			System.Diagnostics.Debug.WriteLine("OnAppEnteredForeground");
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
	}
}