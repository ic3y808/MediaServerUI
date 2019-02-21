export default function ($rootScope, $location, Logger, Backend, AppUtilities, MediaPlayer, AlloyDbService) {
  "ngInject";
  return {
    restrict: 'E',
    scope: {
      data: '=',
      hasjumpbar: '@'
    },
    templateUrl: 'template/genrelist.jade',

    replace: true,
    link: function (scope, elm, attrs) {
      scope.navToGenre = function (id) {
        $location.path('/genre/' + id);
      }
      scope.checkIfNowPlaying = function (id) {
        var selected = MediaPlayer.selectedTrack();
        if (selected) {
          return id === selected.genre_id;
        }
        return false;
      }
      scope.playGenre = function (genre) {
        var genre = AlloyDbService.getGenre(genre.id);
        if (genre) {
          genre.then(function (data) {
            Logger.debug('selection changed');
            $rootScope.tracks = AppUtilities.shuffle(data.tracks);
            MediaPlayer.loadTrack(0);
          });
        }
      }
    }
  }
};