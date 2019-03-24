using Android.Graphics;
using Android.OS;
using Java.Interop;
using Java.Lang;
using Alloy.Interfaces;

namespace Alloy.Models
{
	public class Album : Object, IParcelable
	{
		public long Id { get; set; }
		public string AlbumName{ get; set; }
		public string Artist { get; set; }
		public int NumTracks { get; set; }
		public Bitmap Art { get; set; }
		public bool IsSelected { get; set; }

		[ExportField("CREATOR")] // Need a reference to Mono.Android.Export
		public static ArtistCreator InitializeCreator()
		{
			return new ArtistCreator();
		}

		public void WriteToParcel(Parcel dest, ParcelableWriteFlags flags)
		{
			dest.WriteLong(Id);
			dest.WriteString(AlbumName);
			dest.WriteString(Artist);
			dest.WriteInt(NumTracks);
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
				Id = source.ReadLong(),
				AlbumName = source.ReadString(),
				Artist = source.ReadString(),
				NumTracks = source.ReadInt()
			};
			return album;
		}

		public Object[] NewArray(int size)
		{
			return new Object[size];
		}
	}

	public class AlbumQueue : IQueue
	{
		public override void GetMoreData()
		{

		}

		public override void Refresh()
		{

		}

		public override string NextHref { get; set; }
	}
}