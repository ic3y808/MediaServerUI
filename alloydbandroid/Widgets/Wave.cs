using System;
using Android.Content;
using Android.Graphics;
using Android.Util;
using Android.Views;
using Java.Lang;
using Math = System.Math;

namespace Alloy.Widgets
{
	public class Wave : View
	{
		private readonly int WAVE_HEIGHT_LARGE = 128;
		private readonly int WAVE_HEIGHT_MIDDLE = 96;
		private readonly int WAVE_HEIGHT_LITTLE = 64;

		private readonly float WAVE_LENGTH_MULTIPLE_LARGE = 0.38f;
		private readonly float WAVE_LENGTH_MULTIPLE_MIDDLE = 0.9f;
		private readonly float WAVE_LENGTH_MULTIPLE_LITTLE = 0.1f;

		private readonly float WAVE_HZ_FAST = 0.2f;
		private readonly float WAVE_HZ_NORMAL = 0.09f;
		private readonly float WAVE_HZ_SLOW = 0.05f;

		public int DEFAULT_ABOVE_WAVE_ALPHA = 50;
		public int DEFAULT_BLOW_WAVE_ALPHA = 30;

		private readonly float X_SPACE = 20;
		private readonly double PI2 = 2 * Math.PI;

		private readonly Path mAboveWavePath = new Path();
		private readonly Path mBlowWavePath = new Path();

		private readonly Paint mAboveWavePaint = new Paint();
		private readonly Paint mBlowWavePaint = new Paint();

		private Color mAboveWaveColor;
		private Color mBlowWaveColor;

		private float mWaveMultiple;
		private float mWaveLength;
		private int mWaveHeight;
		private float mMaxRight;
		private float mWaveHz;

		// wave animation
		private float mAboveOffset;
		private float mBlowOffset;

		private RefreshProgressRunnable mRefreshProgressRunnable;

		private int waveLeft, waveRight, waveBottom;

		private Random random;
		// ω
		private double omega;

		public Wave(Context context, IAttributeSet attrs) : this(context, attrs, Resource.Attribute.waveViewStyle)
		{
		}

		public Wave(Context context, IAttributeSet attrs, int defStyle) : base(context, attrs, defStyle)
		{
		}

		public void setAboveWaveColor(Color aboveWaveColor)
		{
			mAboveWaveColor = aboveWaveColor;
		}

		public void setBlowWaveColor(Color blowWaveColor)
		{
			mBlowWaveColor = blowWaveColor;
		}

		public Paint getAboveWavePaint()
		{
			return mAboveWavePaint;
		}

		public Paint getBlowWavePaint()
		{
			return mBlowWavePaint;
		}

		public void initializeWaveSize(int waveMultiple, int waveHeight, int waveHz)
		{
			mWaveMultiple = getWaveMultiple(waveMultiple);
			mWaveHeight = getWaveHeight(waveHeight);
			mWaveHz = getWaveHz(waveHz);
			mBlowOffset = mWaveHeight * 0.4f;
			random = new Random();
			ViewGroup.LayoutParams @params = new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MatchParent, mWaveHeight * 2);
			LayoutParameters = @params;
		}

		public void initializePainters()
		{
			mAboveWavePaint.Color = mAboveWaveColor;
			mAboveWavePaint.Alpha = DEFAULT_ABOVE_WAVE_ALPHA;
			mAboveWavePaint.SetStyle(Paint.Style.Fill);
			mAboveWavePaint.AntiAlias = true;

			mBlowWavePaint.Color = mBlowWaveColor;
			mBlowWavePaint.Alpha = DEFAULT_BLOW_WAVE_ALPHA;
			mBlowWavePaint.SetStyle(Paint.Style.Fill);
			mBlowWavePaint.AntiAlias = true;
		}

		private float getWaveMultiple(int size)
		{
			if(random == null) random= new Random();
			switch (size)
			{
				case WaveView.LARGE:
					return WAVE_LENGTH_MULTIPLE_LARGE;
				case WaveView.MIDDLE:
					return WAVE_LENGTH_MULTIPLE_MIDDLE;
				case WaveView.LITTLE:
					return WAVE_LENGTH_MULTIPLE_LITTLE;
			}
			return 0;
		}

