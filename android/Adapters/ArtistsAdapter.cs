using System;
using System.Collections.Generic;
using System.Linq;
using Alloy.Helpers;
using Alloy.Interfaces;
using Android.App;
using Android.Graphics;
using Android.Views;
using Android.Widget;
using Alloy.Models;
using Alloy.Providers;
using Alloy.Services;
using Alloy.Widgets;
using Android.Support.V7.Widget;
using Android.Views.Animations;
using Java.Util;
using Object = Java.Lang.Object;

namespace Alloy.Adapters
{
	public class ArtistsAdapter : RecyclerView.Adapter, ItemTouchHelperAdapter, ISectionIndexer, FastScrollRecyclerView.SectionedAdapter
	{
		public event EventHandler<CustomViewHolderEvent> ItemClick;
		public OnStartDragListener DragStartListener;
		private LayoutInflater layoutInflater;
		public BackgroundAudioServiceConnection serviceConnection;
		private int lastPosition = -1;
		private ArrayList mSectionPositions;

		public ArtistsAdapter(BackgroundAudioServiceConnection connection)
		{
			layoutInflater = LayoutInflater.From(Application.Context);
			serviceConnection = connection;
		}

		public override long GetItemId(int position)
		{
			return position;
		}

		public override void OnBindViewHolder(RecyclerView.ViewHolder holder, int position)
		{
			setAnimation(holder.ItemView, position);

			var h = (CustomViewHolder)holder;
			if (position >= MusicProvider.Artists.Count) return;
			h.Artist = MusicProvider.Artists[position];
			
			h.artist.SetText(MusicProvider.Artists[position].Name, TextView.BufferType.Normal);
			//h.duration.SetText(MusicProvider.Artists[position].Duration.ToTime(), TextView.BufferType.Normal);
			//if (string.IsNullOrEmpty(MusicProvider.Artists[position].Description))
			//	h.comment.Visibility = ViewStates.Gone;
			//else
			//	h.comment.SetText(MusicProvider.Artists[position].Description, TextView.BufferType.Normal);
			//h.likes.Visibility = ViewStates.Gone;
			//h.reposts.Visibility = ViewStates.Gone;


			if (serviceConnection != null && serviceConnection.IsConnected && serviceConnection.CurrentSong != null && serviceConnection.CurrentSong.Id.Equals(h.Artist.Id)) h.Artist.IsSelected = true;

			h.SetSelected();
			//h.moveHandle.SetOnTouchListener(new OnTouchListener(h, DragStartListener));
		}

		public override RecyclerView.ViewHolder OnCreateViewHolder(ViewGroup parent, int viewType)
		{
			View v = LayoutInflater.From(parent.Context).Inflate(Resource.Layout.artist_row, parent, false);
			var holder = new CustomViewHolder(v, OnClick, true);
			return holder;
		}

		public override int ItemCount => MusicProvider.Artists.Count;

		void OnClick(CustomViewHolderEvent e)
		{
			if (ItemClick != null)
			{
				ItemClick(this, e);
			}
		}

		private void setAnimation(View viewToAnimate, int position)
		{
			// If the bound view wasn't previously displayed on screen, it's animated
			if (position > lastPosition)
			{
				Animation animation = AnimationUtils.LoadAnimation(viewToAnimate.Context, Android.Resource.Animation.FadeIn);
				viewToAnimate.StartAnimation(animation);
				lastPosition = position;
			}
		}

		public override void OnViewAttachedToWindow(Java.Lang.Object holder)
		{
			base.OnViewAttachedToWindow(holder);
			var cHolder = (CustomViewHolder)holder;
			cHolder?.SetSelected();
		}

		public override void OnViewDetachedFromWindow(Object holder)
		{
			base.OnViewDetachedFromWindow(holder);
			var cHolder = (CustomViewHolder)holder;
			cHolder?.ClearAnimation();
			cHolder?.SetSelected();
		}

		public bool OnItemMove(int fromPosition, int toPosition)
		{
			MusicProvider.Artists.Move(fromPosition, toPosition);
			NotifyItemMoved(fromPosition, toPosition);
			return true;
		}

		public void OnItemDismiss(int position)
		{
			if (MusicProvider.Artists[position].IsSelected)
			{
				serviceConnection.PlayNextSong();
				MusicProvider.Artists.RemoveAt(position);
			}
			else MusicProvider.Artists.RemoveAt(position);

			NotifyItemRemoved(position);

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
			var sections = new ArrayList(26);
			mSectionPositions = new ArrayList(26);
			for (int i = 0, size = MusicProvider.Artists.Count; i < size; i++)
			{
				if (i >= MusicProvider.Artists.Count) return sections.ToArray();
				string section = MusicProvider.Artists[i]?.Name?.Substring(0, 1)?.ToUpper();
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
				var a = MusicProvider.Artists[position].Name;
				var b = a.Substring(0, 1);
				return b.Any(char.IsLower) ? b.ToUpper() : b;
			}
			catch
			{
				return "";
			}
		}
	}
}