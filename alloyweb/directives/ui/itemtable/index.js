import styles from "./itemtable.scss";
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
      viewmorelink: "@",
      showartist: "@",
      showimages: "@"
    },
    templateUrl: "/template/itemtable.jade",
    replace: true,
    link: function (scope, elm, attrs) {
      scope.isStarred = (track) => {
        if (track) {
          if (track.starred === "true") { return "icon-star"; }
        }
        return "icon-star-o";
      };

      scope.navTo = (type, url) => {
        $location.path(type + "/" + url);
      };

      scope.starTrack = (track) => {
        if (track) {
          Logger.info("Trying to star track: " + track.title);
          if (track.starred === "true") {
            AlloyDbService.unstar({ id: track.id }).then((result) => {
              Logger.info("UnStarred " + track.title + " " + JSON.stringify(result));
              track.starred = "false";
              AppUtilities.apply();
            });
          } else {
            AlloyDbService.star({ id: track.id }).then((result) => {
              Logger.info("Starred " + track.title + " " + JSON.stringify(result));
              track.starred = "true";
              AppUtilities.apply();
            });
          }
        }
      };
    }
  };
}