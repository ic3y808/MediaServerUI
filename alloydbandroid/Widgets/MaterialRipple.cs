using System;
using Android.Animation;
using Android.Content;
using Android.Content.Res;
using Android.Graphics;
using Android.Graphics.Drawables;
using Android.OS;
using Android.Util;
using Android.Views;
using Android.Views.Animations;
using Android.Widget;
using Java.Lang;
using Microsoft.AppCenter.Crashes;
using Math = Java.Lang.Math;
using Object = Java.Lang.Object;

namespace Alloy.Widgets
{
	public sealed class MaterialRippleLayout : FrameLayout
	{
		private const int DEFAULT_DURATION = 350;
		private const int DEFAULT_FADE_DURATION = 75;
		private const float DEFAULT_DIAMETER_DP = 35;
		private const float DEFAULT_ALPHA = 0.2f;
		private static readonly Color DEFAULT_COLOR = Color.Black;
		private static readonly Color DEFAULT_BACKGROUND = Color.Transparent;
		private const bool DEFAULT_HOVER = true;
		private const bool DEFAULT_DELAY_CLICK = true;
		private const bool DEFAULT_PERSISTENT = false;
		private const bool DEFAULT_SEARCH_ADAPTER = false;
		private const bool DEFAULT_RIPPLE_OVERLAY = false;
		private const int DEFAULT_ROUNDED_CORNERS = 0;

		private static int FADE_EXTRA_DELAY = 50;
		private static long HOVER_DURATION = 2500;

		private readonly Paint paint = new Paint(PaintFlags.AntiAlias);
		private readonly Rect bounds = new Rect();


		private bool rippleOverlay;
		private bool rippleHover;
		private int rippleDiameter;
		private int rippleDuration;
		private int rippleAlpha;
		private bool rippleDelayClick;
		private int rippleFadeDuration;
		private bool ripplePersistent;
		private Drawable rippleBackground;
		private bool rippleInAdapter;
		private float rippleRoundedCorners;

		private float radius;

		private AdapterView parentAdapter;
		private View childView;

		private AnimatorSet rippleAnimator;
		private Animator hoverAnimator;

		private Point currentCoords = new Point();
		private Point previousCoords = new Point();

		private LayerType layerType;

		private bool eventCancelled;
		private bool prepressed;
		private int positionInAdapter;

		private readonly GestureDetector gestureDetector;
		private PressedEvent pendingPressEvent;

		public static RippleBuilder on(View view)
		{
			return new RippleBuilder(view);
		}

		public MaterialRippleLayout(Context context) : this(context, null, 0)
		{

		}

		public MaterialRippleLayout(Context context, IAttributeSet attrs) : this(context, attrs, 0)
		{

		}

		public MaterialRippleLayout(Context context, IAttributeSet attrs, int defStyle) : base(context, attrs, defStyle)
		{
			SetWillNotDraw(false);
			LongClickListenerGesture longClickListener = new LongClickListenerGesture(this);
			gestureDetector = new GestureDetector(context, longClickListener);

			TypedArray a = context.ObtainStyledAttributes(attrs, Resource.Styleable.MaterialRippleLayout);
			Color rippleColor = a.GetColor(Resource.Styleable.MaterialRippleLayout_mrl_rippleColor, DEFAULT_COLOR);
			rippleDiameter = a.GetDimensionPixelSize(Resource.Styleable.MaterialRippleLayout_mrl_rippleDimension, (int)DpToPx(Resources, DEFAULT_DIAMETER_DP));
			rippleOverlay = a.GetBoolean(Resource.Styleable.MaterialRippleLayout_mrl_rippleOverlay, DEFAULT_RIPPLE_OVERLAY);
			rippleHover = a.GetBoolean(Resource.Styleable.MaterialRippleLayout_mrl_rippleHover, DEFAULT_HOVER);
			rippleDuration = a.GetInt(Resource.Styleable.MaterialRippleLayout_mrl_rippleDuration, DEFAULT_DURATION);
			rippleAlpha = (int)(255 * a.GetFloat(Resource.Styleable.MaterialRippleLayout_mrl_rippleAlpha, DEFAULT_ALPHA));
			rippleDelayClick = a.GetBoolean(Resource.Styleable.MaterialRippleLayout_mrl_rippleDelayClick, DEFAULT_DELAY_CLICK);
			rippleFadeDuration = a.GetInteger(Resource.Styleable.MaterialRippleLayout_mrl_rippleFadeDuration, DEFAULT_FADE_DURATION);
			rippleBackground = new ColorDrawable(a.GetColor(Resource.Styleable.MaterialRippleLayout_mrl_rippleBackground, DEFAULT_BACKGROUND));
			ripplePersistent = a.GetBoolean(Resource.Styleable.MaterialRippleLayout_mrl_ripplePersistent, DEFAULT_PERSISTENT);
			rippleInAdapter = a.GetBoolean(Resource.Styleable.MaterialRippleLayout_mrl_rippleInAdapter, DEFAULT_SEARCH_ADAPTER);
			rippleRoundedCorners = a.GetDimensionPixelSize(Resource.Styleable.MaterialRippleLayout_mrl_rippleRoundedCorners, DEFAULT_ROUNDED_CORNERS);

			a.Recycle();

			paint.Color = rippleColor;
			paint.Alpha = rippleAlpha;

			EnableClipPathSupportIfNecessary();
		}

