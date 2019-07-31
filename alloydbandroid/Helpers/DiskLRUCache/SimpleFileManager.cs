using System;
using Java.IO;

namespace Alloy.Helpers.DiskLRUCache
{
	public class SimpleFileManager : FileManager
	{

		private readonly File dir;

		public SimpleFileManager(File dir)
		{
			this.dir = dir;
		}

		public File journal()
		{
			return new File(dir, "journal.bin");
		}


		public void prepare()
		{
			if (!dir.Exists())
			{
				if (!dir.Mkdirs())
				{
					throw new IOException("Unable to create specified cache directory");
				}
			}
		}


		public File get(string name)
		{
			return new File(dir, name);
		}


		public File accept(File extFile, string name)
		{
			File newFile = get(name);
			if ((dir.Exists() || dir.Mkdirs())
			    | (newFile.Exists() && newFile.Delete())
			    | extFile.RenameTo(newFile))
			{
				return newFile;
			}
			else
			{
				throw new FormatException(string.Format("Unable to accept file {0}", extFile.AbsolutePath));
			}
		}


		public bool exists(string name)
		{
			return new File(dir, name).Exists();
		}


		public void delete(string name)
		{
			File file = new File(dir, name);
			if (file.Exists() && !file.Delete())
			{
				throw formatException("Unable to delete file %s", file);
			}
		}

		private IOException formatException(string format, File file)
		{
			string message = string.Format(format, file.Name);
			return new IOException(message);
		}

	}
}
