import styles from './sidenav.scss';
class SidenavController {
  constructor($scope, $rootScope, $element, Logger, MediaElement, MediaPlayer, AppUtilities, AlloyDbService, Backend) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$element = $element;
    this.Logger = Logger;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.AlloyDbService = AlloyDbService;
    this.Backend = Backend;
    this.Logger.debug('sidenav-controller');

    $scope.getNowPlayingImage = () => {
      return this.MediaPlayer.selectedTrack();
    };

    $scope.showCreatePlaylistModal = () => {
      var $this = $(this)
        , $remote = $this.data('remote') || $this.attr('href')
        , $modal = $('#addPlaylistModal')
      $('#primary-content').append($modal);
      $modal.modal();
    };
    $scope.createNewPlaylist = () => {
      var newPlaylist = this.AlloyDbService.addPlaylist({ name: $scope.newPlaylistName });
      if (newPlaylist) {
        newPlaylist.then(result => {
          this.AlloyDbService.refreshPlaylists();
          console.log(result);
        });
      }
      $('#addPlaylistModal').modal('hide')
    };
  }

  $onInit() {
    this.$element.addClass('vbox')
    $('#sidebarCollapse').on('click', () => {
      $('#sidebar').toggleClass('active');
    });

    $('#body-row .collapse').collapse('hide');

    // Collapse/Expand icon
    $('#collapse-icon').addClass('fa-angle-double-left');

    // Collapse click
    $('[data-toggle=sidebar-colapse]').click(() => {
      this.sidebarCollapse();
    });

    $('.list-group li').click(function (e) {
      e.preventDefault();
      $that = $(this);
      $that.parent().find('li').removeClass('active');
      $that.addClass('active');
    });

    jQuery(".list-group").hover(() => {
      jQuery(this).addClass("active");
    },
      () => {
        jQuery(this).removeClass("active");
      });

    $(window).on('resize', () => {
      const breakWidth = parseInt(styles.xxmed);
      if ($(window).width() < breakWidth && !this.$rootScope.isMenuCollapsed) {
        this.sidebarCollapse();
      } else if ($(window).width() > breakWidth && this.$rootScope.isMenuCollapsed) {
        this.sidebarCollapse();
      }
    });

    if ($(window).width() < 500) {
      this.sidebarCollapse();
    }

  }

  sidebarCollapse() {
    this.$rootScope.isMenuCollapsed = !this.$rootScope.isMenuCollapsed;
    $('.menu-collapsed').toggleClass('d-none');
    $('.sidebar-submenu').toggleClass('d-none');
    $('.submenu-icon').toggleClass('d-none');
    $('#list-tab').toggleClass('card-5');
    $('.sidebar').toggleClass('sidebar-expanded sidebar-collapsed');

    // Treating d-flex/d-none on separators with title
    var SeparatorTitle = $('.sidebar-separator-title');
    if (SeparatorTitle.hasClass('d-flex')) {
      SeparatorTitle.removeClass('d-flex');
    } else {
      SeparatorTitle.addClass('d-flex');
    }

    // Collapse/Expand icon
    $('#collapse-icon').toggleClass('fa-angle-double-left fa-angle-double-right');
    this.AppUtilities.broadcast('menuSizeChange');
  }
}

export default {
  bindings: {},
  controller: SidenavController,
  templateUrl: '/template/sidenav.jade'
};