'use strict';

HomeController.$inject = ['$rootScope', '$scope', 'chromecastService', 'subsonicService'];

function HomeController($rootScope, $scope, chromecastService, subsonicService) {
  console.log('home-controller')
  $(".content").css("display", "none");
  $(".loader").css("display", "block");

  $scope.processTracks = function (songCollection, callback) {
    var songs = [];
    songCollection.forEach(song => {

      if (song.coverArt) {
        $rootScope.subsonic.getCoverArt(song.coverArt, 200).then(function (art) {
          //song.artworkUrl = art;
          // $scope.random.push(song);
        });
      }



    });

    Promise.all(songs).then(function (songsResult) {
      callback(songsResult);
    });
  }


  $scope.reloadRandomTracks = function () {
    if ($rootScope.isLoggedIn) {
      $scope.random = [];
      $rootScope.subsonic.getRandomSongs().then(function (result) {
        $scope.processTracks(result.song, function (results) {
          $scope.$apply();
        });

      });


    }
  }




  $rootScope.$on('loginStatusChange', function (event, data) {
    console.log('home reloading on subsonic ready')
    $scope.reloadRandomTracks();
  });

  $rootScope.$on('menuSizeChange', function (event, currentState) {


  });

  $rootScope.$on('windowResized', function (event, data) {


  });


  $scope.reloadRandomTracks();

  if ($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');
  $(".loader").css("display", "none");
  $(".content").css("display", "block");
}




module.exports = HomeController;