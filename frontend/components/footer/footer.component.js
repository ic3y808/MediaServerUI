import './footer.scss';
class FooterController {
  constructor($scope, $rootScope, MediaElement, AppUtilities, Backend, MediaPlayer, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;

    this.Backend.debug('footer-controller');
  }

  updateVolume(val) {
    this.MediaPlayer.currentVolume = val;
    if (this.MediaPlayer.remotePlayerConnected()) {
      this.MediaPlayer.remotePlayer.volumeLevel = val;
      this.MediaPlayer.remotePlayerController.setVolumeLevel();
    } else {
      this.MediaElement.volume = val;
    }
  }

  $onInit() {
    var that = this;
    that.Backend.debug('footer-init');

    $('#subProgress').attr('aria-valuenow', 0).css('width', "0%");
    $('#mainProgress').attr('aria-valuenow', 0).css('width', "0%");

    $('.btn').on('click', function (event) {
      this.blur();
    });

    $('#volumeSlider').on('mousewheel', function (event) {
      event.preventDefault();
      var value = parseInt($("#volumeSlider").val());
      if (event.originalEvent.deltaY < 0) {
        value = value + 5;
        $("#volumeSlider").val(value);
      }
      else if (event.originalEvent.deltaY > 0) {
        value = value - 5;
        $("#volumeSlider").val(value);
      }

      that.updateVolume($('#volumeSlider').val() / 100);
    });

    $("#volumeSlider").on('change', function () {

    });

    $("#volumeSlider").on('input change', function () {
      that.updateVolume($('#volumeSlider').val() / 100);
    });

    $("#clickProgress").click(function (e) {
      var seekto = NaN;

      if (that.MediaPlayer.remotePlayerConnected()) {
        var currentMediaDuration = that.MediaPlayer.remotePlayer.duration;
        seekto = currentMediaDuration * ((e.offsetX / $("#clickProgress").width()));
        if (!isNaN(seekto)) {
          that.MediaPlayer.remotePlayer.currentTime = seekto;
          that.MediaPlayer.remotePlayerController.seek();
        }
      } else {
        var duration = that.MediaElement.duration;
        if (!isFinite(duration))
          duration = that.MediaPlayer.selectedTrack().duration;
        seekto = duration * ((e.offsetX / $("#clickProgress").width()));
        if (!isNaN(seekto)) {
          that.MediaElement.currentTime = seekto;
        }
      }
    });

    $("#shareButton").click(function () {
      that.Backend.debug('shareButton');
      //that.AlloyDbService.createShare(that.MediaPlayer.selectedTrack().id, 'Shared from Alloy').then(function (result) {
      //  $('#shareButton').popover({
      //    animation: true,
      //    content: 'Success! Url Copied to Clipboard.',
      //    delay: {
      //      "show": 0,
      //      "hide": 5000
      //    },
      //    placement: 'top'
      //  }).popover('show');
      //  var url = result.url.toString();
      //  that.AppUtilities.copyTextToClipboard(url);
      //  setTimeout(() => {
      //    $('#shareButton').popover('hide');
      //  }, 5000);
      //});

    });

    $("#muteButton").click(function () {
      var vol = 0;
      if (that.MediaPlayer.remotePlayerConnected()) {
        that.MediaPlayer.remotePlayerController.muteOrUnmute();
        that.MediaPlayer.isMuted = that.MediaPlayer.remotePlayer.isMuted;
        if (that.MediaPlayer.isMuted) {
          vol = 0;
          $('#volumeSlider').val(vol);
        } else {
          vol = that.MediaPlayer.remotePlayer.volumeLevel;
          $('#volumeSlider').val(vol * 100);
        }
      } else {
        that.MediaPlayer.isMuted = !that.MediaPlayer.isMuted;
        if (that.MediaPlayer.isMuted) {
          that.MediaElement.volume = 0;
          $('#volumeSlider').val(0);
        } else {
          that.MediaElement.volume = that.MediaPlayer.currentVolume;
          $('#volumeSlider').val(that.MediaPlayer.currentVolume * 100);
        }
      }
      this.blur();
    });

    $("#skipBackButton").click(function () {
      that.MediaPlayer.previous();
      this.blur();
    });

    $("#playPauseButton").click(function () {

      if (that.MediaPlayer.remotePlayerConnected()) {
        if (!that.MediaPlayer.remotePlayer.isPaused) that.MediaPlayer.pause();
        else that.MediaPlayer.play();
      } else {
        if (that.MediaPlayer.playing) that.MediaPlayer.pause();
        else that.MediaPlayer.play();
      }
      this.blur();
    });

    $("#skipNextButton").click(function () {
      that.MediaPlayer.next();
      this.blur();
    });

    $("#repeatButton").click(function () {
      that.MediaPlayer.repeatEnabled = !that.MediaPlayer.repeatEnabled;
      $("#repeatButton").toggleClass('button-selected');
      this.blur();
    });

    $("#downloadButton").click(function () {
      var dlUrl = that.AlloyDbService.download(that.MediaPlayer.selectedTrack().id);
      window.open(dlUrl, '_blank');
    });

    $("#likeButton").click(function () {
      var track = that.MediaPlayer.selectedTrack();
      that.Backend.info('liking track: ' + track.artist + " - " + track.title);
      if (track.starred === 'true') {
        that.AlloyDbService.unstar({ id: that.MediaPlayer.selectedTrack().id }).then(function (result) {
          if (that.$rootScope.settings.alloydb.alloydb_love_tracks === true) {
            that.AlloyDbService.unlove({ id: that.MediaPlayer.selectedTrack().id })
          }
          that.Backend.info('UnStarred');
          that.Backend.info(result);
          that.MediaPlayer.selectedTrack().starred = 'false';
          $("#likeButtonIcon").addClass('fa-star-o');
          $("#likeButtonIcon").removeClass('fa-star');
          that.AppUtilities.apply();
        });
      } else {
        that.AlloyDbService.star({ id: that.MediaPlayer.selectedTrack().id }).then(function (result) {
          if (that.$rootScope.settings.alloydb.alloydb_love_tracks === true) {
            that.AlloyDbService.love({ id: that.MediaPlayer.selectedTrack().id })
          }
          that.Backend.info('starred');
          that.Backend.info(result);
          that.MediaPlayer.selectedTrack().starred = 'true';
          $("#likeButtonIcon").removeClass('fa-star-o');
          $("#likeButtonIcon").addClass('fa-star');
          that.AppUtilities.apply();
        });
      }
    });
  }
}

export default {
  bindings: {},
  controller: FooterController,
  templateUrl: '/template/footer.jade',
  selector: 'footer-mediaplayer'
};