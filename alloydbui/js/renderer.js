var electron = require("electron");
var { ipcRenderer, shell } = electron;
require("angular");
var app = angular.module("alloydb", []);

if (module.hot) { module.hot.accept(); }

app.run(function ($rootScope) {
  "ngInject";

  $rootScope.currentSelectedPath = "";
  $rootScope.currentSelectedPathDisplayName = "";
  $rootScope.logLevels = {
    "type": "select", 
    "name": "Log Levels",
    "value": "info", 
    "values": ["all", "info", "debug", "error"]
  };

  $(document).on("contextmenu", function (event) {
    event.preventDefault();
  });

  $(document).on("keydown", function (e) {
    if (e.which === 123) {
      ipcRenderer.send("open-dev");
    } else if (e.which === 116) {
      location.reload();
    }
  });

  $rootScope.update = function () {
    if ($rootScope.$root.$$phase !== "$apply" && $rootScope.$root.$$phase !== "$digest") {
      $rootScope.$apply();
    }
  };

  $rootScope.formatTime = function (time) {

    if (time) {
      var t = moment(time).format("YYYY-MM-DD hh:mm:ss");
      return t;
    }
    return "";
  };

  $rootScope.backupDatabase = function () {
    ipcRenderer.send("task-database-backup");
  };

  $rootScope.rescanLibrary = function () {
    ipcRenderer.send("mediascanner-scan-start");
  };

  $rootScope.addMediaPath = function () {
    $rootScope.currentSelectedPathDisplayName = "";
    $rootScope.currentSelectedPath = "";
  };

  $rootScope.addCurrentPath = function () {
    ipcRenderer.send("config-add-media-path", { display_name: $rootScope.currentSelectedPathDisplayName, path: $rootScope.currentSelectedPath });
    $rootScope.currentSelectedPathDisplayName = "";
    $rootScope.currentSelectedPath = "";
  };

  $rootScope.removeMediaPath = function (mediaPath) {
    ipcRenderer.send("config-remove-media-path", { display_name: mediaPath.display_name, path: mediaPath.path });
  };

  $rootScope.runTask = function (task) {
    ipcRenderer.send("scheduler-run-task", task);
  };

  $rootScope.cancelScan = function () {
    ipcRenderer.send("mediascanner-scan-cancel");
  };

  $rootScope.cleanupLibrary = function () {
    ipcRenderer.send("mediascanner-cleaup-start");
  };

  $rootScope.incCleanupLibrary = function () {
    ipcRenderer.send("mediascanner-inc-cleaup-start");
  };

  $rootScope.checkLogEntry = function (entry) {
    if (entry.level === "error") { return "error-row"; }
  };

  $rootScope.mediaScannerRestart = function () {
    ipcRenderer.send("mediascanner-restart");
  };

  $rootScope.enableApiServer = function () {
    ipcRenderer.send("task-alloydb-toggle-api", { enabled: true });
  };

  $rootScope.disableApiServer = function () {
    ipcRenderer.send("task-alloydb-toggle-api", { enabled: false });
  };

  $rootScope.enableUiServer = function () {
    ipcRenderer.send("task-alloydb-toggle-ui", { enabled: true });
  };

  $rootScope.disableUiServer = function () {
    ipcRenderer.send("task-alloydb-toggle-ui", { enabled: false });
  };

  $rootScope.launchWebUI = function (url) {
    shell.openExternal(url);
  };

  $rootScope.launchWebUIDesktop = function () {
    ipcRenderer.send("request-web-ui", { enabled: false });
  };

  $rootScope.filterLogEntry = function () {
    return function (item) {
      if ($rootScope.logLevels.value === "all") { return true; }
      return item.level === $rootScope.logLevels.value.toLowerCase();
    };
  };

  ipcRenderer.on("system-stats", (args, e) => {
    $rootScope.library_stats = e;
    $rootScope.update();
  });

  ipcRenderer.on("config-media-paths", (args, e) => {
    $rootScope.media_paths = e;
    $rootScope.update();
  });

  ipcRenderer.on("mediascanner-status", (args, e) => {
    $rootScope.scan_status = e;
    $rootScope.update();
  });

  ipcRenderer.on("scheduler-current-schedule", (args, e) => {
    $rootScope.schedule = e;
    $rootScope.update();
  });

  ipcRenderer.on("logger-logs", (args, e) => {
    if (e) {
      $rootScope.logs = e;
      $rootScope.update();
    }
  });

  ipcRenderer.on("app-loaded", (args, e) => {
    ipcRenderer.send("scheduler-get-schedule");
    ipcRenderer.send("config-get-media-paths");
    ipcRenderer.send("system-get-stats");
    ipcRenderer.send("logger-get-logs");
    ipcRenderer.send("app-loaded-result", "success");
    $rootScope.loaded = "true";
  });

  ipcRenderer.on("test-quit", (args, e) => {
    ipcRenderer.send("app-quit");
  });

  ipcRenderer.send("update-data");
  $("#loader-wrapper").fadeOut();
});
