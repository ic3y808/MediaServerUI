module.exports = function ($rootScope, $location,Logger, Backend, AppUtilities, MediaPlayer, AlloyDbService) {
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
      scope.navToAlbum = function (id) {
        $location.path('/album/' + id);
      }
      scope.navToArtist = function (id) {
        $location.path('/artist/' + id);
      }
      scope.checkIfNowPlaying = function (id) {
        var selected = MediaPlayer.selectedTrack();
        if (selected) {
          return id === selected.album_id;
        }
        return false;
      }
      scope.starAlbum = function (album) {
        Logger.info('starring album: ' + album.artist + " - " + album.name);
        if (album.starred === 'true') {
          AlloyDbService.unstar({ album: album.id }).then(function (result) {
            Logger.info('UnStarred');
            Logger.info(result);
            album.starred = 'false';
            AppUtilities.apply();
          });
        } else {
          AlloyDbService.star({ album: album.id }).then(function (result) {
            Logger.info('starred');
            Logger.info(result);
            album.starred = 'true';
            AppUtilities.apply();
          });
        }
      }
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
    }
  }
};