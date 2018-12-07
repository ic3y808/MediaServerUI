import './album.scss';
class AlbumController {
  constructor($scope, $rootScope, $routeParams, AppUtilities, Backend, MediaPlayer, SubsonicService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.SubsonicService = SubsonicService;
    this.Backend.debug('artist-controller');
    $scope.album = {};
    $scope.tracks = [];
    $scope.albumName = '';
    var that = this;
    var columnDefs = [{
      headerName: "#",
      field: "track",
      width: 75,
      suppressSizeToFit: true
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
      headerName: "Artist",
      field: "artist"
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
          that.MediaPlayer.tracks = $scope.tracks;

          var index = _.findIndex(that.MediaPlayer.tracks, function (track) {
            return track.id === selectedRow.id;
          });
          that.MediaPlayer.loadTrack(index);
        }
      },
      onGridReady: function (e) {
        $scope.api = e.api;
        $scope.columnApi = e.columnApi;
        $scope.api.showLoadingOverlay();
      }
    };

    $scope.getAlbum = function () {
      if (SubsonicService.isLoggedIn) {
        SubsonicService.subsonic.getAlbum($routeParams.id).then(function (album) {
          $scope.album = album;
          $scope.albumName = album.name;
          $scope.tracks = album.song;

          SubsonicService.subsonic.getArtistInfo2($scope.album.artistId, 50).then(function (result) {
            if (result) {
              if (result.similarArtist) {
                $scope.similarArtists = result.similarArtist.slice(0, 5);
              }
              AppUtilities.apply();
            }
          });

          SubsonicService.subsonic.getAlbumInfo2($scope.album.id, 50).then(function (result) {
            if (result) {
              if (result.notes) {
                $scope.albumNotes = result.notes.replace(/<a\b[^>]*>(.*?)<\/a>/i, "");
              }
              if (result.largeImageUrl) {
                that.AppUtilities.setContentBackground(result.largeImageUrl);
              } else {
                if ($scope.album.coverArt) {
                  SubsonicService.subsonic.getCoverArt($scope.album.coverArt, 1920).then(function (result) {
                    $scope.album.artUrl = result;
                    if($scope.album.artUrl){
                      AppUtilities.setContentBackground($scope.album.artUrl);
                    }
                  });
                }
              }
              AppUtilities.apply();
            }
          });

          if ($scope.tracks && $scope.tracks.length > 0) {
            if ($scope.gridOptions && $scope.gridOptions.api) {
              $scope.gridOptions.api.setRowData($scope.tracks);
              $scope.gridOptions.api.doLayout();
              $scope.gridOptions.api.sizeColumnsToFit();
            }
          } else {
            if ($scope.gridOptions.api)
              $scope.gridOptions.api.showNoRowsOverlay();
          }

          AppUtilities.apply();
          AppUtilities.hideLoader();
        });
      } else {
        if ($scope.gridOptions.api)
          $scope.gridOptions.api.showNoRowsOverlay();
        AppUtilities.hideLoader();
      }
    };

    $scope.refresh = function () {
      that.Backend.debug('refresh album');
      $scope.getAlbum();
    };

    $scope.startRadio = function () {
      SubsonicService.subsonic.getSimilarSongs2($routeParams.id).then(function (similarSongs) {
        that.Backend.debug('starting radio');
        MediaPlayer.tracks = similarSongs.song;
        MediaPlayer.loadTrack(0);
      });
    };

    $scope.shuffle = function () {
      that.Backend.debug('shuffle play');
      that.MediaPlayer.tracks = AppUtilities.shuffle($scope.tracks);
      that.MediaPlayer.loadTrack(0);
    };

    $scope.shareAlbum = function () {
      that.Backend.debug('shareButton');
      that.SubsonicService.subsonic.createShare($scope.album.id, 'Shared from Alloy').then(function (result) {
        $('#shareAlbumButton').popover({
          animation: true,
          content: 'Success! Url Copied to Clipboard.',
          delay: {
            "show": 0,
            "hide": 5000
          },
          placement: 'top'
        }).popover('show');
        var url = result.url.toString();
        that.AppUtilities.copyTextToClipboard(url);
        setTimeout(() => {
          $('#shareAlbumButton').popover('hide');
        }, 5000);
      });
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
      that.Backend.debug('album reloading on subsonic ready');
      $scope.getAlbum();
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

    $scope.getAlbum();
  }
}

export default {
  bindings: {},
  controller: AlbumController,
  templateUrl: '/template/album.jade'
};