		public override void AddView(View child, int index, ViewGroup.LayoutParams @params)
		{
			if (ChildCount > 0)
			{
				throw new IllegalStateException("MaterialRippleLayout can host only one child");
			}
			//noinspection unchecked
			childView = child;
			base.AddView(child, index, @params);
		}

		public override bool OnInterceptTouchEvent(MotionEvent e)
		{
			return !findClickableViewInChild(childView, (int)e.GetX(), (int)e.GetY());
		}

		protected override void OnDraw(Canvas canvas)
		{
			bool positionChanged = adapterPositionChanged();
			if (rippleOverlay)
			{
				if (!positionChanged)
				{
					rippleBackground.Draw(canvas);
				}
				//base.Draw(canvas);
				if (!positionChanged)
				{
					if (System.Math.Abs(rippleRoundedCorners) > 0.00001)
					{
						Path clipPath = new Path();
						RectF rect = new RectF(0, 0, canvas.Width, canvas.Height);
						clipPath.AddRoundRect(rect, rippleRoundedCorners, rippleRoundedCorners, Path.Direction.Cw);
						canvas.ClipPath(clipPath);
					}
					canvas.DrawCircle(currentCoords.X, currentCoords.Y, radius, paint);
				}
			}
			else
			{
				if (!positionChanged)
				{
					rippleBackground.Draw(canvas);
					canvas.DrawCircle(currentCoords.X, currentCoords.Y, radius, paint);
				}
				//base.Draw(canvas);
			}
		}

		protected override void OnSizeChanged(int w, int h, int oldw, int oldh)
		{
			base.OnSizeChanged(w, h, oldw, oldh);
			bounds.Set(0, 0, w, h);
			rippleBackground.Bounds = bounds;
		}

		public override bool IsInEditMode => true;

		public override bool OnTouchEvent(MotionEvent e)
		{
			bool superOnTouchEvent = base.OnTouchEvent(e);

			if (!Enabled || !childView.Enabled) return superOnTouchEvent;

			bool isEventInBounds = bounds.Contains((int)e.GetX(), (int)e.GetY());

			if (isEventInBounds)
			{
				previousCoords.Set(currentCoords.X, currentCoords.Y);
				currentCoords.Set((int)e.GetX(), (int)e.GetY());
			}

			bool gestureResult = gestureDetector.OnTouchEvent(e);

			if (gestureResult || hasPerformedLongPress)
			{
				return true;
			}
			else
			{

				MotionEventActions action = e.ActionMasked;
				switch (action)
				{
					case MotionEventActions.Move:
						if (rippleHover)
						{
							if (isEventInBounds && !eventCancelled)
							{
								Invalidate();
							}
							else if (!isEventInBounds)
							{
								startRipple(null);
							}
						}

						if (!isEventInBounds)
						{
							cancelPressedEvent();
							if (hoverAnimator != null)
							{
								hoverAnimator.Cancel();
							}
							childView.OnTouchEvent(e);
							eventCancelled = true;
						}
						break;
					case MotionEventActions.Cancel:
						if (rippleInAdapter)
						{
							// dont use current coords in adapter since they tend to jump drastically on scroll
							currentCoords.Set(previousCoords.X, previousCoords.Y);
							previousCoords = new Point();
						}
						childView.OnTouchEvent(e);
						if (rippleHover)
						{
							if (!prepressed)
							{
								startRipple(null);
							}
						}
						else
						{
							childView.Pressed = false;
						}
						cancelPressedEvent();
						break;
					case MotionEventActions.Down:
						setPositionInAdapter();
						eventCancelled = false;
						pendingPressEvent = new PressedEvent(this, e);
						if (isInScrollingContainer())
						{
							cancelPressedEvent();
							prepressed = true;
							//postDelayed(pendingPressEvent, ViewConfiguration.getTapTimeout());
						}
						else
						{
							pendingPressEvent.Run();
						}
						break;

					case MotionEventActions.Up:
						PerformClickEvent pendingClickEvent = new PerformClickEvent(this);

						if (prepressed)
						{
							childView.Pressed = true;
							//PostDelayed(
							//	new Runnable() {
							//		@Override public void run()
							//		{
							//		childView.setPressed(false);
							//	}
							//}, ViewConfiguration.getPressedStateDuration());
						}

						if (isEventInBounds)
						{
							startRipple(pendingClickEvent);
						}
						else if (!rippleHover)
						{
							setRadius(0);
						}
						if (!rippleDelayClick && isEventInBounds)
						{
							pendingClickEvent.Run();
						}
						cancelPressedEvent();
						break;
				}
			}

			return true;

		}

