using System;
using Android.Content.PM;
using Android.Graphics;
using Android.Graphics.Drawables;
using Java.Lang;

namespace Alloy.Widgets
{
	public class SlideDrawable : Drawable, Drawable.ICallback
	{
		private readonly Drawable mWrapped;
		private float mOffset;

		private readonly Rect mTmpRect = new Rect();

		private bool mIsRtl;

		public SlideDrawable(Drawable wrapped)
		{
			mWrapped = wrapped;
		}

		public void setOffset(float offset)
		{
			mOffset = offset;
			InvalidateSelf();
		}

		public float getOffset()
		{
			return mOffset;
		}

		public void setIsRtl(bool isRtl)
		{
			mIsRtl = isRtl;
			InvalidateSelf();
		}

		public override void SetFilterBitmap(bool filter)
		{
			mWrapped.SetFilterBitmap(filter);
		}

		public override ConfigChanges ChangingConfigurations
		{
			get => mWrapped.ChangingConfigurations;
			set => mWrapped.ChangingConfigurations = value;
		}

		public override void SetColorFilter(ColorFilter colorFilter)
		{
			mWrapped.SetColorFilter(colorFilter);
		}

		public override void SetColorFilter(Color color, PorterDuff.Mode mode)
		{
			mWrapped.SetColorFilter(color, mode);
		}

		[Obsolete]
		public override void SetDither(bool dither)
		{
			mWrapped.SetDither(dither);
		}

		public override void SetAlpha(int alpha)
		{
			mWrapped.SetAlpha(alpha);
		}

		public override int Alpha
		{
			get => mWrapped.Alpha;
			set => mWrapped.Alpha = value;
		}

		public override void ClearColorFilter()
		{
			mWrapped.ClearColorFilter();
		}

		public override int[] GetState()
		{
			return mWrapped.GetState();
		}

		public override bool SetState(int[] stateSet)
		{
			return mWrapped.SetState(stateSet);
		}

		public override bool IsStateful => mWrapped.IsStateful;

		public override Drawable Current => mWrapped.Current;

		public override int Opacity => mWrapped.Opacity;

		protected override void OnBoundsChange(Rect bounds)
		{
			base.OnBoundsChange(bounds);
			mWrapped.Bounds = bounds;
		}

		protected override bool OnStateChange(int[] state)
		{
			mWrapped.SetState(state);
			return base.OnStateChange(state);
		}

		public override int IntrinsicHeight => mWrapped.IntrinsicHeight;
		public override int IntrinsicWidth => mWrapped.IntrinsicWidth;
		public override Region TransparentRegion => mWrapped.TransparentRegion;

		public override ConstantState GetConstantState()
		{
			//do nothing
			return base.GetConstantState();
		}

		public override bool GetPadding(Rect padding)
		{
			return mWrapped.GetPadding(padding);
		}

		public override int MinimumHeight => mWrapped.MinimumHeight;
		public override int MinimumWidth => mWrapped.MinimumWidth;

		public override void Draw(Canvas canvas)
		{
			mWrapped.CopyBounds(mTmpRect);
			canvas.Save();
			if (mIsRtl) { canvas.Translate(1.0f / 3 * mTmpRect.Width() * mOffset, 0); }
			else { canvas.Translate(1.0f / 3 * mTmpRect.Width() * -mOffset, 0); }

			mWrapped.Draw(canvas);
			canvas.Restore();
		}

		public void InvalidateDrawable(Drawable who)
		{
			if (who == mWrapped) { InvalidateSelf(); }
		}

		public void ScheduleDrawable(Drawable who, IRunnable what, long when)
		{
			if (who == mWrapped) { ScheduleSelf(what, when); }
		}

		public void UnscheduleDrawable(Drawable who, IRunnable what)
		{
			if (who == mWrapped) { UnscheduleSelf(what); }
		}
	}
}