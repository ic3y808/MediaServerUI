using Android.Content;
using Android.OS;
using Android.Views;
using Android.Widget;
using Java.Lang;
using Java.Util;
using Alloy.Models;

namespace Alloy.Adapters
{
	public class MenuAdapter : BaseAdapter
	{


		private Context mContext;

		private ArrayList mItems;


		public MenuAdapter(Context context, ArrayList items)
		{
			mContext = context;
			mItems = items;
		}

		public override Java.Lang.Object GetItem(int position)
		{
			return mItems.Get(position);
		}

		public override long GetItemId(int position)
		{
			return position;
		}

		public override int GetItemViewType(int position)
		{
			if (GetItem(position) is Item) return 0;
			if (GetItem(position) is Category) return 1;
			return 0;
		}

		public override int ViewTypeCount => 2;


		public override bool IsEnabled(int position)
		{
			return GetItem(position) is Item;
		}

		public override bool AreAllItemsEnabled()
		{
			return true;
		}

		public override View GetView(int position, View convertView, ViewGroup parent)
		{
			View v = convertView;
			Object item = GetItem(position);

			if (item is Category category)
			{
				if (v == null) { v = LayoutInflater.From(mContext).Inflate(Resource.Layout.menu_row_category, parent, false); }

				var header = v.FindViewById<TextView>(Resource.Id.category_header);
				header.SetText(category.mTitle, TextView.BufferType.Normal);
			}
			if (item is Divider div)
			{
				if (v == null) { v = LayoutInflater.From(mContext).Inflate(Resource.Layout.menu_row_divider, parent, false); }
			}
			else if (item is Item i)
			{
				if (v == null) { v = LayoutInflater.From(mContext).Inflate(Resource.Layout.menu_row_item, parent, false); }

				TextView tv = (TextView)v;
				tv.SetText(i.mTitle, TextView.BufferType.Normal);
				if (Build.VERSION.SdkInt >= BuildVersionCodes.JellyBeanMr1) { tv.SetCompoundDrawablesRelativeWithIntrinsicBounds(i.mIconRes, 0, 0, 0); }
				else { tv.SetCompoundDrawablesWithIntrinsicBounds(i.mIconRes, 0, 0, 0); }
				i.TextView = tv;

			}

			return v;
		}

		public override int Count => mItems.Size();
	}
}