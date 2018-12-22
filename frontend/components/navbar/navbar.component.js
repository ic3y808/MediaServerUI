import './navbar.scss';
class NavbarController {
  constructor($scope, $rootScope, $location, MediaElement, MediaPlayer, AppUtilities, Backend, SubsonicService, $http) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.SubsonicService = SubsonicService;
    this.Backend.debug('nav-controller');
    var that = this;

    $scope.selectedObject = null;

    $("#search-box").mouseleave(function () {
      $('#search-box').blur();
    });

    $("#search-box").mouseenter(function () {
      $('#search-box').focus();
    });

    var html = '';
    html += '<div class="unselectable card-5" data-instance-id="{{ ctrl.instanceId }} ng-show="ctrl.containerVisible">';
    html += ' <ul class="list-group">';
    html += '   <li ng-repeat="item in ctrl.renderItems" class="list-group-item" ng-if="item.value.data.length">';
    html += '     <p>{{item.value.title}} - {{item.value.data.length}}</p>';
    html += '     <ul class="list-group">';
    html += '       <li ng-if="item.value.data.length" ng-repeat="renderItem in item.value.data" ng-click="ctrl.selectItem(renderItem, item.value.title, true)" class="list-group-item" ng-class="ctrl.getSelectedCssClass(renderItem)">';
    html += '         <p ng-if="renderItem.name">{{renderItem.name}}</p>';
    html += '         <p ng-if="renderItem.title">{{renderItem.title}}</p>';
    html += '       </li>';
    html += '     </ul>';
    html += '   </li>';
    html += ' </ul>';
    html += '</div>';

    var noMatch = "";
    noMatch += '<li class="list-group-item"/>  ';

    $scope.autoCompleteOptions = {
      minimumChars: 1,
      pagingEnabled: true,
      dropdownWidth: '500px',
      containerCssClass: "autocomplete-container",
      pageSize: 5,
      containerTemplate: html,
      noMatchTemplate: noMatch,
      activateOnFocus: true,
      itemSelected: function (e) {
        that.selectedObject = e.item;
       
       
        switch(e.type){
          case"Artists":
            that.$location.path( "/artist/" + e.item.id );
          break;
          case"Songs":
            that.$location.path( "/album/" + e.item.albumId + "/" + e.item.id );
          break;
          case"Albums":
            that.$location.path( "/album/" + e.item.id );
          break;
        }


      },
      data: function (searchText, pagingParams) {
        that.loading = true;


        var searchObj = {
          query: searchText,
          artistCount: 10,
          albumCount: 10,
          songCount: 5,

        };

        return that.SubsonicService.subsonic.search3(searchObj).then(function (result) {
          searchText = searchText.toUpperCase();
console.log(result)

          var artists = _.filter(result.artist, function (artist) {
            console.log('checking artist ' + artist.name)
            var isFound = artist.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
            return isFound;
          });


          var songs = _.filter(result.song, function (song) {
            console.log('checking song ' + song.title)
            var isFound = false;
            var searchTerm = searchText.toLowerCase();
            isFound = song.title.toLowerCase().indexOf(searchTerm) !== -1;
            isFound = song.album.toLowerCase().indexOf(searchTerm) !== -1;
            isFound = song.artist.toLowerCase().indexOf(searchTerm) !== -1;
            return isFound;
          });


          var albums = _.filter(result.album, function (album) {
            console.log('checking album ' + album.name)
            var isFound = false;
            var searchTerm = searchText.toLowerCase();
            isFound = album.name.toLowerCase().indexOf(searchTerm) !== -1;
            isFound = album.artist.toLowerCase().indexOf(searchTerm) !== -1;
            return isFound;
          });

          var results = [
            {
              title: "Artists",
              data: artists
            },
            {
              title: "Songs",
              data: songs
            },
            {
              title: "Albums",
              data: albums
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