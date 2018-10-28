class SidenavController {
  constructor($scope, $rootScope, MediaElement, MediaPlayer, AppUtilities, Backend, SubsonicService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.MediaElement = MediaElement;
    this.MediaPlayer = MediaPlayer;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.SubsonicService = SubsonicService;
    this.Backend.debug('sidenav-controller');
  }

  $onInit() {
    var that = this;

    $('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
    });

    $('#body-row .collapse').collapse('hide');

    // Collapse/Expand icon
    $('#collapse-icon').addClass('fa-angle-double-left');

    // Collapse click
    $('[data-toggle=sidebar-colapse]').click(function () {
      that.sidebarCollapse();
    });

    $('.list-group li').click(function (e) {
      e.preventDefault();

      $that = $(this);

      $that.parent().find('li').removeClass('active');
      $that.addClass('active');
    });

    jQuery(".list-group").hover(function () {
        jQuery(this).addClass("active");
      },
      function () {
        jQuery(this).removeClass("active");
      });
  }

  sidebarCollapse() {
    this.$rootScope.isMenuCollapsed = !this.$rootScope.isMenuCollapsed;
    $('.menu-collapsed').toggleClass('d-none');
    $('.sidebar-submenu').toggleClass('d-none');
    $('.submenu-icon').toggleClass('d-none');
    $('.list-group').toggleClass('card-5');
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