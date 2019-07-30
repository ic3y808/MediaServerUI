using System.Collections.Generic;
using Newtonsoft.Json;

namespace Alloy.Models
{
	public class Tag
	{
		[JsonProperty("date")]
		public string Date { get; set; }
		[JsonProperty("tags")]
		public List<string> Tags { get; set; }
	}
}