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
	public class GenresAdapter : RecyclerView.Adapter, ISectionIndexer, FastScrollRecyclerView.SectionedAdapter
	{
		
		public BackgroundAudioServiceConnection serviceConnection;
		private ArrayList mSectionPositions;

		public GenresAdapter(BackgroundAudioServiceConnection connection)
		{
			serviceConnection = connection;
		}

		public override long GetItemId(int position)
		{
			return position;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			GenreViewHolder h = (GenreViewHolder)holder;
			if (position >= MusicProvider.Genres.Count) return;
			h.Genre = MusicProvider.Genres[position];
			h.artist.SetText(MusicProvider.Genres[position].Name, TextView.BufferType.Normal);
			if (serviceConnection != null && serviceConnection.IsConnected && serviceConnection.CurrentSong != null && serviceConnection.CurrentSong.GenreId.Equals(h.Genre.Id)) h.Genre.IsSelected = true;
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			View v = LayoutInflater.From(parent.Context).Inflate(Resource.Layout.genre_row, parent, false);
			GenreViewHolder holder = new GenreViewHolder(v, OnClick, true);
			return holder;
		}

		public override int ItemCount => MusicProvider.Genres.Count;

		public event EventHandler<GenreViewHolder.GenreViewHolderEvent> ItemClick;
		void OnClick(GenreViewHolder.GenreViewHolderEvent e)
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
			for (int i = 0, size = MusicProvider.Genres.Count; i < size; i++)
			{
				if (i >= MusicProvider.Genres.Count) return sections.ToArray();
				string section = MusicProvider.Genres[i]?.Name?.Substring(0, 1)?.ToUpper();
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
				string a = MusicProvider.Genres[position].Name;
				string b = a.Substring(0, 1);
				return b.Any(char.IsLower) ? b.ToUpper() : b;
			}
			catch
			{
				return "";
			}
		}

		public class GenreViewHolder : RecyclerView.ViewHolder
		{
			private View view;
			
			public GenreViewHolder(View v, Action<GenreViewHolderEvent> listener, bool hasScroller) : base(v)
			{
				view = v;
				artist = v.FindViewById<TextView>(Resource.Id.genre);
				if (artist != null) artist.Selected = true;
				v.Click += (sender, e) => listener(new GenreViewHolderEvent() { Position = base.LayoutPosition, GenreViewHolder = this });
				v.ClearAnimation();
			}

			public class GenreViewHolderEvent
			{
				public int Position { get; set; }
				public GenreViewHolder GenreViewHolder { get; set; }
			}

			public TextView artist;
			public EventHandler ClickHandler;
			public Genre Genre;
		}
	}
}