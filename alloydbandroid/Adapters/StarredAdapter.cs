using System;
using Alloy.Helpers;
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
	public class StarredTrackAdapter : RecyclerView.Adapter
	{
		private BackgroundAudioServiceConnection ServiceConnection { get; }

		public StarredTrackAdapter(BackgroundAudioServiceConnection serviceConnection)
		{
			ServiceConnection = serviceConnection;
		}

		public override long GetItemId(int position)
		{
			return position;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			ViewHolder h = (ViewHolder)holder;
			MusicProvider.Starred.Tracks[position].GetAlbumArt(h.Image);
			h.Image.SetImageBitmap(MusicProvider.Starred.Tracks[position].Art);
			
			h.Title.Text = MusicProvider.Starred.Tracks[position].Title;
			h.Album.Text = MusicProvider.Starred.Tracks[position].Album;
			h.Artist.Text = MusicProvider.Starred.Tracks[position].Artist;
			h.SetSelected(position);
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			return new ViewHolder(
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
				if (MusicProvider.Starred == null || MusicProvider.Starred.Tracks == null) return 0;
				return MusicProvider.Starred.Tracks.Count;
			}
		}

		public event EventHandler<TrackViewHolderEvent> TrackClick;

		public class ViewHolder : RecyclerView.ViewHolder, View.IOnClickListener, View.IOnLongClickListener
		{
			public RelativeLayout ItemRoot { get; set; }
			public WaveView Wave { get; set; }
			public ImageView Image { get; set; }
			public TextView Title { get; set; }
			public TextView Artist { get; set; }
			public TextView Album { get; set; }
			private BackgroundAudioServiceConnection ServiceConnection { get; }

			public event EventHandler<TrackViewHolderEvent> ItemClick;

			public ViewHolder(View itemView, EventHandler<TrackViewHolderEvent> itemClick, BackgroundAudioServiceConnection serviceConnection) : base(itemView)
			{

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
				if (MusicProvider.Starred.Tracks == null || MusicProvider.Starred.Tracks.Count == 0 || position < 0 || position >= MusicProvider.Starred.Tracks.Count) return;

				bool selected = MusicProvider.Starred.Tracks[position].IsSelected || ServiceConnection?.CurrentSong != null && ServiceConnection.CurrentSong.Id.Equals(MusicProvider.Starred.Tracks[position].Id);

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
				ItemClick?.Invoke(this, new TrackViewHolderEvent() { Position = AdapterPosition, Songs = MusicProvider.Starred.Tracks });
			}

			public bool OnLongClick(View v)
			{
				return true;
			}
		}
	}
}