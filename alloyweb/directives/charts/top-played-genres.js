import * as d3 from "d3";
import * as _ from "lodash";

export default function ($rootScope, $window, AppUtilities) {
  "ngInject";
  return {
    restrict: "E",
    scope: {
      data: "="
    },
    //templateUrl: "/template/top-played-genres.jade",
    link: function (scope, element, attrs, ngModel) {
      var redraw = function () {
        scope.width = element[0].parentElement.clientWidth;
        if ($rootScope.charts && $rootScope.charts.genres) {
          var margin = { top: 20, right: 20, bottom: 70, left: 40 },
            width = scope.width - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

            var data = _.take($rootScope.charts.genres.sort((a, b) => { return b.play_count - a.play_count; }), 10);
          var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.05);

          var y = d3.scale.linear().range([height, 0]);

          var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");


          var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");
            

          $(element[0]).html("");
          var svg = d3.select(element[0]).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");


          x.domain(data.map(function (d) { return d.genre; }));
          y.domain([0, d3.max(data, function (d) { return d.play_count; })]);

          svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-1em")
            .attr("transform", "rotate(-45)");

          svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
            

          svg.selectAll("bar")
            .data(data)
            .enter().append("rect")
            .style("fill", "steelblue")
            .attr("x", function (d) { return x(d.genre); })
            .attr("width", x.rangeBand())
            .attr("y", function (d) { return y(d.play_count); })
            .attr("height", function (d) { return height - y(d.play_count); });


          AppUtilities.apply();
        }
      };

      scope.$watch("data", function (newVal, oldVal) {
        redraw();
      });

      angular.element($window).bind("resize", function () {
        redraw();
      });
    }
  };
}