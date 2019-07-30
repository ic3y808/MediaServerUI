using System;
using Alloy.Helpers;
using Android.Support.V7.Widget;
using Android.Views;
using Android.Widget;
using Alloy.Models;
using Alloy.Providers;

using Alloy.Services;
using Android.Graphics;

namespace Alloy.Adapters
{
	public class NowPlayingAdapter : RecyclerView.Adapter
	{
		public event EventHandler<NowPlayingViewHolder.NowPlayingViewHolderEvent> ItemClick;
		public BackgroundAudioServiceConnection ServiceConnection { get; }

		public NowPlayingAdapter(BackgroundAudioServiceConnection service)
		{
			ServiceConnection = service;
		}

		public override long GetItemId(int position)
		{
			return position;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			NowPlayingViewHolder h = (NowPlayingViewHolder)holder;
			h.Title.SetText(ServiceConnection.MainQueue[position].Title, TextView.BufferType.Normal);
			h.Artist.SetText(ServiceConnection.MainQueue[position].Artist, TextView.BufferType.Normal);
			//ServiceConnection.MainQueue[position].GetAlbumArt(h.ImageView);
			BackgroundAudioServiceConnection.PlaybackStatusChanged += (o, e) => { h.SetSelected(); };
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			View v = LayoutInflater.From(parent.Context).Inflate(Resource.Layout.now_playing_row, parent, false);
			v.Clickable = true;
			NowPlayingViewHolder holder = new NowPlayingViewHolder(v, OnClick, false);
			return holder;
		}

		public override int ItemCount
		{
			get
			{
				if (ServiceConnection == null || ServiceConnection?.MainQueue == null) return 0;
				return ServiceConnection.MainQueue.Count;
			}
		}

		void OnClick(NowPlayingViewHolder.NowPlayingViewHolderEvent e)
		{
			ItemClick?.Invoke(this, e);
		}

		public class NowPlayingViewHolder : RecyclerView.ViewHolder
		{
			private readonly View view;

			public NowPlayingViewHolder(View v, Action<NowPlayingViewHolderEvent> listener, bool hasScroller) : base(v)
			{
				view = v;
				CardView = v.FindViewById<CardView>(Resource.Id.card_view);
				if (hasScroller)
				{
					ViewGroup.MarginLayoutParams layoutParams = (ViewGroup.MarginLayoutParams)CardView.LayoutParameters;
					layoutParams.SetMargins(0, 0, Utils.DpToPx(5), 0);
					CardView.RequestLayout();
				}
				CardLayout = v.FindViewById<RelativeLayout>(Resource.Id.card_layout);
				Artist = v.FindViewById<TextView>(Resource.Id.artist);
				if (Artist != null) { Artist.Selected = true; }
				Title = v.FindViewById<TextView>(Resource.Id.title);
				if (Title != null) { Title.Selected = true; }

				Duration = v.FindViewById<TextView>(Resource.Id.duration);
				ImageView = v.FindViewById<ImageView>(Resource.Id.album_art);
				starredButton = v.FindViewById<ImageView>(Resource.Id.star_button);
				if (starredButton != null)
				{
					starredButton.Clickable = true;
					starredButton.Click += (sender, e) => { SetFavorite(); };
				}

				v.Click += (sender, e) => listener(new NowPlayingViewHolderEvent { Position = LayoutPosition, NowPlayingViewHolder = this });
				BackgroundAudioServiceConnection.PlaybackStatusChanged += (o, e) => { SetSelected(); };
				v.ClearAnimation();
			}

			public void ClearAnimation()
			{
				view?.ClearAnimation();
			}

			public async void SetSelected()
			{
				if (Song == null) return;

				if (Song.IsSelected)
				{
					Bitmap art = await Song.GetAlbumArt();
					CardLayout?.SetBackgroundColor(art.GetDominateColor().Contrasting(64));
					CardLayout?.SetPadding(20, 20, 20, 20);
				}
				else
				{
					CardLayout.SetBackgroundColor(Color.Transparent);
					CardLayout.SetPadding(0, 0, 0, 0);
				}
			}


			public void SetFavorite()
			{
				if (Song == null) return;
				if (Song.Starred)
				{
					MusicProvider.RemoveStar(Song);
				}
				else
				{
					MusicProvider.AddStar(Song);
				}
				starredButton?.SetImageResource(Song.Starred ? Resource.Drawable.star_g : Resource.Drawable.star_o);
			}

			public CardView CardView { get; set; }
			public RelativeLayout CardLayout { get; set; }
			public ImageView ImageView { get; set; }
			public ImageView starredButton { get; set; }
			public TextView Artist { get; set; }
			public TextView Title { get; set; }
			public TextView Duration { get; set; }
			public EventHandler ClickHandler { get; set; }
			public Song Song { get; set; }

			public class NowPlayingViewHolderEvent
			{
				public int Position { get; set; }
				public NowPlayingViewHolder NowPlayingViewHolder { get; set; }
			}
		}
	}
}