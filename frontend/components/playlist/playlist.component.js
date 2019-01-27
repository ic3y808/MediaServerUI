import './playlist.scss';
class PlaylistController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
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
      field: "play_count",
      width: 75,
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
      domLayout: 'autoHeight',
      getRowNodeId: function (data) {
        return data.id;
      },
      rowClassRules: {
        'current-track': function (params) {
          if ($scope.api) $scope.api.deselectAll();
          return MediaPlayer.checkIfNowPlaying(params.data);
        }
      },
      onModelUpdated: function (data) {
        AppUtilities.updateGridRows($scope.gridOptions);
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
        AppUtilities.setRowData($scope.gridOptions, MediaPlayer.tracks);
        AppUtilities.hideLoader();
        AppUtilities.apply();
      },
    };

    $rootScope.$on('trackChangedEvent', function (event, data) {
      AppUtilities.updateGridRows($scope.gridOptions);
    });

    $rootScope.$on('loginStatusChange', function (event, data) {
      AppUtilities.setRowData($scope.gridOptions, MediaPlayer.tracks);
    });

    $rootScope.$on('menuSizeChange', function (event, data) {
      AppUtilities.updateGridRows($scope.gridOptions);
    });

    $rootScope.$on('windowResized', function (event, data) {
      AppUtilities.updateGridRows($scope.gridOptions);
    });
  }
}

export default {
  bindings: {},
  controller: PlaylistController,
  templateUrl: '/template/playlist.jade'
};