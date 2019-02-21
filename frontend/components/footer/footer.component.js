import './footer.scss';
class FooterController {
  constructor($scope, $rootScope, $location, Logger, MediaElement, AppUtilities, Backend, MediaPlayer, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.Logger = Logger;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;

    this.Logger.debug('footer-controller');
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
    this.Logger.debug('footer-init');

    $('#subProgress').attr('aria-valuenow', 0).css('width', "0%");
    $('#mainProgress').attr('aria-valuenow', 0).css('width', "0%");

    $('.btn').on('click', () => {
      $('.btn').blur();
    });

    $('#volumeSlider').on('mousewheel', event => {
      event.preventDefault();
      var value = parseInt($("#volumeSlider").val());
      if (event.originalEvent.deltaY < 0) {
        value = value + 5;
        $("#volumeSlider").val(value);
      } else if (event.originalEvent.deltaY > 0) {
        value = value - 5;
        $("#volumeSlider").val(value);
      }

      this.updateVolume($('#volumeSlider').val() / 100);
    });

    $("#volumeSlider").on('change', () => {

    });

    $("#volumeSlider").on('input change', () => {
      this.updateVolume($('#volumeSlider').val() / 100);
    });

    $("#clickProgress").click(e => {
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
        if (!isFinite(duration))
          duration = this.MediaPlayer.selectedTrack().duration;
        seekto = duration * ((e.offsetX / $("#clickProgress").width()));
        if (!isNaN(seekto)) {
          this.MediaElement.currentTime = seekto;
        }
      }
    });

    $("#shareButton").click(() => {
      this.Logger.debug('shareButton');
      //this.AlloyDbService.createShare(this.MediaPlayer.selectedTrack().id, 'Shared from Alloy').then(function (result) {
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
      //  this.AppUtilities.copyTextToClipboard(url);
      //  setTimeout(() => {
      //    $('#shareButton').popover('hide');
      //  }, 5000);
      //});

    });

    $("#muteButton").click(() => {
      var vol = 0;
      if (this.MediaPlayer.remotePlayerConnected()) {
        this.MediaPlayer.remotePlayerController.muteOrUnmute();
        this.MediaPlayer.isMuted = this.MediaPlayer.remotePlayer.isMuted;
        if (this.MediaPlayer.isMuted) {
          vol = 0;
          $('#volumeSlider').val(vol);
        } else {
          vol = this.MediaPlayer.remotePlayer.volumeLevel;
          $('#volumeSlider').val(vol * 100);
        }
      } else {
        this.MediaPlayer.isMuted = !this.MediaPlayer.isMuted;
        if (this.MediaPlayer.isMuted) {
          this.MediaElement.volume = 0;
          $('#volumeSlider').val(0);
        } else {
          this.MediaElement.volume = this.MediaPlayer.currentVolume;
          $('#volumeSlider').val(this.MediaPlayer.currentVolume * 100);
        }
      }
      $("#muteButton").blur();
    });

    $("#skipBackButton").click(() => {
      this.MediaPlayer.previous();
      $("#skipBackButton").blur();
    });

    $("#playPauseButton").click(() => {

      if (this.MediaPlayer.remotePlayerConnected()) {
        if (!this.MediaPlayer.remotePlayer.isPaused) this.MediaPlayer.pause();
        else this.MediaPlayer.play();
      } else {
        if (this.MediaPlayer.playing) this.MediaPlayer.pause();
        else this.MediaPlayer.play();
      }
      $("#playPauseButton").blur();
    });

    $("#skipNextButton").click(() => {
      this.MediaPlayer.next();
      $("#skipNextButton").blur();
    });

    $("#repeatButton").click(() => {
      this.MediaPlayer.repeatEnabled = !this.MediaPlayer.repeatEnabled;
      $("#repeatButton").toggleClass('button-selected');
      $("#repeatButton").blur();
    });

    $("#downloadButton").click(() => {
      var dlUrl = this.AlloyDbService.download(this.MediaPlayer.selectedTrack().id);
      window.open(dlUrl, '_blank');
    });

    $("#nowPlayingImageHolder").click(() => {
      this.$location.path('/playing');
    });

    $("#likeButton").click(() => {
      var track = this.MediaPlayer.selectedTrack();
      this.Logger.info('liking track: ' + track.artist + " - " + track.title);
      if (track.starred === 'true') {
        this.AlloyDbService.unstar({
          id: this.MediaPlayer.selectedTrack().id
        }).then(result => {
          if (this.$rootScope.settings.alloydb.alloydb_love_tracks === true) {
            this.AlloyDbService.unlove({
              id: this.MediaPlayer.selectedTrack().id
            })
          }
          this.Logger.info('UnStarred');
          this.Logger.info(result);
          this.MediaPlayer.selectedTrack().starred = 'false';
          $("#likeButtonIcon").addClass('fa-star-o');
          $("#likeButtonIcon").removeClass('fa-star');
          this.AppUtilities.apply();
        });
      } else {
        this.AlloyDbService.star({
          id: this.MediaPlayer.selectedTrack().id
        }).then(result => {
          if (this.$rootScope.settings.alloydb.alloydb_love_tracks === true) {
            this.AlloyDbService.love({
              id: this.MediaPlayer.selectedTrack().id
            })
          }
          this.Logger.info('starred');
          this.Logger.info(result);
          this.MediaPlayer.selectedTrack().starred = 'true';
          $("#likeButtonIcon").removeClass('fa-star-o');
          $("#likeButtonIcon").addClass('fa-star');
          this.AppUtilities.apply();
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