		private void cancelPressedEvent()
		{
			if (pendingPressEvent != null)
			{
				RemoveCallbacks(pendingPressEvent);
				prepressed = false;
			}
		}

		private bool hasPerformedLongPress;

		public override void SetOnClickListener(IOnClickListener l)
		{
			if (l == null) throw new ArgumentNullException(nameof(l));
			if (childView == null)
			{
				throw new IllegalStateException("MaterialRippleLayout must have a child view to handle clicks");
			}
			childView.SetOnClickListener(l);
		}

		public override void SetOnLongClickListener(IOnLongClickListener onClickListener)
		{
			if (childView == null)
			{
				throw new IllegalStateException("MaterialRippleLayout must have a child view to handle clicks");
			}
			childView.SetOnLongClickListener(onClickListener);
		}

		private void startHover()
		{
			if (eventCancelled) return;

			if (hoverAnimator != null)
			{
				hoverAnimator.Cancel();
			}
			float newRadius = (float)(Math.Sqrt(Math.Pow(Width, 2) + Math.Pow(Height, 2)) * 1.2f);
			hoverAnimator = ObjectAnimator.OfFloat(this, radiusProperty, rippleDiameter, newRadius).SetDuration(HOVER_DURATION);
			hoverAnimator.SetInterpolator(new LinearInterpolator());
			hoverAnimator.Start();
		}

		public class AnimationListener : AnimatorListenerAdapter
		{
			private readonly MaterialRippleLayout layout;
			private readonly IRunnable animationEndRunnable;
			public AnimationListener(MaterialRippleLayout layout, IRunnable animationEndRunnable)
			{
				this.layout = layout;
				this.animationEndRunnable = animationEndRunnable;
			}
			public override void OnAnimationEnd(Animator animation)
			{
				if (!layout.ripplePersistent)
				{
					layout.setRadius(0);
					layout.SetRippleAlpha(layout.rippleAlpha);
				}
				if (animationEndRunnable != null && layout.rippleDelayClick)
				{
					animationEndRunnable.Run();
				}

				layout.childView.Pressed = false;
			}
		}

		private void startRipple(IRunnable animationEndRunnable)
		{
			if (eventCancelled) return;

			float endRadius = getEndRadius();

			cancelAnimations();

			rippleAnimator = new AnimatorSet();
			rippleAnimator.AddListener(new AnimationListener(this, animationEndRunnable));

			ObjectAnimator ripple = ObjectAnimator.OfFloat(this, radiusProperty, radius, endRadius);
			ripple.SetDuration(rippleDuration);
			ripple.SetInterpolator(new DecelerateInterpolator());
			ObjectAnimator fade = ObjectAnimator.OfInt(this, circleAlphaProperty, rippleAlpha, 0);
			fade.SetDuration(rippleFadeDuration);
			fade.SetInterpolator(new AccelerateInterpolator());
			fade.StartDelay = rippleDuration - rippleFadeDuration - FADE_EXTRA_DELAY;

			if (ripplePersistent)
			{
				rippleAnimator.Play(ripple);
			}
			else if (getRadius() > endRadius)
			{
				fade.StartDelay = 0;
				rippleAnimator.Play(fade);
			}
			else
			{
				rippleAnimator.PlayTogether(ripple, fade);
			}
			rippleAnimator.Start();
		}

		private void cancelAnimations()
		{
			if (rippleAnimator != null)
			{
				rippleAnimator.Cancel();
				rippleAnimator.RemoveAllListeners();
			}

			hoverAnimator?.Cancel();
		}

