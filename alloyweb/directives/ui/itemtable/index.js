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
    }
  };
}