using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Android.Database;
using Android.Database.Sqlite;
using Java.IO;
using Microsoft.AppCenter.Crashes;
using Alloy.Models;

namespace Alloy.Providers
{
	public class DatabaseProvider
	{
#pragma warning disable 169
		private static string pathToDatabase;
#pragma warning restore 169
		private static SQLiteDatabase db;

		public static string FavoritesTableKey = "Favorites";
		public static string SubsonicServersTableKey = "SubsonicServers";
		public static string EmbyServersTableKey = "EmbyServers";

		public static void StartDatabase()
		{
			if (db != null) return;
			try
			{
				Java.IO.File f = new File(Android.OS.Environment.ExternalStorageDirectory.AbsolutePath);
				db = SQLiteDatabase.OpenOrCreateDatabase(f + "/AlloyDB.db", null);
				if (db != null && db.IsOpen)
				{
					db.ExecSQL("CREATE TABLE IF NOT EXISTS " + FavoritesTableKey + " (`Id` INTEGER UNIQUE);");



					CreateTables();
				}
				else StartDatabase();
			}
			catch (Exception e) { Crashes.TrackError(e); }
		}

		public static void StopDatabase()
		{
			if (db != null && db.IsOpen) { db.Close(); }
		}

		public static void ResetAllTables()
		{
			try
			{
				if (db != null && db.IsOpen)
				{
					db.ExecSQL("DELETE FROM " + FavoritesTableKey + ";");
					db.ExecSQL("DELETE FROM " + SubsonicServersTableKey + ";");
				}
				else StartDatabase();
			}
			catch (Exception e) { Crashes.TrackError(e); }
		}

		public static bool IsSongFavorite(long id)
		{
			try
			{
				if (db != null && db.IsOpen)
				{
					var a = db.Query(FavoritesTableKey, new[] { "Id" }, "Id=?", new[] { id.ToString() }, null, null, null, null);
					return a.Count != 0;
				}
				else StartDatabase();
			}
			catch (Exception e) { Crashes.TrackError(e); }

			return false;
		}

		public static void SetSongFavorite(Song song, bool isFavorite)
		{
			try
			{
				if (isFavorite)
				{
					try
					{
						if (db != null && db.IsOpen) { db.ExecSQL("INSERT INTO " + FavoritesTableKey + " VALUES (" + song.Id + ");"); }
						else StartDatabase();
					}
					catch (Exception e) { Crashes.TrackError(e); }

					if (!MusicProvider.Favorites.Any(s => s.Id.Equals(song.Id)))
						MusicProvider.Favorites.Add(song);
				}
				else
				{
					try
					{
						if (db != null && db.IsOpen) { db.ExecSQL("DELETE FROM " + FavoritesTableKey + " WHERE Id=" + song.Id); }
						else StartDatabase();
					}
					catch (Exception e) { Crashes.TrackError(e); }

					MusicProvider.Favorites.RemoveAll(t => t.Id.Equals(song.Id));
				}
			}
			catch (Exception e) { Crashes.TrackError(e); }
		}

		static IEnumerable<Type> GetTypesWithHelpAttribute(Assembly assembly)
		{
			foreach (Type type in assembly.GetTypes())
			{
				if (type.GetCustomAttributes(typeof(DatabaseTableAttribute), true).Length > 0)
				{
					yield return type;
				}
			}
		}

		public static string GetTableName(Type dbType)
		{
			object[] tableAttribute = dbType.GetCustomAttributes(typeof(DatabaseTableAttribute), false);
			return tableAttribute.Cast<DatabaseTableAttribute>().First().TableName;
		}

		public static string GetPrimaryKey(Type dbType)
		{
			var props = dbType.GetProperties().Where(prop => Attribute.IsDefined(prop, typeof(DatabaseColumnAttribute))).ToList();
			foreach (var prop in props)
			{
				var columnAttributes = prop.GetCustomAttributes(typeof(DatabaseColumnAttribute), false);
				var columns = columnAttributes.Cast<DatabaseColumnAttribute>();

				foreach (var col in columns)
				{
					if (col.Primary)
					{
						return col.ColumnName;
					}
				}
			}

			return "";
		}

		public static string GetPrimaryKeyId(string key, object o)
		{
			foreach (var propertyInfo in o.GetType().GetProperties())
			{
				if (propertyInfo.Name.Equals(key))
				{
					var value = propertyInfo.GetValue(o);
					return value.ToString();
				}
			}
			return "";
		}

