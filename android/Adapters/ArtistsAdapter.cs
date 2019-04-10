using System;
using System.Linq;
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
	public class ArtistsAdapter : RecyclerView.Adapter, ISectionIndexer, FastScrollRecyclerView.SectionedAdapter
	{
		public BackgroundAudioServiceConnection serviceConnection;
		private ArrayList mSectionPositions;

		public ArtistsAdapter(BackgroundAudioServiceConnection connection)
		{
			serviceConnection = connection;
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
			h.artist.SetText(MusicProvider.Artists[position].Name, TextView.BufferType.Normal);
			if (serviceConnection != null && serviceConnection.IsConnected && serviceConnection.CurrentSong != null && serviceConnection.CurrentSong.Id.Equals(h.Artist.Id)) h.Artist.IsSelected = true;
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			View v = LayoutInflater.From(parent.Context).Inflate(Resource.Layout.artist_row, parent, false);
			ArtistViewHolder holder = new ArtistViewHolder(v, OnClick, true);
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
			return (int)mSectionPositions.Get(sectionIndex);
		}

		public int GetSectionForPosition(int position)
		{
			return 0;
		}

		public Object[] GetSections()
		{
			ArrayList sections = new ArrayList(26);
			mSectionPositions = new ArrayList(26);
			for (int i = 0, size = MusicProvider.Artists.Count; i < size; i++)
			{
				if (i >= MusicProvider.Artists.Count) return sections.ToArray();
				string section = MusicProvider.Artists[i]?.Name?.Substring(0, 1)?.ToUpper();
				if (!sections.Contains(section))
				{
					sections.Add(section);
					mSectionPositions.Add(i);
				}
			}
			return sections.ToArray();
		}

		public string getSectionName(int position)
		{
			try
			{
				string a = MusicProvider.Artists[position].Name;
				string b = a.Substring(0, 1);
				return b.Any(char.IsLower) ? b.ToUpper() : b;
			}
			catch
			{
				return "";
			}
		}

		public class ArtistViewHolder : RecyclerView.ViewHolder
		{
			public ArtistViewHolder(View v, Action<ArtistViewHolderEvent> listener, bool hasScroller) : base(v)
			{
				artist = v.FindViewById<TextView>(Resource.Id.artist);
				if (artist != null) artist.Selected = true;
				v.Click += (sender, e) => listener(new ArtistViewHolderEvent() { Position = base.LayoutPosition, CustomViewHolder = this });
			}

			public class ArtistViewHolderEvent
			{
				public int Position { get; set; }
				public ArtistViewHolder CustomViewHolder { get; set; }
			}

			public TextView artist;
			public EventHandler ClickHandler;
			public Artist Artist;
		}
	}
}