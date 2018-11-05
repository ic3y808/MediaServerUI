class GenresController {
  constructor($scope, $rootScope, $location, MediaElement, MediaPlayer, AppUtilities, Backend, SubsonicService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.SubsonicService = SubsonicService;
    this.Backend.debug('genres-controller');
    $scope.genres = [];
    var that = this;
    var columnDefs = [{
        headerName: "Genre",
        field: "value"
      },
      {
        headerName: "Albums",
        field: "albumCount"
      },
      {
        headerName: "Songs",
        field: "songCount"
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
        return data.value;
      },
      rowMultiSelectWithClick: false,
      onModelUpdated: function (data) {
        if (data && data.api) {
          data.api.doLayout();
          data.api.sizeColumnsToFit();
        }
      },
      onGridReady: function () {
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
        that.Backend.debug('selection changed');
        var selectedRow = $scope.gridOptions.api.getSelectedRows()[0];

        that.$location.path("/genre/" + selectedRow.value.toString());
        if (!$scope.$$phase) {
          $scope.$apply();
        }
        that.Backend.debug("/genre/" + selectedRow.value.toString());
      }
    };

    $scope.getGenres = function (genreCollection, callback) {
      var genres = [];
      genreCollection.forEach(genreHolder => {
        genreHolder.genre.forEach(genre => {
          genres.push(genre);
        });
      });

      Promise.all(genres).then(function (genreResult) {
        callback(genreResult);
      });
    };

    $scope.reloadGenres = function () {
      if (SubsonicService.isLoggedIn) {
        $scope.genres = [];
        SubsonicService.subsonic.getGenres().then(function (result) {

          $scope.genres = result;
          $scope.gridOptions.api.setRowData($scope.genres);
          $scope.gridOptions.api.sizeColumnsToFit();
          if (!$scope.$$phase) {
            $scope.$apply();
          }
          AppUtilities.hideLoader();
        });


      } else {
        if ($scope.gridOptions.api)
          $scope.gridOptions.api.showNoRowsOverlay();
        AppUtilities.hideLoader();
      }
    };

    $rootScope.$on('loginStatusChange', function (event, data) {
      that.Backend.debug('genres reloading on subsonic ready');
      $scope.reloadGenres();
    });



    $scope.reloadGenres();

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
  controller: GenresController,
  templateUrl: '/template/genres.pug'
};