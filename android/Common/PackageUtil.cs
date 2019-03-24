using Android.Content;
using Android.Content.PM;
using Java.Lang;

namespace Alloy.Common
{
	public class PackageUtil
	{
		public static void SetPackageDoNotKill(Class clsComponent, Context context, bool enabled)
		{
			context.PackageManager.SetComponentEnabledSetting(new ComponentName(context, clsComponent), enabled ? ComponentEnabledState.Enabled : ComponentEnabledState.Disabled, ComponentEnableOption.DontKillApp);
		}
	}
}