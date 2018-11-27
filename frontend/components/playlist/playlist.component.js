import './playlist.scss';
class PlaylistController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend, SubsonicService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.SubsonicService = SubsonicService;
    this.Backend.debug('playlist-controller');
    var that = this;
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
        'current-track': function (params) {
          if ($scope.api) $scope.api.deselectAll();
          return MediaPlayer.checkIfNowPlaying(params.data);
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
            that.Backend.debug('selection changed');
            var index = _.findIndex(that.MediaPlayer.tracks, function (track) {
              return track.id === selectedRow.id;
            });
            that.MediaPlayer.loadTrack(index);
          }
        }
      },
      onGridReady: function (event) {
        $scope.api = event.api;
        if ($scope.gridOptions && $scope.gridOptions.api) {
          $scope.gridOptions.api.setRowData(MediaPlayer.tracks);
          $scope.gridOptions.api.doLayout();
          $scope.gridOptions.api.sizeColumnsToFit();
          AppUtilities.hideLoader();
          AppUtilities.apply();
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
      $scope.gridOptions.api.setRowData(MediaPlayer.tracks);
    });

    $rootScope.$on('menuSizeChange', function (event, data) {
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
  controller: PlaylistController,
  templateUrl: '/template/playlist.jade'
};