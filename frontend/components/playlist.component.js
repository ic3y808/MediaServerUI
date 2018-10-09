class PlaylistController {
  constructor($scope, $rootScope) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    console.log('playlist-controller')

    var columnDefs = [{
        headerName: "Title",
        field: "title"
      },
      {
        headerName: "Artist",
        field: "artist"
      },
      {
        headerName: "Album",
        field: "album"
      },
      {
        headerName: "Title",
        field: "title"
      },
      {
        headerName: "Genre",
        field: "genre"
      },
      {
        headerName: "Plays",
        field: "playCount",
        width: 75,
        suppressSizeToFit: true
      },
    ];

    $scope.gridOptions = {
      columnDefs: columnDefs,
      rowData: null,
      rowSelection: 'multiple',
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      rowDeselection: true,
      animateRows: true,
      getRowNodeId: function (data) {
        return data.id;
      },
      rowMultiSelectWithClick: true,
      rowClassRules: {
        // row style function
        'current-track': function (params) {
          if ($rootScope.selectedTrack()) {
            $scope.api.deselectAll();
            return params.data.id === $rootScope.selectedTrack().id;
          }
          return false;
        }
      },
      onModelUpdated: function (data) {
        if (data && data.api) {
          data.api.doLayout();
          data.api.sizeColumnsToFit();
        }
      },
      onRowDoubleClicked: function (e) {
        if ($scope.gridOptions && $scope.gridOptions.api) {
          var selectedRow = e.data;
          if (selectedRow) {
            console.log('selection changed')
            var index = _.findIndex($rootScope.tracks, function (track) {
              return track.id === selectedRow.id
            })
            $rootScope.loadTrack(index);
            $rootScope.$digest();
          }
        }
      },
      onGridReady: function (event) {
        $scope.api = event.api;
        if ($scope.gridOptions && $scope.gridOptions.api) {
          $scope.gridOptions.api.setRowData($rootScope.tracks);
          $scope.gridOptions.api.doLayout();
          $scope.gridOptions.api.sizeColumnsToFit();
        }
      },
    };

    $rootScope.$on('trackChangedEvent', function (event, data) {
      $scope.api.redrawRows({
        force: true
      });
      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
    });

    $rootScope.$on('loginStatusChange', function (event, data) {
      $scope.gridOptions.api.setRowData($rootScope.tracks);
    });

    $rootScope.$on('menuSizeChange', function (event, data) {
      $('#playlistGrid').width($('.wrapper').width());
      $('#playlistGrid').height($('.wrapper').height());
      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }

    });

    $rootScope.$on('windowResized', function (event, data) {

      $('#playlistGrid').width($('.wrapper').width());
      $('#playlistGrid').height($('.wrapper').height());

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
  controller: PlaylistController,
  templateUrl: '/template/playlist.jade'
};