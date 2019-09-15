export default function ApplicationRun($window, $rootScope, $location, $cookies, $http, AuthenticationService, Logger, MediaPlayer, AppUtilities, AlloyDbService) {
  "ngInject";
  Logger.info("Starting WebUI");
  $rootScope.page_title = "Alloy";
  $rootScope.settings = [];
  $rootScope.scrollPos = {};
  $rootScope.contextMenu = $("#contextMenu");
  $rootScope.globals = $cookies.getObject("globals") || {};
  if ($rootScope.globals.currentUser) {
    $http.defaults.headers.common["Authorization"] = "Basic " + $rootScope.globals.currentUser.authdata;
  }

  $rootScope.publicPaths = ["/login", "/register", "/status", "/charts"];
  $rootScope.newShare = {
    type: "",
    id: "",
    description: "",
    expires: "",
    url: ""
  };
  $rootScope.newUser = {
    type: "",
    username: "",
    password: ""
  };

  $rootScope.$on("$locationChangeStart", function (event, next, current) {

    var currentPath = $location.path();
    var restrictedPage = $.inArray(currentPath, $rootScope.publicPaths) === -1;
    if (currentPath.indexOf("/share") > -1) { restrictedPage = false; }
    var loggedIn = $rootScope.globals.currentUser;

    var host = $location.host();
    if ((host === "localhost" || host === "127.0.0.1") && loggedIn) {
      return;
    } else if (host === "localhost" || host === "127.0.0.1") {
      AuthenticationService.SetCredentials("localhost_user", "localhost_user");
      return;
    }

    if (restrictedPage && !loggedIn) {
      $location.path("/login");
    }
  });


  $rootScope.isMenuItemSelected = function(item, isHeader = false) {
    var currentLocation = $location.path();
    currentLocation = currentLocation.replace(/\//g, "");
    if(isHeader){
      return item === currentLocation ? "selectedMenuItem" : "bg-dark-flat";
    } 
    return item === currentLocation ? "selectedMenuItem" : "";
   
  };


  var windowResized = AppUtilities.debounce(function () {
    AppUtilities.broadcast("windowResized");
    if ($(window).width() < 960) {
      $(".nav").removeClass("nav-off-screen");
    }
    else {
      $(".nav").addClass("nav-off-screen");
    }
  }, 25);

  $(window).on("resize", windowResized);

  function toggleFullScreen() {
    var doc = window.document;
    var docEl = doc.documentElement;

    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullScreen.call(docEl);
    }
    else {
      cancelFullScreen.call(doc);
    }
  }

  $rootScope.doShare = function () {
    AlloyDbService.share().then(() => {
      $("#shareModal").modal("toggle");
      $rootScope.newShare = {
        type: "",
        id: "",
        description: "",
        expires: "",
        url: ""
      };
    });
  };

  $rootScope.createUser = function () {
    AlloyDbService.newUser().then((status) => {
      if (status.result === "success") {
        AlloyDbService.refreshUsers();
        $("#createUserModal").modal("toggle");
        $rootScope.newUser = {
          type: "",
          username: "",
          password: ""
        };
      }
    }).catch((err) => {
      this.error(err);
    });
  };

  $rootScope.CheckContext = function (e) {
    $rootScope.contextMenu.hide();

    var $invokedOn = $rootScope.contextMenu.data("invokedOn");
    if ($invokedOn) {
      var opts = $invokedOn.split(";");
      var method = opts[0];
      var id = opts[1];
      var $selectedMenu = $(e.target);

      switch ($selectedMenu[0].type) {
        case "Share":
          switch (method) {
            case "track":
              AlloyDbService.shareTrack(id).then((result) => {
                Logger.info("Share created " + result);
              });
              break;
            case "album":
              AlloyDbService.shareAlbum(id).then((result) => {
                Logger.info("Share created " + result);
              });
              break;
            case "artist":
              AlloyDbService.shareArtist(id).then((result) => {
                Logger.info("Share created " + result);
              });
              break;
            case "genre":
              AlloyDbService.shareGenre(id).then((result) => {
                Logger.info("Share created " + result);
              });
              break;
          }
          break;
        case "Star":
          switch (method) {
            case "track":
              AlloyDbService.star({ id: id }).then((status) => {
                Logger.info("starred " + status.result);
                AlloyDbService.refreshStarred();
              });
              break;
            case "album":
              AlloyDbService.star({ album: id }).then((status) => {
                Logger.info("Share created " + status.result);
                AlloyDbService.refreshStarred();
              });
              break;
            case "artist":
              AlloyDbService.star({ artist: id }).then((status) => {
                Logger.info("Share created " + status.result);
                AlloyDbService.refreshStarred();
              });
              break;
            case "genre":
              AlloyDbService.star({ genre: id }).then((status) => {
                Logger.info("Share created " + status.result);
                AlloyDbService.refreshStarred();
              });
              break;
          }
          break;
        case "Play":

          break;
        case "AddToPlaylist":
          var playlist = $selectedMenu[0].getAttribute("playlist-id");

          switch (method) {
            case "track":
              AlloyDbService.updatePlaylist({ id: playlist, songId: id }).then(() => {
                AlloyDbService.refreshPlaylists();
              });
              break;
            case "artist":
              AlloyDbService.getArtist(id).then((result) => {
                var ids = [];
                result.tracks.forEach((track) => {
                  ids.push(track.id);
                });
                AlloyDbService.updatePlaylist({ id: playlist, songIds: ids, replace: false }).then(() => {
                  AlloyDbService.refreshPlaylists();
                });
              });
              break;
            case "album":
              AlloyDbService.getAlbum(id).then((result) => {
                var ids = [];
                result.tracks.forEach((track) => {
                  ids.push(track.id);
                });
                AlloyDbService.updatePlaylist({ id: playlist, songIds: ids, replace: false }).then(() => {
                  AlloyDbService.refreshPlaylists();
                });
              });
              break;
          }
          break;
      }
    }
  };

  $rootScope.setupContext = function () {
    $("body").on("contextmenu", "ul li", function (e) {
      $rootScope.contextMenu.css({ display: "block", left: e.pageX, top: e.pageY }).data("invokedOn", this.getAttribute("data-value"));
      return false;
    });

    $("body").on("contextmenu", ".item", function (e) {
      $rootScope.contextMenu.css({ display: "block", left: e.pageX, top: e.pageY }).data("invokedOn", this.getAttribute("data-value"));
      return false;
    });

    $("body").on("contextmenu", "tr", function (e) {
      $rootScope.contextMenu.css({ display: "block", left: e.pageX, top: e.pageY }).data("invokedOn", this.getAttribute("data-value"));
      return false;
    });

    $("body").on("contextmenu", "a", function (e) {
      $rootScope.contextMenu.css({ display: "block", left: e.pageX, top: e.pageY }).data("invokedOn", this.getAttribute("data-value"));
      return false;
    });

    $("body").on("click", function (e) {
      $rootScope.contextMenu.hide();
    });

    $rootScope.contextMenu.off("click").on("click", "a", (e) => {
      $rootScope.CheckContext(e);
    });

    $rootScope.contextMenu.on("click", "a", function (e) {
      $rootScope.contextMenu.hide();
    });
  };

  jQuery.fn.scrollTo = function (elem) {
    this.scrollTop(0);
    var el = $(elem);
    var elOffset = el.offset().top;
    var elHeight = el.height();
    var windowHeight = $("#primary-content").height();
    var offset;

    if (elHeight < windowHeight) {
      offset = elOffset - ((windowHeight / 2) - (elHeight / 2));
    }
    else {
      offset = elOffset;
    }
    if (offset != 0) {   this.scrollTop(offset); }
  };

  $window.onkeyup = function (e) {
    var key = e.keyCode ? e.keyCode : e.which;
    var focus = $("input").is(":focus");
    if (!focus) {
      if (key === 9) { // tab
        e.preventDefault();
        AppUtilities.broadcast("GotoNowPlaying");
      }
      if (key === 32) { // space
        e.preventDefault();
        MediaPlayer.toggleCurrentStatus();
      }
      if (key === 122) { // F11
        toggleFullScreen();
      }
    }
  };

  $window.onkeydown = function (e) {
    var key = e.keyCode ? e.keyCode : e.which;
    var focus = $("input").is(":focus");
    if (!focus) {
      if (key === 32) {
        e.preventDefault();
      }
    }
    if (key === 9) { // tab
      e.preventDefault();
    }
  };

  $rootScope.$on("$routeChangeSuccess", function ($event, next, current) {
    $rootScope.setupContext();
  });

  $(document).on("click", "[data-toggle=fullscreen]", function (e) {
    e.preventDefault();
    if (screenfull.enabled) {
      screenfull.request();
    }
  });
  //$("input[placeholder], textarea[placeholder]").placeholder();
  $("[data-toggle=popover]").popover();
  $(document).on("click", ".popover-title .close", function (e) {
    var $target = $(e.target)
      , $popover = $target.closest(".popover").prev();
    $popover && $popover.popover("hide");
  });
  $(document).on("click", "[data-toggle=\"ajaxModal\"]", function (e) {
    $("#ajaxModal").remove();
    e.preventDefault();
    var $this = $(this)
      , $remote = $this.data("remote") || $this.attr("href")
      , $modal = $("<div class=\"modal fade\" id=\"ajaxModal\"><div class=\"modal-body\"></div></div>");
    $("body").append($modal);
    $modal.modal();
    $modal.load($remote);
  });
  $.fn.dropdown.Constructor.prototype.change = function (e) {
    e.preventDefault();
    var $select = {};
    var $menu = {};
    var $label = {};
    var $item = $(e.target), $checked = false;
    !$item.is("a") && ($item = $item.closest("a"));
    $menu = $item.closest(".dropdown-menu");
    $label = $menu.parent().find(".dropdown-label");
    $labelHolder = $label.text();
    $select = $item.parent().find("input");
    $checked = $select.is(":checked");
    if ($select.is(":disabled")) { return; }
    if ($select.attr("type") === "radio" && $checked) { return; }
    if ($select.attr("type") === "radio") { $menu.find("li").removeClass("active"); }
    $item.parent().removeClass("active");
    !$checked && $item.parent().addClass("active");
    $select.prop("checked", !$select.prop("checked"));
    $items = $menu.find("li > input:checked");
    if ($items.length) {
      $text = [];
      $items.each(function () {
        var $str = $(this).parent().text();
        $str && $text.push($.trim($str));
      });
      $text = $text.length < 4 ? $text.join(", ") : $text.length + " selected";
      $label.html($text);
    } else {
      $label.html($label.data("placeholder"));
    }
  };
  $(document).on("click.dropdown-menu", ".dropdown-select > li > a", $.fn.dropdown.Constructor.prototype.change);
  $("[data-toggle=tooltip]").tooltip();
  $(document).on("click", "[data-toggle^=\"class\"]", function (e) {
    e && e.preventDefault();
    var $class = {}, $target = {}, $tmp = {}, $classes = {}, $targets = {};
    var $this = $(e.target);
    !$this.data("toggle") && ($this = $this.closest("[data-toggle^=\"class\"]"));
    $class = $this.data()["toggle"];
    $target = $this.data("target") || $this.attr("href");
    $class && ($tmp = $class.split(":")[1]) && ($classes = $tmp.split(","));
    $target && ($targets = $target.split(","));
    $classes && $classes.length && $.each($targets, function (index, value) {
      if ($classes[index].indexOf("*") !== -1) {
        var patt = new RegExp("\\s" + $classes[index].replace(/\*/g, "[A-Za-z0-9-_]+").split(" ").join("\\s|\\s") + "\\s", "g");
        $($this).each(function (i, it) {
          var cn = " " + it.className + " ";
          while (patt.test(cn)) {
            cn = cn.replace(patt, " ");
          }
          it.className = $.trim(cn);
        });
      }
      ($targets[index] !== "#") && ($($targets[index]).toggleClass($classes[index]) || $this.toggleClass($classes[index]));
    });
    $this.toggleClass("active");
  });
  $(document).on("click", ".panel-toggle", function (e) {
    e && e.preventDefault();
    var $target = {};
    var $this = $(e.target), $class = "collapse";
    if (!$this.is("a")) { $this = $this.closest("a"); }
    $target = $this.closest(".panel");
    $target.find(".panel-body").toggleClass($class);
    $this.toggleClass("active");
  });
  $(".carousel.auto").carousel();
  $(document).on("click.button.data-api", "[data-loading-text]", function (e) {
    var $this = $(e.target);
    $this.is("i") && ($this = $this.parent());
    $this.button("loading");
  });
  var $window = $(window);
  var mobile = function (option) {
    if (option === "reset") {
      //$("[data-toggle^="shift"]").shift("reset");
      return true;
    }
    // $("[data-toggle^="shift"]").shift("init");
    return true;
  };
  var fixVbox = function () {
    $(".ie11 .vbox").each(function () {
      $(this).height($(this).parent().height());
    });
    return true;
  };
  var setHeight = function () {
    $(".app-fluid #nav > *").css("min-height", $(window).height() - 60);
    return true;
  };

  $window.width() < 768 && mobile();

  var $resize = {}, $width = $window.width();
  $window.resize(function () {
    if ($width !== $window.width()) {
      clearTimeout($resize);
      $resize = setTimeout(function () {
        setHeight();
        $window.width() < 768 && mobile();
        $window.width() >= 768 && mobile("reset") && fixVbox();
        $width = $window.width();
      }, 500);
    }
  });

  setHeight();

  fixVbox();
  $(document).on("click", "[data-ride=\"collapse\"] a", function (e) {
    var $this = $(e.target);
    var $active = {};
    $this.is("a") || ($this = $this.closest("a"));
    $active = $this.parent().siblings(".active");
    $active && $active.toggleClass("active").find("> ul:visible").slideUp(200);
    ($this.parent().hasClass("active") && $this.next().slideUp(200)) || $this.next().slideDown(200);
    $this.parent().toggleClass("active");
    var isMenu = $this.next().is("ul");

    !$this.next().is("ul") && $("#sidenavButton").click();

    $this.next().is("ul") && e.preventDefault();
    if ($active.length === 0) {

    }
    setTimeout(function () {
      $(document).trigger("updateNav");
    }, 300);
  });
  $(document).on("click.bs.dropdown.data-api", ".dropdown .on, .dropup .on, .open .on", function (e) {
    e.stopPropagation();
  });

  $(".datepicker").datepicker({
    format: "mm/dd/yyyy",
    startDate: "-3d"
  });

  //$window.onbeforeunload = function () {
  //  return "Are you sure to leave this page?";
  //}
  Logger.debug("loading settings");
  $rootScope.socket.emit("load_settings", "alloydb_settings");
  $rootScope.loaded = "true";
  $("body").toggle();
  Logger.info("Web UI Loaded");
}