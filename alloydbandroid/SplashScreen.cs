using System;
using System.Linq;
using System.Reflection;
using Android.App;
using Android.Content;
using Android.Content.PM;
using Android.OS;
using Android.Support.V4.App;
using Android.Support.V4.Content;

namespace Alloy
{
	[Activity(Label = "Alloy", Theme = "@style/AppTheme.Splash", MainLauncher = true, NoHistory = true, ConfigurationChanges = ConfigChanges.Orientation | ConfigChanges.KeyboardHidden | ConfigChanges.ScreenSize)]
	public class SplashScreen : Activity
	{
		private Handler h;
		private Action startAction;

		protected override void OnResume()
		{
			base.OnResume();
			CheckPermissions();
		}

		public override void OnBackPressed()
		{
			// Prevent the back button from canceling the startup process
		}

		public override void OnRequestPermissionsResult(int requestCode, string[] permissions, Permission[] grantResults)
		{
			base.OnRequestPermissionsResult(requestCode, permissions, grantResults);
			if (grantResults.All(g => g == Permission.Granted))
				h.PostDelayed(startAction, 150);
			else CheckPermissions();
		}

		private void CheckPermissions()
		{
			h = new Handler();
			startAction = () =>
			{
				StartActivity(new Intent(Application.Context, typeof(MainActivity)));
				OverridePendingTransition(Android.Resource.Animation.FadeIn, Android.Resource.Animation.FadeOut);
				Finish();
			};

			object[] attributes = Assembly.GetCallingAssembly().GetCustomAttributes(typeof(UsesPermissionAttribute), false);
			string[] permissions = (from UsesPermissionAttribute attribute in attributes select attribute.Name).ToArray();

			bool ask = false;
			foreach (string permission in permissions)
			{
				Permission result = ContextCompat.CheckSelfPermission(this, permission);
				if (result == Permission.Granted) continue;
				ask = true;
				break;
			}

			if (ask)
			{
				ActivityCompat.RequestPermissions(this, permissions, 0);
			}
			else h.PostDelayed(startAction, 150);
		}
	}
}