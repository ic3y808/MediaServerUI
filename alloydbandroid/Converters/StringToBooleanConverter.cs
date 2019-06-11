using System;
using Newtonsoft.Json;

namespace Alloy.Converters
{
	public class StringToBooleanConverter : JsonConverter
	{
		public override bool CanWrite => false;

		public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
		{
			throw new NotImplementedException();
		}

		public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
		{
			object value = reader.Value;

			return !string.IsNullOrWhiteSpace(value?.ToString()) && string.Equals("true", value.ToString(), StringComparison.OrdinalIgnoreCase);
		}

		public override bool CanConvert(Type objectType)
		{
			return objectType == typeof(string) || objectType == typeof(bool);
		}
	}
}