using System.Collections.Generic;
using Alloy.Models;
namespace Alloy.Interfaces
{
	public abstract class Queue : List<Song>
	{
		public abstract void GetMoreData();
		public abstract void Refresh();
		public abstract string NextHref { get; set; }
	}
}