import './navbar.scss';
class NavbarController {
  constructor($scope, $rootScope, $location, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService, $http) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('nav-controller');
    var that = this;

    $scope.selectedObject = null;

    $("#search-box").mouseenter(function () {
      $('#search-box').focus();
    });

    var html = '';
    html += '<div class="unselectable card-5" data-instance-id="{{ ctrl.instanceId }} ng-show="ctrl.containerVisible">';
    html += ' <ul class="list-group">';
    html += '   <li ng-repeat="item in ctrl.renderItems" class="list-group-item" ng-if="item.value.data.length">';
    html += '     <p>{{item.value.title}} - {{item.value.data.length}}</p>';
    html += '     <ul class="list-group">';
    html += '       <li ng-if="item.value.data.length" ng-repeat="renderItem in item.value.data" ng-click="ctrl.selectItem(renderItem, item.value, true)" class="list-group-item" ng-class="ctrl.getSelectedCssClass(renderItem)">';
    html += '         <p ng-if="renderItem.artist">{{renderItem.artist}}</p>';
    html += '         <p ng-if="renderItem.title">{{renderItem.title}}</p>';
    html += '         <p ng-if="renderItem.album">{{renderItem.album}}</p>';
    html += '         <p ng-if="renderItem.genre">{{renderItem.genre}}</p>';
    html += '       </li>';
    html += '     </ul>';
    html += '   </li>';
    html += ' </ul>';
    html += '</div>';

    var noMatch = "";
    noMatch += '<li class="list-group-item"/>  ';

    $scope.autoCompleteOptions = {
      minimumChars: 1,
      //pagingEnabled: true,
      dropdownWidth: '500px',
      containerCssClass: "autocomplete-container",
      //pageSize: 5,
      containerTemplate: html,
      //noMatchTemplate: noMatch,
      activateOnFocus: true,
      itemSelected: function (e) {
       // that.selectedObject = e.item;


        switch (e.type.title) {
          case "Artists":
            that.$location.path("/artist/" + e.item.base_id);
            break;
          case "Songs":
            that.$location.path("/album/" + e.item.album_id + "/" + e.item.id);
            break;
          case "Albums":
            that.$location.path("/album/" + e.item.album_id);
            break;
          case "Genres":
            that.$location.path("/genre/" + e.item.genre_id);
            break;
        }

      },
      data: function (searchText, pagingParams) {
        that.loading = true;

        return that.AlloyDbService.search(searchText).then(function (result) {
          searchText = searchText.toUpperCase();
          // console.log(result)

          var results = [
            {
              title: "Artists",
              data: result.artists
            },
            {
              title: "Songs",
              data: result.tracks
            },
            {
              title: "Albums",
              data: result.albums
            },
            {
              title: "Genres",
              data: result.genres
            }
          ];

          that.loading = false;
          return results;
        });
      }
    }
  }

  $onInit() {
  }
}

export default {
  bindings: {},
  controller: NavbarController,
  templateUrl: '/template/navbar.jade'
};