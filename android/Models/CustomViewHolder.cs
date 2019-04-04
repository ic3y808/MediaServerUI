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
	public class CustomViewHolder : RecyclerView.ViewHolder
	{
		private View view;
		public int dpToPx(int dp)
		{
			DisplayMetrics displayMetrics = Application.Context.Resources.DisplayMetrics;
			return (int)Math.Round(a: dp * (displayMetrics.Xdpi / (double)DisplayMetricsDensity.Default));
		}
		public CustomViewHolder(View v, Action<CustomViewHolderEvent> listener, bool hasScroller) : base(v)
		{
			view = v;
			//cardView = v.FindViewById<CardView>(Resource.Id.card_view);
			//if (hasScroller)
			//{
			//	ViewGroup.MarginLayoutParams layoutParams = (ViewGroup.MarginLayoutParams)cardView.LayoutParameters;
			//	layoutParams.SetMargins(0, 0, dpToPx(5), 0);
			//	cardView.RequestLayout();
			//}
			//cardLayout = v.FindViewById<RelativeLayout>(Resource.Id.card_layout);
			artist = v.FindViewById<TextView>(Resource.Id.artist);
			if (artist != null) artist.Selected = true;




		
		



			//moveHandle = v.FindViewById<ImageView>(Resource.Id.handle);

			v.Click += (sender, e) => listener(new CustomViewHolderEvent() { Position = base.LayoutPosition, CustomViewHolder = this });

			BackgroundAudioServiceConnection.PlaybackStatusChanged += (o, e) => { SetSelected(); };
			v.ClearAnimation();
		}

		public void ClearAnimation()
		{
			view?.ClearAnimation();
		}

		public void SetSelected()
		{
			if (Artist == null) return;

			if (Artist.IsSelected)
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

		public void PlayArtist()
		{

		}
		
		public TextView artist;
		public EventHandler ClickHandler;
		public Artist Artist;
	}
}