using Android.Graphics;
using Android.OS;
using Java.Interop;
using Java.Lang;

namespace Alloy.Models
{
	public class Genre : Object, IParcelable
	{
		public long Id { get; set; }
		public string Title { get; set; }
		public Bitmap Art { get; set; }
		public int TotalTracks { get; set; }
		public bool IsSelected { get; set; }

		[ExportField("CREATOR")] // Need a reference to Mono.Android.Export
		public static GenreCreator InitializeCreator()
		{
			return new GenreCreator();
		}

		public void WriteToParcel(Parcel dest, ParcelableWriteFlags flags)
		{
			dest.WriteLong(Id);
			dest.WriteString(Title);
			dest.WriteInt(TotalTracks);
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
				Id = source.ReadLong(),
				Title = source.ReadString(),
				TotalTracks = source.ReadInt()
			};
			return genre;
		}

		public Object[] NewArray(int size)
		{
			return new Object[size];
		}
	}
}