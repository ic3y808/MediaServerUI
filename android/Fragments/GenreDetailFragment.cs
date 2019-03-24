using Android.OS;
using Android.Views;
using Android.Widget;
using Alloy.Adapters;
using Alloy.Models;
using Alloy.Services;

namespace Alloy.Fragments
{
	public class GenreDetailFragment : FragmentBase
	{
		private View root_view;
		private ListView listView;
		private GenreDetailAdapter adapter;

		public override View OnCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState)
		{
			base.OnCreateView(inflater, container, savedInstanceState);
			var genre = Arguments.GetParcelable("genre") as Genre;

			root_view = inflater.Inflate(Resource.Layout.genre_detail_layout, container, false);
			listView = root_view.FindViewById<ListView>(Resource.Id.genre_track_list);
			root_view.FindViewById<TextView>(Resource.Id.title).SetText(genre.Title, TextView.BufferType.Normal);
			root_view.FindViewById<ImageView>(Resource.Id.album_art).SetImageBitmap(genre.Art);

			adapter = new GenreDetailAdapter(genre);
			adapter.NotifyDataSetChanged();
			listView.Adapter = adapter;
			listView.ItemClick += MListView_ItemClick;
			RegisterForContextMenu(listView);

			CreateToolbar(root_view, Resource.String.genre_detail_title, true);

			return root_view;
		}

		public override void ScrollToNowPlaying()
		{
			base.ScrollToNowPlaying();
			listView.ClearChoices();
			for (int i = 0; i < adapter.Count; i++)
			{
				var item = adapter[i];
				item.IsSelected = false;
			}

			if (ServiceConnection.CurrentSong != null)
			{
				for (int i = 0; i < adapter.Count; i++)
				{
					var item = adapter[i];
					if (ServiceConnection.CurrentSong.Id.Equals(item.Id))
					{
						item.IsSelected = true;
						//listView.SetItemChecked(i, true);
						break;
					}
				}
			}
			Adapters.Adapters.UpdateAdapters();
			listView.Invalidate();
		}

		public override void PlaybackStatusChanged(StatusEventArg args)
		{
			base.PlaybackStatusChanged(args);
			adapter.NotifyDataSetChanged();
		}

		public override void ServiceConnected()
		{
			base.ServiceConnected();
			Adapters.Adapters.SetAdapters(Activity, adapter);
		}

		public override void ContextMenuCreated(IContextMenu menu, View v, IContextMenuContextMenuInfo menuInfo)
		{
			base.ContextMenuCreated(menu, v, menuInfo);
			if (v.Id == Resource.Id.genre_track_list)
			{
				MenuInflater inflater = Activity.MenuInflater;
				inflater.Inflate(Resource.Menu.song_context_menu, menu);
			}
		}

		private void MListView_ItemClick(object sender, AdapterView.ItemClickEventArgs e)
		{
			if (adapter.GenreTracks[e.Position].IsSelected)
			{

			}
			else ServiceConnection.Play(e.Position, adapter.GenreTracks);
		}
	}
}