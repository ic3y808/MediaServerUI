using System.Collections.Generic;
using System.IO;
using System.Linq;
using Java.IO;
using Java.Lang;
using Microsoft.AppCenter.Crashes;
using File = Java.IO.File;
using IOException = Java.IO.IOException;

namespace Alloy.Helpers.DiskLRUCache
{
	class Journal
	{
		private readonly File file;
		private readonly FileManager fileManager;
		private readonly Dictionary<string, Record> map = new Dictionary<string, Record>();
		private long totalSize;

		private Journal(File file, FileManager fileManager)
		{
			this.file = file;
			this.fileManager = fileManager;
		}

		public void put(Record record, long cacheSize)
		{
			long fileSize = record.getSize();
			prepare(fileSize, cacheSize);
			put(record);
		}

		private void put(Record record)
		{
			map[record.getKey()] = record;
			totalSize += record.getSize();
		}

		public Record get(string key)
		{
			map.TryGetValue(key, out Record record);
			if (record != null)
			{
				updateTime(record);
			}
			return record;
		}

		public Record delete(string key)
		{
			map.TryGetValue(key, out Record record);
			if (record != null)
			{
				map.Remove(key);
				totalSize -= record.getSize();
			}
			return record;
		}

		public List<string> keySet()
		{
			return map.Keys.ToList();
		}

		private void updateTime(Record record)
		{
			long time = JavaSystem.CurrentTimeMillis();
			map[record.getKey()] = new Record(record, time);
		}

		private void prepare(long fileSize, long cacheSize)
		{
			if (totalSize + fileSize > cacheSize)
			{
				List<Record> records = map.Values.ToList();
				records.Sort(new RecordComparator());
				for (int c = records.Count - 1; c > 0; c--)
				{
					Record record = records[c];
					records.RemoveAt(c);
					if (record != null)
					{
						long nextTotalSize = totalSize - record.getSize();
						fileManager.delete(record.getName());
						map.Remove(record.getKey());
						totalSize = nextTotalSize;
					}

					if (totalSize + fileSize <= cacheSize)
					{
						break;
					}
				}
			}
		}

		public long getTotalSize()
		{
			return totalSize;
		}

		public long getJournalSize()
		{
			return file.Length();
		}

		private void setTotalSize(long newTotalSize)
		{
			totalSize = newTotalSize;
		}

		public void writeJournal()
		{
			try
			{
				using (DataOutputStream stream = new DataOutputStream(new FileStream(file.AbsolutePath, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.ReadWrite)))
				{
					stream.WriteShort(DiskLruCache.JOURNAL_FORMAT_VERSION);
					stream.WriteInt(map.Count);
					foreach (Record record in map.Values)
					{
						stream.WriteUTF(record.getKey());
						stream.WriteUTF(record.getName());
						stream.WriteLong(record.getTime());
						stream.WriteLong(record.getSize());
					}
					stream.Close();
				}
			}
			catch (IOException e)
			{
				Crashes.TrackError(e);
			}
		}

		public static Journal readJournal(FileManager fileManager)
		{
			File file = fileManager.journal();
			Journal journal = new Journal(file, fileManager);

			try
			{
				if (!System.IO.File.Exists(file.Path)) return journal;
				using (DataInputStream stream = new DataInputStream(new FileStream(file.AbsolutePath, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.ReadWrite)))
				{
					int version = stream.ReadShort();
					if (version != DiskLruCache.JOURNAL_FORMAT_VERSION)
					{
						throw new IllegalArgumentException("Invalid journal format version");
					}
					int count = stream.ReadInt();
					long totalJournalSize = 0;
					for (int c = 0; c < count; c++)
					{
						string key = stream.ReadUTF();
						string name = stream.ReadUTF();
						long time = stream.ReadLong();
						long size = stream.ReadLong();
						totalJournalSize += size;
						Record record = new Record(key, name, time, size);
						journal.put(record);
					}
					journal.setTotalSize(totalJournalSize);
				}
			}
			catch (IOException e)
			{
				Crashes.TrackError(e);
			}
			return journal;
		}

	}
}