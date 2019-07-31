using System;
using System.Collections.Generic;
using Alloy.Helpers;
using Alloy.Models;
using Android.Views;
using Android.Widget;
using Alloy.Services;
using Alloy.Widgets;
using Android.Graphics;
using Android.Support.V4.Content;
using Android.Support.V7.Widget;

namespace Alloy.Adapters
{
	public class MaterialRippleAdapter : RecyclerView.Adapter
	{
		public List<Song> Songs { get; set; }
		public List<Album> Albums { get; set; }
		public List<Artist> Artists { get; set; }

		public MaterialRippleAdapter()
		{
			Songs = new List<Song>();
			Albums = new List<Album>();
			Artists = new List<Artist>();
		}

		public override long GetItemId(int position)
		{
			return position;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			MaterialRippleViewHolder h = (MaterialRippleViewHolder)holder;
			if (Songs.Count > 0)
			{
				Songs[position].GetAlbumArt(h.Image);
				h.Image.SetImageBitmap(Songs[position].Art);
				h.Title.Text = Songs[position].Title;
				h.AlbumTitle.Text = Songs[position].Album;
				h.Artist.Text = Songs[position].Artist;
				h.Hyphen.Visibility = ViewStates.Visible;
			}
			if (Albums.Count > 0)
			{
				Albums[position].GetAlbumArt(h.Image);
				h.Image.SetImageBitmap(Albums[position].Art);
				h.Title.Text = Albums[position].Name;
				h.Artist.Text = Albums[position].Artist;
			}
			if (Artists.Count > 0)
			{
				Artists[position].GetAlbumArt(h.Image);
				h.Image.SetImageBitmap(Artists[position].Art);
				h.Title.Text = Artists[position].Name;
			}
			h.SetSelected(position);
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			MaterialRippleViewHolder vh = new MaterialRippleViewHolder(MaterialRippleLayout.on(LayoutInflater.From(parent.Context).Inflate(Resource.Layout.material_ripple_item, parent, false))
				.RippleColor(new Color(ContextCompat.GetColor(parent.Context, Resource.Color.ripple_color)))
				.RippleAlpha(0.2f)
				.RippleHover(true)
				.RippleOverlay(true)
				.create())
			{
				Songs = Songs,
				Albums = Albums,
				Artists = Artists,
			};
			vh.TrackClick += TrackClick;
			vh.AlbumClick += AlbumClick;
			vh.ArtistClick += ArtistClick;
			return vh;
		}

		public override int ItemCount
		{
			get
			{
				if (Songs.Count > 0) return Songs.Count;
				if (Albums.Count > 0) return Albums.Count;
				if (Artists.Count > 0) return Artists.Count;
				return 0;
			}
		}

		public event EventHandler<TrackViewHolderEvent> TrackClick;
		public event EventHandler<AlbumViewHolderEvent> AlbumClick;
		public event EventHandler<ArtistViewHolderEvent> ArtistClick;

		public class MaterialRippleViewHolder : RecyclerView.ViewHolder, View.IOnClickListener, View.IOnLongClickListener
		{
			public RelativeLayout ItemRoot { get; set; }
			public WaveView Wave { get; set; }
			public ImageView Image { get; set; }
			public TextView Title { get; set; }
			public TextView Artist { get; set; }
			public TextView Hyphen { get; set; }
			public TextView AlbumTitle { get; set; }
			public List<Song> Songs { get; set; }
			public List<Album> Albums { get; set; }
			public List<Artist> Artists { get; set; }

			public event EventHandler<TrackViewHolderEvent> TrackClick;
			public event EventHandler<AlbumViewHolderEvent> AlbumClick;
			public event EventHandler<ArtistViewHolderEvent> ArtistClick;

			public MaterialRippleViewHolder(View itemView) : base(itemView)
			{
				ItemRoot = itemView.FindViewById<RelativeLayout>(Resource.Id.item_root);
				Wave = itemView.FindViewById<WaveView>(Resource.Id.wave_view);
				Image = itemView.FindViewById<ImageView>(Resource.Id.image_view);
				Title = itemView.FindViewById<TextView>(Resource.Id.title);
				Hyphen = itemView.FindViewById<TextView>(Resource.Id.hyphen);
				Artist = itemView.FindViewById<TextView>(Resource.Id.artist);
				AlbumTitle = itemView.FindViewById<TextView>(Resource.Id.album);
				AlbumTitle.Typeface = Typeface.Create(AlbumTitle.Typeface, TypefaceStyle.Italic);
				BackgroundAudioServiceConnection.PlaybackStatusChanged += (o, e) => { SetSelected(LayoutPosition); };
				ItemView.LayoutParameters = (new RecyclerView.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.WrapContent));
				itemView.SetOnClickListener(this);
				itemView.SetOnLongClickListener(this);
				Hyphen.Visibility = ViewStates.Gone;
				Wave.Visibility = ViewStates.Gone;
				Wave.setProgress(0);
			}

			//TODO fix selected background

			public void SetSelected(int position)
			{
				if (Songs == null || Songs.Count == 0 || position < 0 || position >= Songs.Count) return;

				//bool selected = Songs[position].IsSelected || ServiceConnection?.CurrentSong != null && ServiceConnection.CurrentSong.Id.Equals(Songs[position].Id);

				//if (selected)
				//{
				//	ItemRoot.SetBackgroundResource(Resource.Color.menu_selection_color);
				//	SetWave(false);
				//}
				//else
				//{
				//	SetWave(false);
				//	ItemRoot.SetBackgroundColor(Color.Transparent);
				//}
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
				TrackClick?.Invoke(this, new TrackViewHolderEvent() { Position = AdapterPosition, Songs = Songs });
				AlbumClick?.Invoke(this, new AlbumViewHolderEvent() { Position = AdapterPosition, Albums = Albums });
				ArtistClick?.Invoke(this, new ArtistViewHolderEvent() { Position = AdapterPosition, Artists = Artists });
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

		public class AlbumViewHolderEvent
		{
			public int Position { get; set; }
			public List<Album> Albums { get; set; }
		}

		public class ArtistViewHolderEvent
		{
			public int Position { get; set; }
			public List<Artist> Artists { get; set; }
		}
	}
}