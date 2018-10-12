class PodcastsController {
  constructor($scope, $rootScope) {
    "ngInject";
    console.log('podcasts-controller')
    this.$scope = $scope;
    this.$rootScope = $rootScope;

    $rootScope.hideLoader();
  }
}

export default {
  bindings: {},
  controller: PodcastsController,
  templateUrl: '/template/podcasts.jade'
};