		private float getEndRadius()
		{
			int width = Width;
			int height = Height;

			int halfWidth = width / 2;
			int halfHeight = height / 2;

			float radiusX = halfWidth > currentCoords.X ? width - currentCoords.X : currentCoords.X;
			float radiusY = halfHeight > currentCoords.Y ? height - currentCoords.Y : currentCoords.Y;

			return (float)Math.Sqrt(Math.Pow(radiusX, 2) + Math.Pow(radiusY, 2)) * 1.2f;
		}

		private bool isInScrollingContainer()
		{
			IViewParent p = Parent;
			while (p is ViewGroup)
			{
				if (((ViewGroup)p).ShouldDelayChildPressedState())
				{
					return true;
				}
				p = p.Parent;
			}
			return false;
		}

		private AdapterView findParentAdapterView()
		{
			if (parentAdapter != null)
			{
				return parentAdapter;
			}
			IViewParent current = Parent;
			while (true)
			{
				if (current is AdapterView view)
				{
					parentAdapter = view;
					return parentAdapter;
				}

				try
				{
					current = current.Parent;
				}
				catch (NullPointerException npe)
				{
					Crashes.TrackError(npe);
					throw new RuntimeException("Could not find a parent AdapterView");
				}
			}
		}



		private void setPositionInAdapter()
		{
			if (rippleInAdapter)
			{
				positionInAdapter = findParentAdapterView().GetPositionForView(this);
			}
		}

		private bool adapterPositionChanged()
		{
			if (rippleInAdapter)
			{
				int newPosition = findParentAdapterView().GetPositionForView(this);
				bool changed = newPosition != positionInAdapter;
				positionInAdapter = newPosition;
				if (changed)
				{
					cancelPressedEvent();
					cancelAnimations();
					childView.Pressed = false;
					setRadius(0);
				}
				return changed;
			}
			return false;
		}

		private bool findClickableViewInChild(View view, int x, int y)
		{
			ViewGroup viewGroup = view as ViewGroup;
			if (viewGroup != null)
			{
				for (int i = 0; i < viewGroup.ChildCount; i++)
				{
					View child = viewGroup.GetChildAt(i);
					Rect rect = new Rect();
					child.GetHitRect(rect);

					bool contains = rect.Contains(x, y);
					if (contains)
					{
						return findClickableViewInChild(child, x - rect.Left, y - rect.Top);
					}
				}
			}
			else if (view != childView)
			{
				return (view.Enabled && (view.Clickable || view.LongClickable || view.FocusableInTouchMode));
			}

			return view.FocusableInTouchMode;
		}

		private float getRadius()
		{
			return radius;
		}

		public void setRadius(float newRadius)
		{
			radius = newRadius;
			Invalidate();
		}

		public int getRippleAlpha()
		{
			return paint.Alpha;
		}

		public void SetRippleAlpha(int newRippleAlpha)
		{
			paint.Alpha = newRippleAlpha;
			Invalidate();
		}

		public void SetRippleColor(Color newRippleColor)
		{
			Color rippleColor = newRippleColor;
			paint.Color = rippleColor;
			paint.Alpha = rippleAlpha;
			Invalidate();
		}

		public void SetRippleOverlay(bool newRippleOverlay)
		{
			rippleOverlay = newRippleOverlay;
		}

		public void SetRippleDiameter(int newRippleDiameter)
		{
			rippleDiameter = newRippleDiameter;
		}

		public void SetRippleDuration(int newRippleDuration)
		{
			rippleDuration = newRippleDuration;
		}

		public void SetRippleBackground(Color color)
		{
			rippleBackground = new ColorDrawable(color) { Bounds = bounds };
			Invalidate();
		}

		public void SetRippleHover(bool newRippleHover)
		{
			rippleHover = newRippleHover;
		}

		public void SetRippleDelayClick(bool newRippleDelayClick)
		{
			rippleDelayClick = newRippleDelayClick;
		}

		public void SetRippleFadeDuration(int newRippleFadeDuration)
		{
			rippleFadeDuration = newRippleFadeDuration;
		}

		public void SetRipplePersistent(bool newRipplePersistent)
		{
			ripplePersistent = newRipplePersistent;
		}

		public void SetRippleInAdapter(bool newRippleInAdapter)
		{
			rippleInAdapter = newRippleInAdapter;
		}

