namespace Alloy.Interfaces
{
	public interface ViewBehavior
	{
		void OnHandleGrabbed();
		void OnHandleReleased();
		void OnScrollStarted();
		void OnScrollFinished();
	}
}