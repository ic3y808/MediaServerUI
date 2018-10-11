class PlayingController {
  constructor($scope, $rootScope) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    console.log('playing-controller')

    $scope.getSong = function () {
      if ($rootScope.isLoggedIn) {
        var track = $rootScope.selectedTrack();
        if (track) {
          $rootScope.subsonic.getSong($rootScope.selectedTrack().id).then(function (song) {
            $scope.song = song.song;
            $scope.artistName = $scope.song.artist;
            $scope.trackTitle = $scope.song.title;
            $scope.year = $scope.song.year;
            $scope.contentType = $scope.song.contentType;
            $scope.bitrate = $scope.song.bitrate;
            $scope.playCount = $scope.song.playCount;
            $rootScope.subsonic.getArtistInfo2($scope.song.artistId, 50).then(function (result) {
              if (result) {
                $scope.artistBio = result.biography.replace(/<a\b[^>]*>(.*?)<\/a>/i, "");
                if (result.similarArtist && result.similarArtist.length > 0)
                  $scope.similarArtists = result.similarArtist;
                if (result.largeImageUrl) {
                  $rootScope.setContentBackground(result.largeImageUrl.replace('300x300', Math.round($('.content').width()) + 'x' + Math.round($('.content').height())));
                }

                $scope.$apply();
                $rootScope.hideLoader();
              }
            });
          });
        }
      } else {
        if ($scope.gridOptions.api) 
          $scope.gridOptions.api.showNoRowsOverlay();
        $rootScope.hideLoader();
      }
    }

    $rootScope.$on('trackChangedEvent', function (event, data) {
      console.log('Track Changed reloading now playing')
      $scope.getSong();
    });

    $rootScope.$on('loginStatusChange', function (event, data) {
      console.log('login changed reloading now playing')
      $scope.getSong();
    });

    $scope.getSong();
    if ($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');
  }
}

export default {
  bindings: {},
  controller: PlayingController,
  templateUrl: '/template/playing.jade'
};