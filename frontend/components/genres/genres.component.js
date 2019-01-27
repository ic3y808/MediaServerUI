import './genres.scss';
class GenresController {
  constructor($scope, $rootScope, $location, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('genres-controller');
    this.AppUtilities.showNoRows();
    this.AppUtilities.showLoader();
    $scope.genres = [];
    var that = this;
    var columnDefs = [{
      headerName: "Genre",
      field: "name"
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

        $location.path("/genre/" + selectedRow.id.toString());
        that.AppUtilities.apply();
        that.Backend.debug("/genre/" + selectedRow.id.toString());
      }
    };

    $scope.refresh = function () {
      AlloyDbService.refreshGenres();
    };

    $rootScope.$on('menuSizeChange', function (event, currentState) {
      AppUtilities.updateGridRows($scope.gridOptions);
    });

    $rootScope.$on('windowResized', function (event, data) {
      AppUtilities.updateGridRows($scope.gridOptions);
    });

    $rootScope.$watch('genres', function (newVal, oldVal) {
      if ($rootScope.genres) {
        AppUtilities.setRowData($scope.gridOptions, $rootScope.genres);
        AppUtilities.apply();
        AppUtilities.hideLoader();
      }
    });
  }
}

export default {
  bindings: {},
  controller: GenresController,
  templateUrl: '/template/genres.jade'
};