class GenreController {
  constructor($scope, $rootScope, $routeParams) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    console.log('genre-controller')
    $scope.artist = {};
    $scope.albums = [];
    $scope.tracks = [];
    $scope.artistName = '';
    $scope.genre = $routeParams.id;
    var columnDefs = [
      {
        headerName: "Artist",
        field: "artist"
      },
      {
        headerName: "Title",
        field: "title"
      },
      {
        headerName: "Album",
        field: "album"
      },
      {
        headerName: "Plays",
        field: "playCount",
        width: 60,
        suppressSizeToFit: true
      },
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
      rowMultiSelectWithClick: true,
      rowClassRules: {
        'current-track': function (params) {
          if ($scope.api) $scope.api.deselectAll();
          return $rootScope.checkIfNowPlaying(params.data);
        }
      },
      getRowNodeId: function (data) {
        return data.id;
      },
      onModelUpdated: function (data) {
        if (data && data.api) {
          data.api.doLayout();
          data.api.sizeColumnsToFit();
        }
      },
      onSelectionChanged: function (data) {
        var selectedRow = $scope.api.getSelectedRows()[0];
        if (selectedRow) {
          if ($scope.tracks) {
            $rootScope.tracks = $scope.tracks;

            var index = _.findIndex($rootScope.tracks, function (track) {
              if (track && selectedRow) {
                return track.id === selectedRow.id
              } else return false;
            })
            $rootScope.loadTrack(index);
            $rootScope.$digest();
          }
        }

      },
      onGridReady: function (e) {
        $scope.api = e.api;
        $scope.columnApi = e.columnApi;
      },
    };

    $scope.getGenre = function () {
      if ($rootScope.isLoggedIn) {
        $rootScope.subsonic.getSongsByGenre($routeParams.id, 500, 0).then(function (result) {
          $scope.tracks = result.song;
          if ($scope.gridOptions && $scope.gridOptions.api) {
            $scope.gridOptions.api.setRowData($scope.tracks);
            $scope.gridOptions.api.doLayout();
            $scope.gridOptions.api.sizeColumnsToFit();
          }
          if (!$scope.$$phase) {
            $scope.$apply();
          }
          $rootScope.hideLoader();
        });
      } else {
        if ($scope.gridOptions.api)
          $scope.gridOptions.api.showNoRowsOverlay();
        $rootScope.hideLoader();
      }
    }

    $scope.refresh = function () {
      console.log('refresh genre')
      $scope.getGenre();
    };

    $scope.shuffle = function () {
      console.log('shuffle play')
      $rootScope.tracks = _.shuffle($scope.tracks);
      $rootScope.loadTrack(0);
      $rootScope.$digest();
    };

    $rootScope.$on('loginStatusChange', function (event, data) {
      console.log('genre reloading on subsonic ready')
      $scope.getGenre();
    });

    $rootScope.$on('menuSizeChange', function (event, data) {

      //$('#genreTrackGrid').width($('.main-content').width());
      //$('#genreTrackGrid').height($('.main-content').height());

      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
    });

    $rootScope.$on('windowResized', function (event, data) {
      //$('#genreTrackGrid').width($('.main-content').width());
      //$('#genreTrackGrid').height($('.main-content').height());

      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
    });

    $scope.getGenre();
  }
}

export default {
  bindings: {},
  controller: GenreController,
  templateUrl: '/template/genre.jade'
};