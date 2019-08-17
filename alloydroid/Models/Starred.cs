using System.Collections.Generic;
using Newtonsoft.Json;

namespace Alloy.Models
{
	public class StarredContainer
	{
		[JsonProperty("starred")]
		public Starred Starred { get; set; }
	}

	public class Starred
	{
		public Starred()
		{
			Tracks = new List<Song>();
			Albums = new List<Album>();
			Artists = new List<Artist>();
			TopArtists = new List<Artist>();
			TopTracks = new List<Song>();
			TopAlbums = new List<Album>();
		}
		[JsonProperty("tracks")]
		public List<Song> Tracks { get; set; }
		[JsonProperty("albums")]
		public List<Album> Albums { get; set; }
		[JsonProperty("artists")]
		public List<Artist> Artists { get; set; }
		[JsonProperty("top_artists")]
		public List<Artist> TopArtists { get; set; }
		[JsonProperty("top_tracks")]
		public List<Song> TopTracks { get; set; }
		[JsonProperty("top_albums")]
		public List<Album> TopAlbums { get; set; }
	}
}