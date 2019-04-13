using Android.Graphics.Drawables;
using Android.OS;
using Android.Support.V7.App;
using Android.Util;
using Java.Lang;

namespace Alloy.Compat
{
	public class ActionBarHelper
	{
		private const string TAG = "ActionBarHelper";

		public AppCompatActivity Activity { get; }

		public Object IndicatorInfo { get; }

		public bool UsesCompat { get; }

		public ActionBarHelper(AppCompatActivity activity)
		{
			Activity = activity;
			try
			{
				Class clazz = activity.Class;
				clazz.GetMethod("getSupportActionBar");
				UsesCompat = true;
			}
			catch (NoSuchMethodException e)
			{
				Log.Error(TAG, "Activity " + activity.Class.SimpleName + " does not use a compatibility action bar", e);
			}

			IndicatorInfo = getIndicatorInfo();
		}

		private Object getIndicatorInfo()
		{
			if (UsesCompat && Build.VERSION.SdkInt < BuildVersionCodes.IceCreamSandwich)
			{
				return ActionBarHelperCompat.getIndicatorInfo(Activity);
			}

			return Build.VERSION.SdkInt >= BuildVersionCodes.Honeycomb ? ActionBarHelperNative.getIndicatorInfo(Activity) : null;
		}

		public void setActionBarUpIndicator(Drawable drawable, int contentDesc)
		{
			if (UsesCompat && Build.VERSION.SdkInt < BuildVersionCodes.IceCreamSandwich)
			{
				ActionBarHelperCompat.setActionBarUpIndicator(IndicatorInfo, Activity, drawable, contentDesc);
			}
			else if (Build.VERSION.SdkInt >= BuildVersionCodes.Honeycomb)
			{
				ActionBarHelperNative.setActionBarUpIndicator(IndicatorInfo, Activity, drawable, contentDesc);
			}
		}

		public void setActionBarDescription(int contentDesc)
		{
			if (UsesCompat && Build.VERSION.SdkInt < BuildVersionCodes.IceCreamSandwich)
			{
				ActionBarHelperCompat.setActionBarDescription(IndicatorInfo, Activity, contentDesc);
			}
			else if (Build.VERSION.SdkInt >= BuildVersionCodes.Honeycomb)
			{
				ActionBarHelperNative.setActionBarDescription(IndicatorInfo, Activity, contentDesc);
			}
		}

		public Drawable getThemeUpIndicator()
		{
			if (UsesCompat && Build.VERSION.SdkInt < BuildVersionCodes.IceCreamSandwich)
			{
				return ActionBarHelperCompat.getThemeUpIndicator(IndicatorInfo);
			}

			return Build.VERSION.SdkInt >= BuildVersionCodes.Honeycomb ? ActionBarHelperNative.getThemeUpIndicator(IndicatorInfo, Activity) : null;
		}

		public void setDisplayShowHomeAsUpEnabled(bool enabled)
		{
			if (UsesCompat && Build.VERSION.SdkInt < BuildVersionCodes.IceCreamSandwich)
			{
				ActionBarHelperCompat.setDisplayHomeAsUpEnabled(IndicatorInfo, enabled);
			}
			else if (Build.VERSION.SdkInt >= BuildVersionCodes.Honeycomb)
			{
				ActionBarHelperNative.setDisplayHomeAsUpEnabled(Activity, enabled);
			}
		}
	}
}