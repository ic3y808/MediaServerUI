using Newtonsoft.Json;

namespace Alloy.Models
{
	public class HistoryContainer
	{
		[JsonProperty("history")]
		public History[] History { get; set; }
	}

	public class History
	{
		[JsonProperty("history_id")]
		public int HistoryId { get; set; }
		[JsonProperty("id")]
		public string Id { get; set; }
		[JsonProperty("type")]
		public string Type { get; set; }
		[JsonProperty("action")]
		public string Action { get; set; }
		[JsonProperty("time")]
		public int Time { get; set; }
		[JsonProperty("title")]
		public string Title { get; set; }
		[JsonProperty("artist")]
		public string Artist { get; set; }
		[JsonProperty("artist_id")]
		public string ArtistId { get; set; }
		[JsonProperty("album")]
		public string Album { get; set; }
		[JsonProperty("album_id")]
		public string AlbumId { get; set; }
		[JsonProperty("genre")]
		public string Genre { get; set; }
		[JsonProperty("genre_id")]
		public string GenreId { get; set; }
	}
}