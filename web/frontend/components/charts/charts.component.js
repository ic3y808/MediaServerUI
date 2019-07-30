import Highcharts from "highcharts";
import "./charts.scss";
var CLR_SCARLET = "#B90000";
var CLR_TANGERINE = "#E63900";
var CLR_FIRE = "#FF6600";
var CLR_CARROT = "#FF9900";
var CLR_SUNFLOWER = "#FFC900";
var CLR_PISTACHIO = "#8FBF00";
var CLR_FERN = "#009966";
var CLR_TURQUOISE = "#00AFBF";
var CLR_AZURE = "#0066FF";
var CLR_INDIGO = "#3636D9";
var CLR_VIOLET = "#9900FF";
var CLR_MAGENTA = "#CC0099";

// Shuffled for contrast
var COLOURS = [
  CLR_TANGERINE,
  CLR_SUNFLOWER,
  CLR_FERN,
  CLR_AZURE,
  CLR_VIOLET,
  CLR_SCARLET,
  CLR_CARROT,
  CLR_PISTACHIO,
  CLR_TURQUOISE,
  CLR_INDIGO,
  CLR_MAGENTA,
  CLR_FIRE,
];

class Tooltip {
  start() {
    this.$el = $("<div />")
      .addClass("user-dashboard-tooltip")
      .appendTo(document.body);
    this.hide();
  }

  stop() {
    this.$el.remove();
  }

  show(x, y, text) {
    this.$el.text(text);
    this.move(x, y);
    this.$el.show();
  }

  move(x, y) {
    this.$el.css({
      "left": x + 10,
      "top": y + 10
    });
  }

  hide() {
    this.$el.hide();
  }
}

class PointTooltips {
  constructor(app, points, tooltip) {
    this.app = app;
    this.tooltip = tooltip;
    this.points = points;
    this.start();
  }

  start() {
    this.points.forEach(this.bindTooltipToPoint.bind(this));
    this.points.forEach(this.addLink.bind(this));
  }

  stop() {
    this.points.forEach(this.unbindTooltip.bind(this));
  }

  bindTooltipToPoint(point) {
    point.$el.mouseover(function (evt) {
      this.tooltip.show(evt.clientX, evt.clientY, point.point.tooltip);
    }.bind(this));

    point.$el.mousemove(function (evt) {
      this.tooltip.move(evt.clientX, evt.clientY);
    }.bind(this));

    point.$el.mouseout(function () {
      this.tooltip.hide();
    }.bind(this));
  }

  addLink(point) {
    if (point.point.link) {
      svgUtils.addLink(point.$el, point.point.link);
    }
  }

