import './navbar.scss';
class NavbarController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend, SubsonicService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.SubsonicService = SubsonicService;
    this.Backend.debug('nav-controller');
    var that = this;

    $scope.selectedObject = null;

    $("#search-box").mouseleave(function () {
      $('#search-box').blur();
    });

    $("#search-box").mouseenter(function () {
      $('#search-box').focus();
    });


    $scope.autoCompleteOptions = {
      minimumChars: 1,
      pagingEnabled: false,
      activateOnFocus: true,
      dropdownWidth: '500px',
      dropdownHeight: '200px',
      dropdownParent: $('nav'),
      data: function (searchText) {
        var searchObj = {
          query: searchText,
          artistCount: 10,
          albumCount: 10,
          songCount: 5,

        };
        return that.SubsonicService.subsonic.search3(searchObj)
          .then(function (result) {

            console.log(typeof result.song)
            var songs = _.filter(result.song, function (song) {
              console.log('checking song ' + song.title )
              return song.title.toLowerCase().indexOf(searchText.toLowerCase()) === -1;
            });
            if (songs.length > 0) {
              return _.pluck(songs, 'title');
            }

            var artists = _.filter(result.artist, function (artist) {
              return artist.name.startsWith(searchText);
            });

            if (artists.length > 0) {
              return _.pluck(artists, 'name');
            }



          });
      },
      renderItem: function (item) {
        console.log(item);
        return {
          value: item.name,
          label: "<p class='auto-complete' ng-bind-html='entry.item.name'></p>"
        };
      },
      itemSelected: function (e) {
        that.selectedObject = e.item;
      }
    }
  }

  $onInit() {
  }
}

export default {
  bindings: {},
  controller: NavbarController,
  templateUrl: '/template/navbar.jade'
};