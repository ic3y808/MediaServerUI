module.exports = function ($rootScope, $location, Backend, AppUtilities, AlloyDbService, MediaPlayer) {
  return {
    restrict: 'E',
    scope: {
      data: '=',
      hasjumpbar: '@'
    },
    templateUrl: 'template/artistlist.jade',
    replace: true,
    link: function (scope, elm, attrs) {
      scope.navToArtist = function (id) {
        $location.path('/artist/' + id);
      }
      var testForLetter = function (character) {
        try {
          //Variable declarations can't start with digits or operators
          //If no error is thrown check for dollar or underscore. Those are the only nonletter characters that are allowed as identifiers
          eval("let " + character + ";");
          let regExSpecial = /[^\$_]/;
          return regExSpecial.test(character);
        }
        catch (error) {
          return false;
        }
      }
      scope.getId = function (name) {

        if (!testForLetter(name.charAt(0).toUpperCase())) return 'symbol';
        return name.charAt(0).toUpperCase()
      }

      scope.checkIfNowPlaying = function (id) {
        var selected = MediaPlayer.selectedTrack();
        if (selected) {
          return id === selected.base_id;
        }
        return false;
      }

      scope.starArtist = function (artist) {
        Backend.info('starring artist: ' + artist.base_path);
        if (artist.starred === 'true') {
          AlloyDbService.unstar({ artist: artist.base_id }).then(function (result) {
            Backend.info('UnStarred');
            Backend.info(result);
            artist.starred = 'false';
            AppUtilities.apply();
          });
        } else {
          AlloyDbService.star({ artist: artist.base_id }).then(function (result) {
            Backend.info('starred');
            Backend.info(result);
            artist.starred = 'true';
            AppUtilities.apply();
          });
        }
      }

      scope.playArtist = function (artist) {
        console.log(artist);
        var artistRquest = AlloyDbService.getArtist(artist.base_id);
        if (artistRquest) {
          artistRquest.then(function (data) {
            Backend.debug('selection changed');
            var artist = JSON.parse(data);
            $rootScope.tracks = AppUtilities.shuffle(artist.tracks);
            MediaPlayer.loadTrack(0);
          });
        }
      }
    }
  }
};
