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
      headerName: "Path",
      field: "path"
    },
    {
      headerName: "Tracks",
      field: "trackCount",
      width: 150
    },
    {
      headerName: "Plays",
      field: "playCount",
      width: 150
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
        AppUtilities.updateGridRows($scope.gridOptions);
      },
      onGridReady: function () {
        $scope.reloadAlbums();
        AppUtilities.updateGridRows($scope.gridOptions);
      },
      onSelectionChanged: function (data) {
        var selectedRow = $scope.gridOptions.api.getSelectedRows()[0];

        $location.path("/album/" + selectedRow.id.toString());
        if (!$scope.$$phase) {
          $scope.$apply();
        }
        that.Backend.debug("/album/" + selectedRow.id.toString());
      }
    };

    $scope.reloadAlbums = function () {
      $scope.albums = [];
      AlloyDbService.getAlbums().then(function (result) {
        $scope.albums = result;
        AppUtilities.updateGridRows($scope.gridOptions);
      });
    };

    $rootScope.$on('loginStatusChange', function (event, data) {
      that.Backend.debug('Albums reload on loginsatuschange');
      $scope.reloadAlbums();
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
  controller: AlbumsController,
  templateUrl: '/template/albums.jade'
};