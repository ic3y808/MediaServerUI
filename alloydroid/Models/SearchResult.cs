using System.Collections.Generic;
using Newtonsoft.Json;

namespace Alloy.Models
{
	public class SearchResult
	{
		[JsonProperty("artists")]
		public List<Artist> Artists { get; set; }
		[JsonProperty("albums")]
		public List<Album> Albums { get; set; }
		[JsonProperty("tracks")]
		public List<Song> Tracks { get; set; }
		[JsonProperty("genres")]
		public List<Genre> Genres { get; set; }
	}
}