using System.Collections.Generic;
using Alloy.Interfaces;
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
		public Fresh()
		{
			Albums = new List<Album>();
			Artists = new List<Artist>();
			Tracks = new List<Song>();
		}
		[JsonProperty("albums")]
		public List<Album> Albums { get; set; }
		[JsonProperty("artists")]
		public List<Artist> Artists { get; set; }
		[JsonProperty("tracks")]
		public List<Song> Tracks { get; set; }
	}
}