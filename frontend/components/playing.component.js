class PlayingController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend, SubsonicService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.SubsonicService = SubsonicService;
    this.Backend.debug('playing-controller');
    var that = this;
    $scope.getSong = function () {
      if (that.SubsonicService.isLoggedIn) {
        var track = that.MediaPlayer.selectedTrack();
        if (track) {
          that.SubsonicService.subsonic.getSong(track.id).then(function (song) {
            $scope.song = song.song;
            $scope.artistName = $scope.song.artist;
            $scope.trackTitle = $scope.song.title;
            $scope.year = $scope.song.year;
            $scope.contentType = $scope.song.contentType;
            $scope.bitrate = $scope.song.bitrate;
            $scope.playCount = $scope.song.playCount;
            that.SubsonicService.subsonic.getArtistInfo2($scope.song.artistId, 50).then(function (result) {
              if (result) {
                $scope.artistBio = result.biography.replace(/<a\b[^>]*>(.*?)<\/a>/i, "");
                if (result.similarArtist && result.similarArtist.length > 0)
                  $scope.similarArtists = result.similarArtist;
                if (result.largeImageUrl) {
                  that.AppUtilities.setContentBackground(result.largeImageUrl);
                }
                that.AppUtilities.apply();
                that.AppUtilities.hideLoader();
              }
            });
          });
        }
      } else {
        if ($scope.gridOptions && $scope.gridOptions.api) {
          $scope.gridOptions.api.showNoRowsOverlay();
        }
        that.AppUtilities.hideLoader();
      }
    };

    $rootScope.$on('trackChangedEvent', function (event, data) {
      that.Backend.debug('Track Changed reloading now playing');
      $scope.getSong();
    });

    $rootScope.$on('loginStatusChange', function (event, data) {
      that.Backend.debug('login changed reloading now playing');
      $scope.getSong();
    });

    $scope.getSong();
  }
}

export default {
  bindings: {},
  controller: PlayingController,
  templateUrl: '/template/playing.jade'
};