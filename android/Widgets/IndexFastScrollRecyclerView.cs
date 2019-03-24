using System;
using Android.Content;
using Android.Content.Res;
using Android.Graphics;
using Android.Runtime;
using Android.Support.V7.Widget;
using Android.Util;
using Android.Views;

namespace Alloy.Widgets
{
	[Register("alloy.widgets.IndexFastScrollRecyclerView")]
	public class IndexFastScrollRecyclerView : RecyclerView
	{
		private IndexFastScrollRecyclerSection mScroller;
		private GestureDetector mGestureDetector;

		private bool mEnabled = true;

		public int mIndexTextSize = 12;
		public float mIndexbarWidth = 20;
		public float mIndexbarMarginWidth = 5;
		public float mIndexbarMarginHeight = 5;
		public int mPreviewPadding = 5;
		public int mIndexBarCornerRadius = 5;
		public float mIndexBarTransparentValue = (float)0.6;
		public Color mIndexbarBackgroudColor = Color.Black;
		public Color mIndexbarTextColor = Color.White;
		public Color mIndexbarHighLateTextColor = Color.Black;

		public int mPreviewTextSize = 50;
		public Color mPreviewBackgroudColor = Color.Black;
		public Color mPreviewTextColor = Color.White;
		public float mPreviewTransparentValue = (float)0.4;

		protected IndexFastScrollRecyclerView(IntPtr javaReference, JniHandleOwnership transfer) : base(javaReference, transfer)
		{
		}

		public IndexFastScrollRecyclerView(Context context) : base(context)
		{
		}

		public IndexFastScrollRecyclerView(Context context, IAttributeSet attrs) : base(context, attrs)
		{
			init(context, attrs);
		}

		public IndexFastScrollRecyclerView(Context context, IAttributeSet attrs, int defStyle) : base(context, attrs, defStyle)
		{
			init(context, attrs);
		}

		private void init(Context context, IAttributeSet attrs)
		{
			if (attrs != null)
			{
				TypedArray typedArray = context.ObtainStyledAttributes(attrs, Resource.Styleable.IndexFastScrollRecyclerView, 0, 0);

				if (typedArray != null)
				{
					try
					{
						mIndexTextSize = typedArray.GetInt(Resource.Styleable.IndexFastScrollRecyclerView_indexTextSize, mIndexTextSize);
						mIndexbarWidth = typedArray.GetFloat(Resource.Styleable.IndexFastScrollRecyclerView_indexbarWidth, mIndexbarWidth);
						mIndexbarMarginWidth = typedArray.GetFloat(Resource.Styleable.IndexFastScrollRecyclerView_indexbarMarginWidth, mIndexbarMarginWidth);
						mIndexbarMarginHeight = typedArray.GetFloat(Resource.Styleable.IndexFastScrollRecyclerView_indexbarMarginHeight, mIndexbarMarginHeight);
						mPreviewPadding = typedArray.GetInt(Resource.Styleable.IndexFastScrollRecyclerView_previewPadding, mPreviewPadding);
						mIndexBarCornerRadius = typedArray.GetInt(Resource.Styleable.IndexFastScrollRecyclerView_indexBarCornerRadius, mIndexBarCornerRadius);
						mIndexBarTransparentValue = typedArray.GetFloat(Resource.Styleable.IndexFastScrollRecyclerView_indexBarTransparentValue, mIndexBarTransparentValue);

						if (typedArray.HasValue(Resource.Styleable.IndexFastScrollRecyclerView_indexBarColor))
						{
							mIndexbarBackgroudColor = Color.ParseColor(typedArray.GetString(Resource.Styleable.IndexFastScrollRecyclerView_indexBarColor));
						}

						if (typedArray.HasValue(Resource.Styleable.IndexFastScrollRecyclerView_indexBarTextColor))
						{
							mIndexbarTextColor = Color.ParseColor(typedArray.GetString(Resource.Styleable.IndexFastScrollRecyclerView_indexBarTextColor));
						}

						if (typedArray.HasValue(Resource.Styleable.IndexFastScrollRecyclerView_indexBarHighlightTextColor))
						{
							mIndexbarHighLateTextColor = Color.ParseColor(typedArray.GetString(Resource.Styleable.IndexFastScrollRecyclerView_indexBarHighlightTextColor));
						}

						if (typedArray.HasValue(Resource.Styleable.IndexFastScrollRecyclerView_indexBarColorRes))
						{
							mIndexbarBackgroudColor = typedArray.GetColor(Resource.Styleable.IndexFastScrollRecyclerView_indexBarColorRes, mIndexbarBackgroudColor);
						}

						if (typedArray.HasValue(Resource.Styleable.IndexFastScrollRecyclerView_indexBarTextColorRes))
						{
							mIndexbarTextColor = typedArray.GetColor(Resource.Styleable.IndexFastScrollRecyclerView_indexBarTextColorRes, mIndexbarTextColor);
						}

						if (typedArray.HasValue(Resource.Styleable.IndexFastScrollRecyclerView_indexBarHighlightTextColorRes))
						{
							mIndexbarHighLateTextColor = typedArray.GetColor(Resource.Styleable.IndexFastScrollRecyclerView_indexBarHighlightTextColor, mIndexbarHighLateTextColor);
						}

						mPreviewTextSize = typedArray.GetInt(Resource.Styleable.IndexFastScrollRecyclerView_previewTextSize, mPreviewTextSize);
						mPreviewTransparentValue = typedArray.GetFloat(Resource.Styleable.IndexFastScrollRecyclerView_previewTransparentValue, mPreviewTransparentValue);

						if (typedArray.HasValue(Resource.Styleable.IndexFastScrollRecyclerView_previewColor))
						{
							mPreviewBackgroudColor = Color.ParseColor(typedArray.GetString(Resource.Styleable.IndexFastScrollRecyclerView_previewColor));
						}

						if (typedArray.HasValue(Resource.Styleable.IndexFastScrollRecyclerView_previewTextColor))
						{
							mPreviewTextColor = Color.ParseColor(typedArray.GetString(Resource.Styleable.IndexFastScrollRecyclerView_previewTextColor));
						}

					}
					finally
					{
						typedArray.Recycle();
					}
				}
			}
			mScroller = new IndexFastScrollRecyclerSection(context, this);
		}

