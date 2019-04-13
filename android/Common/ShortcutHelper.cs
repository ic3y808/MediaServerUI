using System;
using System.Collections.Generic;

using Android.App;
using Android.Content;
using Android.Content.PM;
using Android.Graphics.Drawables;
using Android.OS;
using Android.Widget;
using Java.Lang;
using Debug = System.Diagnostics.Debug;
using Exception = Java.Lang.Exception;

namespace Alloy.Common
{
	public class ShortcutHelper
	{
		private static readonly string EXTRA_LAST_REFRESH = "com.example.android.shortcutsample.EXTRA_LAST_REFRESH";

		private static readonly long REFRESH_INTERVAL_MS = 60 * 60 * 1000;

		private readonly Context mContext;

		private readonly ShortcutManager mShortcutManager;

		public ShortcutHelper(Context context)
		{
			mContext = context;
			mShortcutManager = mContext.GetSystemService(Class.FromType(typeof(ShortcutManager))) as ShortcutManager;
		}

		public static void showToast(Context context, string message)
		{
			new Handler(Looper.MainLooper).Post(() => { Toast.MakeText(context, message, ToastLength.Short).Show(); });
		}

		public void maybeRestoreAllDynamicShortcuts()
		{
			if (mShortcutManager.DynamicShortcuts.Count == 0)
			{
				// NOTE: If this application is always supposed to have dynamic shortcuts, then publish
				// them here.
				// Note when an application is "restored" on a new device, all dynamic shortcuts
				// will *not* be restored but the pinned shortcuts *will*.
			}
		}

		public void reportShortcutUsed(string id)
		{
			mShortcutManager.ReportShortcutUsed(id);
		}

		/**
		 * Use this when interacting with ShortcutManager to show consistent error messages.
		 */
		private void callShortcutManager(bool r)
		{
			try
			{
				//if (!r.getAsBoolean())
				//{
				//	showToast(mContext, "Call to ShortcutManager is rate-limited");
				//}
			}
			catch (Exception e)
			{
				Debug.WriteLine("Caught Exception " + e);
				showToast(mContext, "Error while calling ShortcutManager: " + e);
			}
		}

		/**
		 * Return all mutable shortcuts from this app self.
		 */
		public List<ShortcutInfo> getShortcuts()
		{
			// Load mutable dynamic shortcuts and pinned shortcuts and put them into a single list
			// removing duplicates.

			List<ShortcutInfo> ret = new List<ShortcutInfo>();
			HashSet<string> seenKeys = new HashSet<string>();

			// Check existing shortcuts shortcuts
			foreach (ShortcutInfo shortcut in mShortcutManager.DynamicShortcuts)
				if (!shortcut.IsImmutable)
				{
					ret.Add(shortcut);
					seenKeys.Add(shortcut.Id);
				}

			foreach (ShortcutInfo shortcut in mShortcutManager.PinnedShortcuts)
				if (!shortcut.IsImmutable && !seenKeys.Contains(shortcut.Id))
				{
					ret.Add(shortcut);
					seenKeys.Add(shortcut.Id);
				}

			return ret;
		}

		public void refreshShortcuts(bool force)
		{
			new ShortcutRefresher(this).Execute(force);
		}

		private ShortcutInfo createShortcut(string id, string shortLabel, string longLabel, Type intentType)
		{
			ShortcutInfo.Builder b = new ShortcutInfo.Builder(mContext, id);

			Intent open = new Intent(Application.Context, typeof(MainActivity));
			open.SetAction(Intent.ActionView);
			open.AddFlags(ActivityFlags.SingleTop);
			open.PutExtra("tab_name", shortLabel);
			b.SetIntent(open);
			b.SetIcon(Icon.CreateWithResource(mContext, Resource.Mipmap.ic_launcher));
			b.SetShortLabel(shortLabel);
			b.SetLongLabel(longLabel);
			setExtras(b, shortLabel);
			return b.Build();
		}

		private void setExtras(ShortcutInfo.Builder b, string name)
		{
			PersistableBundle extras = new PersistableBundle();
			extras.PutString("tab_name", name);
			extras.PutLong(EXTRA_LAST_REFRESH, JavaSystem.CurrentTimeMillis());
			b.SetExtras(extras);
		}


		public void AddShortcut(string id, string shortLabel, string longLabel, Type intentType)
		{
			ShortcutInfo shortcut = createShortcut(id, shortLabel, longLabel, intentType);
			bool var = mShortcutManager.AddDynamicShortcuts(new List<ShortcutInfo> { shortcut });

			callShortcutManager(var);
		}

		public void removeShortcut(ShortcutInfo shortcut)
		{
			mShortcutManager.RemoveDynamicShortcuts(new List<string> { shortcut.Id });
		}

		public void disableShortcut(ShortcutInfo shortcut)
		{
			mShortcutManager.DisableShortcuts(new List<string> { shortcut.Id });
		}

		public void enableShortcut(ShortcutInfo shortcut)
		{
			mShortcutManager.EnableShortcuts(new List<string> { shortcut.Id });
		}

		/**
		 * Called when the activity starts.  Looks for shortcuts that have been pushed and refreshes
		 * them (but the refresh part isn't implemented yet...).
		 */

		public class ShortcutRefresher : AsyncTask<object, object, int>
		{
			private readonly ShortcutHelper shortcutHelper;

			public ShortcutRefresher(ShortcutHelper shortcutHelper)
			{
				this.shortcutHelper = shortcutHelper;
			}

			protected override int RunInBackground(params object[] @params)
			{
				bool force = bool.Parse(@params[0].ToString());

				long now = JavaSystem.CurrentTimeMillis();
				long staleThreshold = force ? now : now - REFRESH_INTERVAL_MS;

				// Check all existing dynamic and pinned shortcut, and if their last refresh
				// time is older than a certain threshold, update them.

				List<ShortcutInfo> updateList = new List<ShortcutInfo>();

				foreach (ShortcutInfo shortcut in shortcutHelper.getShortcuts())
				{
					if (shortcut.IsImmutable) continue;

					PersistableBundle extras = shortcut.Extras;
					if (extras != null && extras.GetLong(EXTRA_LAST_REFRESH) >= staleThreshold) continue;
					Debug.WriteLine("Refreshing shortcut: " + shortcut.Id);

					ShortcutInfo.Builder b = new ShortcutInfo.Builder(shortcutHelper.mContext, shortcut.Id);

					shortcutHelper.setExtras(b, shortcut.ShortLabel);

					updateList.Add(b.Build());
				}

				// Call update.
				if (updateList.Count > 0)
				{
					bool res = shortcutHelper.mShortcutManager.UpdateShortcuts(updateList);
					shortcutHelper.callShortcutManager(res);
				}

				return 0;
			}
		}
	}
}