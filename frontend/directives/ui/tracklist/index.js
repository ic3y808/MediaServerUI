module.exports = function ($rootScope, $timeout, $location, MediaPlayer, Backend, AlloyDbService, AppUtilities) {
  return {
    restrict: 'E',
    scope: {
      data: '=',
      showartist:'@',
      showalbum:'@',
      hasjumpbar: '@'
    },
    templateUrl: '/template/tracklist.jade',

    replace: true,
    link: function (scope, elm, attrs) {
      scope.navToAlbum = function(id){
        $location.path('/album/' + id);
      }
      scope.navToArtist = function(id){
        $location.path('/artist/' + id);
      }
      scope.navToGenre = function(id){
        $location.path('/genre/' + id);
      }

      scope.requestPlay = function (id) {
        Backend.debug('selection changed');
        $rootScope.tracks = scope.data;
        var index = _.findIndex($rootScope.tracks, function (track) {
          return track.id === id;
        });
        MediaPlayer.loadTrack(index);
      }

      scope.checkIfNowPlaying = function (id) {
        var selected = MediaPlayer.selectedTrack();
        if (selected) {
          return id === selected.id;
        }
        return false;
      }

      scope.starTrack = function (track) {
        Backend.info('starring track: ' + track.artist + " - " + track.title);
        if (track.starred === 'true') {
          AlloyDbService.unstar({ id: track.id }).then(function (result) {
            if ($rootScope.settings.alloydb.alloydb_love_tracks === true) {
              AlloyDbService.unlove({ id: track.id })
            }
            Backend.info('UnStarred');
            Backend.info(result);
            track.starred = 'false';
            $timeout(function () {
              AppUtilities.apply();
            })
          });
        } else {
          AlloyDbService.star({ id: track.id }).then(function (result) {
            if ($rootScope.settings.alloydb.alloydb_love_tracks === true) {
              AlloyDbService.love({ id: track.id })
            }
            Backend.info('starred');
            Backend.info(result);
            track.starred = 'true';
            $timeout(function () {
              AppUtilities.apply();
            })

          });
        }




      }

      scope.$watch('data', function (newVal, oldVal) {
        AppUtilities.apply();
      });

    }
  }
};