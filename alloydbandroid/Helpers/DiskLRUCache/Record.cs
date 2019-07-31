
using System;

namespace Alloy.Helpers.DiskLRUCache
{
	public class Record : IEquatable<Record>
	{

		private readonly string key;
		private readonly string name;
		private readonly long time;
		private readonly long size;

		public Record(Record record, long time) : this(record.key, record.name, time, record.size)
		{
		}

		public Record(string key, string name, long time, long size)
		{
			this.key = key;
			this.name = name;
			this.time = time;
			this.size = size;
		}

		public string getKey()
		{
			return key;
		}

		public string getName()
		{
			return name;
		}

		public long getTime()
		{
			return time;
		}

		public long getSize()
		{
			return size;
		}

		public bool Equals(Record o)
		{
			if (this == o) return true;
			if (o == null || GetType() != o.GetType()) return false;
			if (time != o.time) return false;
			if (size != o.size) return false;
			if (!key.Equals(o.key)) return false;
			return name.Equals(o.name);
		}

		public override int GetHashCode()
		{
			int result = key.GetHashCode();
			result = 31 * result + name.GetHashCode();
			result = 31 * result + (int)(time ^ (int)((uint)time >> 32));
			result = 31 * result + (int)(size ^ (int)((uint)time >> 32));
			return result;
		}
	}
}
