using System;
using Android.Views;
using Android.Widget;
using Alloy.Models;
using Alloy.Services;
using Android.Content;
using Android.Support.V7.Widget;

namespace Alloy.Adapters
{
	public class AlbumDetailTrackAdapter : Android.Support.V7.Widget.RecyclerView.Adapter
	{
		public Context context;
		public MusicQueue Songs;
		private BackgroundAudioServiceConnection serviceConnection;

		public AlbumDetailTrackAdapter(MusicQueue songs, BackgroundAudioServiceConnection serviceConnection)
		{
			Songs = songs;
			this.serviceConnection = serviceConnection;
		}

		public override long GetItemId(int position)
		{
			return position;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			ViewHolder h = (ViewHolder)holder;
			if (h.configured) return;
			h.Songs = Songs;
			h.image.SetImageBitmap(Songs[position].Art);
			h.name.SetText(Songs[position].Title, TextView.BufferType.Normal);
			h.artist.SetText(Songs[position].Album, TextView.BufferType.Normal);
			h.configured = true;
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			context = parent.Context;
			View view = LayoutInflater.From(context).Inflate(Resource.Layout.album_detail_song_item, parent, false);
			return new ViewHolder(view, OnClick);
		}

		public override int ItemCount => Songs.Count;

		void OnClick(ViewHolder.ViewHolderEvent e)
		{
			ItemClick?.Invoke(this, e);
		}

		public event EventHandler<ViewHolder.ViewHolderEvent> ItemClick;

		public class ViewHolder : RecyclerView.ViewHolder
		{

			public ImageView image;
			public TextView name;
			public TextView artist;
			public MusicQueue Songs;
			public bool configured;

			public ViewHolder(View itemView, Action<ViewHolderEvent> listener) : base(itemView)
			{
				image = itemView.FindViewById<ImageView>(Resource.Id.image_view);
				name = itemView.FindViewById<TextView>(Resource.Id.name);
				artist = itemView.FindViewById<TextView>(Resource.Id.artist);
				itemView.Click += (sender, e) => listener(new ViewHolderEvent() { Position = base.LayoutPosition, Songs = Songs });
			}

			public class ViewHolderEvent
			{
				public int Position { get; set; }
				public MusicQueue Songs { get; set; }
			}
		}
	}
}