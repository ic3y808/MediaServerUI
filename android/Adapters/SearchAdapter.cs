

using Android.Content;
using Android.Database;
using Android.Views;
using Android.Widget;
using CursorAdapter = Android.Support.V4.Widget.CursorAdapter;


namespace Alloy.Adapters
{
	public class SearchAdapter : CursorAdapter
	{
		public override void BindView(View view, Context context, ICursor cursor)
		{
			string configured = view.FindViewById<TextView>(Resource.Id.view_configured).Text;

			if (string.IsNullOrEmpty(configured))
			{
				string type = cursor.GetString(1);

				switch (type)
				{
					case "seperator":
						view.FindViewById<LinearLayout>(Resource.Id.seperator).Visibility = ViewStates.Visible;
						view.FindViewById<TextView>(Resource.Id.seperator_title).Text = cursor.GetString(2);
						break;
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
				view.FindViewById<TextView>(Resource.Id.view_configured).Text = "configured";
			}
		}

		public override View NewView(Context context, ICursor cursor, ViewGroup parent)
		{
			return LayoutInflater.From(context).Inflate(Resource.Layout.search_row, parent, false);
		}

		public SearchAdapter(Context context, ICursor c) : base(context, c)
		{
		}
	}
}