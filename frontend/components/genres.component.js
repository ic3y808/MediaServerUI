class GenresController {
  constructor($scope, $rootScope, $location) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    console.log('genres-controller')

    $scope.genres = [];

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
        console.log("onGridReady");
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
        console.log('selection changed')
        var selectedRow = $scope.gridOptions.api.getSelectedRows()[0];

        $location.path("/genre/" + selectedRow.value.toString());
        $scope.$apply();
        console.log("/genre/" + selectedRow.value.toString());
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
    }

    $scope.reloadGenres = function () {
      if ($rootScope.isLoggedIn) {
        $scope.genres = [];
        $rootScope.subsonic.getGenres().then(function (result) {

          $scope.genres = result;
          $scope.gridOptions.api.setRowData($scope.genres);
          $scope.gridOptions.api.sizeColumnsToFit();
          $scope.$apply();
          $rootScope.hideLoader();
        });


      } else {
        if ($scope.gridOptions.api)
        $scope.gridOptions.api.showNoRowsOverlay();
        $rootScope.hideLoader();
      }
    }

    $rootScope.$on('loginStatusChange', function (event, data) {
      console.log('genres reloading on subsonic ready')
      $scope.reloadGenres();
    });



    $scope.reloadGenres();

    $rootScope.$on('menuSizeChange', function (event, currentState) {

      $('#genresGrid').width($('.wrapper').width());
      $('#genresGrid').height($('.wrapper').height());

      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
    });

    $rootScope.$on('windowResized', function (event, data) {

      $('#genresGrid').width($('.wrapper').width());
      $('#genresGrid').height($('.wrapper').height());

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
  templateUrl: '/template/genres.jade'
};