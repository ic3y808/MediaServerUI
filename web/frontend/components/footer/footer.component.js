import "./footer.scss";
class FooterController {
  constructor($scope, $rootScope, $location, $element, Logger, MediaElement, AppUtilities, Backend, MediaPlayer, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.$element = $element;
    this.Logger = Logger;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Logger.debug("footer-controller");

    $scope.playPause = () => {
      if (this.MediaPlayer) {
        var selected = this.MediaPlayer.selectedTrack();
        if (selected) {
          if (this.MediaPlayer.remotePlayerConnected()) {
            if (!this.MediaPlayer.remotePlayer.isPaused) { this.MediaPlayer.pause(); }
            else { this.MediaPlayer.play(); }
          } else {
            if (this.MediaPlayer.playing) { this.MediaPlayer.pause(); }
            else { this.MediaPlayer.play(); }
          }
        }
      }
    };

    $scope.isPlaying = () => {
      if (this.MediaPlayer) {
        var selected = this.MediaPlayer.selectedTrack();
        if (selected) {
          if (this.MediaPlayer.remotePlayerConnected()) {
            if (!this.MediaPlayer.remotePlayer.isPaused) {return "icon-play";}
            else {return "icon-pause";}
          } else {
            if (this.MediaPlayer.playing) {return "icon-pause";}
            else {return "icon-play";}
          }
        }
      }
      return "icon-play";
    };

    $scope.skipBack = () => {
      this.MediaPlayer.previous();
    };

    $scope.skipNext = () => {
      this.MediaPlayer.next();
    };

    $scope.toggleShuffle = () => {

    };

    $scope.toggleRepeat = () => {
      this.MediaPlayer.repeatEnabled = !this.MediaPlayer.repeatEnabled;
    };

    $scope.isRepeatOn = () => {
      if (this.MediaPlayer.repeatEnabled) {
        return "icon-loop";
      }
      return "icon-loop";
    };

    $scope.isMuted = () => {
      if (this.MediaPlayer.currentVolume === 0) {
        return "icon-volume-off";
      }
      if (this.MediaPlayer.isMuted) {
        return "icon-volume-off";
      }
      return "icon-volume-on";
    };

    $scope.toggleMute = () => {
      if (this.MediaPlayer.remotePlayerConnected()) {
        this.MediaPlayer.remotePlayerController.muteOrUnmute();
        this.MediaPlayer.isMuted = this.MediaPlayer.remotePlayer.isMuted;
        if (this.MediaPlayer.isMuted) {
          this.MediaPlayer.remotePlayer.volumeLevel = 0;
        } else {
          vol = this.MediaPlayer.remotePlayer.volumeLevel;

        }
      } else {
        this.MediaPlayer.isMuted = !this.MediaPlayer.isMuted;
        if (this.MediaPlayer.isMuted) {
          this.MediaElement.volume = 0;

        } else {
          this.MediaElement.volume = this.MediaPlayer.currentVolume;
        }
      }
    };

    $scope.shareTrack = () => {
      this.Logger.debug("shareButton");
      this.AlloyDbService.createShare(this.MediaPlayer.selectedTrack().id, "Shared from Alloy").then(function (result) {
        $("#shareButton").popover({
          animation: true,
          content: "Success! Url Copied to Clipboard.",
          delay: {
            "show": 0,
            "hide": 5000
          },
          placement: "top"
        }).popover("show");
        var url = result.url.toString();
        this.AppUtilities.copyTextToClipboard(url);
        setTimeout(() => {
          $("#shareButton").popover("hide");
        }, 5000);
      });
    };

    $scope.isStarred = () => {
      if (this.MediaPlayer) {
        var selected = this.MediaPlayer.selectedTrack();
        if (selected) {
          if (selected.starred === "true") {return "icon-star"};
        }
      }
      return "icon-star-o";
    };

    $scope.starTrack = () => {
      if (this.MediaPlayer) {
        var selected = this.MediaPlayer.selectedTrack();
        if (selected) {
          this.Logger.info("Trying to star track: " + selected.title);
          if (selected.starred === "true") {
            this.AlloyDbService.unstar({ id: selected.id }).then((result) => {
              this.Logger.info("UnStarred " + selected.title + " " + JSON.stringify(result));
              selected.starred = "false";
              this.AppUtilities.apply();
            });
          } else {
            this.AlloyDbService.star({ id: selected.id }).then((result) => {
              this.Logger.info("Starred " + selected.title + " " + JSON.stringify(result));
              selected.starred = "true";
              this.AppUtilities.apply();
            });
          }
        }
      }
    };

    $rootScope.$watch("MediaPlayer", (o, n) => {
      if ($rootScope.MediaPlayer) {

        this.AppUtilities.apply();

      }
    });
  }

  $onInit() {
    this.Logger.debug("footer-init");
    this.$element.addClass("vbox");
    this.$element.addClass("scrollable");

    $("#subProgress").attr("aria-valuenow", 0).css("width", "0%");

    function getMousePos(canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
      };
    }

    //$("#clickProgress").mousemove(function (evt) {
    //  var c = document.getElementById("clickProgress");
    //  var ctx = c.getContext("2d");
    //  var x = (evt.pageX - $("#clickProgress").offset().left) + $(window).scrollLeft();
    //  var y = (evt.pageY - $("#clickProgress").offset().top) + $(window).scrollTop();
    //  ctx.save();
    //  ctx.setTransform(1, 0, 0, 1, 0, 0);
    //  ctx.clearRect(0, 0, c.width, c.height);
    //  ctx.restore();
    //  ctx.beginPath();
    //  ctx.moveTo(x, 0);
    //  ctx.lineTo(x, 60);
    //  ctx.stroke();
    //});

    $("#clickProgress").click((e) => {
      var seekto = NaN;

      if (this.MediaPlayer.remotePlayerConnected()) {
        var currentMediaDuration = this.MediaPlayer.remotePlayer.duration;
        seekto = currentMediaDuration * ((e.offsetX / $("#clickProgress").width()));
        if (!isNaN(seekto)) {
          this.MediaPlayer.remotePlayer.currentTime = seekto;
          this.MediaPlayer.remotePlayerController.seek();
        }
      } else {
        var duration = this.MediaElement.duration;
        if (!isFinite(duration)) { duration = this.MediaPlayer.selectedTrack().duration; }
        seekto = duration * ((e.offsetX / $("#clickProgress").width()));
        if (!isNaN(seekto)) {
          this.MediaElement.currentTime = seekto;
        }
      }
    });

    $("#downloadButton").click(() => {
      var dlUrl = this.AlloyDbService.download(this.MediaPlayer.selectedTrack().id);
      window.open(dlUrl, "_blank");
    });

    $("#nowPlayingImageHolder").click(() => {
      this.$location.path("/playing");
    });
  }
}

export default {
  bindings: {},
  controller: FooterController,
  templateUrl: "/template/footer.jade",
  selector: "footer-mediaplayer"
};