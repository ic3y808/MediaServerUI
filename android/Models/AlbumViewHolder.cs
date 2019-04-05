using System;
using System.Linq;
using Android.App;
using Android.Graphics;
using Android.Support.V7.Widget;
using Android.Util;
using Android.Views;
using Android.Widget;
using Alloy.Helpers;
using Alloy.Providers;
using Alloy.Services;

namespace Alloy.Models
{
	public class AlbumViewHolder : RecyclerView.ViewHolder
	{
		private readonly View view;
		public int dpToPx(int dp)
		{
			DisplayMetrics displayMetrics = Application.Context.Resources.DisplayMetrics;
			return (int)Math.Round(a: dp * (displayMetrics.Xdpi / (double)DisplayMetricsDensity.Default));
		}
		public AlbumViewHolder(View v, Action<AlbumViewHolderEvent> listener, bool hasScroller) : base(v)
		{
			view = v;
			name = v.FindViewById<TextView>(Resource.Id.artist);
			if (name != null) name.Selected = true;

			v.Click += (sender, e) => listener(new AlbumViewHolderEvent() { Position = base.LayoutPosition, ViewHolder = this });

			BackgroundAudioServiceConnection.PlaybackStatusChanged += (o, e) => { SetSelected(); };
			v.ClearAnimation();
		}

		public void ClearAnimation()
		{
			view?.ClearAnimation();
		}

		public void SetSelected()
		{
			if (Album == null) return;

			if (Album.IsSelected)
			{
				//if (Song.Art == null)
				//	Song.Art = Extensions.GetDefaultAlbumArtEfficiently();
				//if (Artist.Art != null)
				//{
				//	cardLayout?.SetBackgroundColor(Artist.Art.GetDominateColor().Contrasting(64));
				//}
				//if (Artist.Art != null)
				//{
				//	cardLayout?.SetBackgroundColor(Artist.Art.GetDominateColor().Contrasting(64));
				//}

				//cardLayout?.SetPadding(20, 20, 20, 20);
			}
			else
			{
				//cardLayout.SetBackgroundColor(Color.Transparent);
				//cardLayout.SetPadding(0, 0, 0, 0);
			}
		}
		
		public TextView name;
		public EventHandler ClickHandler;
		public Album Album;

		public class AlbumViewHolderEvent
		{
			public int Position { get; set; }
			public AlbumViewHolder ViewHolder { get; set; }
		}
	}
}