/*!

 =========================================================
 * Material Dashboard - v2.1.1
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-dashboard
 * Copyright 2018 Creative Tim (http://www.creative-tim.com)

 * Designed by www.invisionapp.com Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 */


var breakCards = true;

var searchVisible = 0;
var transparent = true;

var transparentDemo = true;
var fixedTop = false;

var mobile_menu_visible = 0,
  mobile_menu_initialized = false,
  toggle_initialized = false,
  bootstrap_nav_initialized = false;

var seq = 0,
  delays = 80,
  durations = 500;
var seq2 = 0,
  delays2 = 80,
  durations2 = 500;

  
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.

function debounce(func, wait, immediate) {
  var timeout = null;
  return function () {
    var context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate) { func.apply(context, args); }
    }, wait);
    if (immediate && !timeout) { func.apply(context, args); }
  };
}

$(document).ready(function () {

  $("body").bootstrapMaterialDesign();

  $sidebar = $(".sidebar");

  md.initSidebarsCheck();

  window_width = $(window).width();

  // check if there is an image set for the sidebar's background
  md.checkSidebarImage();

  //  Activate the tooltips
  $("[rel=\"tooltip\"]").tooltip({ trigger: "hover" });
  $.fn.selectpicker.Constructor.BootstrapVersion = "4";

  $(".form-control").on("focus", function () {
    $(this).parent(".input-group").addClass("input-group-focus");
  }).on("blur", function () {
    $(this).parent(".input-group").removeClass("input-group-focus");
  });

  // remove class has-error for checkbox validation
  $("input[type=\"checkbox\"][required=\"true\"], input[type=\"radio\"][required=\"true\"]").on("click", function () {
    if ($(this).hasClass("error")) {
      $(this).closest("div").removeClass("has-error");
    }
  });

  $().ready(function () {
    $sidebar = $(".sidebar");
    $sidebar_img_container = $sidebar.find(".sidebar-background");
    $full_page = $(".full-page");
    $sidebar_responsive = $("body > .navbar-collapse");
    window_width = $(window).width();
    fixed_plugin_open = $(".sidebar .sidebar-wrapper .nav li.active a p").html();
    if (window_width > 767 && fixed_plugin_open == "Dashboard") {
      if ($(".fixed-plugin .dropdown").hasClass("show-dropdown")) {
        $(".fixed-plugin .dropdown").addClass("open");
      }
    }
    $(".fixed-plugin a").click(function (event) {
      // Alex if we click on switch, stop propagation of the event, so the dropdown will not be hide, otherwise we set the  section active
      if ($(this).hasClass("switch-trigger")) {
        if (event.stopPropagation) {
          event.stopPropagation();
        } else if (window.event) {
          window.event.cancelBubble = true;
        }
      }
    });
    $(".fixed-plugin .active-color span").click(function () {
      $full_page_background = $(".full-page-background");
      $(this).siblings().removeClass("active");
      $(this).addClass("active");
      var new_color = $(this).data("color");
      if ($sidebar.length != 0) {
        $sidebar.attr("data-color", new_color);
      }
      if ($full_page.length != 0) {
        $full_page.attr("filter-color", new_color);
      }
      if ($sidebar_responsive.length != 0) {
        $sidebar_responsive.attr("data-color", new_color);
      }
    });
    $(".fixed-plugin .background-color .badge").click(function () {
      $(this).siblings().removeClass("active");
      $(this).addClass("active");
      var new_color = $(this).data("background-color");
      if ($sidebar.length != 0) {
        $sidebar.attr("data-background-color", new_color);
      }
    });
    $(".fixed-plugin .img-holder").click(function () {
      $full_page_background = $(".full-page-background");
      $(this).parent("li").siblings().removeClass("active");
      $(this).parent("li").addClass("active");
      var new_image = $(this).find("img").attr("src");
      if ($sidebar_img_container.length !== 0 && $(".switch-sidebar-image input:checked").length != 0) {
        $sidebar_img_container.fadeOut("fast", function () {
          $sidebar_img_container.css("background-image", "url(\"" + new_image + "\")");
          $sidebar_img_container.fadeIn("fast");
        });
      }
      if ($full_page_background.length !== 0 && $(".switch-sidebar-image input:checked").length != 0) {
        var new_image_full_page = $(".fixed-plugin li.active .img-holder").find("img").data("src");
        $full_page_background.fadeOut("fast", function () {
          $full_page_background.css("background-image", "url(\"" + new_image_full_page + "\")");
          $full_page_background.fadeIn("fast");
        });
      }
      if ($(".switch-sidebar-image input:checked").length == 0) {
        var new_image = $(".fixed-plugin li.active .img-holder").find("img").attr("src");
        var new_image_full_page = $(".fixed-plugin li.active .img-holder").find("img").data("src");
        $sidebar_img_container.css("background-image", "url(\"" + new_image + "\")");
        $full_page_background.css("background-image", "url(\"" + new_image_full_page + "\")");
      }
      if ($sidebar_responsive.length != 0) {
        $sidebar_responsive.css("background-image", "url(\"" + new_image + "\")");
      }
    });
    $(".switch-sidebar-image input").change(function () {
      $full_page_background = $(".full-page-background");
      $input = $(this);
      if ($input.is(":checked")) {
        if ($sidebar_img_container.length != 0) {
          $sidebar_img_container.fadeIn("fast");
          $sidebar.attr("data-image", "#");
        }
        if ($full_page_background.length != 0) {
          $full_page_background.fadeIn("fast");
          $full_page.attr("data-image", "#");
        }
        background_image = true;
      } else {
        if ($sidebar_img_container.length != 0) {
          $sidebar.removeAttr("data-image");
          $sidebar_img_container.fadeOut("fast");
        }
        if ($full_page_background.length != 0) {
          $full_page.removeAttr("data-image", "#");
          $full_page_background.fadeOut("fast");
        }
        background_image = false;
      }
    });
    $(".switch-sidebar-mini input").change(function () {
      $body = $("body");
      $input = $(this);
      if (md.misc.sidebar_mini_active == true) {
        $("body").removeClass("sidebar-mini");
        md.misc.sidebar_mini_active = false;
        $(".sidebar .sidebar-wrapper, .main-panel").perfectScrollbar();
      } else {
        $(".sidebar .sidebar-wrapper, .main-panel").perfectScrollbar("destroy");
        setTimeout(function () {
          $("body").addClass("sidebar-mini");
          md.misc.sidebar_mini_active = true;
        }, 300);
      }
      // we simulate the window Resize so the charts will get updated in realtime.

      // we stop the simulation of Window Resize after the animations are completed

    });
  });

});

