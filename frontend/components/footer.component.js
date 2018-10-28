class FooterController {
  constructor($scope, $rootScope, MediaElement, AppUtilities, Backend, MediaPlayer, SubsonicService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.SubsonicService = SubsonicService;
    this.Backend.debug('footer-controller');    
  }

  $onInit(){
    this.Backend.debug('footer-init');
    var that = this;
    $('#subProgress').attr('aria-valuenow', 0).css('width', "0%");
    $('#mainProgress').attr('aria-valuenow', 0).css('width', "0%");

    $("#volumeSlider").on('change', function () {

    });
  
    $("#volumeSlider").on('input change', function () {
      var level = that.MediaPlayer.currentVolume = $('#volumeSlider').val() / 100;
      if (that.MediaPlayer.remotePlayerConnected()) {
        that.MediaPlayer.remotePlayer.volumeLevel = level;
        that.MediaPlayer.remotePlayerController.setVolumeLevel();
      } else {
        that.MediaElement.volume = level;
      }
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
      this.Backend.debug('shareButton');
      that.SubsonicService.subsonic.createShare(that.MediaPlayer.selectedTrack().id, 'Shared from MediaCenterUI').then(function (result) {
        $('#shareButton').popover({
          animation: true,
          content: 'Success! Url Copied to Clipboard.',
          delay: {
            "show": 0,
            "hide": 5000
          },
          placement: 'top'
        }).popover('show');
        var url = result.url.toString();
        that.AppUtilities.copyTextToClipboard(url);
        setTimeout(() => {
          $('#shareButton').popover('hide');
        }, 5000);
      });
  
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
    });
  
    $("#skipBackButton").click(function () {
      that.MediaPlayer.previous();
    });
  
    $("#playPauseButton").click(function () {
  
      if (that.MediaPlayer.remotePlayerConnected()) {
        if (!that.MediaPlayer.remotePlayer.isPaused) that.MediaPlayer.pause();
        else that.MediaPlayer.play();
  
      } else {
        if (that.MediaPlayer.playing) that.MediaPlayer.pause();
        else that.MediaPlayer.play();
      }
  
  
    });
  
    $("#skipNextButton").click(function () {
      that.MediaPlayer.next();
    });
  
    $("#repeatButton").click(function () {
      that.MediaPlayer.repeatEnabled = !that.MediaPlayer.repeatEnabled;
      $("#repeatButton").toggleClass('button-selected');
    });
  
    $("#downloadButton").click(function () {
      var dlUrl = that.SubsonicService.subsonic.downloadUrl(that.MediaPlayer.selectedTrack().id);
      window.open(dlUrl, '_blank');
    });
  
    $("#likeButton").click(function () {
      var track = that.MediaPlayer.selectedTrack();
      that.Backend.info('liking track: ' + track.artist + " - " + track.title);
      if (track.starred) {
        that.SubsonicService.subsonic.unstar(that.MediaPlayer.selectedTrack().id).then(function (result) {
          that.Backend.info('UnStarred');
          that.Backend.info(result);
          that.MediaPlayer.selectedTrack().starred = undefined;
          $("#likeButtonIcon").addClass('fa-heart-o');
          $("#likeButtonIcon").removeClass('fa-heart');
          that.AppUtilities.apply();
        });
      } else {
        that.SubsonicService.subsonic.star(that.MediaPlayer.selectedTrack().id).then(function (result) {
          that.Backend.info('starred');
          that.Backend.info(result);
          that.MediaPlayer.selectedTrack().starred = 1;
          $("#likeButtonIcon").removeClass('fa-heart-o');
          $("#likeButtonIcon").addClass('fa-heart');
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