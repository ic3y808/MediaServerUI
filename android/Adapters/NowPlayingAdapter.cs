using System;
using Android.Support.V7.Widget;
using Android.Views;
using Android.Widget;
using Alloy.Models;
using Alloy.Services;

namespace Alloy.Adapters
{
	public class NowPlayingAdapter : RecyclerView.Adapter
	{
		public event EventHandler<NowPlayingViewHolderEvent> ItemClick;
		private BackgroundAudioServiceConnection serviceConnection;
		
		public NowPlayingAdapter(BackgroundAudioServiceConnection service)
		{
			serviceConnection = service;
		}

		public override long GetItemId(int position)
		{
			return position;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			var h = (NowPlayingViewHolder)holder;
			h.title.SetText(serviceConnection.MainQueue[position].Title, TextView.BufferType.Normal);
			h.artist.SetText(serviceConnection.MainQueue[position].Artist, TextView.BufferType.Normal);
			h.imageView.SetImageBitmap(serviceConnection.MainQueue[position].Art);

			BackgroundAudioServiceConnection.PlaybackStatusChanged += (o, e) => { h.SetSelected();};
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			View v = LayoutInflater.From(parent.Context).Inflate(Resource.Layout.now_playing_row, parent, false);
			v.Clickable = true;
			var holder = new NowPlayingViewHolder(v, OnClick, false);
			return holder;
		}

		public override int ItemCount
		{
			get
			{
				if (serviceConnection == null || !serviceConnection.IsConnected || serviceConnection.MainQueue == null) return 0;
				return serviceConnection.MainQueue.Count;
			}
		}

		void OnClick(NowPlayingViewHolderEvent e)
		{
			ItemClick?.Invoke(this, e);
		}
	}
}