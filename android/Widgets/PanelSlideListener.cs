using Alloy.Widgets;
using Android.Views;

namespace SlideUpPanelLibrary
{
	public interface PanelSlideListener
	{
		/**
         * Called when a sliding pane's position changes.
         *
         * @param panel       The child view that was moved
         * @param slideOffset The new offset of this sliding pane within its range, from 0-1
         */
		void onPanelSlide(View panel, float slideOffset);

		/**
         * Called when a sliding panel state changes
         *
         * @param panel The child view that was slid to an collapsed position
         */
		void onPanelStateChanged(View panel, SlidingUpPanelLayout.PanelState previousState, SlidingUpPanelLayout.PanelState newState);
	}
}