		public override void OnDraw(Canvas c)
		{
			base.OnDraw(c);
			if (mScroller != null)
				mScroller.draw(c);
		}

		public override void SetAdapter(Adapter adapter)
		{
			base.SetAdapter(adapter);
			if (mScroller != null)
				mScroller.SetAdapter(adapter);
		}

		public override bool OnInterceptTouchEvent(MotionEvent ev)
		{
			if (mEnabled && mScroller != null && mScroller.contains(ev.GetX(), ev.GetY()))
				return true;

			return base.OnInterceptTouchEvent(ev);
		}

		protected override void OnSizeChanged(int w, int h, int oldw, int oldh)
		{
			base.OnSizeChanged(w, h, oldw, oldh);
			if (mScroller != null)
				mScroller.onSizeChanged(w, h, oldw, oldh);
		}



		public override bool OnTouchEvent(MotionEvent ev)
		{
			if (mEnabled)
			{
				// Intercept ListView's touch event
				if (mScroller != null && mScroller.onTouchEvent(ev))
					return true;

				if (mGestureDetector == null)
				{
					mGestureDetector = new GestureDetector(Context, new GestureDetector.SimpleOnGestureListener());
					mGestureDetector.OnTouchEvent(ev);
				}
			}

			return base.OnTouchEvent(ev);
		}

		public void SetIndexTextSize(int value)
		{
			mScroller.SetIndexTextSize(value);
		}

		public void SetIndexbarWidth(float value)
		{
			mScroller.SetIndexbarWidth(value);
		}

		public void SetIndexbarMarginWidth(float value)
		{
			mScroller.SetIndexbarMarginWidth(value);
		}

		public void SetIndexbarMarginHeight(float value)
		{
			mScroller.SetIndexbarMarginHeight(value);
		}

		public void SetPreviewPadding(int value)
		{
			mScroller.SetPreviewPadding(value);
		}

		public void SetIndexBarCornerRadius(int value)
		{
			mScroller.SetIndexBarCornerRadius(value);
		}

		public void SetIndexBarTransparentValue(float value)
		{
			mScroller.SetIndexBarTransparentValue(value);
		}

		public void SetTypeface(Typeface typeface)
		{
			mScroller.SetTypeface(typeface);
		}

		public void SetIndexBarVisibility(bool shown)
		{
			mScroller.SetIndexBarVisibility(shown);
			mEnabled = shown;
		}

		public void SetPreviewVisibility(bool shown)
		{
			mScroller.SetPreviewVisibility(shown);
		}

		public void SetPreviewTextSize(int value)
		{
			mScroller.SetPreviewTextSize(value);
		}

		public void SetPreviewColor(Color color)
		{
			mScroller.SetPreviewColor(color);
		}

		public void SetPreviewColor(String color)
		{
			mScroller.SetPreviewColor(Color.ParseColor(color));
		}

		public void SetPreviewTextColor(Color color)
		{
			mScroller.SetPreviewTextColor(color);
		}

		public void SetPreviewTransparentValue(float value)
		{
			mScroller.SetPreviewTransparentValue(value);
		}

		public void SetPreviewTextColor(String color)
		{
			mScroller.SetPreviewTextColor(Color.ParseColor(color));
		}

		public void SetIndexBarColor(String color)
		{
			mScroller.SetIndexBarColor(Color.ParseColor(color));
		}

		public void SetIndexBarColor(Color color)
		{
			mScroller.SetIndexBarColor(color);
		}

		public void SetIndexBarTextColor(String color)
		{
			mScroller.SetIndexBarTextColor(Color.ParseColor(color));
		}

		public void SetIndexBarTextColor(Color color)
		{
			mScroller.SetIndexBarTextColor(color);
		}

		public void SetIndexbarHighLateTextColor(String color)
		{
			mScroller.SetIndexBarHighLateTextColor(Color.ParseColor(color));
		}

		public void SetIndexbarHighLateTextColor(Color color)
		{
			mScroller.SetIndexBarHighLateTextColor(color);
		}

		public void SetIndexBarHighLateTextVisibility(bool shown)
		{
			mScroller.SetIndexBarHighLateTextVisibility(shown);
		}
	}
}