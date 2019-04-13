export default function () {
  "ngInject";
  return {
    restrict: "E",
    scope: {
      relid: "@",
      buttontext: "@",
      buttonicon: "@",
      data: "="
    },
    // object is passed while making the call
    templateUrl: "/template/playlistselector.jade",
    replace: true,

    link: function (scope, elm, attrs) {
  
    }
  }
};