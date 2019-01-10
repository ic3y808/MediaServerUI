import './genre.scss';
class GenreController {
  constructor($scope, $rootScope, $routeParams, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$routeParams = $routeParams;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('genre-controller');
    $scope.artist = {};
    $scope.albums = [];
    $scope.tracks = [];
    $scope.artistName = '';
    $scope.all_expanded = false;
    $scope.albums_expanded = true;
    $scope.tracks_expanded = false;
    $scope.genre = this.$routeParams.id;
    var that = this;
    var columnDefs = [{
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
      rowSelection: 'multiple',
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      rowDeselection: true,
      animateRows: true,
      domLayout: 'autoHeight',
      rowClassRules: {
        'current-track': function (params) {
          if ($scope.api) $scope.api.deselectAll();
          return MediaPlayer.checkIfNowPlaying(params.data);
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
      onRowDoubleClicked: function (e) {
        var selectedRow = e.data;
        if (selectedRow) {
          MediaPlayer.tracks = $scope.tracks;

          var index = _.findIndex(MediaPlayer.tracks, function (track) {
            return track.id === selectedRow.id;
          });
          MediaPlayer.loadTrack(index);
        }
      },
      onGridReady: function (e) {
        $scope.api = e.api;
        $scope.columnApi = e.columnApi;
      },
    };

    $scope.getGenre = function () {
      if (AlloyDbService.isLoggedIn) {
        that.AlloyDbService.getSongsByGenre(that.$routeParams.id, 500, 0).then(function (result) {
          $scope.tracks = result;
          if ($scope.gridOptions && $scope.gridOptions.api) {
            $scope.gridOptions.api.setRowData($scope.tracks);
            $scope.gridOptions.api.doLayout();
            $scope.gridOptions.api.sizeColumnsToFit();
          }
          if (!$scope.$$phase) {
            $scope.$apply();
          }
          that.AppUtilities.hideLoader();
        });
      } else {
        if ($scope.gridOptions.api)
          $scope.gridOptions.api.showNoRowsOverlay();
        AppUtilities.hideLoader();
      }
    };

    $scope.toggleAlbums = function () {
      if ($scope.albums_expanded) $('#albumListContainer').hide();
      else $('#albumListContainer').show();
      $scope.albums_expanded = !$scope.albums_expanded;
    }

    $scope.toggleTracks = function () {
      if ($scope.tracks_expanded) $('#trackListContainer').hide();
      else $('#trackListContainer').show();
      $scope.tracks_expanded = !$scope.tracks_expanded;

      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }
    }

    $scope.toggleAll = function () {
      $scope.tracks_expanded = $scope.all_expanded;
      $scope.albums_expanded = $scope.all_expanded;

      if ($scope.albums_expanded) $('#albumListContainer').hide();
      else $('#albumListContainer').show();

      if ($scope.tracks_expanded) $('#trackListContainer').hide();
      else $('#trackListContainer').show();

      if ($scope.gridOptions && $scope.gridOptions.api) {
        $scope.gridOptions.api.doLayout();
        $scope.gridOptions.api.sizeColumnsToFit();
      }

      $scope.all_expanded = !$scope.all_expanded;
    }

    $scope.refresh = function () {
      that.Backend.debug('refresh genre');
      $scope.getGenre();
    };

    $scope.shuffle = function () {
      that.Backend.debug('shuffle play');
      MediaPlayer.tracks = AppUtilities.shuffle($scope.tracks);
      MediaPlayer.loadTrack(0);
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
      that.Backend.debug('Genre reload on loginsatuschange');
      $scope.getGenre();
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

    $scope.getGenre();
  }
}

export default {
  bindings: {},
  controller: GenreController,
  templateUrl: '/template/genre.jade'
};