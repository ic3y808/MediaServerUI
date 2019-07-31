using Android.Content;
using Android.Content.Res;
using Android.Graphics;
using Android.Util;
using Android.Views;
using Android.Widget;
using Orientation = Android.Widget.Orientation;

namespace Alloy.Widgets
{
	public sealed class WaveView : LinearLayout
	{
		public const int LARGE = 1;
		public const int MIDDLE = 2;
		public const int LITTLE = 3;

		private int mProgress;

		private readonly Wave mWave;

		private readonly int DEFAULT_ABOVE_WAVE_COLOR = Color.White;
		private readonly int DEFAULT_BLOW_WAVE_COLOR = Color.White;
		private readonly int DEFAULT_PROGRESS = 80;


		public WaveView(Context context, IAttributeSet attrs) : base(context, attrs)
		{
			Orientation = Orientation.Vertical;
			//load styled attributes.
			TypedArray attributes = context.Theme.ObtainStyledAttributes(attrs, Resource.Styleable.WaveView, Resource.Attribute.waveViewStyle, 0);
			Color mAboveWaveColor = attributes.GetColor(Resource.Styleable.WaveView_above_wave_color, DEFAULT_ABOVE_WAVE_COLOR);
			Color mBlowWaveColor = attributes.GetColor(Resource.Styleable.WaveView_blow_wave_color, DEFAULT_BLOW_WAVE_COLOR);
			mProgress = attributes.GetInt(Resource.Styleable.WaveView_progress, DEFAULT_PROGRESS);
			int mWaveHeight = attributes.GetInt(Resource.Styleable.WaveView_wave_height, MIDDLE);
			int mWaveMultiple = attributes.GetInt(Resource.Styleable.WaveView_wave_length, LARGE);
			int mWaveHz = attributes.GetInt(Resource.Styleable.WaveView_wave_hz, MIDDLE);
			attributes.Recycle();

			mWave = new Wave(context, null);
			mWave.initializeWaveSize(mWaveMultiple, mWaveHeight, mWaveHz);
			mWave.setAboveWaveColor(mAboveWaveColor);
			mWave.setBlowWaveColor(mBlowWaveColor);
			mWave.initializePainters();

			Solid mSolid = new Solid(context, null);
			mSolid.setAboveWavePaint(mWave.getAboveWavePaint());
			mSolid.setBlowWavePaint(mWave.getBlowWavePaint());

			AddView(mWave);
			AddView(mSolid);

			setProgress(mProgress);
		}


		public void setProgress(int progress)
		{
			this.mProgress = progress > 100 ? 100 : progress;
			computeWaveToTop();
		}


		private void computeWaveToTop()
		{
			int mWaveToTop = (int)(Height * (1f - mProgress / 100f));
			ViewGroup.LayoutParams @params = mWave.LayoutParameters;
			if (@params != null)
			{
				((LayoutParams)@params).TopMargin = mWaveToTop;
			}

			mWave.LayoutParameters = @params;
		}
	}
}
