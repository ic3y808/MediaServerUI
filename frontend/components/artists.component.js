class ArtistsController {
  constructor($scope, $rootScope, $location) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    console.log('artists-controller')

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
        console.log("onGridReady");
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
        console.log('onSelectionChanged')
        var selectedRow = $scope.gridOptions.api.getSelectedRows()[0];

        $location.path("/artist/" + selectedRow.id.toString());
        $scope.$apply();
        console.log("/artist/" + selectedRow.id.toString());
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
    }

    $scope.reloadArtists = function () {
      if ($rootScope.isLoggedIn) {
        $scope.artists = [];
        $rootScope.subsonic.getArtists().then(function (artistsCollection) {
          $scope.getArtists(artistsCollection, function (result) {
            $scope.artists = result;
            $scope.gridOptions.api.setRowData($scope.artists);
            $scope.gridOptions.api.sizeColumnsToFit();
            $scope.$apply();
          })
        });


      }
    }

    $rootScope.$on('loginStatusChange', function (event, data) {
      console.log('music reloading on subsonic ready')
      //$scope.reloadArtists();
    });

    document.addEventListener("DOMContentLoaded", function () {
      var eGridDiv = document.querySelector('#artistsGrid');
      new agGrid.Grid(eGridDiv, $scope.gridOptions);
    });

    $rootScope.$on('menuSizeChange', function (event, currentState) {

      $('#artistsGrid').width($('.wrapper').width());
      $('#artistsGrid').height($('.wrapper').height());

      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
    });

    $rootScope.$on('windowResized', function (event, data) {

      $('#artistsGrid').width($('.wrapper').width());
      $('#artistsGrid').height($('.wrapper').height());

      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
    });




    if ($rootScope.isMenuCollapsed === true) {
      $('.content').toggleClass('content-wide');
      $('.gridContainer ').toggleClass('dataTable-wide');
    }
    $(".loader").css("display", "none");
    $(".content").css("display", "block");
  }
}

export default {
  bindings: {},
  controller: ArtistsController,
  templateUrl: '/template/artists.jade'
};