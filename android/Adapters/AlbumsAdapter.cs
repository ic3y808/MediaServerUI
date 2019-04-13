using System;
using System.Linq;
using Android.Graphics;
using Android.Views;
using Android.Widget;
using Alloy.Models;
using Alloy.Providers;

using Alloy.Services;
using Alloy.Widgets;
using Android.Support.V7.Widget;
using Java.Util;
using Object = Java.Lang.Object;

namespace Alloy.Adapters
{
	public class AlbumsAdapter : RecyclerView.Adapter, ISectionIndexer, FastScrollRecyclerView.SectionedAdapter
	{
		public event EventHandler<AlbumViewHolder.AlbumViewHolderEvent> ItemClick;
		public BackgroundAudioServiceConnection ServiceConnection { get; }
		private ArrayList sectionPositions;

		public AlbumsAdapter(BackgroundAudioServiceConnection connection)
		{
			ServiceConnection = connection;
			BackgroundAudioServiceConnection.PlaybackStatusChanged += (sender, arg) => { NotifyDataSetChanged(); };
		}

		public override long GetItemId(int position)
		{
			return position;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			AlbumViewHolder h = (AlbumViewHolder)holder;
			if (position >= MusicProvider.Albums.Count) return;
			h.Album = MusicProvider.Albums[position];
			h.name.SetText(MusicProvider.Albums[position].Name, TextView.BufferType.Normal);
			h.SetSelected();
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			View v = LayoutInflater.From(parent.Context).Inflate(Resource.Layout.artist_row, parent, false);
			AlbumViewHolder holder = new AlbumViewHolder(v, OnClick, ServiceConnection);
			return holder;
		}

		public override int ItemCount => MusicProvider.Albums.Count;

		void OnClick(AlbumViewHolder.AlbumViewHolderEvent e)
		{
			if (ItemClick != null)
			{
				ItemClick(this, e);
			}
		}

		public int GetPositionForSection(int sectionIndex)
		{
			return (int)sectionPositions.Get(sectionIndex);
		}

		public int GetSectionForPosition(int position)
		{
			return 0;
		}

		public Object[] GetSections()
		{
			ArrayList sections = new ArrayList(26);
			sectionPositions = new ArrayList(26);
			for (int i = 0, size = MusicProvider.Albums.Count; i < size; i++)
			{
				if (i >= MusicProvider.Albums.Count) return sections.ToArray();
				string section = MusicProvider.Albums[i]?.Name?.Substring(0, 1).ToUpper();
				if (sections.Contains(section)) continue;
				sections.Add(section);
				sectionPositions.Add(i);
			}
			return sections.ToArray();
		}

		public string getSectionName(int position)
		{
			try
			{
				string a = MusicProvider.Albums[position].Name;
				string b = a.Substring(0, 1);
				return b.Any(char.IsLower) ? b.ToUpper() : b;
			}
			catch
			{
				return "";
			}
		}

		public class AlbumViewHolder : RecyclerView.ViewHolder
		{
			public BackgroundAudioServiceConnection serviceConnection;
			public RelativeLayout itemRoot;
			public TextView name;
			public Album Album;

			public AlbumViewHolder(View v, Action<AlbumViewHolderEvent> listener, BackgroundAudioServiceConnection serviceConnection) : base(v)
			{
				itemRoot = v.FindViewById<RelativeLayout>(Resource.Id.item_root);
				name = v.FindViewById<TextView>(Resource.Id.artist);
				this.serviceConnection = serviceConnection;
				v.Click += (sender, e) => listener(new AlbumViewHolderEvent() { Position = LayoutPosition, ViewHolder = this });
				BackgroundAudioServiceConnection.PlaybackStatusChanged += (o, e) => { SetSelected(); };
			}

			public void SetSelected()
			{
				if (Album == null) return;

				bool selected = Album.IsSelected || serviceConnection != null && serviceConnection.CurrentSong != null && serviceConnection.CurrentSong.AlbumId.Equals(Album.Id);

				if (Album.Tracks != null && Album.Tracks.Count != 0)
				{
					foreach (Song albumTrack in Album.Tracks)
					{
						if (albumTrack.IsSelected || serviceConnection != null && serviceConnection.CurrentSong != null && serviceConnection.CurrentSong.Id.Equals(albumTrack.Id)) selected = true;
					}
				}

				if (selected)
				{
					itemRoot.SetBackgroundResource(Resource.Color.menu_selection_color);
				}
				else
				{
					itemRoot.SetBackgroundColor(Color.Transparent);
				}
			}



			public class AlbumViewHolderEvent
			{
				public int Position { get; set; }
				public AlbumViewHolder ViewHolder { get; set; }
			}
		}
	}
}