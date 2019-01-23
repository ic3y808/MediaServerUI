import './artists.scss';
class ArtistsController {
  constructor($scope, $rootScope, $location, AppUtilities, Backend, MediaPlayer, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('artists-controller');
    this.AppUtilities.showLoader();
    var that = this;

    var columnDefs = [{
      headerName: "Name",
      field: "base_path"
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
      getRowNodeId: function (data) {
        return data.base_id;
      },
      rowMultiSelectWithClick: false,
      onModelUpdated: function (data) {
        AppUtilities.updateGridRows($scope.gridOptions);
      },
      onGridReady: function () {
        $scope.reloadArtists();
        AppUtilities.updateGridRows($scope.gridOptions);
      },
      onSelectionChanged: function (data) {
        that.Backend.debug('onSelectionChanged');
        var selectedRow = $scope.gridOptions.api.getSelectedRows()[0];

        $location.path("/artist/" + selectedRow.base_id.toString());
        if (!$scope.$$phase) {
          $scope.$apply();
        }
        that.Backend.debug("/artist/" + selectedRow.base_id.toString());
      }
    };

    $scope.reloadArtists = function () {

      $scope.artists = [];
      AppUtilities.showNoRows();
      var artists = that.AlloyDbService.getMusicFolders();
      if (artists) {
        artists.then(function (result) {
          $scope.artists = result;
          AppUtilities.setRowData($scope.gridOptions, $scope.artists);
          AppUtilities.apply();
          AppUtilities.hideLoader();
        });
      }
    };

    $rootScope.$on('loginStatusChange', function (event, data) {
      that.Backend.debug('Artists reload on loginsatuschange');
      $scope.reloadArtists();
    });

    document.addEventListener("DOMContentLoaded", function () {
      var eGridDiv = document.querySelector('#artistsGrid');
      new agGrid.Grid(eGridDiv, $scope.gridOptions);
    });

    $rootScope.$on('menuSizeChange', function (event, currentState) {

      AppUtilities.updateGridRows($scope.gridOptions);
    });

    $rootScope.$on('windowResized', function (event, data) {

      AppUtilities.updateGridRows($scope.gridOptions);


    });
  }
}

export default {
  bindings: {},
  controller: ArtistsController,
  templateUrl: '/template/artists.jade'
};