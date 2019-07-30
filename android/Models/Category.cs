using Android.App;

namespace Alloy.Models
{
	public class Category : Java.Lang.Object
	{

		public string mTitle { get; set; }

		public Category(int title)
		{
			mTitle = Application.Context.GetString(title);
		}
	}
}