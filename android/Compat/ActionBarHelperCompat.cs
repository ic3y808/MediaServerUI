using Android.App;
using Android.Graphics.Drawables;
using Android.Support.V7.App;
using Android.Util;
using Android.Views;
using Android.Widget;
using Java.Lang;
using Java.Lang.Reflect;

namespace Alloy.Compat
{
	public class ActionBarHelperCompat
	{

		private static string TAG = "ActionBarHelperCompat";

		private ActionBarHelperCompat()
		{
		}

		public static void setActionBarUpIndicator(Object info, Activity activity, Drawable drawable, int contentDescRes)
		{
			SetIndicatorInfo sii = (SetIndicatorInfo)info;
			if (sii.mUpIndicatorView != null)
			{
				sii.mUpIndicatorView.SetImageDrawable(drawable);
				string contentDescription = contentDescRes == 0 ? null : activity.GetString(contentDescRes);
				sii.mUpIndicatorView.ContentDescription = contentDescription;
			}
		}

		public static void setActionBarDescription(Object info, Activity activity, int contentDescRes)
		{
			SetIndicatorInfo sii = (SetIndicatorInfo)info;
			if (sii.mUpIndicatorView != null)
			{
				string contentDescription = contentDescRes == 0 ? null : activity.GetString(contentDescRes);
				sii.mUpIndicatorView.ContentDescription = contentDescription;
			}
		}

		public static Drawable getThemeUpIndicator(Object info)
		{
			SetIndicatorInfo sii = (SetIndicatorInfo)info;
			if (sii.mUpIndicatorView != null)
			{
				return sii.mUpIndicatorView.Drawable;
			}
			return null;
		}

		public static Object getIndicatorInfo(AppCompatActivity activity)
		{
			return new SetIndicatorInfo(activity);
		}

		public static void setDisplayHomeAsUpEnabled(Object info, bool enabled)
		{
			SetIndicatorInfo sii = (SetIndicatorInfo)info;
			if (sii.mHomeAsUpEnabled != null)
			{
				try
				{
					sii.mHomeAsUpEnabled.Invoke(sii.mActionBar, enabled);
				}
				catch (Throwable t)
				{
					Log.Error(TAG, "Unable to call setHomeAsUpEnabled", t);
				}
			}
		}

		public class SetIndicatorInfo : Java.Lang.Object
		{

			public ImageView mUpIndicatorView;
			public Object mActionBar;
			public Method mHomeAsUpEnabled;

			public SetIndicatorInfo(AppCompatActivity activity)
			{
				try
				{
					string appPackage = activity.PackageName;

					try
					{
						// Attempt to find ActionBarSherlock up indicator
						int homeId = activity.Resources.GetIdentifier("abs__home", "id", appPackage);
						View v = activity.FindViewById(homeId);
						ViewGroup parent = (ViewGroup)v.Parent;
						int upId = activity.Resources.GetIdentifier("abs__up", "id", appPackage);
						mUpIndicatorView = (ImageView)parent.FindViewById(upId);
					}
					catch (Throwable t)
					{
						Log.Error(TAG, "ABS action bar not found", t);
					}

					if (mUpIndicatorView == null)
					{
						// Attempt to find AppCompat up indicator
						int homeId = activity.Resources.GetIdentifier("home", "id", appPackage);
						View v = activity.FindViewById(homeId);
						ViewGroup parent = (ViewGroup)v.Parent;
						int upId = activity.Resources.GetIdentifier("up", "id", appPackage);
						mUpIndicatorView = (ImageView)parent.FindViewById(upId);
					}

					Class supportActivity = activity.Class;
					Method getActionBar = supportActivity.GetMethod("getSupportActionBar");
					getActionBar.Invoke(mActionBar);

					Class supportActionBar = mActionBar.Class;
					mHomeAsUpEnabled = supportActionBar.GetMethod("setDisplayHomeAsUpEnabled", Boolean.Type);

				}
				catch (Throwable t)
				{
					Log.Error(TAG, "Unable to init SetIndicatorInfo for ABS", t);
				}
			}
		}
	}
}