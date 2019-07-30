using System;
using System.Collections.Generic;
using System.Globalization;
using Alloy.Converters;
using Android.Graphics;
using Android.OS;
using Java.Interop;
using Newtonsoft.Json;
using Object = Java.Lang.Object;

namespace Alloy.Models
{
	public class ArtistList
	{
		[JsonProperty("artists")]
		public List<Artist> Artists { get; set; }
		[JsonProperty("next_offset")]
		public int NextOffset { get; set; }
		[JsonProperty("limit")]
		public int Limit { get; set; }
	}

	public class ArtistContainer
	{
		[JsonProperty("artist")]
		public Artist Artist { get; set; }

		[JsonProperty("popular_tracks")]
		public MusicQueue PopularTracks { get; set; }

		[JsonProperty("tracks")]
		public MusicQueue Tracks { get; set; }

		[JsonProperty("links")]
		public List<Link> Links { get; set; }

		[JsonProperty("albums")]
		public List<Album> Albums { get; set; }

		[JsonProperty("EPs")]
		public List<Album> EPs { get; set; }

		[JsonProperty("singles")]
		public List<Album> Singles { get; set; }

		[JsonProperty("total_plays")]
		public int TotalPlays { get; set; }

		[JsonProperty("size")]
		public string Size { get; set; }
	}

	public class ArtistIndex
	{
		[JsonProperty("index")]
		public ArtistIndexContainer[] Index { get; set; }
	}

	public class ArtistIndexContainer
	{
		[JsonProperty("name")]
		public string Name { get; set; }
		[JsonProperty("value")]
		public Artist[] Value { get; set; }
	}

	public class Artist : Object, IParcelable
	{
		[JsonProperty("id")]
		public string Id { get; set; }
		[JsonIgnore]
		public Bitmap Art { get; set; }
		[JsonProperty("name")]
		public string Name { get; set; }
		[JsonProperty("sore_name")]
		public string SortName { get; set; }
		[JsonProperty("disambiguation")]
		public string Disambiguation { get; set; }
		[JsonProperty("overview")]
		public string Overview { get; set; }
		[JsonProperty("biography")]
		public string Biography { get; set; }
		[JsonProperty("starred"), JsonConverter(typeof(StringToBooleanConverter))]
		public bool Starred { get; set; }
		[JsonProperty("starred_date"), JsonConverter(typeof(MinDateTimeConverter))]
		public DateTime StarredDate { get; set; }
		[JsonProperty("status")]
		public string Status { get; set; }
		[JsonProperty("rating"), JsonConverter(typeof(NullIntConverter))]
		public int Rating { get; set; }
		[JsonProperty("type")]
		public string Type { get; set; }
		[JsonProperty("path")]
		public string Path { get; set; }
		[JsonProperty("track_count"), JsonConverter(typeof(NullIntConverter))]
		public int TrackCount { get; set; }
		[JsonProperty("sort_order"), JsonConverter(typeof(NullIntConverter))]
		public int SortOrder { get; set; }



		public bool IsSelected { get; set; }
		public bool IsLabel { get; set; }
		public bool IsDivider { get; set; }

		[ExportField("CREATOR")] // Need a reference to Mono.Android.Export
		public static ArtistCreator InitializeCreator()
		{
			return new ArtistCreator();
		}

		public void WriteToParcel(Parcel dest, ParcelableWriteFlags flags)
		{
			dest.WriteString(Id);
			dest.WriteString(Name);
			dest.WriteString(SortName);
			dest.WriteString(Disambiguation);
			dest.WriteString(Overview);
			dest.WriteString(Biography);
			dest.WriteString(Starred.ToString());
			dest.WriteString(StarredDate.ToString(CultureInfo.InvariantCulture));
			dest.WriteString(Status);
			dest.WriteInt(Rating);
			dest.WriteString(Type);
			dest.WriteString(Path);
			dest.WriteInt(TrackCount);
			dest.WriteInt(SortOrder);
			dest.WriteString(IsSelected.ToString());
			dest.WriteString(IsLabel.ToString());
			dest.WriteString(IsDivider.ToString());
		}

		public int DescribeContents()
		{
			return 0;
		}
	}

	public class ArtistCreator : Object, IParcelableCreator
	{
		public Object CreateFromParcel(Parcel source)
		{
			Artist artist = new Artist
			{
				Id = source.ReadString(),
				Name = source.ReadString(),
				SortName = source.ReadString(),
				Disambiguation = source.ReadString(),
				Overview = source.ReadString(),
				Biography = source.ReadString(),
				Starred = bool.Parse(source.ReadString()),
				StarredDate = DateTime.Parse(source.ReadString()),
				Status = source.ReadString(),
				Rating = source.ReadInt(),
				Type = source.ReadString(),
				Path = source.ReadString(),
				TrackCount = source.ReadInt(),
				SortOrder = source.ReadInt(),
				IsSelected = bool.Parse(source.ReadString()),
				IsLabel = bool.Parse(source.ReadString()),
				IsDivider = bool.Parse(source.ReadString()),

			};
			return artist;
		}

		public Object[] NewArray(int size)
		{
			return new Object[size];
		}
	}
}