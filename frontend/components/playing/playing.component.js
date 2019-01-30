import './playing.scss';
class PlayingController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('playing-controller');
    var that = this;
    $scope.getSong = function () {
      var track = that.MediaPlayer.selectedTrack();
      if (track) {
        $scope.trackTitle = track.title;
        $scope.artistName = track.artist;
        $scope.year = track.year;
        $scope.contentType = track.content_type;
        $scope.bitrate = track.bitrate;

        that.AlloyDbService.getTrackInfo(track.id).then(function (song) {
          if (song.trackInfo) {
            $scope.song = song.trackInfo;
            $scope.artistName = $scope.song.artist.name;
            $scope.trackTitle = $scope.song.name;
          
            $scope.playCount = $scope.song.playcount;
          }
          that.AppUtilities.hideLoader();
        });

        that.AlloyDbService.getArtistInfo(track.artist).then(function (info) {
          if (info) {

            $scope.artistInfo = info.artistInfo;
            if ($scope.artistInfo.bio) {
              $scope.artistBio = $scope.artistInfo.bio.summary.replace(/<a\b[^>]*>(.*?)<\/a>/i, "");
            }
            if ($scope.artistInfo.similar) {
              $scope.similarArtists = $scope.artistInfo.similar.artist.slice(0, 5);
            }
            if ($scope.artistInfo.image) {
              $scope.artistInfo.image.forEach(function (image) {
                if (image['@'].size === 'extralarge') {
                  that.AppUtilities.setContentBackground(image['#']);
                }
              });
            }
            that.AppUtilities.apply();          
          }
        });

      } else {
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