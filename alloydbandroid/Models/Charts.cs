﻿using System.Collections.Generic;
using Alloy.Interfaces;
using Newtonsoft.Json;

namespace Alloy.Models
{
	public class ChartsContainer
	{
		[JsonProperty("charts")]
		public Charts Charts { get; set; }
	}

	public class Charts
	{
		[JsonProperty("tags")]
		public List<Tag> Tags { get; set; }
		[JsonProperty("never_played_albums")]
		public List<Album> NeverPlayedAlbums { get; set; }
		[JsonProperty("top_tracks")]
		public Queue TopTracks { get; set; }
		[JsonProperty("never_played")]
		public Queue NeverPlayed { get; set; }
	}
}