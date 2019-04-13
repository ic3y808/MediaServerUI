using System;
using Android.App;
using Android.Content.Res;
using Android.Graphics.Drawables;
using Android.Support.V7.App;
using Android.Util;
using Android.Views;
using Android.Widget;
using Java.Lang;
using ActionBar = Android.Support.V7.App.ActionBar;
using Object = Java.Lang.Object;

namespace Alloy.Compat
{
	public class ActionBarHelperNative
	{

		private static string TAG = "ActionBarHelperNative";

		private ActionBarHelperNative()
		{
		}

		private static readonly int[] THEME_ATTRS = { Android.Resource.Attribute.HomeAsUpIndicator };

		public static void SetActionBarUpIndicator(Object info, AppCompatActivity activity, Drawable drawable, int contentDescRes)
		{
			SetIndicatorInfo sii = (SetIndicatorInfo)info;
			if (sii.setHomeAsUpIndicator != null)
			{
				try
				{
					ActionBar actionBar = activity.SupportActionBar;
					sii.setHomeAsUpIndicator(actionBar, drawable);
					sii.setHomeActionContentDescription(actionBar, contentDescRes);
				}
				catch (Throwable t)
				{
					Log.Error(TAG, "Couldn't set home-as-up indicator via JB-MR2 API", t);
				}
			}
			else if (sii.upIndicatorView != null) { sii.upIndicatorView.SetImageDrawable(drawable); }
			else
			{
				Log.Error(TAG, "Couldn't set home-as-up indicator");
			}
		}

		public static void SetActionBarDescription(Object info, AppCompatActivity activity, int contentDescRes)
		{
			SetIndicatorInfo sii = (SetIndicatorInfo)info;
			if (sii.setHomeAsUpIndicator == null) return;
			try
			{
				ActionBar actionBar = activity.SupportActionBar;
				sii.setHomeActionContentDescription.Invoke(actionBar, contentDescRes);
			}
			catch (Throwable t)
			{
				Log.Error(TAG, "Couldn't set content description via JB-MR2 API", t);
			}
		}

		public static Drawable GetThemeUpIndicator(Object info, AppCompatActivity activity)
		{
			TypedArray a = activity.ObtainStyledAttributes(THEME_ATTRS);
			Drawable result = a.GetDrawable(0);
			a.Recycle();
			return result;
		}

		public static Object GetIndicatorInfo(AppCompatActivity activity)
		{
			return new SetIndicatorInfo(activity);
		}

		public static void SetDisplayHomeAsUpEnabled(AppCompatActivity activity, bool b)
		{
			ActionBar actionBar = activity.SupportActionBar;
			actionBar?.SetDisplayHomeAsUpEnabled(b);
		}

		public class SetIndicatorInfo : Object
		{

			public Action<ActionBar, Drawable> setHomeAsUpIndicator;
			public Action<ActionBar, int> setHomeActionContentDescription;
			public ImageView upIndicatorView;

			public SetIndicatorInfo(Activity activity)
			{
				try
				{
					setHomeAsUpIndicator = (ab, d) => { ab?.SetHomeAsUpIndicator(d); };
					setHomeActionContentDescription = (ab, r) => { ab?.SetHomeActionContentDescription(r); };
					return;
				}
				catch
				{
					// ignored
				}

				View home = activity.FindViewById(Android.Resource.Id.Home);
				if (home == null)
				{
					return;
				}

				ViewGroup parent = (ViewGroup)home.Parent;
				int childCount = parent.ChildCount;
				if (childCount != 2)
				{
					return;
				}

				View first = parent.GetChildAt(0);
				View second = parent.GetChildAt(1);
				View up = first.Id == Android.Resource.Id.Home ? second : first;

				if (up is ImageView)
				{
					upIndicatorView = (ImageView)up;
				}
			}
		}
	}
}