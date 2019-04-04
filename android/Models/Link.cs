using Newtonsoft.Json;

namespace Alloy.Models
{
	public class Link
	{
		[JsonProperty("id")]
		public int Id { get; set; }
		[JsonProperty("type")]
		public string Type { get; set; }
		[JsonProperty("target")]
		public string Target { get; set; }
		[JsonProperty("artist_id")]
		public string ArtistId { get; set; }
	}
}