export default function ($rootScope, $timeout, $location, Logger, MediaPlayer, Backend, AlloyDbService, AppUtilities) {
  "ngInject";
  return {
    restrict: 'E',
    scope: {
      data: '=',
      showstar:'@',
      showtracknum:'@',
      showartist:'@',
      showalbum:'@',
      showgenre:'@',
      showplays:'@',
      showduration:'@',
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
        Logger.debug('selection changed');
        scope.data.forEach(function(track){track.selected = null})
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
        Logger.info('starring track: ' + track.artist + " - " + track.title);
        if (track.starred === 'true') {
          AlloyDbService.unstar({ id: track.id }).then(function (result) {
            if ($rootScope.settings.alloydb.alloydb_love_tracks === true) {
              AlloyDbService.unlove({ id: track.id })
            }
            Logger.info('UnStarred');
            Logger.info(result);
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
            Logger.info('starred');
            Logger.info(result);
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