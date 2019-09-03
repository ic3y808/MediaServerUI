import * as _ from "lodash";

class ChartsController {
  constructor($scope, $rootScope, $element, Cache, Logger, AppUtilities, Backend, MediaPlayer, AlloyDbService) {
    "ngInject";
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$element = $element;
    this.Cache = Cache;
    this.Logger = Logger;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.MediaPlayer = MediaPlayer;
    this.AlloyDbService = AlloyDbService;
    this.Logger.debug("charts-controller");
    this.$scope.smaPeriod = 12;
    this.$scope.refresh = () => {
      this.AlloyDbService.refreshCharts();
    };

    $rootScope.$watch("charts", (newVal, oldVal) => {
      this.redraw();
    });

    $rootScope.$on("loginStatusChange", (event, data) => {
      this.Logger.debug("Charts reload on loginsatuschange");
      $scope.refresh();
    });


    this.$scope.decreaseSmaPeriod = () => {
      this.$scope.smaPeriod--;
      if (this.$scope.smaPeriod < 0) { this.$scope.smaPeriod = 0; }
      this.redraw();
    };

    this.$scope.increaseSmaPeriod =  () =>  {
      this.$scope.smaPeriod++;
      this.redraw();
    };
    
  }

  redraw() {
    if (!this.$rootScope.charts || !this.$rootScope.charts.genres) { return; }
    var data = _.take(this.$rootScope.charts.genres.sort((a, b) => { return b.play_count - a.play_count; }), 30);
    this.$scope.labels = _.map(data, "genre");
    this.$scope.series = ["Genres"];
    this.$scope.data = _.map(data, "play_count");


    this.$scope.colors = ["#45b7cd", "#ff6384", "#ff8e72"];

    this.$scope.top_tag_labels = _.map(this.$rootScope.charts.tags, "date");
    this.$scope.top_tag_series = ["Plays"];


    this.$scope.plays_by_hour = _.values(this.$rootScope.charts.plays_by_hour[this.$rootScope.charts.plays_by_hour.length - 1].hours);
    this.$scope.plays_by_hour_labels = Object.keys(this.$rootScope.charts.plays_by_hour[this.$rootScope.charts.plays_by_hour.length - 1].hours);
   

    function sma(array, key, period) {
      for (var i = 0; i < array.length; i++) {
        if (i === 0) { array[0].average = array[0][key]; }
        else {
          var last = array[i - 1].average * Math.min(i, period);
          array[i].average = (last + array[i][key]) / (Math.min(i, period) + 1);
        }
        console.log(i + " " + array[i][key]);
      }
    }

    sma(this.$rootScope.charts.tags, "plays", this.$scope.smaPeriod);


    this.$scope.plays_over_time_data = [_.map(this.$rootScope.charts.tags, "plays"), _.map(this.$rootScope.charts.tags, "average")];
    this.$scope.plays_over_time_labels = _.map(this.$rootScope.charts.tags, "date");
    this.$scope.datasetOverride = [
      {
        label: "Bar chart",
        borderWidth: 1,
        type: "bar"
      },
      {
        label: "Line chart",
        borderWidth: 3,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        type: "line"
      }
    ];
  }

  $onInit() {
    this.$element.addClass("vbox");
    this.$element.addClass("scrollable");

  }
}


//
export default {
  bindings: {},
  controller: ChartsController,
  templateUrl: "/template/charts.jade"
};

//
