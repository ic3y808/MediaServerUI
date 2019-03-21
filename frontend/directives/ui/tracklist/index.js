export default function ($rootScope, $timeout, $location, Logger, MediaPlayer, Backend, AlloyDbService, AppUtilities) {
  "ngInject";
  return {
    restrict: 'E',
    scope: {
      data: '=',
      showstar: '@',
      showtracknum: '@',
      showartist: '@',
      showalbum: '@',
      showgenre: '@',
      showplays: '@',
      showduration: '@',
      canaddplaylist: '@'
    },
    templateUrl: '/template/tracklist.jade',

    replace: true,
    link: function (scope, elm, attrs) {
      scope.column = 'album';
      scope.reverse = false;

      scope.addTrackToPlaylist = (track) => {
        scope.$modal = $('#addTrackToPlaylistModal')
        $('#primary-content').append(scope.$modal);
        scope.$modal.modal();
      };
  
      scope.addToPlaylist = (playlist, track) => {
        var pls = AlloyDbService.addPlaylist({ id: playlist, songId: track.id });
        if (pls) {
          pls.then(info => {
            if (info) {
              AlloyDbService.refreshPlaylists();
              scope.$modal.modal('hide');
              AppUtilities.apply();
            }
          });
        }
      };

      scope.$watch('data', function (newVal, oldVal) {
        AppUtilities.apply();
      });

    }
  }
};