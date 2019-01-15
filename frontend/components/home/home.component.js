import styles from './home.scss';
class HomeController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Backend.debug('home-controller');
    var that = this;

    $scope.refresh = function () {

      $scope.random = [];
      var getRandomSongs = that.AlloyDbService.getRandomSongs();
      if (getRandomSongs) {
        getRandomSongs.then(function (result) {
          $scope.random = result;

          var plist = [
            {
              "title": "luminous sky",
              "description": "another spectacular masterpiece of nature",
              "image": "https://luwes.github.io/js-cover-flow/media/DSC00358.jpg"
            },
            {
              "title": "volcano valley",
              "description": "",
              "image": "https://luwes.github.io/js-cover-flow/media/IMG_0044.jpg"
            },
            {
              "title": "sheep hill path",
              "description": "",
              "image": "https://luwes.github.io/js-cover-flow/media/DSC00435.jpg"
            },
            {
              "title": "saw tooth ridge",
              "description": "",
              "image": "https://luwes.github.io/js-cover-flow/media/DSC00736.jpg"
            },
            {
              "title": "winter long",
              "description": "what a massive and unbelievable winter we're having!",
              "image": "https://luwes.github.io/js-cover-flow/media/IMG_0028.jpg"
            },
            {
              "title": "unreachable peak",
              "description": "",
              "image": "https://luwes.github.io/js-cover-flow/media/DSC01313.jpg"
            }
          ];
          coverflow('player').setup({
            //flash: 'coverflow.swf',
            backgroundcolor: "ffffff",
            playlist: plist,
            width:'100%'
     
        });
          that.AppUtilities.apply();
        });
      }
    };

    $rootScope.$on('loginStatusChange', function (event, data) {
      that.Backend.debug('Home reload on loginsatuschange');
      $scope.refresh();
    });

    $rootScope.$on('menuSizeChange', function (event, currentState) {


    });

    $rootScope.$on('windowResized', function (event, data) {


    });


    
    
    $scope.refresh();

    if ($rootScope.isMenuCollapsed) $('.content').toggleClass('content-wide');

   
    this.AppUtilities.hideLoader();

  }
}

export default {
  bindings: {},
  controller: HomeController,
  templateUrl: '/template/home.jade'
};