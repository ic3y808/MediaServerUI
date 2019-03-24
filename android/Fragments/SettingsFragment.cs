using Android.OS;
using Android.Preferences;
using Android.Views;
using Object = Java.Lang.Object;

namespace Alloy.Fragments
{
	public class SettingsFragment : PreferenceFragment
	{
		public override void OnCreate(Bundle savedInstanceState)
		{

			base.OnCreate(savedInstanceState);

			AddPreferencesFromResource(Resource.Xml.preferences);


		}

		private PreferenceCategory CreateCategory(int titleRes)
		{
			var cat = new PreferenceCategory(PreferenceScreen.Context) { Title = PreferenceScreen.Context.GetString(titleRes) };
			return cat;
		}

		private EditTextPreference CreateEditText(int titleRes, int dialogTitleRes, int summaryRes, int keyRes)
		{
			EditTextPreference preference = new EditTextPreference(PreferenceScreen.Context);
			preference.Title = PreferenceScreen.Context.GetString(titleRes);
			preference.DialogTitle = PreferenceScreen.Context.GetString(dialogTitleRes);
			preference.Summary = PreferenceScreen.Context.GetString(summaryRes);
			preference.Key = PreferenceScreen.Context.GetString(keyRes);
			return preference;
		}

		private SwitchPreference CreateSwitch(int titleRes, int summaryRes, int keyRes)
		{
			SwitchPreference preference = new SwitchPreference(PreferenceScreen.Context);
			preference.Title = PreferenceScreen.Context.GetString(titleRes);
			preference.Summary = PreferenceScreen.Context.GetString(summaryRes);
			preference.Key = PreferenceScreen.Context.GetString(keyRes);
			return preference;
		}

		

		private ListPreference CreateList(int titleRes, int dialogTitleRes, int summaryRes, int keyRes, string[] entries, string[] entryValues, Object defaultObj)
		{
			ListPreference preference = new ListPreference(PreferenceScreen.Context);
			preference.Title = PreferenceScreen.Context.GetString(titleRes);
			preference.DialogTitle = PreferenceScreen.Context.GetString(dialogTitleRes);
			preference.Summary = PreferenceScreen.Context.GetString(summaryRes);
			preference.Key = PreferenceScreen.Context.GetString(keyRes);
			preference.SetEntries(entries);
			preference.SetEntryValues(entryValues);
			preference.SetDefaultValue(defaultObj);
			return preference;
		}



		public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
		{


			//EditTextPreference soundcloudEmail = (EditTextPreference)PreferenceManager.FindPreference(Application.Context.GetString(Resource.String.setting_soundcloud_email_key));
			//soundcloudEmail.PreferenceChange += (sender, args) =>
			//{
			//	var preferences = PreferenceManager.GetDefaultSharedPreferences(Application.Context);
			//	var encrypted = Crypto.Encrypt(args.NewValue.ToString(), Application.Context.GetString(Resource.String.setting_soundcloud_email_encrypted_key));
			//	preferences.Edit().PutString(Application.Context.GetString(Resource.String.setting_soundcloud_email_encrypted_key), encrypted).Apply();

			//};
			//soundcloudEmail.PreferenceClick += (sender, args) =>
			//{
			//	var preferences = PreferenceManager.GetDefaultSharedPreferences(Application.Context);
			//	var encrypted = preferences.GetString(Application.Context.GetString(Resource.String.setting_soundcloud_email_encrypted_key), "");
			//	if (!string.IsNullOrEmpty(encrypted))
			//	{
			//		var decrypted = Crypto.Decrypt(encrypted, Application.Context.GetString(Resource.String.setting_soundcloud_email_encrypted_key));
			//		soundcloudEmail.EditText.Text = decrypted;
			//	}

			//};

			//EditTextPreference soundcloudPassword = (EditTextPreference)PreferenceManager.FindPreference(Application.Context.GetString(Resource.String.setting_soundcloud_password_key));
			//soundcloudPassword.PreferenceChange += (sender, args) =>
			//{
			//	var preferences = PreferenceManager.GetDefaultSharedPreferences(Application.Context);
			//	var encrypted = Crypto.Encrypt(args.NewValue.ToString(), Application.Context.GetString(Resource.String.setting_soundcloud_password_encrypted_key));
			//	preferences.Edit().PutString(Application.Context.GetString(Resource.String.setting_soundcloud_password_encrypted_key), encrypted).Apply();

			//};
			//soundcloudPassword.PreferenceClick += (sender, args) =>
			//{
			//	var preferences = PreferenceManager.GetDefaultSharedPreferences(Application.Context);
			//	var encrypted = preferences.GetString(Application.Context.GetString(Resource.String.setting_soundcloud_password_encrypted_key), "");
			//	if (!string.IsNullOrEmpty(encrypted))
			//	{
			//		var decrypted = Crypto.Decrypt(encrypted, Application.Context.GetString(Resource.String.setting_soundcloud_password_encrypted_key));
			//		soundcloudEmail.EditText.Text = decrypted;
			//	}
			//};

			//EditTextPreference subsonicUsername = (EditTextPreference)PreferenceManager.FindPreference(Application.Context.GetString(Resource.String.setting_subsonic_username_key));
			//subsonicUsername.PreferenceChange += (sender, args) =>
			//{
			//	var preferences = PreferenceManager.GetDefaultSharedPreferences(Application.Context);
			//	var encrypted = Crypto.Encrypt(args.NewValue.ToString(), Application.Context.GetString(Resource.String.setting_subsonic_username_encrypted_key));
			//	preferences.Edit().PutString(Application.Context.GetString(Resource.String.setting_subsonic_username_encrypted_key), encrypted).Apply();

			//};
			//subsonicUsername.PreferenceClick += (sender, args) =>
			//{
			//	var preferences = PreferenceManager.GetDefaultSharedPreferences(Application.Context);
			//	var encrypted = preferences.GetString(Application.Context.GetString(Resource.String.setting_subsonic_username_encrypted_key), "");
			//	if (!string.IsNullOrEmpty(encrypted))
			//	{
			//		var decrypted = Crypto.Decrypt(encrypted, Application.Context.GetString(Resource.String.setting_subsonic_username_encrypted_key));
			//		soundcloudEmail.EditText.Text = decrypted;
			//	}
			//};

			//EditTextPreference subsonicpassword = (EditTextPreference)PreferenceManager.FindPreference(Application.Context.GetString(Resource.String.setting_subsonic_password_key));
			//subsonicpassword.PreferenceChange += (sender, args) =>
			//{
			//	var preferences = PreferenceManager.GetDefaultSharedPreferences(Application.Context);
			//	var encrypted = Crypto.Encrypt(args.NewValue.ToString(), Application.Context.GetString(Resource.String.setting_subsonic_password_encrypted_key));
			//	preferences.Edit().PutString(Application.Context.GetString(Resource.String.setting_subsonic_password_encrypted_key), encrypted).Apply();

			//};
			//subsonicpassword.PreferenceClick += (sender, args) =>
			//{
			//	var preferences = PreferenceManager.GetDefaultSharedPreferences(Application.Context);
			//	var encrypted = preferences.GetString(Application.Context.GetString(Resource.String.setting_subsonic_password_encrypted_key), "");
			//	if (!string.IsNullOrEmpty(encrypted))
			//	{
			//		var decrypted = Crypto.Decrypt(encrypted, Application.Context.GetString(Resource.String.setting_subsonic_password_encrypted_key));
			//		soundcloudEmail.EditText.Text = decrypted;
			//	}
			//};


			return base.OnCreateView(inflater, container, savedInstanceState);
		}
	}
}