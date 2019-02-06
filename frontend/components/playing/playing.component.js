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
    
      var current = that.MediaPlayer.selectedTrack();

      if (current) {
        var currentPromise = AlloyDbService.getTrackInfo(current.id)
        var currentArtistPromise = AlloyDbService.getArtistInfo(current.artist)

        $scope.trackTitle = current.title;
        $scope.artistName = current.artist;
        $scope.artistId = current.base_id;
        $scope.albumName = current.album;
        $scope.albumId = current.album_id;
        $scope.year = current.year;
        $scope.contentType = current.content_type;
        $scope.bitrate = current.bitrate;
        if (currentPromise) {
          currentPromise.then(function (song) {
            if (song.trackInfo) {
              $scope.song = song.trackInfo;
              $scope.artistName = $scope.song.artist.name;
              $scope.trackTitle = $scope.song.name;

              $scope.playCount = $scope.song.playcount;
            }

          });
        }
        if (currentArtistPromise) {
          currentArtistPromise.then(function (info) {
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
                  if (image['@'].size === 'large') {
                    $scope.artistImage = image['#'];
                  }
                  if (image['@'].size === 'extralarge') {
                    $scope.artistImage = image['#'];
                  }
                });
              }
              that.AppUtilities.apply();
            }
          });

        }

        that.AppUtilities.hideLoader();
      } else {
        that.AppUtilities.hideLoader();
        return;
      }

      $scope.previousTracks = that.MediaPlayer.previousTracks(5);
      $scope.upcomingTracks = that.MediaPlayer.upcomingTracks(5);

      
     

      //if(previous){
      //  var previousPromise = AlloyDbService.getTrackInfo(previous.id)      
      //  if (previousPromise) {
      //    previousPromise.then(function (info) { });
      //  }
      //}
      //if(next){
      //  var nextPromise = AlloyDbService.getTrackInfo(next.id)
      //  if (nextPromise) {
      //    nextPromise.then(function (info) { });
      //  }
      //}



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