
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

		public override bool Equals(Object o)
		{
			return Equals((Record) o);
		}

		public override int GetHashCode()
		{
			unchecked
			{
				int hashCode = (key != null ? key.GetHashCode() : 0);
				hashCode = (hashCode * 397) ^ (name != null ? name.GetHashCode() : 0);
				hashCode = (hashCode * 397) ^ time.GetHashCode();
				hashCode = (hashCode * 397) ^ size.GetHashCode();
				return hashCode;
			}
		}

		public bool Equals(Record other)
		{
			if (ReferenceEquals(null, other)) return false;
			if (ReferenceEquals(this, other)) return true;
			return string.Equals(key, other.key) && string.Equals(name, other.name) && time == other.time && size == other.size;
		}
	}
}
