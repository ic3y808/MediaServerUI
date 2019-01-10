module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      buttontext: '@',
      buttonicon: '@',
      buttonclick: '&',
      href: "@"
    },
    // object is passed while making the call
    template:
      '<a href="{{href}}" class="btn AlbumDetails-detailsLabel Label-label Label-default Label-large">' +
      '	  <i aria-hidden="true" data-prefix="far" viewBox="0 0 512 512" style="font-size: 17px;" class="fa {{buttonicon}} fa-w-16 Icon-default"></i>' +
      '	<span class="AlbumDetails-path ng-binding">{{buttontext}}</span>' +
      '</a>',
    replace: true,
    link: function (scope, elm, attrs) {
      scope.clickButton = function () {
        scope.buttonclick();
      }
    }
  }
};

