PodcastsController.$inject = ['$rootScope', '$scope', 'subsonicService'];

function PodcastsController($rootScope, $scope, subsonicService) {
  $(".content").css("display", "none");
  $(".loader").css("display", "block");
  console.log('podcasts-controller')


  if ($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');
  $(".loader").css("display", "none");
  $(".content").css("display", "block");
};

module.exports = PodcastsController;