using Android.Content;
using Android.Content.Res;
using Android.Graphics;
using Android.OS;
using Android.Util;
using Android.Views;
using Android.Widget;
using Object = Java.Lang.Object;
using Orientation = Android.Widget.Orientation;

namespace Alloy.Widgets
{
	public class WaveView : LinearLayout
	{
		public const int LARGE = 1;
		public const int MIDDLE = 2;
		public const int LITTLE = 3;

		private Color mAboveWaveColor;
		private Color mBlowWaveColor;
		private int mProgress;
		private int mWaveHeight;
		private int mWaveMultiple;
		private int mWaveHz;

		private int mWaveToTop;

		private Wave mWave;
		private Solid mSolid;

		private int DEFAULT_ABOVE_WAVE_COLOR = Color.White;
		private int DEFAULT_BLOW_WAVE_COLOR = Color.White;
		private int DEFAULT_PROGRESS = 80;


		public WaveView(Context context, IAttributeSet attrs) : base(context, attrs)
		{
			Orientation = Orientation.Vertical;
			//load styled attributes.
			TypedArray attributes = context.Theme.ObtainStyledAttributes(attrs, Resource.Styleable.WaveView, Resource.Attribute.waveViewStyle, 0);
			mAboveWaveColor = attributes.GetColor(Resource.Styleable.WaveView_above_wave_color, DEFAULT_ABOVE_WAVE_COLOR);
			mBlowWaveColor = attributes.GetColor(Resource.Styleable.WaveView_blow_wave_color, DEFAULT_BLOW_WAVE_COLOR);
			mProgress = attributes.GetInt(Resource.Styleable.WaveView_progress, DEFAULT_PROGRESS);
			mWaveHeight = attributes.GetInt(Resource.Styleable.WaveView_wave_height, MIDDLE);
			mWaveMultiple = attributes.GetInt(Resource.Styleable.WaveView_wave_length, LARGE);
			mWaveHz = attributes.GetInt(Resource.Styleable.WaveView_wave_hz, MIDDLE);
			attributes.Recycle();

			mWave = new Wave(context, null);
			mWave.initializeWaveSize(mWaveMultiple, mWaveHeight, mWaveHz);
			mWave.setAboveWaveColor(mAboveWaveColor);
			mWave.setBlowWaveColor(mBlowWaveColor);
			mWave.initializePainters();

			mSolid = new Solid(context, null);
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
			mWaveToTop = (int)(Height * (1f - mProgress / 100f));
			ViewGroup.LayoutParams @params = mWave.LayoutParameters;
			if (@params != null)
			{
				((LayoutParams)@params).TopMargin = mWaveToTop;
			}

			mWave.LayoutParameters = @params;
		}


		private class SavedState : BaseSavedState
		{

			int progress;

			public SavedState(Parcel source) : base(source)
			{
				progress = source.ReadInt();
			}


			public override void WriteToParcel(Parcel dest, ParcelableWriteFlags flags)
			{
				base.WriteToParcel(dest, flags);
				dest.WriteInt(progress);
			}

			public class SavedStateCreator : Object, IParcelableCreator
			{
				public Object CreateFromParcel(Parcel source)
				{
					return new SavedState(source);
				}

				public Object[] NewArray(int size)
				{
					return new SavedState[size];
				}
			}
		}
	}
}
