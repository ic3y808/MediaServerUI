import './style.scss';
const context = cast.framework.CastReceiverContext.getInstance();
const playerManager = context.getPlayerManager();

var w = $( window ).width();
var h = $( window ).height(); 

var url = 'https://source.unsplash.com/random/' + w + 'x' + h;

console.log(url);
$("#player").css("--splash-image", "url('" + url + "')");
$("#player").css("background-image", "url('" + url + "')");
$("#player").css("--slideshow-image-1", "url('" + url + "')");
$("#player").css("--slideshow-image-2", "url('" + url + "')");
$("#player").css("--slideshow-image-3", "url('" + url + "')");
$("#player").css("--slideshow-image-4", "url('" + url + "')");
$("#player").css("--slideshow-image-5", "url('" + url + "')");
$("#player").css("--slideshow-image-6", "url('" + url + "')");
$("#player").css("--slideshow-image-7", "url('" + url + "')");
$("#player").css("--slideshow-image-8", "url('" + url + "')");
$("#player").css("--slideshow-image-9", "url('" + url + "')");

const playerData = {};
const playerDataBinder = new cast.framework.ui.PlayerDataBinder(playerData);

// Update ui according to player state
playerDataBinder.addEventListener(
    cast.framework.ui.PlayerDataEventType.STATE_CHANGED,
    e => {
      switch (e.value) {
        case cast.framework.ui.State.LAUNCHING:
        case cast.framework.ui.State.IDLE:
          // Write your own event handling code
          break;
        case cast.framework.ui.State.LOADING:
          // Write your own event handling code
          break;
        case cast.framework.ui.State.BUFFERING:
          // Write your own event handling code
          break;
        case cast.framework.ui.State.PAUSED:
          // Write your own event handling code
          break;
        case cast.framework.ui.State.PLAYING:
          // Write your own event handling code
          break;
      }
    });

// listen to all Core Events
playerManager.addEventListener(cast.framework.events.category.CORE,
	event => {
		console.log(event);
	});

const playbackConfig = new cast.framework.PlaybackConfig();

// Sets the player to start playback as soon as there are five seconds of
// media contents buffered. Default is 10.
playbackConfig.autoResumeDuration = 5;

const options = new cast.framework.CastReceiverOptions();
options.maxInactivity = 15; //Development only
options.disableIdleTimeout = true; //Development only
options.statusText = "Unity"; //Development only

context.start({
  playbackConfig: playbackConfig,
  supportedCommands: cast.framework.messages.Command.ALL_BASIC_MEDIA |
					 cast.framework.messages.Command.QUEUE_PREV |
					 cast.framework.messages.Command.QUEUE_NEXT,
  options: options
});