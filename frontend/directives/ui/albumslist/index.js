module.exports = function (MediaPlayer) {
  return {
    restrict: 'E',
    scope: {
      data: '=',
      showartist: '@'
    },
    templateUrl:'/template/albumslist.jade',
    replace: true,
    link: function (scope, elm, attrs) {
      scope.clickButton = function () {
        scope.buttonclick();
      }
      scope.checkIfNowPlaying = function (id) {
        var selected = MediaPlayer.selectedTrack();
        if (selected) {
          return id === selected.album_id;
        }
        return false;
      }
    }
  }
};