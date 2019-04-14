export default function ApplicationRun($window, $rootScope, $location, $timeout, Logger, Backend, MediaPlayer, AppUtilities) {
  "ngInject";
  Logger.info("starting application");
  $rootScope.settings = [];
  $rootScope.scrollPos = {};

  var windowResized = AppUtilities.debounce(function () {
    AppUtilities.broadcast("windowResized");
  }, 25);

  $(window).on("resize", windowResized);


  $window.onkeyup = function (e) {
    var key = e.keyCode ? e.keyCode : e.which;
    //  var focus = $("#search-box").is(":focus") 
    //if (!focus) {
    if (key === 32) {
      e.preventDefault();
      MediaPlayer.toggleCurrentStatus();
    }
    //}
  };

  $window.onkeydown = function (e) {
    var key = e.keyCode ? e.keyCode : e.which;
    if (key === 32) {
      e.preventDefault();
    }
  };

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
<<<<<<< HEAD
    if ($select.is(":disabled")) { return; }
    if ($select.attr("type") === "radio" && $checked) { return; }
    if ($select.attr("type") === "radio") { $menu.find("li").removeClass("active"); }
=======
    if ($select.is(":disabled"))
      {return;}
    if ($select.attr("type") == "radio" && $checked)
      {return;}
    if ($select.attr("type") == "radio")
      {$menu.find("li").removeClass("active");}
>>>>>>> master
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
<<<<<<< HEAD
    var $target = {};
    var $this = $(e.target), $class = "collapse";
    if (!$this.is("a")) { $this = $this.closest("a"); }
=======
    var $this = $(e.target), $class = "collapse", $target;
    if (!$this.is("a"))
      {$this = $this.closest("a");}
>>>>>>> master
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
<<<<<<< HEAD

  setHeight();

=======
  var setHeight = function () {
    $(".app-fluid #nav > *").css("min-height", $(window).height() - 60);
    return true;
  };
  setHeight();
  var fixVbox = function () {
    $(".ie11 .vbox").each(function () {
      $(this).height($(this).parent().height());
    });
    return true;
  };
>>>>>>> master
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

  var Tab = function (element) {
    this.element = $(element);
  };
  Tab.prototype.show = function () {
    var $this = this.element;
    var $ul = $this.closest("ul:not(.dropdown-menu)");
    var selector = $this.data("target");
    if (!selector) {
      selector = $this.attr("href");
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, "");
    }
<<<<<<< HEAD
    if ($this.parent("li").hasClass("active")) { return; }
=======
    if ($this.parent("li").hasClass("active"))
      {return;}
>>>>>>> master
    var previous = $ul.find(".active:last a")[0];
    var e = $.Event("show.bs.tab", {
      relatedTarget: previous
    });
    $this.trigger(e);
<<<<<<< HEAD
    if (e.isDefaultPrevented()) { return; }
=======
    if (e.isDefaultPrevented())
      {return;}
>>>>>>> master
    var $target = $(selector);
    this.activate($this.parent("li"), $ul);
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: "shown.bs.tab",
        relatedTarget: previous
      });
    });
  };
  Tab.prototype.activate = function (element, container, callback) {
    var $active = container.find("> .active");
    var transition = callback && $.support.transition && $active.hasClass("fade");
    function next() {
      $active.removeClass("active").find("> .dropdown-menu > .active").removeClass("active");
      element.addClass("active");
      if (transition) {
        element[0].offsetWidth;
        element.addClass("in");
      } else {
        element.removeClass("fade");
      }
      if (element.parent(".dropdown-menu")) {
        element.closest("li.dropdown").addClass("active");
      }
      callback && callback();
    }
    transition ? $active.one($.support.transition.end, next).emulateTransitionEnd(150) : next();
    $active.removeClass("in");
  };
  var old = $.fn.tab;
  $.fn.tab = function (option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data("bs.tab");
<<<<<<< HEAD
      if (!data) { $this.data("bs.tab", (data = new Tab(this))); }
      if (typeof option === "string") { data[option](); }
=======
      if (!data)
        {$this.data("bs.tab", (data = new Tab(this)));}
      if (typeof option === "string")
        {data[option]();}
>>>>>>> master
    });
  };
  $.fn.tab.Constructor = Tab;
  $.fn.tab.noConflict = function () {
    $.fn.tab = old;
    return this;
  };
  $(document).on("click.bs.tab.data-api", "[data-toggle=\"tab\"], [data-toggle=\"pill\"]", function (e) {
    e.preventDefault();
    $(this).tab("show");
  });
<<<<<<< HEAD

=======
 
>>>>>>> master

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

  // toggleFullScreen();

  //$window.onbeforeunload = function () {
  //  return "Are you sure to leave this page?";
  //}

  $timeout(function () {
    Logger.debug("loading settings");
<<<<<<< HEAD
    if ($rootScope) { $rootScope.socket.emit("load_settings", "alloydb_settings"); }
    if ($rootScope) { $rootScope.socket.emit("load_settings", "sabnzbd_settings"); }
=======
    if ($rootScope)
      {$rootScope.socket.emit("load_settings", "alloydb_settings");}
    if ($rootScope)
      {$rootScope.socket.emit("load_settings", "sabnzbd_settings");}
>>>>>>> master

    setTimeout(() => {
      if (MediaPlayer.castStatus()) {
        Logger.debug("cast status true, initialize cast");
        MediaPlayer.initializeCast();
      }
    }, 1000);
  });

  Logger.info("Application Loaded");
}