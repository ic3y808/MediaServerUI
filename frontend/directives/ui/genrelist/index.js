module.exports = function ($location, MediaPlayer) {
  return {
    restrict: 'E',
    scope: {
      data: '='
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
    }
  }
};