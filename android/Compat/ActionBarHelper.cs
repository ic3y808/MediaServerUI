using Android.Graphics.Drawables;
using Android.OS;
using Android.Support.V7.App;
using Android.Util;
using Java.Lang;
using Net.Simonvt.Menudrawer.Compat;

namespace Alloy.Compat
{
	public class ActionBarHelper
	{
		private static string TAG = "ActionBarHelper";

		public static bool DEBUG = false;

		private AppCompatActivity mActivity;

		private Object mIndicatorInfo;

		private bool mUsesCompat;

		public ActionBarHelper(AppCompatActivity activity)
		{
			mActivity = activity;

			try
			{

				Class clazz = activity.Class;
				var m = clazz.GetMethod("getSupportActionBar");
				mUsesCompat = true;
			}
			catch (NoSuchMethodException e)
			{
				if (DEBUG)
				{
					Log.Error(TAG,
							"Activity " + activity.Class.SimpleName + " does not use a compatibility action bar",
							e);
				}
			}

			mIndicatorInfo = getIndicatorInfo();
		}

		private Object getIndicatorInfo()
		{
			if (mUsesCompat && Build.VERSION.SdkInt < BuildVersionCodes.IceCreamSandwich)
			{
				return ActionBarHelperCompat.getIndicatorInfo(mActivity);
			}
			else if (Build.VERSION.SdkInt >= BuildVersionCodes.Honeycomb)
			{
				return ActionBarHelperNative.getIndicatorInfo(mActivity);
			}

			return null;
		}

		public void setActionBarUpIndicator(Drawable drawable, int contentDesc)
		{
			if (mUsesCompat && Build.VERSION.SdkInt < BuildVersionCodes.IceCreamSandwich)
			{
				ActionBarHelperCompat.setActionBarUpIndicator(mIndicatorInfo, mActivity, drawable, contentDesc);
			}
			else if (Build.VERSION.SdkInt >= BuildVersionCodes.Honeycomb)
			{
				ActionBarHelperNative.setActionBarUpIndicator(mIndicatorInfo, mActivity, drawable, contentDesc);
			}
		}

		public void setActionBarDescription(int contentDesc)
		{
			if (mUsesCompat && Build.VERSION.SdkInt < BuildVersionCodes.IceCreamSandwich)
			{
				ActionBarHelperCompat.setActionBarDescription(mIndicatorInfo, mActivity, contentDesc);
			}
			else if (Build.VERSION.SdkInt >= BuildVersionCodes.Honeycomb)
			{
				ActionBarHelperNative.setActionBarDescription(mIndicatorInfo, mActivity, contentDesc);
			}
		}

		public Drawable getThemeUpIndicator()
		{
			if (mUsesCompat && Build.VERSION.SdkInt < BuildVersionCodes.IceCreamSandwich)
			{
				return ActionBarHelperCompat.getThemeUpIndicator(mIndicatorInfo);
			}
			else if (Build.VERSION.SdkInt >= BuildVersionCodes.Honeycomb)
			{
				return ActionBarHelperNative.getThemeUpIndicator(mIndicatorInfo, mActivity);
			}

			return null;
		}

		public void setDisplayShowHomeAsUpEnabled(bool enabled)
		{
			if (mUsesCompat && Build.VERSION.SdkInt < BuildVersionCodes.IceCreamSandwich)
			{
				ActionBarHelperCompat.setDisplayHomeAsUpEnabled(mIndicatorInfo, enabled);
			}
			else if (Build.VERSION.SdkInt >= BuildVersionCodes.Honeycomb)
			{
				ActionBarHelperNative.setDisplayHomeAsUpEnabled(mActivity, enabled);
			}
		}
	}
}