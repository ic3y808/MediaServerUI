using System;
using System.Globalization;
using System.Linq;
using Android.Views;
using Android.Widget;
using Alloy.Models;
using Alloy.Providers;

using Alloy.Services;
using Alloy.Widgets;
using Android.Graphics;
using Android.Support.V7.Widget;
using Java.Util;
using Object = Java.Lang.Object;

namespace Alloy.Adapters
{
	public class ArtistsAdapter : RecyclerView.Adapter, ISectionIndexer, FastScrollRecyclerView.ISectionedAdapter
	{
		public BackgroundAudioServiceConnection ServiceConnection { get; }
		private ArrayList sectionPositions;

		public ArtistsAdapter(BackgroundAudioServiceConnection connection)
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
			ArtistViewHolder h = (ArtistViewHolder)holder;
			if (position >= MusicProvider.Artists.Count) return;
			h.Artist = MusicProvider.Artists[position];
			h.ArtistName.SetText(MusicProvider.Artists[position].Name, TextView.BufferType.Normal);
			h.SetSelected();
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			View v = LayoutInflater.From(parent.Context).Inflate(Resource.Layout.artist_row, parent, false);
			ArtistViewHolder holder = new ArtistViewHolder(v, OnClick, ServiceConnection);
			return holder;
		}

		public override int ItemCount => MusicProvider.Artists.Count;

		public event EventHandler<ArtistViewHolder.ArtistViewHolderEvent> ItemClick;
		void OnClick(ArtistViewHolder.ArtistViewHolderEvent e)
		{
			ItemClick?.Invoke(this, e);
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
			for (int i = 0, size = MusicProvider.Artists.Count; i < size; i++)
			{
				if (i >= MusicProvider.Artists.Count) return sections.ToArray();
				string section = MusicProvider.Artists[i]?.Name?.Substring(0, 1).ToUpper();
				if (sections.Contains(section)) continue;
				sections.Add(section);
				sectionPositions.Add(i);
			}
			return sections.ToArray();
		}

		public string GetSectionName(int position)
		{
			try
			{
				string a = MusicProvider.Artists[position].Name;
				string b = a.Substring(0, 1);
				return b.Any(char.IsLower) ? b.ToUpper(CultureInfo.InvariantCulture) : b;
			}
			catch
			{
				return "";
			}
		}

		public class ArtistViewHolder : RecyclerView.ViewHolder
		{
			public FrameLayout ItemRoot { get; set; }
			public BackgroundAudioServiceConnection ServiceConnection { get; }

			public ArtistViewHolder(View v, Action<ArtistViewHolderEvent> listener, BackgroundAudioServiceConnection serviceConnection) : base(v)
			{
				ItemRoot = v.FindViewById<FrameLayout>(Resource.Id.item_root);
				ServiceConnection = serviceConnection;
				ArtistName = v.FindViewById<TextView>(Resource.Id.artist);
				if (ArtistName != null) ArtistName.Selected = true;
				v.Click += (sender, e) => listener(new ArtistViewHolderEvent { Position = LayoutPosition, CustomViewHolder = this });
			}

			public class ArtistViewHolderEvent
			{
				public int Position { get; set; }
				public ArtistViewHolder CustomViewHolder { get; set; }
			}

			public void SetSelected()
			{
				if (Artist == null) return;

				bool selected = Artist.IsSelected || ServiceConnection?.CurrentSong != null && ServiceConnection.CurrentSong.ArtistId.Equals(Artist.Id);

				if (selected)
				{
					ItemRoot.SetBackgroundResource(Resource.Color.menu_selection_color);
				}
				else
				{
					ItemRoot.SetBackgroundColor(Color.Transparent);
				}
			}

			public TextView ArtistName { get; set; }
			public EventHandler ClickHandler { get; set; }
			public Artist Artist { get; set; }
		}
	}
}