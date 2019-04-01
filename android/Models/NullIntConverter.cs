using System;
using Newtonsoft.Json;

namespace Alloy.Models
{
	public class NullIntConverter : JsonConverter
	{
		public override bool CanWrite { get { return false; } }

		public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
		{
			throw new NotImplementedException();
		}

		public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
		{
			var value = reader.Value;

			if (value == null || String.IsNullOrWhiteSpace(value.ToString()))
			{
				return 0;
			}

			int parsed = 0;
			int.TryParse(value.ToString(), out parsed);
			return parsed;
		}

		public override bool CanConvert(Type objectType)
		{
			if (objectType == typeof(String) || objectType == typeof(int))
			{
				return true;
			}
			return false;
		}
	}
}