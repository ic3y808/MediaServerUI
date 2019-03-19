export default function ($rootScope, $timeout, $location, Logger, MediaElement, MediaPlayer, Backend, AlloyDbService, AppUtilities) {
  "ngInject";
  return {
    restrict: 'E',
    scope: {
      direction: '@'
    },
    templateUrl: '/template/searchbar.jade',

    replace: true,
    link: function ($scope, $element, attrs) {
      "ngInject";

      $scope.selectedObject = null;

      $element.bind("click", event => {


      });

        $('#search-box')
        .mouseenter(function () {
          $(this).focus();
        })
        .mouseleave(function () {
          if ("activeElement" in document)
            document.activeElement.blur();
        });

      var html = '';
      html += '<div class="unselectable card-5" data-instance-id="{{ ctrl.instanceId }} ng-show="ctrl.containerVisible">';
      html += ' <ul class="list-group">';
      html += '   <li ng-repeat="item in ctrl.renderItems" class="list-group-item">';
      html += '     <p>{{item.value.title}} - {{item.value.data.length}}</p>';
      html += '     <ul class="list-group">';
      html += '       <li ng-if="item.value.data.length" ng-repeat="renderItem in item.value.data" ng-click="ctrl.selectItem(renderItem, item.value, true)" class="list-group-item" ng-class="ctrl.getSelectedCssClass(renderItem)">';
      html += '         <p class="search-list-item" ng-if="item.value.title==\'Artists\'">{{renderItem.artist}}</p>';
      html += '         <p class="search-list-item" ng-if="item.value.title==\'Songs\'">{{renderItem.title}} - {{renderItem.artist}}</p>';
      html += '         <p class="search-list-item" ng-if="item.value.title==\'Albums\'">{{renderItem.name}} - {{renderItem.artist}}</p>';
      html += '         <p class="search-list-item" ng-if="item.value.title==\'Genres\'">{{renderItem.genre}}</p>';
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
        itemSelected: e => {
          // selectedObject = e.item;


          switch (e.type.title) {
            case "Artists":
              $location.path("/artist/" + e.item.artist_id);
              break;
            case "Songs":
              $location.path("/album/" + e.item.album_id + "/" + e.item.id);
              break;
            case "Albums":
              $location.path("/album/" + e.item.id);
              break;
            case "Genres":
              $location.path("/genre/" + e.item.genre);
              break;
          }

        },
        data: (searchText, pagingParams) => {
          $scope.loading = true;

          return AlloyDbService.search(searchText).then(result => {
            searchText = searchText.toUpperCase();
            if (searchText === '') return [];
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

            $scope.loading = false;
            return results;
          });
        }
      }

    }
  }
};