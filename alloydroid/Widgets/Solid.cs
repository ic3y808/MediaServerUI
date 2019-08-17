using Android.Content;
using Android.Graphics;
using Android.Util;
using Android.Views;
using Android.Widget;

namespace Alloy.Widgets
{
	public class Solid : View
	{
		private Paint aboveWavePaint;
		private Paint blowWavePaint;

		public Solid(Context context, IAttributeSet attrs) : this(context, attrs, 0)
		{

		}

		public Solid(Context context, IAttributeSet attrs, int defStyleAttr) : base(context, attrs, defStyleAttr)
		{
			LinearLayout.LayoutParams @params = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MatchParent, LinearLayout.LayoutParams.MatchParent);
			@params.Weight = 1;
			LayoutParameters = @params;
		}

		public void setAboveWavePaint(Paint aboveWavePaint)
		{
			this.aboveWavePaint = aboveWavePaint;
		}

		public void setBlowWavePaint(Paint blowWavePaint)
		{
			this.blowWavePaint = blowWavePaint;
		}


		protected override void OnDraw(Canvas canvas)
		{
			base.OnDraw(canvas);
			canvas.DrawRect(Left, 0, Right, Bottom, blowWavePaint);
			canvas.DrawRect(Left, 0, Right, Bottom, aboveWavePaint);
		}
	}

}