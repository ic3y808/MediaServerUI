PodcastsController.$inject = ['$scope', '$rootScope'];

function PodcastsController($scope, $rootScope) {
  console.log('podcasts-controller')


  if ($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');
  $(".loader").css("display", "none");
  $(".content").css("display", "block");
}

export default PodcastsController;
