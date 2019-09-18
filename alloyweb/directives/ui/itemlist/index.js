import styles from "./itemlist.scss";
export default function ($rootScope, $location, Logger, Backend, AppUtilities, MediaPlayer, AlloyDbService) {
  "ngInject";
  return {
    restrict: "E",
    scope: {
      data: "=",
      title: "@",
      limit: "@",
      type: "@",
      refreshclick: "&",
      showviewmore: "@",
      viewmorelink: "@"

    },
    templateUrl: "/template/itemlist.jade",

    replace: true,
    link: (scope, elm, attrs) => {
      scope.itemLimit = parseInt(scope.limit, 10);

      switch (scope.type) {
        case "tracks": break;
        case "albums": break;
        case "artists": break;
      }

      $rootScope.$on("trackChangedEvent", (event, data) => {
        scope.currentTrack = data;
        scope.isPlaying = $rootScope.MediaPlayer.isPlaying();
        AppUtilities.apply();
      });

      $rootScope.$on("playbackStatusChangedEvent", (event, data) => {
        scope.currentTrack = $rootScope.currentTrack;
        scope.isPlaying = $rootScope.MediaPlayer.isPlaying();
        AppUtilities.apply();
      });

      scope.$watch("data", function (newVal, oldVal) {
        AppUtilities.apply();
      });

      scope.currentTrack = $rootScope.currentTrack;
      scope.isPlaying = $rootScope.MediaPlayer.isPlaying();
    }
  };
}