using System;
using System.Collections.Generic;
using System.Globalization;
using Android.Graphics;
using Android.OS;
using Java.Interop;
using Alloy.Interfaces;
using Newtonsoft.Json;
using Object = Java.Lang.Object;

namespace Alloy.Models
{
	public class AlbumList
	{
		[JsonProperty("albums")]
		public List<Album> Albums { get; set; }
	}
	public class AlbumContainer
	{
		[JsonProperty("album")]
		public Album Album { get; set; }

		[JsonProperty("tracks")]
		public MusicQueue Tracks { get; set; }

		[JsonProperty("total_plays")]
		public int TotalPlays { get; set; }

		[JsonProperty("size")]
		public string Size { get; set; }
	}

	public class Album : Object, IParcelable
	{
		[JsonProperty("id")]
		public string Id { get; set; }
		[JsonIgnore]
		public Bitmap Art { get; set; }
		[JsonProperty("name")]
		public string Name { get; set; }
		[JsonProperty("path")]
		public string Path { get; set; }
		[JsonProperty("created"), JsonConverter(typeof(MinDateTimeConverter))]
		public DateTime Created { get; set; }
		[JsonProperty("artist")]
		public string Artist { get; set; }
		[JsonProperty("artist_id")]
		public string ArtistId { get; set; }
		[JsonProperty("genre")]
		public string Genre { get; set; }
		[JsonProperty("genre_id")]
		public string GenreId { get; set; }
		[JsonProperty("starred"), JsonConverter(typeof(StringToBooleanConverter))]
		public bool Starred { get; set; }
		[JsonProperty("starred_date"), JsonConverter(typeof(MinDateTimeConverter))]
		public DateTime StarredDate { get; set; }
		[JsonProperty("rating"), JsonConverter(typeof(NullIntConverter))]
		public int Rating { get; set; }
		[JsonProperty("type")]
		public string Type { get; set; }
		[JsonProperty("track_count"), JsonConverter(typeof(NullIntConverter))]
		public int TrackCount { get; set; }

		[JsonProperty("tracks")]
		public MusicQueue Tracks { get; set; }

		public bool IsSelected { get; set; }
		public bool IsLabel { get; set; }
		public bool IsDivider { get; set; }

		[ExportField("CREATOR")] 
		public static ArtistCreator InitializeCreator()
		{
			return new ArtistCreator();
		}

		public void WriteToParcel(Parcel dest, ParcelableWriteFlags flags)
		{
			dest.WriteString(Id);
			dest.WriteString(Name);
			dest.WriteString(Path);
			dest.WriteString(Created.ToString(CultureInfo.InvariantCulture));
			dest.WriteString(Artist);
			dest.WriteString(ArtistId);
			dest.WriteString(Genre);
			dest.WriteString(GenreId);
			dest.WriteString(Starred.ToString());
			dest.WriteString(StarredDate.ToString(CultureInfo.InvariantCulture));
			dest.WriteInt(Rating);
			dest.WriteString(Type);
			dest.WriteInt(TrackCount);
			dest.WriteString(IsSelected.ToString());
			dest.WriteString(IsLabel.ToString());
			dest.WriteString(IsDivider.ToString());
		}

		public int DescribeContents()
		{
			return 0;
		}
	}

	public class AlbumCreator : Object, IParcelableCreator
	{
		public Object CreateFromParcel(Parcel source)
		{
			Album album = new Album
			{
				Id = source.ReadString(),
				Name = source.ReadString(),
				Path = source.ReadString(),
				Created = DateTime.Parse(source.ReadString()),
				Artist = source.ReadString(),
				ArtistId = source.ReadString(),
				Genre = source.ReadString(),
				GenreId = source.ReadString(),
				Starred = bool.Parse(source.ReadString()),
				StarredDate = DateTime.Parse(source.ReadString()),
				Rating = source.ReadInt(),
				Type = source.ReadString(),
				TrackCount = source.ReadInt(),
				IsSelected = bool.Parse(source.ReadString()),
				IsLabel = bool.Parse(source.ReadString()),
				IsDivider = bool.Parse(source.ReadString()),
			};
			return album;
		}

		public Object[] NewArray(int size)
		{
			return new Object[size];
		}
	}
}