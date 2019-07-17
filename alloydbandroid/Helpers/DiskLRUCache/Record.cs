
namespace Alloy.Helpers.DiskLRUCache
{
	public class Record
	{

		private string key;
		private string name;
		private long time;
		private long size;

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

		public override bool Equals(object o)
		{
			if (this == o) return true;
			if (o == null || GetType() != o.GetType()) return false;

			Record record = (Record)o;

			if (time != record.time) return false;
			if (size != record.size) return false;
			if (!key.Equals(record.key)) return false;
			return name.Equals(record.name);
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