using System;

namespace Alloy.Common
{
	[Serializable]
	[AttributeUsage(AttributeTargets.Assembly,
		AllowMultiple = true,
		Inherited = false)]
	class SupportedFormatAttribute : Attribute
	{
		public string Name;
		public string[] Extensions;

		public SupportedFormatAttribute(string name)
		{
			Name = name;
		}
	}
}