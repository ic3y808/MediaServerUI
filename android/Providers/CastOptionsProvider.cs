using System.Collections.Generic;
using Android.App;
using Android.Content;
using Android.Gms.Cast.Framework;
using Android.Runtime;

namespace Alloy.Providers
{
	[Register("alloy.providers.CastOptionsProvider")]
	public class CastOptionsProvider : Java.Lang.Object, IOptionsProvider
	{
		public static string CUSTOM_NAMESPACE = "urn:x-cast:custom_namespace";

		public IList<SessionProvider> GetAdditionalSessionProviders(Context appContext)
		{
			return null;
		}

		public CastOptions GetCastOptions(Context appContext)
		{
			//NotificationOptions notificationOptions = new NotificationOptions.Builder()
			//	.SetActions(new List<string>{MediaIntentReceiver.ActionSkipNext,
			//		MediaIntentReceiver.ActionTogglePlayback,
			//		MediaIntentReceiver.ActionStopCasting}, new int[] { 1, 2 })
			//	.SetTargetActivityClassName(ExpandedControlsActivity.class.getName())
			//	.Build();
			//CastMediaOptions mediaOptions = new CastMediaOptions.Builder()
			//	.SetImagePicker(new ImagePicker())
			//	//.SetNotificationOptions(notificationOptions)
			//	//.SetExpandedControllerActivityClassName(ExpandedControlsActivity.class.getName())
			//	.Build();

			CastOptions castOptions = new CastOptions.Builder()
				.SetResumeSavedSession(true)
				.SetEnableReconnectionService(true)
				//.SetSupportedNamespaces(new List<string> { CUSTOM_NAMESPACE })
				.SetReceiverApplicationId(Application.Context.GetString(Resource.String.cast_app_id))
				.Build();


			return castOptions;
		}
	}
}