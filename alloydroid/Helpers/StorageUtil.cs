using System.Collections.Generic;
using Android.Content;
using Android.Provider;
using Newtonsoft.Json;

namespace Alloy.Helpers
{
	public class StorageUtil
	{
		private readonly string STORAGE = " com.d3bug.alloy.STORAGE";

		private readonly Context context;

		public StorageUtil(Context context)
		{
			this.context = context;
		}

		public void storeAudio(List<MediaStore.Audio> arrayList)
		{
			ISharedPreferences preferences = context.GetSharedPreferences(STORAGE, FileCreationMode.Private);

			ISharedPreferencesEditor editor = preferences.Edit();

			editor.PutString("audioArrayList", JsonConvert.SerializeObject(arrayList));
			editor.Apply();
		}

		public List<MediaStore.Audio> loadAudio()
		{
			ISharedPreferences preferences = context.GetSharedPreferences(STORAGE, FileCreationMode.Private);

			string json = preferences.GetString("audioArrayList", null);

			return JsonConvert.DeserializeObject<List<MediaStore.Audio>>(json);
		}

		public void storeAudioIndex(int index)
		{
			ISharedPreferences preferences = context.GetSharedPreferences(STORAGE, FileCreationMode.Private);
			ISharedPreferencesEditor editor = preferences.Edit();
			editor.PutInt("audioIndex", index);
			editor.Apply();
		}

		public int loadAudioIndex()
		{
			ISharedPreferences preferences = context.GetSharedPreferences(STORAGE, FileCreationMode.Private);
			return preferences.GetInt("audioIndex", -1);//return -1 if no data found
		}

		public void clearCachedAudioPlaylist()
		{
			ISharedPreferences preferences = context.GetSharedPreferences(STORAGE, FileCreationMode.Private);
			ISharedPreferencesEditor editor = preferences.Edit();
			editor.Clear();
			editor.Commit();
		}
	}
}