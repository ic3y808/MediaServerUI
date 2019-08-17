namespace Alloy.Models
{
	public class ItemClickEventArgs
	{
		public ItemClickEventArgs(int position)
		{
			this.Position = position;
		}
		public int Position { get; set; }
	}
}