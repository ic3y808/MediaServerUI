using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Android.App;
using Android.Content;
using Android.Content.PM;
using Android.Graphics.Drawables;
using Android.OS;
using Android.Support.V4.App;
using Android.Support.V4.Content;
using Java.Lang;
//using Alloy.Common;
//using Alloy.Fragments;



namespace Alloy
{
	
	[Activity(Label = "Alloy", Theme = "@style/AppTheme.Splash", MainLauncher = true, NoHistory = true, ConfigurationChanges = ConfigChanges.Orientation | ConfigChanges.KeyboardHidden | ConfigChanges.ScreenSize)]
	public class SplashScreen : Activity
	{
		private Handler h;
		private Action startAction;
		public const string PREFS_NAME = "PREFS_NAME";
		public const string PREF_KEY_SHORTCUT_ADDED = "PREF_KEY_SHORTCUT_ADDED";

		protected override void OnResume()
		{
			base.OnResume();
			CheckPermissions();
			//ResetShortcut();
			//CheckShortcut();
			CheckDynamicShortcuts();

			//ShortcutHelper mHelper = new ShortcutHelper(this);

			//mHelper.maybeRestoreAllDynamicShortcuts();
			////TODO fix dynamic shortcuts
			//mHelper.AddShortcut("AllMusic", "All Music", "All Music");
			//mHelper.AddShortcut("Favorites", "Favorites", "Favorites");
			//mHelper.AddShortcut("Artists", "Artists", "Artists");
			//mHelper.refreshShortcuts(true);
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

		private void CheckShortcut()
		{
			ISharedPreferences sharedPreferences = GetPreferences(FileCreationMode.Private);
			bool shortCutWasAlreadyAdded = sharedPreferences.GetBoolean(PREF_KEY_SHORTCUT_ADDED, false);
			if (shortCutWasAlreadyAdded) return;

			ShortcutManager shortcutManager = GetSystemService(Class.FromType(typeof(ShortcutManager))) as ShortcutManager;

			Intent i = new Intent(Application.Context, typeof(MainActivity));
			i.SetAction(Intent.ActionView);
			PendingIntent reOpenApp = PendingIntent.GetActivity(Application.Context, 0, i, PendingIntentFlags.UpdateCurrent);

			ShortcutInfo pinShortcutInfo =
				new ShortcutInfo.Builder(Application.Context, "alloyShortcut")
					.SetIcon(Icon.CreateWithResource(Application.Context, Resource.Mipmap.ic_launcher))
					.SetShortLabel(Application.Context.GetString(Resource.String.app_name))
					.SetIntent(i)
					.Build();



			shortcutManager?.RequestPinShortcut(pinShortcutInfo, reOpenApp.IntentSender);

			ISharedPreferencesEditor editor = sharedPreferences.Edit();
			editor.PutBoolean(PREF_KEY_SHORTCUT_ADDED, true);
			editor.Commit();
		}

		private void CheckDynamicShortcuts()
		{
			ShortcutManager shortcutManager = GetSystemService(Class.FromType(typeof(ShortcutManager))) as ShortcutManager;
			Intent i = new Intent(Application.Context, typeof(MainActivity));
			i.SetAction(Intent.ActionView);
			
			ShortcutInfo dynamicShortcut = new ShortcutInfo.Builder(Application.Context, "alloyShortcut1")
				.SetShortLabel("Dynamic1")
				.SetLongLabel("Open dynamic shortcut")
				.SetIcon(Icon.CreateWithResource(this, Resource.Mipmap.ic_launcher))
				.SetIntent(i)
				.Build();

			ShortcutInfo dynamicShortcut2 = new ShortcutInfo.Builder(Application.Context, "alloyShortcut2")
				.SetShortLabel("Dynamic2")
				.SetLongLabel("Open dynamic shortcut")
				.SetIcon(Icon.CreateWithResource(this, Resource.Mipmap.ic_launcher))
				.SetIntent(i)
				.Build();

			shortcutManager?.UpdateShortcuts(new List<ShortcutInfo> { dynamicShortcut, dynamicShortcut2 });


		}

		private void ResetShortcut()
		{
			ISharedPreferences sharedPreferences = GetPreferences(FileCreationMode.Private);
			ISharedPreferencesEditor editor = sharedPreferences.Edit();
			editor.PutBoolean(PREF_KEY_SHORTCUT_ADDED, false);
			editor.Commit();
		}
	}
}