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
		private const string TAG = "ActionBarHelperCompat";

		public static void SetActionBarUpIndicator(Object info, Activity activity, Drawable drawable, int contentDescRes)
		{
			SetIndicatorInfo sii = (SetIndicatorInfo)info;
			if (sii.UpIndicatorView == null) return;
			sii.UpIndicatorView.SetImageDrawable(drawable);
			string contentDescription = contentDescRes == 0 ? null : activity.GetString(contentDescRes);
			sii.UpIndicatorView.ContentDescription = contentDescription;
		}

		public static void SetActionBarDescription(Object info, Activity activity, int contentDescRes)
		{
			SetIndicatorInfo sii = (SetIndicatorInfo)info;
			if (sii.UpIndicatorView != null)
			{
				string contentDescription = contentDescRes == 0 ? null : activity.GetString(contentDescRes);
				sii.UpIndicatorView.ContentDescription = contentDescription;
			}
		}

		public static Drawable GetThemeUpIndicator(Object info)
		{
			SetIndicatorInfo sii = (SetIndicatorInfo)info;
			if (sii.UpIndicatorView != null)
			{
				return sii.UpIndicatorView.Drawable;
			}
			return null;
		}

		public static Object GetIndicatorInfo(AppCompatActivity activity)
		{
			return new SetIndicatorInfo(activity);
		}

		public static void SetDisplayHomeAsUpEnabled(Object info, bool enabled)
		{
			SetIndicatorInfo sii = (SetIndicatorInfo)info;
			if (sii.HomeAsUpEnabled != null)
			{
				try
				{
					sii.HomeAsUpEnabled.Invoke(sii.ActionBar, enabled);
				}
				catch (Throwable t)
				{
					Log.Error(TAG, "Unable to call setHomeAsUpEnabled", t);
				}
			}
		}

		public class SetIndicatorInfo : Object
		{

			public ImageView UpIndicatorView { get; set; }
			public Object ActionBar { get; set; }
			public Method HomeAsUpEnabled { get; set; }

			public SetIndicatorInfo(Activity activity)
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
						UpIndicatorView = (ImageView)parent.FindViewById(upId);
					}
					catch (Throwable t)
					{
						Log.Error(TAG, "ABS action bar not found", t);
					}

					if (UpIndicatorView == null)
					{
						// Attempt to find AppCompat up indicator
						int homeId = activity.Resources.GetIdentifier("home", "id", appPackage);
						View v = activity.FindViewById(homeId);
						ViewGroup parent = (ViewGroup)v.Parent;
						int upId = activity.Resources.GetIdentifier("up", "id", appPackage);
						UpIndicatorView = (ImageView)parent.FindViewById(upId);
					}

					Class supportActivity = activity.Class;
					Method getActionBar = supportActivity.GetMethod("getSupportActionBar");
					getActionBar.Invoke(ActionBar);

					Class supportActionBar = ActionBar.Class;
					HomeAsUpEnabled = supportActionBar.GetMethod("setDisplayHomeAsUpEnabled", Boolean.Type);

				}
				catch (Throwable t)
				{
					Log.Error(TAG, "Unable to init SetIndicatorInfo for ABS", t);
				}
			}
		}
	}
}