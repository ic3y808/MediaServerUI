using System;
using System.Collections.Generic;
using System.Globalization;
using Android.Graphics;
using Android.OS;
using Java.Interop;
using Newtonsoft.Json;
using Object = Java.Lang.Object;

namespace Alloy.Models
{
	public class GenreList
	{
		[JsonProperty("genres")]
		public List<Genre> Genres { get; set; }
	}
	public class GenreContainer
	{
		[JsonProperty("genre")]
		public Genre Genre { get; set; }

		[JsonProperty("tracks")]
		public MusicQueue Tracks { get; set; }

		[JsonProperty("total_plays")]
		public int TotalPlays { get; set; }

		[JsonProperty("size")]
		public string Size { get; set; }
	}

	public class Genre : Object, IParcelable
	{
		[JsonProperty("id")]
		public string Id { get; set; }
		[JsonIgnore]
		public Bitmap Art { get; set; }
		[JsonProperty("name")]
		public string Name { get; set; }
		[JsonProperty("starred"), JsonConverter(typeof(StringToBooleanConverter))]
		public bool Starred { get; set; }
		[JsonProperty("starred_date"), JsonConverter(typeof(MinDateTimeConverter))]
		public DateTime StarredDate { get; set; }
		[JsonProperty("track_count"), JsonConverter(typeof(NullIntConverter))]
		public int TrackCount { get; set; }
		[JsonProperty("artist_count"), JsonConverter(typeof(NullIntConverter))]
		public int ArtistCount { get; set; }
		[JsonProperty("album_count"), JsonConverter(typeof(NullIntConverter))]
		public int AlbumCount { get; set; }

		public bool IsSelected { get; set; }
		public bool IsLabel { get; set; }
		public bool IsDivider { get; set; }

		[ExportField("CREATOR")]
		public static GenreCreator InitializeCreator()
		{
			return new GenreCreator();
		}

		public void WriteToParcel(Parcel dest, ParcelableWriteFlags flags)
		{
			dest.WriteString(Id);
			dest.WriteString(Name);
			dest.WriteString(Starred.ToString());
			dest.WriteString(StarredDate.ToString(CultureInfo.InvariantCulture));
			dest.WriteInt(TrackCount);
			dest.WriteInt(ArtistCount);
			dest.WriteInt(AlbumCount);
			dest.WriteString(IsSelected.ToString());
			dest.WriteString(IsLabel.ToString());
			dest.WriteString(IsDivider.ToString());
		}

		public int DescribeContents()
		{
			return 0;
		}
	}

	public class GenreCreator : Object, IParcelableCreator
	{
		public Object CreateFromParcel(Parcel source)
		{
			Genre genre = new Genre
			{
				Id = source.ReadString(),
				Name = source.ReadString(),
				Starred = bool.Parse(source.ReadString()),
				StarredDate = DateTime.Parse(source.ReadString()),
				TrackCount = source.ReadInt(),
				ArtistCount = source.ReadInt(),
				AlbumCount = source.ReadInt(),
				IsSelected = bool.Parse(source.ReadString()),
				IsLabel = bool.Parse(source.ReadString()),
				IsDivider = bool.Parse(source.ReadString()),
			};
			return genre;
		}

		public Object[] NewArray(int size)
		{
			return new Object[size];
		}
	}
}