		public static void CreateTables()
		{
			var dbTypes = GetTypesWithHelpAttribute(Assembly.GetCallingAssembly());

			foreach (var dbType in dbTypes)
			{
				string tableName = GetTableName(dbType);

				string sql = @"CREATE TABLE IF NOT EXISTS `" + tableName + "` (";

				var props = dbType.GetProperties().Where(prop => Attribute.IsDefined(prop, typeof(DatabaseColumnAttribute))).ToList();
				for (var index = 0; index < props.Count; index++)
				{
					PropertyInfo prop = props[index];
					object[] columnAttributes = prop.GetCustomAttributes(typeof(DatabaseColumnAttribute), false);
					IEnumerable<DatabaseColumnAttribute> columns = columnAttributes.Cast<DatabaseColumnAttribute>();

					foreach (var col in columns)
					{
					

						sql += $"`{col.ColumnName}` {col.ColumnType}";

						if (col.Primary)
							sql += " PRIMARY KEY";
						if (col.Unique)
							sql += " UNIQUE";
						if (col.AutoIncrement)
							sql += " AUTO INCREMENT";
						else if (index < props.Count - 1)
							sql += ", ";


					}
				}

				sql += ");";

				System.Diagnostics.Debug.WriteLine("SQL: " + sql);
				if (db != null && db.IsOpen) { db.ExecSQL(sql); }

			}
		}

		public static void Insert<T>(Object o, bool replace = false)
		{
			try
			{
				var tableName = GetTableName(typeof(T));
				string cols = "";
				string vals = "";
				string sql = @"INSERT OR ";

				if (replace) sql += "REPLACE";
				else sql += "IGNORE";

				sql += " INTO `" + tableName + "` (";

				var props = o.GetType().GetProperties().Where(prop => Attribute.IsDefined(prop, typeof(DatabaseColumnAttribute))).ToList();
				for (var index = 0; index < props.Count; index++)
				{
					PropertyInfo prop = props[index];
					object[] columnAttributes = prop.GetCustomAttributes(typeof(DatabaseColumnAttribute), false);
					IEnumerable<DatabaseColumnAttribute> columns = columnAttributes.Cast<DatabaseColumnAttribute>();

					for (var i = 0; i < columnAttributes.Length; i++)
					{
						DatabaseColumnAttribute columnAttribute = (DatabaseColumnAttribute)columnAttributes[i];
						
						cols += columnAttribute.ColumnName;
						if (index < props.Count - 1) cols += ", ";

						switch (columnAttribute.ColumnType)
						{
							case ColumnType.TEXT:
								vals += DatabaseUtils.SqlEscapeString((prop.GetValue(o) != null ? prop.GetValue(o).ToString() : ""));
								break;
							case ColumnType.INTEGER:
							case ColumnType.NUMERIC:
								vals += prop.GetValue(o);
								break;
							default:
								vals += DatabaseUtils.SqlEscapeString((prop.GetValue(o) != null ? prop.GetValue(o).ToString() : ""));
								break;
						}

						if (index < props.Count - 1) vals += ", ";

					}
				}
				sql += $"{cols}) VALUES({vals});";

				if (db != null && db.IsOpen) { db.ExecSQL(sql); }
			}
			catch (Exception e)
			{
				System.Diagnostics.Debug.WriteLine(e.Message);
			}
		}

		public static ICursor Get<T>()
		{
			if (db != null && db.IsOpen)
			{
				return db.Query(GetTableName(typeof(T)), null, null, null, null, null, null, null);
			}
			return null;
		}

		public static void Clear<T>()
		{
			if (db != null && db.IsOpen)
			{
				db.ExecSQL("DELETE FROM " + GetTableName(typeof(T)) + ";");
			}
		}

		public static void Remove<T>(object o)
		{
			if (db != null && db.IsOpen)
			{
				var sql = "DELETE FROM " + GetTableName(typeof(T)) + " WHERE " + GetPrimaryKey(typeof(T)) + "='" +
				          GetPrimaryKeyId(GetPrimaryKey(typeof(T)), o) + "'";
				System.Diagnostics.Debug.WriteLine(sql);
				db.ExecSQL("DELETE FROM " + GetTableName(typeof(T)) + " WHERE "+ GetPrimaryKey(typeof(T)) + "='" + GetPrimaryKeyId(GetPrimaryKey(typeof(T)), o) + "'");
			}
		}
	}
}