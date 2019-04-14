export default function (MediaElement, MediaPlayer, AppUtilities) {
  "ngInject";
  return {
    restrict: "E",
    scope: {
      direction: "@"
    },
    templateUrl: "/template/volumeslider.jade",

    replace: true,
    link: function (scope, element, attrs) {

      scope.getVolume = () => {
        var vol = MediaPlayer.checkVolume();
        return { "width": vol * 100 + "%" };
      };

      scope.updateVolume = (val) => {
        MediaPlayer.currentVolume = val;
        if (MediaPlayer.remotePlayerConnected()) {
          MediaPlayer.remotePlayer.volumeLevel = val;
          MediaPlayer.remotePlayerController.setVolumeLevel();
        } else {
          MediaElement.volume = val;
        }
        AppUtilities.apply();
      };

      element.bind("click", (event) => {
        var $bar = element[0],
          offset = $bar.getBoundingClientRect(),
          x = event.pageX - offset.left,
          w = $bar.clientWidth;
        scope.updateVolume(x / w);
      });

      element.bind("DOMMouseScroll mousewheel onmousewheel", (event) => {

        // cross-browser wheel delta
        var event = window.event || event; // old IE support
        var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

        var value = 0;
        if (delta < 0) {
          value = -0.05;
        } else if (delta > 0) {
          value = 0.05;
        }
        var vol = MediaPlayer.checkVolume();
        vol = vol + value;
        if (vol < 0) {vol = 0;}
        if (vol > 1) {vol = 1;}
        scope.updateVolume(vol);

        // for IE
        event.returnValue = false;
        // for Chrome and Firefox
        if (event.preventDefault) {
          event.preventDefault();
        }
      });
    }
  };
}