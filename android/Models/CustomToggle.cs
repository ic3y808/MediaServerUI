using System;
using Alloy.Widgets;
using Android.App;
using Android.OS;
using Android.Runtime;
using Android.Support.V4.Widget;
using Android.Support.V7.App;
using Android.Views;
using Android.Views.Animations;
using Android.Widget;
using SlideUpPanelLibrary;
using Toolbar = Android.Support.V7.Widget.Toolbar;

namespace Alloy.Models
{
	public class CustomToggle : ActionBarDrawerToggle
	{
		public SlidingUpPanelLayout Layout { get; set; }
		private float lastTranslate = 0.0f;
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