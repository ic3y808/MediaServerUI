using System;
using System.Linq;
using Alloy.Helpers;
using Alloy.Providers;
using Alloy.Services;
using Android.App;
using Android.Graphics;
using Android.Support.V7.Widget;
using Android.Util;
using Android.Views;
using Android.Widget;

namespace Alloy.Models
{
	public class NowPlayingViewHolder : RecyclerView.ViewHolder
	{
		private View view;
		public int dpToPx(int dp)
		{
			DisplayMetrics displayMetrics = Application.Context.Resources.DisplayMetrics;
			return (int)Math.Round(a: dp * (displayMetrics.Xdpi / (double)DisplayMetricsDensity.Default));
		}
		public NowPlayingViewHolder(View v, Action<NowPlayingViewHolderEvent> listener, bool hasScroller) : base(v)
		{
			view = v;
			cardView = v.FindViewById<CardView>(Resource.Id.card_view);
			if (hasScroller)
			{
				ViewGroup.MarginLayoutParams layoutParams = (ViewGroup.MarginLayoutParams)cardView.LayoutParameters;
				layoutParams.SetMargins(0, 0, dpToPx(5), 0);
				cardView.RequestLayout();
			}
			cardLayout = v.FindViewById<RelativeLayout>(Resource.Id.card_layout);
			artist = v.FindViewById<TextView>(Resource.Id.artist);
			if (artist != null) artist.Selected = true;
			title = v.FindViewById<TextView>(Resource.Id.title);
			if (title != null) title.Selected = true;
			
			duration = v.FindViewById<TextView>(Resource.Id.duration);

			imageView = v.FindViewById<ImageView>(Resource.Id.album_art);
			favoriteButton = v.FindViewById<ImageView>(Resource.Id.favorite_button);
			if (favoriteButton != null)
			{
				favoriteButton.Clickable = true;
				favoriteButton.Click += (sender, e) => { SetFavorite(true); };
			}

			//moveHandle = v.FindViewById<ImageView>(Resource.Id.handle);

			v.Click += (sender, e) => listener(new NowPlayingViewHolderEvent() { Position = base.LayoutPosition, NowPlayingViewHolder = this });

			BackgroundAudioServiceConnection.PlaybackStatusChanged += (o, e) => { SetSelected(); };
			v.ClearAnimation();
		}

		public void ClearAnimation()
		{
			view?.ClearAnimation();
		}

		public void SetSelected()
		{
			if (Song == null) return;

			if (Song.IsSelected)
			{
				//if (Song.Art == null)
				//	Song.Art = Extensions.GetDefaultAlbumArtEfficiently();
				if (Song.Art == null) return;
				cardLayout?.SetBackgroundColor(Song.Art.GetDominateColor().Contrasting(64));
				cardLayout?.SetPadding(20, 20, 20, 20);
			}
			else
			{
				cardLayout.SetBackgroundColor(Color.Transparent);
				cardLayout.SetPadding(0, 0, 0, 0);
			}
		}

		public void SetFavorite(bool update_db = false)
		{
			//if (Song == null) return;
			//Utils.Run(() =>
			//{
			//	if (update_db)
			//	{
			//		if (Song.IsFavorite == null) Song.IsFavorite = false;
			//		if (Song.IsFavorite != null)
			//		{
			//			Song.IsFavorite = !Song.IsFavorite;
			//			DatabaseProvider.SetSongFavorite(Song, Song.IsFavorite.Value);
			//			if (Song.IsFavorite.Value && !MusicProvider.Favorites.Any(t => t.Id.Equals(Song.Id))) MusicProvider.Favorites.Insert(0, Song);
			//			if (Song.IsSoundcloudTrack)
			//			{
			//				if (Song.IsFavorite.Value)
			//				{
			//					SoundcloudProvider.AddTrackToFavorites(Song.SCId);
			//					SoundcloudProvider.FollowUser(Song.UserId);
			//					Utils.Run(() =>
			//					{
			//						SoundcloudProvider.Download(Song, () =>
			//						{
			//							if (!MusicProvider.AllSongs.Any(t => t.Id.Equals(Song.Id))) MusicProvider.AllSongs.Add(Song);
			//							if (Song.IsFavorite != null && Song.IsFavorite.Value && !MusicProvider.Favorites.Any(t => t.Id.Equals(Song.Id))) MusicProvider.Favorites.Add(Song);
			//						});
			//					});
			//				}
			//				else
			//				{
			//					SoundcloudProvider.RemoveTrackFromFavorites(Song.SCId);
			//					SoundcloudProvider.RemoveFollowedUser(Song.UserId);
			//				}
			//			}
			//		}

			//	}

			//	if (Song.IsFavorite != null && Song.IsFavorite.Value)
			//		favoriteButton?.SetImageResource(Resource.Drawable.favorite);
			//	else
			//		favoriteButton?.SetImageResource(Resource.Drawable.not_favorite);
			//});

		}



		public CardView cardView;
		public RelativeLayout cardLayout;
		public ImageView imageView;
		//public ImageView moveHandle;
		public ImageView favoriteButton;
		public TextView artist;
		public TextView title;
		public TextView duration;

		public EventHandler ClickHandler;
		public Song Song;
	}
}