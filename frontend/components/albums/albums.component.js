import './albums.scss';
class AlbumsController {
  constructor($scope, $rootScope, $location, AppUtilities, Backend, MediaPlayer, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('albums-controller');
    this.AppUtilities.showNoRows();
    this.AppUtilities.showLoader();
    var that = this;

    var columnDefs = [{
      headerName: "Album Name",
      field: "name"
    },
    {
      headerName: "Artist",
      field: "base_path"
    },
    {
      headerName: "Genre",
      field: "genre"
    },
    {
      headerName: "Tracks",
      field: "track_count",
      width: 100,
      suppressSizeToFit: true
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
      domLayout: 'autoHeight',
      getRowNodeId: function (data) {
        return data.id;
      },
      rowMultiSelectWithClick: false,
      onModelUpdated: function (data) {
        AppUtilities.updateGridRows($scope.gridOptions);
      },
      onGridReady: function () {
        AppUtilities.updateGridRows($scope.gridOptions);
      },
      onSelectionChanged: function (data) {
        var selectedRow = $scope.gridOptions.api.getSelectedRows()[0];

        $location.path("/album/" + selectedRow.id.toString());
        that.AppUtilities.apply();
        that.Backend.debug("/album/" + selectedRow.id.toString());
      }
    };

    $scope.refresh = function () {
      AlloyDbService.refreshAlbums();
    };

    $rootScope.$on('menuSizeChange', function (event, currentState) {
      AppUtilities.updateGridRows($scope.gridOptions);
    });

    $rootScope.$on('windowResized', function (event, data) {
      AppUtilities.updateGridRows($scope.gridOptions);
    });

    $rootScope.$watch('albums', function (newVal, oldVal) {
      if ($rootScope.albums) {
        AppUtilities.setRowData($scope.gridOptions, $rootScope.albums);
        AppUtilities.apply();
        AppUtilities.hideLoader();
      }
    });
  }
}

export default {
  bindings: {},
  controller: AlbumsController,
  templateUrl: '/template/albums.jade'
};