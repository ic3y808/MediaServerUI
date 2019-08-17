var mediaPathPicker = require("./media-path-picker");
var libraryStats = require("./library-stats");
var logViewer = require("./log-viewer");
var scanStatus = require("./scan-status");
var scheduleViewer = require("./schedule-viewer");
module.exports = angular
  .module("app.directives", [])
  .directive("mediaPathPicker", mediaPathPicker)
  .directive("libraryStats", libraryStats)
  .directive("logViewer", logViewer)
  .directive("scanStatus", scanStatus)
  .directive("scheduleViewer", scheduleViewer)
  ;