$(document).on("click", ".navbar-toggler", function () {
  $toggle = $(this);

  if (mobile_menu_visible == 1) {
    $("html").removeClass("nav-open");

    $(".close-layer").remove();
    setTimeout(function () {
      $toggle.removeClass("toggled");
    }, 400);

    mobile_menu_visible = 0;
  } else {
    setTimeout(function () {
      $toggle.addClass("toggled");
    }, 430);

    var $layer = $("<div class=\"close-layer\"></div>");

    if ($("body").find(".main-panel").length != 0) {
      $layer.appendTo(".main-panel");

    } else if (($("body").hasClass("off-canvas-sidebar"))) {
      $layer.appendTo(".wrapper-full-page");
    }

    setTimeout(function () {
      $layer.addClass("visible");
    }, 100);

    $layer.click(function () {
      $("html").removeClass("nav-open");
      mobile_menu_visible = 0;

      $layer.removeClass("visible");

      setTimeout(function () {
        $layer.remove();
        $toggle.removeClass("toggled");

      }, 400);
    });

    $("html").addClass("nav-open");
    mobile_menu_visible = 1;

  }

});

// activate collapse right menu when the windows is resized
$(window).resize(function () {
  md.initSidebarsCheck();
});

md = {
  misc: {
    navbar_menu_visible: 0,
    active_collapse: true,
    disabled_collapse_init: 0,
  },

  checkSidebarImage: function () {
    var $sidebar = $(".sidebar");
    var image_src = $sidebar.data("image");

    if (image_src !== undefined) {
      var sidebar_container = "<div class=\"sidebar-background\" style=\"background-image: url(" + image_src + ") \"/>";
      $sidebar.append(sidebar_container);
    }
  },

  showNotification: function (from, align, icon, type, message) {

    var color = Math.floor((Math.random() * 6) + 1);

    $.notify({
      icon: icon,
      message: message

    }, {
        type: type,
        timer: 1500,
        placement: {
          from: from,
          align: align
        }
      });
  },

  initFormExtendedDatetimepickers: function () {
    $(".datetimepicker").datetimepicker({
      icons: {
        time: "fa fa-clock-o",
        date: "fa fa-calendar",
        up: "fa fa-chevron-up",
        down: "fa fa-chevron-down",
        previous: "fa fa-chevron-left",
        next: "fa fa-chevron-right",
        today: "fa fa-screenshot",
        clear: "fa fa-trash",
        close: "fa fa-remove"
      }
    });

    $(".datepicker").datetimepicker({
      format: "MM/DD/YYYY",
      icons: {
        time: "fa fa-clock-o",
        date: "fa fa-calendar",
        up: "fa fa-chevron-up",
        down: "fa fa-chevron-down",
        previous: "fa fa-chevron-left",
        next: "fa fa-chevron-right",
        today: "fa fa-screenshot",
        clear: "fa fa-trash",
        close: "fa fa-remove"
      }
    });

    $(".timepicker").datetimepicker({
      //          format: 'H:mm',    // use this format if you want the 24hours timepicker
      format: "h:mm A", //use this format if you want the 12hours timpiecker with AM/PM toggle
      icons: {
        time: "fa fa-clock-o",
        date: "fa fa-calendar",
        up: "fa fa-chevron-up",
        down: "fa fa-chevron-down",
        previous: "fa fa-chevron-left",
        next: "fa fa-chevron-right",
        today: "fa fa-screenshot",
        clear: "fa fa-trash",
        close: "fa fa-remove"

      }
    });
  },


  initSliders: function () {
    // Sliders for demo purpose
    var slider = document.getElementById("sliderRegular");

    noUiSlider.create(slider, {
      start: 40,
      connect: [true, false],
      range: {
        min: 0,
        max: 100
      }
    });

    var slider2 = document.getElementById("sliderDouble");

    noUiSlider.create(slider2, {
      start: [20, 60],
      connect: true,
      range: {
        min: 0,
        max: 100
      }
    });
  },

  initSidebarsCheck: function () {
    if ($(window).width() <= 991) {
      if ($sidebar.length != 0) {
        md.initRightMenu();
      }
    }
  },

  checkFullPageBackgroundImage: function () {
    var $page = $(".full-page");
    var image_src = $page.data("image");

    if (image_src !== undefined) {
      var image_container = "<div class=\"full-page-background\" style=\"background-image: url(" + image_src + ") \"/>";
      $page.append(image_container);
    }
  },

  initMinimizeSidebar: function () {

    $("#minimizeSidebar").click(function () {
      var $btn = $(this);

      if (md.misc.sidebar_mini_active == true) {
        $("body").removeClass("sidebar-mini");
        md.misc.sidebar_mini_active = false;
      } else {
        $("body").addClass("sidebar-mini");
        md.misc.sidebar_mini_active = true;
      }
    });
  },

  checkScrollForTransparentNavbar: debounce(function () {
    if ($(document).scrollTop() > 260) {
      if (transparent) {
        transparent = false;
        $(".navbar-color-on-scroll").removeClass("navbar-transparent");
      }
    } else {
      if (!transparent) {
        transparent = true;
        $(".navbar-color-on-scroll").addClass("navbar-transparent");
      }
    }
  }, 17),


  initRightMenu: debounce(function () {
    var $sidebar_wrapper = $(".sidebar-wrapper");

    if (!mobile_menu_initialized) {
      var $navbar = $("nav").find(".navbar-collapse").children(".navbar-nav");

      var mobile_menu_content = "";

      var nav_content = $navbar.html();

      var nav_content = "<ul class=\"nav navbar-nav nav-mobile-menu\">" + nav_content + "</ul>";

      var navbar_form = $("nav").find(".navbar-form").get(0).outerHTML;

      var $sidebar_nav = $sidebar_wrapper.find(" > .nav");

      // insert the navbar form before the sidebar list
      $nav_content = $(nav_content);
      $navbar_form = $(navbar_form);
      $nav_content.insertBefore($sidebar_nav);
      $navbar_form.insertBefore($nav_content);

      $(".sidebar-wrapper .dropdown .dropdown-menu > li > a").click(function (event) {
        event.stopPropagation();

      });

      mobile_menu_initialized = true;
    } else {
      if ($(window).width() > 991) {
        // reset all the additions that we made for the sidebar wrapper only if the screen is bigger than 991px
        $sidebar_wrapper.find(".navbar-form").remove();
        $sidebar_wrapper.find(".nav-mobile-menu").remove();

        mobile_menu_initialized = false;
      }
    }
  }, 200),

};
