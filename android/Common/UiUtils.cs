using Android.Content;
using Android.OS;

namespace Alloy.Common
{
	public class UiUtils
	{
		public static bool IsInteractive(Context context)
		{
			PowerManager pm = (PowerManager)context.GetSystemService("power");
			return pm != null && pm.IsInteractive;
		}
	}
}