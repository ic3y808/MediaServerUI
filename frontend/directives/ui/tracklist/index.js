module.exports = function (Backend, MediaPlayer) {
  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    templateUrl: '/template/tracklist.jade',

    replace: true,
    link: function (scope, elm, attrs) {



      scope.requestPlay = function (id) {
        Backend.debug('selection changed');
        MediaPlayer.tracks = scope.data;
        var index = _.findIndex(MediaPlayer.tracks, function (track) {
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

    }
  }
};