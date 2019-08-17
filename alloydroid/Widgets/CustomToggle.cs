using System;
using Android.App;
using Android.OS;
using Android.Runtime;
using Android.Support.V4.Widget;
using Android.Support.V7.App;
using Android.Views;
using Android.Views.Animations;
using Toolbar = Android.Support.V7.Widget.Toolbar;

namespace Alloy.Widgets
{
	public class CustomToggle : ActionBarDrawerToggle
	{
		public View Layout { get; set; }
		private float lastTranslate;

		protected CustomToggle(IntPtr javaReference, JniHandleOwnership transfer) : base(javaReference, transfer)
		{
		}

		public CustomToggle(Activity activity, DrawerLayout drawerLayout, Toolbar toolbar, int openDrawerContentDescRes, int closeDrawerContentDescRes) : base(activity, drawerLayout, toolbar, openDrawerContentDescRes, closeDrawerContentDescRes)
		{
		}

		public CustomToggle(Activity activity, DrawerLayout drawerLayout, int openDrawerContentDescRes, int closeDrawerContentDescRes) : base(activity, drawerLayout, openDrawerContentDescRes, closeDrawerContentDescRes)
		{
		}

		public override void OnDrawerSlide(View drawerView, float slideOffset)
		{
			base.OnDrawerSlide(drawerView, slideOffset);
			float moveFactor = (drawerView.Width * slideOffset);

			if (Build.VERSION.SdkInt >= BuildVersionCodes.Honeycomb)
			{
				Layout.TranslationX = moveFactor;
			}
			else
			{
				TranslateAnimation anim = new TranslateAnimation(lastTranslate, moveFactor, 0.0f, 0.0f)
				{
					Duration = 0,
					FillAfter = true
				};
				Layout.StartAnimation(anim);

				lastTranslate = moveFactor;
			}
		}
	}
}