		public void SetRippleRoundedCorners(int rippleRoundedCorner)
		{
			rippleRoundedCorners = rippleRoundedCorner;
			EnableClipPathSupportIfNecessary();
		}

		public void SetDefaultRippleAlpha(float alpha)
		{
			rippleAlpha = (int)(255 * alpha);
			paint.Alpha = rippleAlpha;
			Invalidate();
		}

		public void PerformRipple()
		{
			currentCoords = new Point(Width / 2, Height / 2);
			startRipple(null);
		}

		public void PerformRipple(Point anchor)
		{
			currentCoords = new Point(anchor.X, anchor.Y);
			startRipple(null);
		}

		private void EnableClipPathSupportIfNecessary()
		{
			if (Build.VERSION.SdkInt > BuildVersionCodes.JellyBeanMr1) return;
			if (System.Math.Abs(rippleRoundedCorners) > 0.00001)
			{
				layerType = LayerType;
				SetLayerType(LayerType.Software, null);
			}
			else
			{
				SetLayerType(layerType, null);
			}
		}

		static float DpToPx(Resources resources, float dp)
		{
			return TypedValue.ApplyDimension(ComplexUnitType.Dip, dp, resources.DisplayMetrics);
		}

		public class RadiusPropertyClass : Property
		{
			public RadiusPropertyClass(Class type, string name) : base(type, name)
			{
			}

			public override Object Get(Object @object)
			{
				MaterialRippleLayout layout = (MaterialRippleLayout)@object;
				return layout.getRadius();
			}

			public override void Set(Object @object, Object value)
			{
				MaterialRippleLayout layout = (MaterialRippleLayout)@object;
				layout.setRadius((float)value);
			}
		}

		public class CircleAlphaPropertyClass : Property
		{
			public CircleAlphaPropertyClass(Class type, string name) : base(type, name)
			{
			}

			public override Object Get(Object @object)
			{
				MaterialRippleLayout layout = (MaterialRippleLayout)@object;
				return layout.getRippleAlpha();
			}

			public override void Set(Object @object, Object value)
			{
				MaterialRippleLayout layout = (MaterialRippleLayout)@object;
				layout.SetRippleAlpha((int)value);
			}
		}

		private readonly Property radiusProperty = new RadiusPropertyClass(Class.FromType(typeof(MaterialRippleLayout)), "radius");


		private readonly Property circleAlphaProperty = new CircleAlphaPropertyClass(Class.FromType(typeof(MaterialRippleLayout)), "rippleAlpha");

		private class PerformClickEvent : Object, IRunnable
		{
			private MaterialRippleLayout layout;

			public PerformClickEvent(MaterialRippleLayout layout)
			{
				this.layout = layout;
			}

			public void Run()
			{
				if (layout.hasPerformedLongPress) return;

				// if parent is an AdapterView, try to call its ItemClickListener
				if (layout.Parent is AdapterView)
				{
					// try clicking direct child first
					if (!layout.childView.PerformClick())
						// if it did not handle it dispatch to adapterView
						clickAdapterView((AdapterView)layout.Parent);
				}
				else if (layout.rippleInAdapter)
				{
					// find adapter view
					clickAdapterView(layout.findParentAdapterView());
				}
				else
				{
					// otherwise, just perform click on child
					layout.childView.PerformClick();
				}
			}

			private void clickAdapterView(AdapterView parent)
			{
				int position = parent.GetPositionForView(layout);
				long itemId = parent.GetItemIdAtPosition(position);
				if (position != AdapterView.InvalidPosition)
				{
					parent.PerformItemClick(layout, position, itemId);
				}
			}
		}

		private class PressedEvent : Object, IRunnable
		{
			private readonly MaterialRippleLayout layout;
			private readonly MotionEvent motionEvent;

			public PressedEvent(MaterialRippleLayout layout, MotionEvent e)
			{
				this.layout = layout;
				motionEvent = e;
			}

			public void Run()
			{
				layout.prepressed = false;
				layout.childView.LongClickable = false; //prevent the child's long click,let's the ripple layout call it's performLongClick
				layout.childView.OnTouchEvent(motionEvent);
				layout.childView.Pressed = true;
				if (layout.rippleHover)
				{
					layout.startHover();
				}
			}
		}

		public class LongClickListenerGesture : GestureDetector.SimpleOnGestureListener
		{
			private readonly MaterialRippleLayout layout;
			public LongClickListenerGesture(MaterialRippleLayout layout)
			{
				this.layout = layout;
			}

