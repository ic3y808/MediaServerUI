import "./config.scss";
class ConfigController {
  constructor($scope, $rootScope, $compile, $routeParams, $location, $element, Logger, AppUtilities, Backend, MediaPlayer) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$compile = $compile;
    this.$routeParams = $routeParams;
    this.$location = $location;
    this.$element = $element;
    this.Logger = Logger;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.Logger.debug("config-controller");
    this.AppUtilities.showLoader();


    this.$scope.jumpTo = (to) => {
      this.$location.path("/config/" + to);
    };

    this.$scope.navigate = (to) => {
      $("#config-content").append(this.$compile("<config" + to + "/>")(this.$scope));
      this.AppUtilities.apply();
    };

    this.$scope.toggleAdvanced = () =>  {
     $rootScope.settings.advanced_mode = !$rootScope.settings.advanced_mode;
      this.AppUtilities.apply();
    };

    this.$rootScope.triggerConfigAlert = (message, type) =>  {
      //$(".PageContentBody-contentBody").append("<div class="alert alert-" + type + " config-alert notification" role="alert">" + message + "</div>");
      setTimeout(() => {
        // $(".config-alert").hide(500);
        $("#saveSettingsButton").popover("hide");
      }, 3000);

      // $("#saveSettingsButton").popover("show");
    };


    var t = "<div class=\"popover\" role=\"tooltip\">" +
      "<div class=\"arrow\">" +
      "</div>" +
      "<h3 class=\"popover-header\"></h3>" +
      "<div class=\"popover-body\"></div>" +
      "</div>";


    $("body").popover({
      html: true,
      selector: "[rel=save-settings-popover]",
      trigger: "click",
      template: t,
      content: "Success!",
      //container: ".PageContentBody-contentBody",
      placement: "bottom",
    });
    //.on("shown.bs.popover", () =>  {
    //  var $pop = $(this);
    //  setTimeout(() =>  {
    //      $pop.popover("hide");
    //  }, 2000);
    //});;


    AppUtilities.apply();
    AppUtilities.hideLoader();
  }

  $onInit() {
    if (this.$routeParams.id) {
      this.Logger.debug("navigating to " + this.$routeParams.id);
      this.$scope.navigate(this.$routeParams.id);
 
      this.$element.addClass("vbox");
      this.$element.addClass("scrollable");
    }
  }
}

export default {
  bindings: {},
  controller: ConfigController,
  templateUrl: "/template/config.jade"
};