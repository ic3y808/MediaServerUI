using System;
using System.Collections.Generic;
using Alloy.Helpers;
using Alloy.Models;
using Android.Views;
using Android.Widget;
using Alloy.Providers;
using Alloy.Services;
using Alloy.Widgets;
using Android.Graphics;
using Android.Support.V4.Content;
using Android.Support.V7.Widget;

namespace Alloy.Adapters
{
	public class MaterialRippleTrackAdapter : RecyclerView.Adapter
	{
		private BackgroundAudioServiceConnection ServiceConnection { get; }
		public List<Song> Songs { get; set; }

		public MaterialRippleTrackAdapter(BackgroundAudioServiceConnection serviceConnection)
		{
			Songs = new List<Song>();
			ServiceConnection = serviceConnection;
		}

		public override long GetItemId(int position)
		{
			return position;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			MaterialRippleTrackViewHolder h = (MaterialRippleTrackViewHolder)holder;
			Songs[position].GetAlbumArt(h.Image);
			h.Image.SetImageBitmap(Songs[position].Art);

			h.Title.Text = Songs[position].Title;
			h.Album.Text = Songs[position].Album;
			h.Artist.Text = Songs[position].Artist;
			h.SetSelected(position);
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			return new MaterialRippleTrackViewHolder(Songs,
				MaterialRippleLayout.on(LayoutInflater.From(parent.Context).Inflate(Resource.Layout.starred_song_item, parent, false))
					.RippleColor(new Color(ContextCompat.GetColor(parent.Context, Resource.Color.ripple_color)))
					.RippleAlpha(0.2f)
					.RippleHover(true)
					.RippleOverlay(true)
					.create(), TrackClick, ServiceConnection);
		}

		public override int ItemCount
		{
			get
			{
				if (MusicProvider.Starred == null || Songs == null) return 0;
				return Songs.Count;
			}
		}

		public event EventHandler<TrackViewHolderEvent> TrackClick;

		public class MaterialRippleTrackViewHolder : RecyclerView.ViewHolder, View.IOnClickListener, View.IOnLongClickListener
		{
			public RelativeLayout ItemRoot { get; set; }
			public WaveView Wave { get; set; }
			public ImageView Image { get; set; }
			public TextView Title { get; set; }
			public TextView Artist { get; set; }
			public TextView Album { get; set; }
			public List<Song> Songs { get; set; }
			private BackgroundAudioServiceConnection ServiceConnection { get; }

			public event EventHandler<TrackViewHolderEvent> ItemClick;

			public MaterialRippleTrackViewHolder(List<Song> songs, View itemView, EventHandler<TrackViewHolderEvent> itemClick, BackgroundAudioServiceConnection serviceConnection) : base(itemView)
			{
				Songs = songs;
				ItemRoot = itemView.FindViewById<RelativeLayout>(Resource.Id.item_root);
				Wave = itemView.FindViewById<WaveView>(Resource.Id.wave_view);
				Image = itemView.FindViewById<ImageView>(Resource.Id.image_view);
				Title = itemView.FindViewById<TextView>(Resource.Id.title);
				Artist = itemView.FindViewById<TextView>(Resource.Id.artist);
				Album = itemView.FindViewById<TextView>(Resource.Id.album);
				Album.Typeface = Typeface.Create(Album.Typeface, TypefaceStyle.Italic);
				ServiceConnection = serviceConnection;
				BackgroundAudioServiceConnection.PlaybackStatusChanged += (o, e) => { SetSelected(LayoutPosition); };
				ItemView.LayoutParameters = (new RecyclerView.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.WrapContent));
				itemView.SetOnClickListener(this);
				itemView.SetOnLongClickListener(this);
				ItemClick = itemClick;
				Wave.Visibility = ViewStates.Gone;
				Wave.setProgress(0);

			}

			public void SetSelected(int position)
			{
				if (Songs == null || Songs.Count == 0 || position < 0 || position >= Songs.Count) return;

				bool selected = Songs[position].IsSelected || ServiceConnection?.CurrentSong != null && ServiceConnection.CurrentSong.Id.Equals(Songs[position].Id);

				if (selected)
				{
					ItemRoot.SetBackgroundResource(Resource.Color.menu_selection_color);
					SetWave(false);
				}
				else
				{
					SetWave(false);
					ItemRoot.SetBackgroundColor(Color.Transparent);
				}
			}

			public void SetWave(bool on)
			{
				if (on)
				{
					Wave.Visibility = ViewStates.Visible;
					Wave.setProgress(50);
				}
				else
				{
					Wave.Visibility = ViewStates.Gone;
					Wave.setProgress(0);
				}
			}

			public void OnClick(View v)
			{
				SetWave(true);
				ItemClick?.Invoke(this, new TrackViewHolderEvent() { Position = AdapterPosition, Songs = Songs });
			}

			public bool OnLongClick(View v)
			{
				return true;
			}
		}

		public class TrackViewHolderEvent
		{
			public int Position { get; set; }
			public List<Song> Songs { get; set; }
		}
	}
}