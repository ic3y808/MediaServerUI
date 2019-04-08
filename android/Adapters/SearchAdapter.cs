using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.Database;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using CursorAdapter = Android.Support.V4.Widget.CursorAdapter;


namespace Alloy.Adapters
{
	public class SearchAdapter : CursorAdapter
	{
		Context context;
		public SearchAdapter(IntPtr javaReference, JniHandleOwnership transfer) : base(javaReference, transfer)
		{
		}

		public SearchAdapter(Context context, ICursor c) : base(context, c)
		{
			this.context = context;
		}

		public override void BindView(View view, Context context, ICursor cursor)
		{
			string type = cursor.GetString(0);
			switch (type)
			{
				case "artist":
					view.FindViewById<LinearLayout>(Resource.Id.artist_result_layout).Visibility = ViewStates.Visible;
					view.FindViewById<TextView>(Resource.Id.artist_name).Text = cursor.GetString(2);
					break;
				case "album":
					view.FindViewById<LinearLayout>(Resource.Id.album_result_layout).Visibility = ViewStates.Visible;
					view.FindViewById<TextView>(Resource.Id.album_name).Text = cursor.GetString(2);
					break;
				case "genre":
					view.FindViewById<LinearLayout>(Resource.Id.genre_result_layout).Visibility = ViewStates.Visible;
					view.FindViewById<TextView>(Resource.Id.genre_name).Text = cursor.GetString(2);
					break;
				case "track":
					view.FindViewById<LinearLayout>(Resource.Id.track_result_layout).Visibility = ViewStates.Visible;
					view.FindViewById<TextView>(Resource.Id.title).Text = cursor.GetString(2);
					view.FindViewById<TextView>(Resource.Id.track_artist).Text = cursor.GetString(2);
					break;
			}
		}

		public override View NewView(Context context, ICursor cursor, ViewGroup parent)
		{
			return LayoutInflater.From(context).Inflate(Resource.Layout.search_row, parent, false);
		}
	}
}