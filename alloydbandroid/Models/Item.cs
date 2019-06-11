using Android.App;
using Android.Widget;

namespace Alloy.Models
{
	public class Item : Java.Lang.Object
	{
		public int Id { get; set; }
		public string mTitle { get; set; }
		public int mIconRes { get; set; }
		public TextView TextView { get; set; }
		public bool IsDivider { get; set; }
		public bool IsCategory { get; set; }
		public Item(int id, int title, int iconRes)
		{
			Id = id;
			mTitle = Application.Context.GetString(title);
			mIconRes = iconRes;
		}
	}
}