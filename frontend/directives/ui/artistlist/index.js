export default function ($rootScope, $location, Logger, Backend, AppUtilities, AlloyDbService, MediaPlayer) {
  "ngInject";
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
        if (artist.starred === 'true') {
          Logger.info('un-starring artist: ' + artist.name);
          AlloyDbService.unstar({ artist: artist.id }).then(function (result) {
            Logger.info(JSON.stringify(result));
            artist.starred = 'false';
            AppUtilities.apply();
          });
        } else {
          Logger.info('starring artist: ' + artist.name);
          AlloyDbService.star({ artist: artist.id }).then(function (result) {
            Logger.info(JSON.stringify(result));
            artist.starred = 'true';
            AppUtilities.apply();
          });
        }
      }

      scope.playArtist = function (artist) {
        var artistRquest = AlloyDbService.getArtist(artist.id);
        if (artistRquest) {
          artistRquest.then(function (artist) {
            Logger.debug('selection changed');
            $rootScope.tracks = AppUtilities.shuffle(artist.tracks);
            MediaPlayer.loadTrack(0);
          });
        }
      }
    }
  }
};
