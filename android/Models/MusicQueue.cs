using Alloy.Interfaces;

namespace Alloy.Models
{
	public class MusicQueue : Queue
	{
		public override void GetMoreData()
		{
			//TODO make better queue system
		}

		public override void Refresh()
		{
			// not used	
		}

		public override string NextHref { get; set; }
	}
}