using System.Collections.Generic;
using Android.Gms.Cast;
using Alloy.Models;
namespace Alloy.Interfaces
{
	public abstract class IQueue : List<Song>
	{
		public abstract void GetMoreData();
		public abstract void Refresh();
		public virtual MediaQueueItem[] MediaQueue { get; set; }
		public virtual void ToMediaQueue()
		{
			MediaQueue = new MediaQueueItem[this.Count];
			for (var index = 0; index < this.Count; index++)
			{
				var song = this[index];
				MediaQueue[index] = song.QueueItem();
			}
		}
		public virtual void ToLocalMediaQueue()
		{
			MediaQueue = new MediaQueueItem[this.Count];
			for (var index = 0; index < this.Count; index++)
			{
				var song = this[index];
				MediaQueue[index] = song.LocalQueueItem();
			}
		}
		public virtual void ToRemoteMediaQueue()
		{
			MediaQueue = new MediaQueueItem[this.Count];
			for (var index = 0; index < this.Count; index++)
			{
				var song = this[index];
				MediaQueue[index] = song.RemoteQueueItem();
			}
		}
		public abstract string NextHref { get; set; }
	}

	public abstract class IArtistQueue : List<Artist>
	{
		public abstract void GetMoreData();
		public abstract void Refresh();
		public virtual MediaQueueItem[] MediaQueue { get; set; }
		//public virtual void ToMediaQueue()
		//{
		//	MediaQueue = new MediaQueueItem[this.Count];
		//	for (var index = 0; index < this.Count; index++)
		//	{
		//		var song = this[index];
		//		MediaQueue[index] = song.QueueItem();
		//	}
		//}
		//public virtual void ToLocalMediaQueue()
		//{
		//	MediaQueue = new MediaQueueItem[this.Count];
		//	for (var index = 0; index < this.Count; index++)
		//	{
		//		var song = this[index];
		//		MediaQueue[index] = song.LocalQueueItem();
		//	}
		//}
		//public virtual void ToRemoteMediaQueue()
		//{
		//	MediaQueue = new MediaQueueItem[this.Count];
		//	for (var index = 0; index < this.Count; index++)
		//	{
		//		var song = this[index];
		//		MediaQueue[index] = song.RemoteQueueItem();
		//	}
		//}
		public abstract int NextOffset { get; set; }
	}
}
