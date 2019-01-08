import './style.scss';

class PageToolbarController {
  constructor($scope, $rootScope, Backend) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.Backend = Backend;
    this.Backend.debug('PageToolbarController');
  }
}

export default {
  bindings: {},
  controller: PageToolbarController,
  templateUrl: '/template/pagetoolbar.jade'
};