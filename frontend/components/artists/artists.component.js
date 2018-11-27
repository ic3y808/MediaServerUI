import './artists.scss';
class ArtistsController {
  constructor($scope, $rootScope, $location, AppUtilities, Backend, MediaPlayer, SubsonicService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.SubsonicService = SubsonicService;
    this.Backend.debug('artists-controller');
    var that = this;

    var columnDefs = [{
      headerName: "Name",
      field: "name"
    },
    {
      headerName: "Albums",
      field: "albumCount",
      width: 150,
      suppressSizeToFit: false
    }
    ];

    $scope.gridOptions = {
      columnDefs: columnDefs,
      rowData: null,
      rowSelection: 'single',
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      rowDeselection: true,
      animateRows: true,
      getRowNodeId: function (data) {
        return data.id;
      },
      rowMultiSelectWithClick: false,
      onModelUpdated: function (data) {
        if (data && data.api) {
          data.api.doLayout();
          data.api.sizeColumnsToFit();
        }
      },
      onGridReady: function () {
        $scope.reloadArtists();
        $scope.gridOptions.api.sizeColumnsToFit();
        $scope.gridOptions.api.addGlobalListener(
          function (foo) {
            _.debounce(function () {
              $scope.gridOptions.api.sizeColumnsToFit();
            }, 300);

          }
        );
      },
      onSelectionChanged: function (data) {
        that.Backend.debug('onSelectionChanged');
        var selectedRow = $scope.gridOptions.api.getSelectedRows()[0];

        $location.path("/artist/" + selectedRow.id.toString());
        if (!$scope.$$phase) {
          $scope.$apply();
        }
        that.Backend.debug("/artist/" + selectedRow.id.toString());
      }
    };

    $scope.getArtists = function (artistsCollection, callback) {
      var artists = [];
      artistsCollection.forEach(artistHolder => {
        artistHolder.artist.forEach(artist => {
          artists.push(artist);
        });
      });

      Promise.all(artists).then(function (artistsResult) {
        callback(artistsResult);
      });
    };

    $scope.reloadArtists = function () {
      if (SubsonicService.isLoggedIn) {
        $scope.artists = [];
        SubsonicService.subsonic.getArtists().then(function (artistsCollection) {
          $scope.getArtists(artistsCollection, function (result) {
            $scope.artists = result;
            if ($scope.gridOptions.api) {
              $scope.gridOptions.api.setRowData($scope.artists);
              $scope.gridOptions.api.sizeColumnsToFit();
              if (!$scope.$$phase) {
                $scope.$apply();
              }
              AppUtilities.hideLoader();
            }
          });
        });
      } else {
        if ($scope.gridOptions.api)
          $scope.gridOptions.api.showNoRowsOverlay();
        AppUtilities.hideLoader();
      }
    };

    $rootScope.$on('loginStatusChange', function (event, data) {
      that.Backend.debug('music reloading on subsonic ready');
      $scope.reloadArtists();
    });

    document.addEventListener("DOMContentLoaded", function () {
      var eGridDiv = document.querySelector('#artistsGrid');
      new agGrid.Grid(eGridDiv, $scope.gridOptions);
    });

    $rootScope.$on('menuSizeChange', function (event, currentState) {

      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
    });

    $rootScope.$on('windowResized', function (event, data) {

      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }


    });
  }
}

export default {
  bindings: {},
  controller: ArtistsController,
  templateUrl: '/template/artists.jade'
};