		private int getWaveHeight(int size)
		{
			switch (size)
			{
				case WaveView.LARGE:
					return WAVE_HEIGHT_LARGE;
				case WaveView.MIDDLE:
					return WAVE_HEIGHT_MIDDLE;
				case WaveView.LITTLE:
					return WAVE_HEIGHT_LITTLE;
			}
			return 0;
		}

		private float getWaveHz(int size)
		{
			switch (size)
			{
				case WaveView.LARGE:
					return WAVE_HZ_FAST;
				case WaveView.MIDDLE:
					return WAVE_HZ_NORMAL;
				case WaveView.LITTLE:
					return WAVE_HZ_SLOW;
			}
			return 0;
		}

		/**
		 * calculate wave track
		 */
		private void calculatePath()
		{
			mAboveWavePath.Reset();
			mBlowWavePath.Reset();

			getWaveOffset();

			float y;
			mAboveWavePath.MoveTo(waveLeft, waveBottom);
			for (float x = 0; x <= mMaxRight; x += X_SPACE)
			{
				y = (float)(mWaveHeight * Math.Sin(omega * x + mAboveOffset) + mWaveHeight);
				mAboveWavePath.LineTo(x, y);
			}
			mAboveWavePath.LineTo(waveRight, waveBottom);

			mBlowWavePath.MoveTo(waveLeft, waveBottom);
			for (float x = 0; x <= mMaxRight; x += X_SPACE)
			{
				y = (float)(mWaveHeight * Math.Sin(omega * x + mBlowOffset) + mWaveHeight);
				mBlowWavePath.LineTo(x, y);
			}
			mBlowWavePath.LineTo(waveRight, waveBottom);
		}

		protected override void OnDraw(Canvas canvas)
		{
			base.OnDraw(canvas);
			canvas.DrawPath(mBlowWavePath, mBlowWavePaint);
			canvas.DrawPath(mAboveWavePath, mAboveWavePaint);
		}

		protected override void OnLayout(bool changed, int left, int top, int right, int bottom)
		{
			base.OnLayout(changed, left, top, right, bottom);
			if (Math.Abs(mWaveLength) < 0.0001)
			{
				startWave();
			}
		}

		public override void OnWindowFocusChanged(bool hasWindowFocus)
		{
			base.OnWindowFocusChanged(hasWindowFocus);
			if (hasWindowFocus && Math.Abs(mWaveLength) < 0.0001)
			{
				startWave();
			}
		}

		protected override void OnWindowVisibilityChanged(ViewStates visibility)
		{
			base.OnWindowVisibilityChanged(visibility);
			if (ViewStates.Gone == visibility)
			{
				RemoveCallbacks(mRefreshProgressRunnable);
			}
			else
			{
				RemoveCallbacks(mRefreshProgressRunnable);
				mRefreshProgressRunnable = new RefreshProgressRunnable(this);
				Post(mRefreshProgressRunnable);
			}
		}

		private void startWave()
		{
			if (Width != 0)
			{
				int width = Width;
				mWaveLength = width * mWaveMultiple;
				waveLeft = Left;
				waveRight = Right;
				waveBottom = Bottom + 2;
				mMaxRight = waveRight + X_SPACE;
				omega = PI2 / mWaveLength;
			}
		}

		private void getWaveOffset()
		{
			if (mBlowOffset > float.MaxValue - 100)
			{
				mBlowOffset = 0;
			}
			else
			{
				mBlowOffset += mWaveHz;
			}

			if (mAboveOffset > float.MaxValue - 100)
			{
				mAboveOffset = 0;
			}
			else
			{
				mAboveOffset += mWaveHz;
			}
		}

		private class RefreshProgressRunnable : Java.Lang.Object, IRunnable
		{
			private readonly Wave wave;
			public RefreshProgressRunnable(Wave wave)
			{
				this.wave = wave;
			}
			public void Run()
			{

				long start = JavaSystem.CurrentTimeMillis();

				wave.calculatePath();

				wave.Invalidate();

				long gap = 16 - (JavaSystem.CurrentTimeMillis() - start);
				wave.PostDelayed(this, gap < 0 ? 0 : gap);

			}
		}
	}
}