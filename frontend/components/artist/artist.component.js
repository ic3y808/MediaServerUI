import './artist.scss';
import Glide from '@glidejs/glide'


class ArtistController {
  constructor($scope, $rootScope, $routeParams, $compile, AppUtilities, Backend, MediaPlayer, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$routeParams = $routeParams;
    this.$compile = $compile;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('artist-controller');
    this.AppUtilities.showLoader();
    $scope.artistName = '';
    $scope.artist = {};
    $scope.artist = {};
    $scope.albums = [];
    $scope.tracks = [];
    $scope.all_expanded = false;
    $scope.albums_expanded = true;
    $scope.tracks_expanded = false;
    $('#trackListContainer').hide();


    var that = this;
    var columnDefs = [{
      headerName: "#",
      field: "no",
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
        AppUtilities.updateGridRows($scope.gridOptions);
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
        // $scope.api.showLoadingOverlay();
      }
    };

    $scope.menuOptions = [
      // NEW IMPLEMENTATION
      {
        text: 'Object-Select',
        click: function ($itemScope, $event, modelValue, text, $li) {
          $scope.selected = $itemScope.item.name;
        }
      },
      {
        text: 'Object-Remove',
        click: function ($itemScope, $event, modelValue, text, $li) {
          $scope.items.splice($itemScope.$index, 1);
        }
      },
      // LEGACY IMPLEMENTATION
      ['Select', function ($itemScope, $event, modelValue, text, $li) {
        $scope.selected = $itemScope.item.name;
      }],
      null, // Dividier
      ['Remove', function ($itemScope, $event, modelValue, text, $li) {
        $scope.items.splice($itemScope.$index, 1);
      }]
    ];

    $scope.getCoverArt = function (id) {
      return that.AlloyDbService.getCoverArt(id);
    }

    $scope.toggleAlbums = function () {
      if ($scope.albums_expanded) $('#albumListContainer').hide();
      else $('#albumListContainer').show();
      $scope.albums_expanded = !$scope.albums_expanded;
    }

    $scope.toggleTracks = function () {
      if ($scope.tracks_expanded) $('#trackListContainer').hide();
      else $('#trackListContainer').show();
      $scope.tracks_expanded = !$scope.tracks_expanded;

      AppUtilities.updateGridRows($scope.gridOptions);
    }

    $scope.toggleAll = function () {
      $scope.tracks_expanded = $scope.all_expanded;
      $scope.albums_expanded = $scope.all_expanded;

      if ($scope.albums_expanded) $('#albumListContainer').hide();
      else $('#albumListContainer').show();

      if ($scope.tracks_expanded) $('#trackListContainer').hide();
      else $('#trackListContainer').show();

      AppUtilities.updateGridRows($scope.gridOptions);

      $scope.all_expanded = !$scope.all_expanded;
    }

    $scope.getTags = function(obj){
      return obj;
    }

    $scope.getArtist = function () {

      var artist = that.AlloyDbService.getArtist($routeParams.id);
      if (artist) {
        artist.then(function (artist) {

          $scope.artist = artist;
          $scope.artistName = artist.name;
          $scope.artist.albums.forEach(function (album) {
            album.cover_art = $scope.getCoverArt(album.cover_art);
          })

          $scope.tracks = artist.tracks;

          AppUtilities.setRowData($scope.gridOptions, $scope.tracks);

          var artistInfo = that.AlloyDbService.getArtistInfo($scope.artistName);
          if (artistInfo) {
            artistInfo.then(function (info) {
              if (info.artistInfo) {
                $scope.artistInfo = info.artistInfo;

                angular.element(document.getElementById('linkContainer')).append($compile("<div> <p>test</p></div>")($scope));

               // $('#linkContainer').append('<popoverbutton buttontext="Tags" buttonicon="fa-tags" data="artistInfo.tags.tag"><popoverbutton>')


                if ($scope.artistInfo.bio) {
                  $scope.artistBio = $scope.artistInfo.bio.summary.replace(/<a\b[^>]*>(.*?)<\/a>/i, "");
                }
                if ($scope.artistInfo.similar) {
                  $scope.similarArtists = $scope.artistInfo.similar.artist.slice(0, 5);
                }
                if ($scope.artistInfo.image) {
                  $scope.artistInfo.image.forEach(function (image) {
                    if (image['@'].size === 'large') {
                      $scope.artistImage = image['#'];
                    }
                    if (image['@'].size === 'extralarge') {
                      $scope.artistImage = image['#'];
                      //that.AppUtilities.setContentBackground(image['#']);
                    }
                  });
                }
                that.AppUtilities.apply();
                that.AppUtilities.hideLoader();
              } else {
                that.AppUtilities.hideLoader();
              }
            });
          }

          that.AppUtilities.apply();
        });
      }
    };

    $scope.refresh = function () {
      that.Backend.debug('refresh artist');
      $scope.getArtist();
    };

    $scope.startRadio = function () {
      AlloyDbService.getSimilarSongs2($routeParams.id).then(function (similarSongs) {
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

    $scope.starArtist = function () {
      that.Backend.info('starring artist: ' + $scope.artist);
      if ($scope.artist.starred === 'true') {
        that.AlloyDbService.unstar({ artist: that.$routeParams.id }).then(function (result) {
          that.Backend.info('UnStarred');
          that.Backend.info(result);
          that.$scope.artist.starred = 'false'
          that.AppUtilities.apply();
        });
      } else {
        that.AlloyDbService.star({ artist: that.$routeParams.id }).then(function (result) {
          that.Backend.info('starred');
          that.Backend.info(result);
          that.$scope.artist.starred = 'true'
          that.AppUtilities.apply();
        });
      }
    };

    $rootScope.$on('trackChangedEvent', function (event, data) {
      $scope.api.redrawRows({
        force: true
      });
      AppUtilities.updateGridRows($scope.gridOptions);
    });

    $rootScope.$on('loginStatusChange', function (event, data) {
      that.Backend.debug('Artist reload on loginsatuschange');
      $scope.getArtist();
    });

    $rootScope.$on('menuSizeChange', function (event, data) {
      AppUtilities.updateGridRows($scope.gridOptions);
    });

    $rootScope.$on('windowResized', function (event, data) {
      AppUtilities.updateGridRows($scope.gridOptions);
    });

   

    $scope.getArtist();
  }
}

export default {
  bindings: {},
  controller: ArtistController,
  templateUrl: '/template/artist.jade'
};