			public override void OnLongPress(MotionEvent e)
			{
				layout.hasPerformedLongPress = layout.childView.PerformLongClick();
				if (!layout.hasPerformedLongPress) return;
				if (layout.rippleHover)
				{
					layout.startRipple(null);
				}
				layout.cancelPressedEvent();
			}
			public override bool OnDown(MotionEvent e)
			{
				layout.hasPerformedLongPress = false;
				return base.OnDown(e);
			}
		}

		public class RippleBuilder
		{

			private readonly Context context;
			private readonly View child;

			private Color rippleColor = DEFAULT_COLOR;
			private bool rippleOverlay = DEFAULT_RIPPLE_OVERLAY;
			private bool rippleHover = DEFAULT_HOVER;
			private float rippleDiameter = DEFAULT_DIAMETER_DP;
			private int rippleDuration = DEFAULT_DURATION;
			private float rippleAlpha = DEFAULT_ALPHA;
			private bool rippleDelayClick = DEFAULT_DELAY_CLICK;
			private int rippleFadeDuration = DEFAULT_FADE_DURATION;
			private bool ripplePersistent = DEFAULT_PERSISTENT;
			private Color rippleBackground = DEFAULT_BACKGROUND;
			private bool rippleSearchAdapter = DEFAULT_SEARCH_ADAPTER;
			private float rippleRoundedCorner = DEFAULT_ROUNDED_CORNERS;

			public RippleBuilder(View child)
			{
				this.child = child;
				context = child.Context;
			}

			public RippleBuilder RippleColor(Color color)
			{
				rippleColor = color;
				return this;
			}

			public RippleBuilder RippleOverlay(bool overlay)
			{
				rippleOverlay = overlay;
				return this;
			}

			public RippleBuilder RippleHover(bool hover)
			{
				rippleHover = hover;
				return this;
			}

			public RippleBuilder RippleDiameterDp(int diameterDp)
			{
				rippleDiameter = diameterDp;
				return this;
			}

			public RippleBuilder RippleDuration(int duration)
			{
				rippleDuration = duration;
				return this;
			}

			public RippleBuilder RippleAlpha(float alpha)
			{
				rippleAlpha = alpha;
				return this;
			}

			public RippleBuilder RippleDelayClick(bool delayClick)
			{
				rippleDelayClick = delayClick;
				return this;
			}

			public RippleBuilder RippleFadeDuration(int fadeDuration)
			{
				rippleFadeDuration = fadeDuration;
				return this;
			}

			public RippleBuilder RipplePersistent(bool persistent)
			{
				ripplePersistent = persistent;
				return this;
			}

			public RippleBuilder RippleBackground(Color color)
			{
				rippleBackground = color;
				return this;
			}

			public RippleBuilder RippleInAdapter(bool inAdapter)
			{
				rippleSearchAdapter = inAdapter;
				return this;
			}

			public RippleBuilder RippleRoundedCorners(int radiusDp)
			{
				rippleRoundedCorner = radiusDp;
				return this;
			}

			public MaterialRippleLayout create()
			{
				MaterialRippleLayout layout = new MaterialRippleLayout(context);
				layout.SetRippleColor(rippleColor);
				layout.SetDefaultRippleAlpha(rippleAlpha);
				layout.SetRippleDelayClick(rippleDelayClick);
				layout.SetRippleDiameter((int)DpToPx(context.Resources, rippleDiameter));
				layout.SetRippleDuration(rippleDuration);
				layout.SetRippleFadeDuration(rippleFadeDuration);
				layout.SetRippleHover(rippleHover);
				layout.SetRipplePersistent(ripplePersistent);
				layout.SetRippleOverlay(rippleOverlay);
				layout.SetRippleBackground(rippleBackground);
				layout.SetRippleInAdapter(rippleSearchAdapter);
				layout.SetRippleRoundedCorners((int)DpToPx(context.Resources, rippleRoundedCorner));

				ViewGroup.LayoutParams @params = child.LayoutParameters;
				ViewGroup parent = (ViewGroup)child.Parent;
				int index = 0;

				if (parent != null && parent is MaterialRippleLayout)
				{
					throw new IllegalStateException("MaterialRippleLayout could not be created: parent of the view already is a MaterialRippleLayout");
				}

				if (parent != null)
				{
					index = parent.IndexOfChild(child);
					parent.RemoveView(child);
				}

				layout.AddView(child, new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MatchParent, ViewGroup.LayoutParams.MatchParent));

				if (parent != null)
				{
					parent.AddView(layout, index, @params);
				}

				return layout;
			}
		}

	}
}
