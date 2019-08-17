

using Android.Graphics;
using Android.Graphics.Drawables;
using Android.OS;
using Android.Support.V4.Content;
using Android.Support.V7.Preferences;
using Android.Views;

namespace Alloy.Fragments
{
	public class SettingsFragment : PreferenceFragmentCompat
	{
		public override void OnViewCreated(View view, Bundle savedInstanceState)
		{
			base.OnViewCreated(view, savedInstanceState);

			view.Background = new ColorDrawable(new Color(ContextCompat.GetColor(Context, Resource.Color.playback_control_background)));
			
		}

		public override void OnCreatePreferences(Bundle savedInstanceState, string rootKey)
		{
			AddPreferencesFromResource(Resource.Xml.preferences);
		}
	}
}