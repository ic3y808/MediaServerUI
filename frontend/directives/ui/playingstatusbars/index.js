export default function (MediaPlayer) {
  "ngInject";
  return {
    restrict: 'E',
    scope: {
      direction: '@'
    },
    templateUrl: '/template/playingstatusbars.jade',

    replace: true,
    link: function ($scope, element, attrs) {
      "ngInject";
      $scope.isPlaying = () => {
        return MediaPlayer.playing && !MediaPlayer.paused;
      };

    }
  }
};