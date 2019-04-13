export default  function (Backend, AppUtilities, AlloyDbService) {
  "ngInject";
  return {
    restrict: "E",
    scope: {
      data: "="
    },
    templateUrl: "/template/blacklist.jade",
    replace: true,
    link: function (scope, elm, attrs) {
      
    }
  }
};