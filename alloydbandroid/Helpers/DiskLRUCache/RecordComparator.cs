using System.Collections.Generic;

namespace Alloy.Helpers.DiskLRUCache
{
	public class RecordComparator : Java.Lang.Object, IComparer<Record>
	{
		public int Compare(Record x, Record y)
		{
			int t = x.getTime() == y.getTime() ? 0 : 1;
			return x.getTime() < y.getTime() ? -1 : t;
		}
	}
}