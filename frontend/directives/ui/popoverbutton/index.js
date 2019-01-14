module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      buttontext: '@',
      buttonicon: '@',
      data: '='
    },
    // object is passed while making the call
    template: function () {
      return '<a href="{{href}}" class="btn AlbumDetails-detailsLabel Label-label Label-default Label-large" rel="popover-button-selector">' +
        '	  <i aria-hidden="true" data-prefix="far" viewBox="0 0 512 512" style="font-size: 17px;" class="fa {{buttonicon}} fa-w-16 Icon-default"></i>' +
        '	<span class="AlbumDetails-path ng-binding">{{buttontext}}</span>' +
        '</a>';
    },
    replace: true,

    link: function (scope, elm, attrs) {
      console.log('linking')
      scope.$watch('data', function (newVal, oldVal) {
        console.log(scope.data)
        if (scope.data) {
          var t = '<div class="popover" role="tooltip">' +
            '<div class="arrow">' +
            '</div>' +
            '<h3 class="popover-header"></h3>' +
            '<div class="popover-body"></div>' +
            '</div>';
          var content = [];
          scope.data.forEach(tag => {
            content.push("<div class='AlbumDetails-detailsLabel Label-label Label-default Label-large'>" + tag.name + "</div>")
          });


          $('body').popover({
            html: true,
            selector: '[rel=popover-button-selector]',
            trigger: 'click',
            template: t,
            content: content.join(''),
            container: '.PageContentBody-contentBody',
            placement: "bottom",
          });
        }
      });
    }
  }
};