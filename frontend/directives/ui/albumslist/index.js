export default function ($rootScope, $location, Logger, Backend, AppUtilities, MediaPlayer, AlloyDbService) {
  "ngInject";
  return {
    restrict: 'E',
    scope: {
      data: '=',
      showartist: '@',
      hasjumpbar: '@'
    },
    templateUrl: '/template/albumslist.jade',
    replace: true,
    link: function (scope, elm, attrs) {
      scope.column = 'album';
      scope.reverse = false;
      scope.navToAlbum = function (id) {
        $location.path('/album/' + id);
      };
      scope.navToArtist = function (id) {
        $location.path('/artist/' + id);
      };
      scope.checkIfNowPlaying = function (id) {
        var selected = MediaPlayer.selectedTrack();
        if (selected) {
          return id === selected.album_id;
        }
        return false;
      };
      scope.starAlbum = function (album) {
        if (album.starred === 'true') {
          Logger.info('un-starring album: ' + album.name);
          AlloyDbService.unstar({ album: album.id }).then(function (result) {
            Logger.info(JSON.stringify(result));
            album.starred = 'false';
            AppUtilities.apply();
          });
        } else {
          Logger.info('starring album: ' + album.name);
          AlloyDbService.star({ album: album.id }).then(function (result) {
            Logger.info(JSON.stringify(result));
            album.starred = 'true';
            AppUtilities.apply();
          });
        }
      };
      scope.playAlbum = function (album) {
        var album = AlloyDbService.getAlbum(album.id);
        if (album) {
          album.then(function (data) {
            Logger.debug('selection changed');
            $rootScope.tracks = data.tracks;
            MediaPlayer.loadTrack(0);
          });
        }
      }
      scope.sortColumn = function (col) {
        scope.column = col;
        if (scope.reverse) {
          scope.reverse = false;
          scope.reverseclass = 'TableHeaderCell-sortIcon-Up';
        } else {
          scope.reverse = true;
          scope.reverseclass = 'TableHeaderCell-sortIcon-Down';
        }
      };
      scope.sortClass = function (col) {
        if (scope.column == col) {
          if (scope.reverse) {
            return 'TableHeaderCell-sortIcon-Down';
          } else {
            return 'TableHeaderCell-sortIcon-Up';
          }
        } else {
          return '';
        }
      }
    }
  }
};