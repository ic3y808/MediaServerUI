export default function (AlloyDbService, Logger) {
  "ngInject";
  return {
    restrict: "AE",
    templateUrl: "/template/starratinglabel.jade",
    replace: true,
    scope: {
      track: "=",
      artist: "=",
      album: "=",
      extrastyles: "@"
    },
    controller: ["$scope", "$attrs", "$element", "$compile",
      function ($scope, $attrs, $element, $compile) {
        "ngInject";
        $scope.rating = 0;
        $scope.$watch("track", function (oldVal, newVal) {
          if ($scope.track) {
            $scope.rating = $scope.track.rating;
            setSelection();
          }
        });

        $scope.$watch("artist", function (oldVal, newVal) {
          if ($scope.artist) {
            $scope.rating = $scope.artist.rating;
            setSelection();
          }
        });

        $scope.$watch("album", function (oldVal, newVal) {
          if ($scope.album) {
            $scope.rating = $scope.album.rating;
            setSelection();
          }
        });

        var fill = function (i) {
          for (var x = 1; x <= i; x++) {
            $(".star" + x).addClass("star-rating-selected")
          }
        };

        var unfill = function () {
          for (var x = 1; x <= 5; x++) {
            $(".star" + x).removeClass("star-rating-selected");
          }
          fill($scope.rating);
        };

        var setSelection = function (i) {
          unfill();
          fill($scope.rating);
        };

        var updateRating = function (i) {
          if ($scope.rating === i)
          $scope.rating = 0
        else
          $scope.rating = i;
          setSelection($scope.rating);
          var params = {
            rating: $scope.rating
          }

          if ($scope.album) {
            params.album_id = $scope.album.id;
            $scope.album.rating = $scope.rating;
            Logger.info("setting rating for album " + $scope.album.name + " to " + $scope.rating);
          }
          if ($scope.artist) {
            params.artist_id = $scope.artist.id;
            $scope.artist.rating = $scope.rating;
            Logger.info("setting rating for artist " + $scope.artist.name + " to " + $scope.rating);
          }
          if ($scope.track) {
            params.track_id = $scope.track.id;
            $scope.track.rating = $scope.rating;
            Logger.info("setting rating for track " + $scope.track.title + " to " + $scope.rating);
          }
          var rating = AlloyDbService.setRating(params);
          if (rating) {
            rating.then(result => {
              Logger.info(JSON.stringify(result));
            });
          }
        };

        $(".star1").mouseenter(function () {
          fill(1);
        }).mouseleave(unfill).click(function () {
          updateRating(1);
        });
        $(".star2").mouseenter(function () {
          fill(2);
        }).mouseleave(unfill).click(function () {
          updateRating(2);
        });
        $(".star3").mouseenter(function () {
          fill(3);
        }).mouseleave(unfill).click(function () {
          updateRating(3);
        });
        $(".star4").mouseenter(function () {
          fill(4);
        }).mouseleave(unfill).click(function () {
          updateRating(4);
        });
        $(".star5").mouseenter(function () {
          fill(5);
        }).mouseleave(unfill).click(function () {
          updateRating(5);
        });
      }
    ]
  }
}