class PodcastsController {
  constructor($scope, $rootScope) {
    "ngInject";
    console.log('podcasts-controller')
    this.$scope = $scope;
    this.$rootScope = $rootScope;

    if ($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');
    $rootScope.hideLoader();
  }
}

export default {
  bindings: {},
  controller: PodcastsController,
  templateUrl: '/template/podcasts.jade'
};