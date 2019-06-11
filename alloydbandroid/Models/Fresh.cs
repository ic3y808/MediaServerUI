using System.Collections.Generic;
using Newtonsoft.Json;

namespace Alloy.Models
{
	public class FreshContainer
	{
		[JsonProperty("fresh")]
		public Fresh Fresh { get; set; }
	}

	public class Fresh
	{
		[JsonProperty("albums")]
		public List<Album> Albums { get; set; }
		[JsonProperty("artists")]
		public List<Artist> Artists { get; set; }
		[JsonProperty("tracks")]
		public MusicQueue Tracks { get; set; }
	}
}