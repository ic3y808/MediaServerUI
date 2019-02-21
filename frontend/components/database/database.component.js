import './database.scss';
class DatabaseController {
  constructor($scope, $rootScope, Logger) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.Logger = Logger;

    this.Logger.debug('database-controller');
  }

  $onInit() {

 
  }
}

export default {
  bindings: {},
  controller: DatabaseController,
  templateUrl: '/template/database.jade'
};