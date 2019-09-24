import "./recent.scss";
class RecentController {
  constructor($scope, $rootScope, $element, AppUtilities, AlloyDbService, Logger, MediaPlayer) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$element = $element;
    this.AlloyDbService = AlloyDbService;
    this.AppUtilities = AppUtilities;
    this.Logger = Logger;
    this.MediaPlayer = MediaPlayer;
    this.Logger.debug("recent-controller");
    this.$scope.instanceCallback = (instance) => {
      this.table = instance.DataTable;
    };

    this.$scope.tableOptions = {
      pageResize: true
    };

    this.$scope.isStarred = (album) => {
      if (album) {
        if (album.starred === "true") { return "icon-star"; }
      }
      return "icon-star-o";
    };

    this.$rootScope.$on("windowResized", (event, data) => {
      this.table.draw();
    });

    this.$rootScope.$watch("recently_added_albums", (old, neew) => {
      this.table.draw();
    });

    this.$scope.playAlbum = (album) => {
      this.Logger.debug("Play Album");
      this.AlloyDbService.getAlbum(album.id).then((info) => {
        this.$rootScope.tracks = this.AppUtilities.shuffle(info.tracks);
        this.MediaPlayer.loadTrack(0);
      });
    }

    if (this.$rootScope.recently_added_albums && this.$rootScope.recently_added_albums.length < 50) {
      this.AlloyDbService.refreshRecent();
    }
  }

  $onInit() {
    this.$element.addClass("vbox");

  }
}

export default {
  bindings: {},
  controller: RecentController,
  templateUrl: "/template/recent.jade"
};