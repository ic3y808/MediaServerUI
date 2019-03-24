using System;
using Android.Content.Res;
using Android.Graphics.Drawables;
using Android.Support.V7.App;
using Android.Util;
using Android.Views;
using Android.Widget;
using Java.Lang;
using Alloy.Compat;
using ActionBar = Android.Support.V7.App.ActionBar;
using Object = Java.Lang.Object;

namespace Net.Simonvt.Menudrawer.Compat
{
	public class ActionBarHelperNative
	{

		private static string TAG = "ActionBarHelperNative";

		private ActionBarHelperNative()
		{
		}

		private static int[] THEME_ATTRS = new int[]
		{
			Android.Resource.Attribute.HomeAsUpIndicator
		};

		public static void setActionBarUpIndicator(Object info, AppCompatActivity activity, Drawable drawable, int contentDescRes)
		{

			var sii = (SetIndicatorInfo)info;
			if (sii.setHomeAsUpIndicator != null)
			{
				try
				{
					Android.Support.V7.App.ActionBar actionBar = activity.SupportActionBar;
					sii.setHomeAsUpIndicator(actionBar, drawable);
					sii.setHomeActionContentDescription(actionBar, contentDescRes);
				}
				catch (Throwable t)
				{
					if (ActionBarHelper.DEBUG) Log.Error(TAG, "Couldn't set home-as-up indicator via JB-MR2 API", t);
				}
			}
			else if (sii.upIndicatorView != null) { sii.upIndicatorView.SetImageDrawable(drawable); }
			else
			{
				if (ActionBarHelper.DEBUG) Log.Error(TAG, "Couldn't set home-as-up indicator");
			}
		}

		public static void setActionBarDescription(Object info, AppCompatActivity activity, int contentDescRes)
		{
			SetIndicatorInfo sii = (SetIndicatorInfo)info;
			if (sii.setHomeAsUpIndicator != null)
			{
				try
				{
					ActionBar actionBar = activity.SupportActionBar;
					sii.setHomeActionContentDescription.Invoke(actionBar, contentDescRes);
				}
				catch (Throwable t)
				{
					if (ActionBarHelper.DEBUG) Log.Error(TAG, "Couldn't set content description via JB-MR2 API", t);
				}
			}
		}

		public static Drawable getThemeUpIndicator(Object info, AppCompatActivity activity)
		{
			TypedArray a = activity.ObtainStyledAttributes(THEME_ATTRS);
			Drawable result = a.GetDrawable(0);
			a.Recycle();
			return result;
		}

		public static Object getIndicatorInfo(AppCompatActivity activity)
		{
			return new SetIndicatorInfo(activity);
		}

		public static void setDisplayHomeAsUpEnabled(AppCompatActivity activity, bool b)
		{
			ActionBar actionBar = activity.SupportActionBar;
			if (actionBar != null) { actionBar.SetDisplayHomeAsUpEnabled(b); }
		}

		public class SetIndicatorInfo : Java.Lang.Object
		{

			public Action<ActionBar, Drawable> setHomeAsUpIndicator;
			public Action<ActionBar, int> setHomeActionContentDescription;
			public ImageView upIndicatorView;
			
			public SetIndicatorInfo(AppCompatActivity activity)
			{
				//try
				//	{
				setHomeAsUpIndicator = (ActionBar ab, Drawable d) => { ab?.SetHomeAsUpIndicator(d); };
				setHomeActionContentDescription  = (ActionBar ab, int r) => { ab?.SetHomeActionContentDescription(r); };
				//var actionbar = Class.FromType(typeof(Android.Support.V7.App.ActionBar)).GetConstructor().NewInstance();
				//Expression a = activity.SupportActionBar.SetHomeAsUpIndicator(1);
				//setHomeAsUpIndicator = (i) => activity.SupportActionBar.SetHomeAsUpIndicator(i);
		

				//setHomeAsUpIndicator = actionBar.GetDeclaredMethod("setHomeAsUpIndicator", Class.FromType(typeof(Integer)).Class);


				//setHomeAsUpIndicator = Class.FromType(typeof(Android.Support.V7.App.ActionBar)).setHomeAsUpIndicator Class.FromType(typeof(Drawable)).Class);
				//setHomeActionContentDescription = Class.FromType(typeof(Android.Support.V7.App.ActionBar)).Class.GetDeclaredMethod("setHomeActionContentDescription", Class.FromType(typeof(Integer)));

				// If we got the method we won't need the stuff below.
				//	return;
				//}
				//catch (Throwable t)
				//{
				//	// Oh well. We'll use the other mechanism below instead.
				//}

				View home = activity.FindViewById(Android.Resource.Id.Home);
				if (home == null)
				{
					// Action bar doesn't have a known configuration, an OEM messed with things.
					return;
				}

				ViewGroup parent = (ViewGroup)home.Parent;
				int childCount = parent.ChildCount;
				if (childCount != 2)
				{
					// No idea which one will be the right one, an OEM messed with things.
					return;
				}

				View first = parent.GetChildAt(0);
				View second = parent.GetChildAt(1);
				View up = first.Id == Android.Resource.Id.Home ? second : first;

				if (up is ImageView)
				{
					// Jackpot! (Probably...)
					upIndicatorView = (ImageView)up;
				}
			}
		}
	}
}