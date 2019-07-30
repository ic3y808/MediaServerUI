using System;
using Newtonsoft.Json;

namespace Alloy.Converters
{
	public class NullIntConverter : JsonConverter
	{
		public override bool CanWrite => false;

		public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
		{
			throw new NotImplementedException();
		}

		public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
		{
			object value = reader.Value;

			if (string.IsNullOrWhiteSpace(value?.ToString()))
			{
				return 0;
			}

			int.TryParse(value.ToString(), out int parsed);
			return parsed;
		}

		public override bool CanConvert(Type objectType)
		{
			return objectType == typeof(string) || objectType == typeof(int);
		}
	}
}