using System;

namespace Alloy.Models
{
	[Serializable]
	[AttributeUsage(AttributeTargets.Class, AllowMultiple = true, Inherited = false)]
	public class DatabaseTableAttribute : Attribute
	{
		public string TableName { get; set; }
		public DatabaseTableAttribute()
		{
		}
	}

	public enum ColumnType
	{
		TEXT, 
		INTEGER,
		BLOB,
		NUMERIC,
		REAL
	}

	[Serializable]
	[AttributeUsage(AttributeTargets.Property, AllowMultiple = true, Inherited = false)]
	public class DatabaseColumnAttribute : Attribute
	{
		public string ColumnName { get; set; }
		public ColumnType ColumnType { get; set; }
		public string ColumnTypeEnum { get; set; }
		public bool Unique { get; set; }
		public bool Primary { get; set; }
		public bool AutoIncrement { get; set; }
		public DatabaseColumnAttribute()
		{
		}
	}
}
