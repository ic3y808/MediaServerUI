import './starred.scss';
class StarredController {
  constructor($scope, $rootScope, $timeout, $element, Logger, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.$element = $element;
    this.Logger = Logger;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Logger.debug('starred-controller');
    this.AppUtilities.showLoader();
   
    $scope.refresh = () => {
      AlloyDbService.refreshStarred();
    };

    $rootScope.$watch('starred_tracks', (newVal, oldVal) =>  {
      if ($rootScope.starred_tracks) {
        this.AppUtilities.apply();
        this.AppUtilities.hideLoader();
      }
    });

    $rootScope.$watch('starred_albums', (newVal, oldVal) =>  {
      if ($rootScope.starred_albums) {
        this.AppUtilities.apply();
        this.AppUtilities.hideLoader();
      }
    });
  }

  $onInit() {
    this.$element.addClass('vbox')
    this.$element.addClass('scrollable')
  };

}

export default {
  bindings: {},
  controller: StarredController,
  templateUrl: '/template/starred.jade'
};