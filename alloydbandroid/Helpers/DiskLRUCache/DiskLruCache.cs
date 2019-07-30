using System.Collections.Generic;
using System.Text;
using Java.IO;
using Java.Lang;
using Java.Security;
using StringBuilder = Java.Lang.StringBuilder;

namespace Alloy.Helpers.DiskLRUCache
{
	public class DiskLruCache
	{

		public static int JOURNAL_FORMAT_VERSION = 1;
		public static string HASH_ALGORITHM = "MD5";

		private Journal journal;
		private long cacheSize;
		private FileManager fileManager;

		private DiskLruCache(FileManager fileManager, Journal journal, long cacheSize)
		{
			this.fileManager = fileManager;
			this.journal = journal;
			this.cacheSize = cacheSize;
		}

		public static DiskLruCache create(File cacheDir, long cacheSize)
		{
			FileManager fileManager = new SimpleFileManager(cacheDir);
			return create(fileManager, cacheSize);
		}

		public static DiskLruCache create(FileManager fileManager, long cacheSize)
		{
			fileManager.prepare();
			Journal journal = Journal.readJournal(fileManager);
			return new DiskLruCache(fileManager, journal, cacheSize);
		}

		public File put(string key, File file)
		{
			lock (journal)
			{
				assertKeyValid(key);
				string name = generateName(key, file);
				long time = Java.Lang.JavaSystem.CurrentTimeMillis();
				long fileSize = file.Length();
				Record record = new Record(key, name, time, fileSize);
				File cacheFile = fileManager.accept(file, name);
				journal.delete(key);
				journal.put(record, cacheSize);
				journal.writeJournal();
				return cacheFile;
			}
		}

		public File get(string key)
		{
			lock (journal)
			{
				assertKeyValid(key);
				Record record = journal.get(key);
				if (record != null)
				{
					File file = fileManager.get(record.getName());
					if (!file.Exists())
					{
						journal.delete(key);
						file = null;
						journal.writeJournal();
					}
					
					return file;
				}
				else
				{
					//log("[-] No requested file with key %s in cache", key);
					return null;
				}
			}
		}

		public void delete(string key)
		{
			delete(key, true);
		}

		private void delete(string key, bool writeJournal)
		{
			lock (journal)
			{
				assertKeyValid(key);
				Record record = journal.delete(key);
				if (record != null)
				{
					if (writeJournal)
					{
						journal.writeJournal();
					}
					fileManager.delete(record.getName());
				}
				else
				{
					throw new RecordNotFoundException();
				}
			}
		}

		public void clearCache()
		{
			lock (journal)
			{
				List<string> keys = journal.keySet();
				foreach (string key in keys)
				{
					try
					{
						delete(key, false);
					}
					catch (RecordNotFoundException ignored)
					{
					}
				}
				journal.writeJournal();
			}
		}

		public List<string> keySet()
		{
			lock (journal)
			{
				return journal.keySet();
			}
		}

		public long getCacheSize()
		{
			return cacheSize;
		}

		public long getUsedSpace()
		{
			lock (journal)
			{
				return journal.getTotalSize();
			}
		}

		public long getFreeSpace()
		{
			lock (journal)
			{
				return cacheSize - journal.getTotalSize();
			}
		}

		public long getJournalSize()
		{
			lock (journal)
			{
				return journal.getJournalSize();
			}
		}

		private static void assertKeyValid(string key)
		{
			if (key == null || key.Length == 0)
			{
				throw new IllegalArgumentException(string.Format("Invalid key value: '{0}'", key));
			}
		}

		private static string keyHash(string baseStr)
		{
			try
			{
				MessageDigest digest = MessageDigest.GetInstance(HASH_ALGORITHM);
				byte[] bytes = digest.Digest(Encoding.UTF8.GetBytes(baseStr));
				StringBuilder hexstring = new StringBuilder();
				foreach (byte b in bytes)
				{
					string hex = Integer.ToHexString(0xff & b);
					if (hex.Length == 1)
					{
						hexstring.Append('0');
					}
					hexstring.Append(hex);
				}
				return hexstring.ToString();
			}
			catch (NoSuchAlgorithmException ignored)
			{
			}
			throw new IllegalArgumentException("Unable to hash key");
		}

		private static string generateName(string key, File file)
		{
			return keyHash(key) + fileExtension(file.Name);
		}

		private static string fileExtension(string path)
		{
			string suffix = "";
			if (!string.IsNullOrEmpty(path))
			{
				int index = path.LastIndexOf(".");
				if (index != -1)
				{
					suffix = path.Substring(index);
				}
			}
			return suffix;
		}

	}
}
