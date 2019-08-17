using Java.IO;

namespace Alloy.Helpers.DiskLRUCache
{
	public interface FileManager
	{

		File journal();

		void prepare();

		File get(string name);

		File accept(File extFile, string name);

		bool exists(string name);

		void delete(string name);

	}
}
