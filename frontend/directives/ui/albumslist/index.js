module.exports = function ($location, Backend, AppUtilities, MediaPlayer, AlloyDbService) {
  return {
    restrict: 'E',
    scope: {
      data: '=',
      showartist: '@',
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
        Backend.info('starring album: ' + album.artist + " - " + album.name);
        if (album.starred === 'true') {
          AlloyDbService.unstar({ album: album.id }).then(function (result) {
            Backend.info('UnStarred');
            Backend.info(result);
            album.starred = 'false';
            AppUtilities.apply();
          });
        } else {
          AlloyDbService.star({ album: album.id }).then(function (result) {
            Backend.info('starred');
            Backend.info(result);
            album.starred = 'true';
            AppUtilities.apply();
          });
        }
      }
    }
  }
};