using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Alloy.Converters
{
	public class MinDateTimeConverter : DateTimeConverterBase
	{
		public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
		{
			if (reader.Value == null) { return DateTime.MinValue; }
			DateTime.TryParse(reader.Value.ToString(), out DateTime result);
			return result;
		}

		public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
		{
			DateTime dateTimeValue = (DateTime)value;
			if (dateTimeValue == DateTime.MinValue)
			{
				writer.WriteNull();
				return;
			}
			writer.WriteValue(value);
		}
	}
}