  unbindTooltip(point) {
    point.$el.off();
  }
}

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

    this.$scope.refresh = () => {
      this.AlloyDbService.refreshCharts();
    };
    this.$rootScope.$watch("charts", (o, n) => {
      if (this.$rootScope.charts && this.$rootScope.charts.tags) {
        this.tooltip = new Tooltip();
        this.tooltip.start();
        var $container = $(".js-tube-tags-target");
        this.chart = this.drawChart($container, this.$rootScope.charts.tags);
      }
    });
  }


  addMarkers(series) {
    series.forEach(function (tag) {
      $.extend(tag.data[0], {
        enabled: true,
        dataLabels: {
          enabled: true,
          verticalAlign: "bottom",
          y: -5,
          overflow: true,
          crop: false,
          formatter: function () {
            var maxLength = this.labelMaxLength();
            var name = tag.name;
            if (name.length > maxLength) {
              name = name.slice(0, maxLength - 1) + "…";
            }
            return name;
          }.bind(this)
        },
        marker: {
          enabled: true
        }
      });
    }.bind(this));
  }

  formatSeries(entries) {
    var uniqueTags = _.uniq(_.reject(_.flatten(entries, "tags"), _.isEmpty));

    // Create a series for each tag, with it"s ranking for each entry as
    // y and x respectively

    var series = uniqueTags.map(function (tag) {
      return {
        name: tag,
        data: []
      };
    });

    entries.forEach(function (entry, entryIndex) {
      if (!entry.tags.length) {
        return;
      }
      series.forEach(function (tag) {
        var ranking = entry.tags.indexOf(tag.name);
        ranking = ranking === -1 ? entry.tags.length : ranking;
        var invertedRanking = entry.tags.length - ranking;
        if (!invertedRanking) {
          tag.data.push({
            x: entryIndex,
            y: 0,
            nodata: true
          });
          return;
        }
        tag.data.push({
          x: entryIndex,
          y: invertedRanking
        });
      });
    });


    // Trim ends

    var trim = function (data) {
      var started = false;
      return data.filter(function (datum) {
        started = started || !datum.nodata;
        return started;
      });
    };

    series.forEach(function (tag) {
      tag.data.reverse();
      tag.data = trim(tag.data);
      tag.data.reverse();
      tag.data = trim(tag.data);
    });


    // Create a flat line for each tag for each entry

    series.forEach(function (tag) {
      var newdata = [];
      tag.data.forEach(function (point) {
        newdata.push(
          _.extend({}, point, { x: point.x - 0.25 }),
          _.extend({}, point, { x: point.x + 0.25 })
        );
      });
      tag.data = newdata;
    });


    // Use a dashed line when there are no listens of a tag in a given entry

    series.forEach(function (tag) {

      var zones = tag.data.map((point, index) => {
        var nextPoint = index < tag.data.length - 1 && tag.data[index + 1];

        if (nextPoint && nextPoint.nodata !== point.nodata) {
          var boundryPoint = point.nodata ? nextPoint : point;
          return {
            value: boundryPoint.x,
            opacity: boundryPoint !== point ? 0.3 : 1
          };
        }
      });

      zones = _.flatten(zones);
      zones = _.reject(zones, _.isUndefined);

      if (!zones.length) {
        return;
      }

      tag.zoneAxis = "x";

      zones.push({
        opacity: 1,
        value: 999999
      });

      tag.zones = zones;
    });


    // Remove artifacts

    series.forEach(function (tag) {
      tag.data.forEach(function (point) {
        if (point.nodata) {
          delete point.nodata;
        }
      });
    });

    return series;
  }

  addColours(series) {
    series.forEach(function (tag) {
      var characters = tag.name.split("");
      var code = characters.reduce(function (sum, character) {
        return sum + character.charCodeAt(0);
      }, 0);
      tag.color = COLOURS[code % COLOURS.length];
    });
  }

  labelMaxLength() {
    var breakpoint = "lg";//mediaSize.getMediaSize();
    if (breakpoint === "xs") {
      return 12;
    }
    if (breakpoint === "lg") {
      return 11;
    }
    return 10;
  }

  applyZoneStyling(tag) {
    // Manually apply opacity as highcharts doesn"t support it
    // unless we switch to "styled mode"
    tag.zones.forEach(function (zoneSpec, i) {
      if (zoneSpec.hasOwnProperty("opacity")) {
        var el = tag["zone-graph-" + i].element;
        el.setAttribute("opacity", zoneSpec.opacity);
      }
    });
  }

  addTooltips(series) {
    var points = series.map(function (tag) {
      tag.options.tooltip = tag.name;
      var elements = [
        tag.group.element,
        tag.markerGroup.element,
        tag.dataLabelsGroup.element
      ];
      return {
        "$el": $(elements),
        "point": tag.options
      };
    });
    this.tooltips = new PointTooltips(this.app, points, this.tooltip);
  }

  shareDimensions() {
    var dimensions = parent.shareDimensions.call(this);
    var width = this.$el.find(".user-dashboard-tube-tags-scroll").innerWidth();
    width += 30; // Padding between the scrollable bit and the module container
    dimensions.width = Math.max(dimensions.width, width);
    dimensions.mediaWidth = Math.max(dimensions.mediaWidth, width);
    return dimensions;
  }

  drawChart($container, entries) {

    var series = this.formatSeries(entries);
    this.addMarkers(series);
    this.addColours(series);

    var categories = _.pluck(entries, "date");

    var vPadding = 1 / 4;

    var chart = new Highcharts.Chart({
      chart: {
        renderTo: $container.get(0),
        type: "spline"
      },
      title: false,
      legend: {
        enabled: true
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        series: {
          allowPointSelect: true,
          marker: {
            enabled: true,
            symbol: "circle",
            radius: 3
          },
          lineWidth: 3,
          linecap: "square",
          states: {
            hover: {
              enabled: false
            }
          }
        }
      },
      tooltip: {
        enabled: false,
        snap: 8
      },
      yAxis: {
        visible: true,
        tickInterval: vPadding,
        min: -0.1,
        gridLineWidth: 0,
        title: {
          text: null
        },
        labels: {
          formatter: function () {
            return (this.value > 0 && Number.isInteger(this.value)) ? "<div class=\"user-dashboard-tube-tags-position\" align=\"center\" >" + (6 - this.value) + "</div>" : "";
          },
          useHTML: true
        },

      },
      xAxis: {
        categories: categories,
        lineColor: "transparent",
        tickColor: "transparent",
        min: 0,
        max: entries.length - 1
      },
      series: series
    });
 
    chart.series.forEach(this.applyZoneStyling.bind(this));
    this.addTooltips(chart.series);
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
