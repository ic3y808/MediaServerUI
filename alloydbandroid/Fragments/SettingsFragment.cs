

using Android.OS;
using Android.Preferences;
using Android.Support.V7.Preferences;

namespace Alloy.Fragments
{
	public class SettingsFragment : PreferenceFragmentCompat
	{
		public override void OnCreate(Bundle savedInstanceState)
		{
			base.OnCreate(savedInstanceState);
			
		}

		public override void OnCreatePreferences(Bundle savedInstanceState, string rootKey)
		{
			AddPreferencesFromResource(Resource.Xml.preferences);
		}
	}
}