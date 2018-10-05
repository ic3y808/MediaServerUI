GenreController.$inject = ['$scope', '$rootScope', '$routeParams'];

function GenreController($scope, $rootScope, $routeParams) {
  console.log('genre-controller')
  $scope.artist = {};
  $scope.albums = [];
  $scope.tracks = [];
  $scope.artistName = '';
  $scope.genre = $routeParams.id;
  var columnDefs = [
    {
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
    rowSelection: 'single',
    enableColResize: true,
    enableSorting: true,
    enableFilter: true,
    rowDeselection: true,
    animateRows: true,
    getRowNodeId: function (data) {
      return data.id;
    },
    rowMultiSelectWithClick: true,
    onModelUpdated: function (data) {
      if (data && data.api) {
        data.api.doLayout();
        data.api.sizeColumnsToFit();
      }
    },
    onSelectionChanged: function (data) {
      var selectedRow = $scope.api.getSelectedRows()[0];
      $rootScope.tracks = $scope.tracks;

      var index = _.findIndex($rootScope.tracks, function (track) {
        return track.id === selectedRow.id
      })
      $rootScope.loadTrack(index);
      $rootScope.$digest();

    },
    onGridReady: function (e) {
      $scope.api = e.api;
      $scope.columnApi = e.columnApi;
    }
  };

  $scope.getGenre = function () {
    if ($rootScope.isLoggedIn) {
      $rootScope.subsonic.getSongsByGenre($routeParams.id, 500, 0).then(function (result) {
        $scope.tracks = result.song;
        if ($scope.gridOptions && $scope.gridOptions.api) {
          $scope.gridOptions.api.setRowData($scope.tracks);
          $scope.gridOptions.api.doLayout();
          $scope.gridOptions.api.sizeColumnsToFit();
        }
        $scope.$apply();
      });
    }
  }

  $scope.shuffle = function () {
    console.log('shuffle play')
    $rootScope.tracks = _.shuffle($scope.tracks);
    $rootScope.loadTrack(0);
    $rootScope.$digest();
  };

  $rootScope.$on('loginStatusChange', function (event, data) {
    console.log('genre reloading on subsonic ready')
    $scope.getGenre();
  });

  $rootScope.$on('menuSizeChange', function (event, data) {

    $('#genresGrid').width($('.wrapper').width());

    if ($scope.gridOptions && $scope.gridOptions.api) {
      $scope.gridOptions.api.doLayout();
      $scope.gridOptions.api.sizeColumnsToFit();
    }
  });

  $rootScope.$on('windowResized', function (event, data) {

    $('#genresGrid').width($('.wrapper').width());
    $('#genresGrid').height($('.wrapper').height());

    if ($scope.gridOptions && $scope.gridOptions.api) {
      $scope.gridOptions.api.doLayout();
      $scope.gridOptions.api.sizeColumnsToFit();
    }
  });

  $scope.getGenre();
  if ($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');
  $(".loader").css("display", "none");
  $(".content").css("display", "block");
}

export default GenreController;
