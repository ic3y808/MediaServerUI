class ArtistController {
  constructor($scope, $rootScope, $routeParams, AppUtilities, Backend, MediaPlayer, SubsonicService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.SubsonicService = SubsonicService;
    this.Backend.debug('artist-controller');
    $scope.artist = {};
    $scope.albums = [];
    $scope.tracks = [];
    $scope.artistName = '';
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
        $scope.api.showLoadingOverlay();
      }
    };

    $scope.getArtist = function () {
      if (SubsonicService.isLoggedIn) {
        SubsonicService.subsonic.getArtist($routeParams.id).then(function (artist) {
          $scope.artist = artist;
          $scope.artistName = artist.name;

          SubsonicService.subsonic.getArtistInfo2($routeParams.id, 50).then(function (result) {
            if (result) {
              if (result.biography) {
                $scope.artistBio = result.biography.replace(/<a\b[^>]*>(.*?)<\/a>/i, "");
              }
              if (result.similarArtist) {
                $scope.similarArtists = result.similarArtist.slice(0, 5);
              }
              if (result.largeImageUrl) {
                that.AppUtilities.setContentBackground(result.largeImageUrl);
              }
              if (!$scope.$$phase) {
                $scope.$apply();
              }
            }
          });

          if (artist.album && artist.album.length > 0) {
            $scope.albums = [];
            $scope.tracks = [];
            artist.album.forEach(album => {

              if (album.coverArt) {
                that.SubsonicService.subsonic.getCoverArt(album.coverArt, 100).then(function (result) {
                  album.artUrl = result;
                  $scope.albums.push(album);
                  if (!$scope.$$phase) {
                    $scope.$apply();
                  }
                  $("#coverflow").flipster();
                });
              }


              SubsonicService.subsonic.getAlbum(album.id).then(function (result) {
                if (result) {
                  result.song.forEach(function (song) {
                    $scope.tracks.push(song);
                    if (!$scope.$$phase) {
                      $scope.$apply();
                    }
                  });

                  if ($scope.gridOptions && $scope.gridOptions.api) {
                    $scope.gridOptions.api.setRowData($scope.tracks);
                    $scope.gridOptions.api.doLayout();
                    $scope.gridOptions.api.sizeColumnsToFit();
                  }
                  if (!$scope.$$phase) {
                    $scope.$apply();
                  }
                  $("#coverflow").flipster();
                  AppUtilities.hideLoader();
                }
              });
            });
          } else {
            if ($scope.gridOptions.api)
              $scope.gridOptions.api.showNoRowsOverlay();
          }

          $("#coverflow").flipster();
          if (!$scope.$$phase) {
            $scope.$apply();
          }
          AppUtilities.hideLoader();
        });
      } else {
        if ($scope.gridOptions.api)
          $scope.gridOptions.api.showNoRowsOverlay();
        AppUtilities.hideLoader();
      }
    };

    $scope.refresh = function () {
      that.Backend.debug('refresh artist');
      $scope.getArtist();
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
      that.Backend.debug('artist reloading on subsonic ready');
      $scope.getArtist();
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

    $scope.getArtist();
  }
}

export default {
  bindings: {},
  controller: ArtistController,
  templateUrl: '/template/artist.pug'
};