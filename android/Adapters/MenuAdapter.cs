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


		private readonly Context Context;

		private readonly ArrayList Items;


		public MenuAdapter(Context context, ArrayList items)
		{
			Context = context;
			Items = items;
		}

		public override Java.Lang.Object GetItem(int position)
		{
			return Items.Get(position);
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

			switch (item)
			{
				case Category category:
					if (v == null) { v = LayoutInflater.From(Context).Inflate(Resource.Layout.menu_row_category, parent, false); }

					TextView header = v.FindViewById<TextView>(Resource.Id.category_header);
					header.SetText(category.mTitle, TextView.BufferType.Normal);
					break;
				case Divider _:
					if (v == null) { v = LayoutInflater.From(Context).Inflate(Resource.Layout.menu_row_divider, parent, false); }

					break;
				case Item i:
					if (v == null) { v = LayoutInflater.From(Context).Inflate(Resource.Layout.menu_row_item, parent, false); }

					TextView tv = (TextView)v;
					tv.SetText(i.mTitle, TextView.BufferType.Normal);
					if (Build.VERSION.SdkInt >= BuildVersionCodes.JellyBeanMr1) { tv.SetCompoundDrawablesRelativeWithIntrinsicBounds(i.mIconRes, 0, 0, 0); }
					else { tv.SetCompoundDrawablesWithIntrinsicBounds(i.mIconRes, 0, 0, 0); }
					i.TextView = tv;
					break;
			}

			return v;
		}

		public override int Count => Items.Size();
	}
}