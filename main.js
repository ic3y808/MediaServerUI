const fs = require("fs");
const path = require("path");
const moment = require("moment");
const shell = require("shelljs");
var electron = require("electron");
var { app, net, BrowserWindow, ipcMain, Menu, Tray } = electron;
var settings = require(path.join(__dirname, "config"));
var logger = require("./common/logger");
var utils = require("./common/utils");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
const express = require("express");
const appServer = express();
var server = require("http").Server(appServer);
var io = require("socket.io")(server);
var sockets = require("./alloydbweb/routes/sockets");
var sr = require("screenres");
const url = require("url");

let mainWindow = null;
let serverWindow = null;
let mediaScannerWindow = null;
let schedulerWindow = null;
let webUIWindow = null;
let splashWindow = null;
var tray = null;
var running = false;
var timer = {};
var db = {};

function isDev() { return process.env.MODE === "dev"; }
function isApiEnabled() { return process.env.API_ENABLED === "true"; }
function isUiEnabled() { return process.env.UI_ENABLED === "true"; }
function isPacked() { return process.mainModule.filename.indexOf("app.asar") > -1; }

function flatten(lists) {
  return lists.reduce((a, b) => a.concat(b), []);
}

function getDirectories(srcpath) {
  return fs
    .readdirSync(srcpath)
    .map((file) => path.join(srcpath, file))
    .filter((path) => fs.statSync(path).isDirectory());
}

function getDirectoriesRecursive(srcpath) {
  return [
    srcpath,
    ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))
  ];
}

function onClose(e) {
  e.preventDefault();
  mainWindow.hide();
}

function doCheckpoint() {
  if (!running) { return; }
  logger.info("alloydb", "Starting checkpoint");
  db.checkpoint();
  logger.info("alloydb", "Checkpoint Complete");
}

function doBackup() {
  if (!running) { return; }
  logger.info("alloydb", "Starting backup");
  if (!fs.existsSync(process.env.BACKUP_DATA_DIR)) { shell.mkdir("-p", process.env.BACKUP_DATA_DIR); }
  db.backup(path.join(process.env.BACKUP_DATA_DIR, `backup-${Date.now()}.db`));
  logger.info("alloydb", "Backup Complete");
}

function doCleanup() {
  if (!running) { return; }
  logger.info("alloydb", "Starting Cleanup");
  mediaScannerWindow.webContents.send("mediascanner-cleaup-start");
}

function doIncCleanup() {
  if (!running) { return; }
  logger.info("alloydb", "Starting Incremental Cleanup");
  mediaScannerWindow.webContents.send("mediascanner-inc-cleaup-start");
}

function doRescan() {
  if (!running) { return; }
  logger.info("alloydb", "Starting Rescan");
  mediaScannerWindow.webContents.send("mediascanner-scan-start");
}

function doToggleApiServer(e, data) {
  if (!running) { return; }
  logger.info("alloydb", "Changing API server settings to " + JSON.stringify(data));
  if (data.enabled === true) { settings.config.api_enabled = "true"; }
  else { settings.config.api_enabled = "false"; }
  settings.saveConfig();
}

function doToggleUiServer(e, data) {
  if (!running) { return; }
  logger.info("alloydb", "Changing UI server settings to " + JSON.stringify(data));
  if (data.enabled === true) { settings.config.ui_enabled = "true"; }
  else { settings.config.ui_enabled = "false"; }
  settings.saveConfig();
}

function queryLog() {
  logger.query((results) => {
    if (mainWindow) { mainWindow.webContents.send("logger-logs", results); }
  });
}

function createWindow(width, height, min_width, min_height, title, show, page, close) {
  const win = new BrowserWindow({
    width: width, height: height, min_width: min_width, min_height: min_height,
    webPreferences: { nodeIntegration: true }, show: isDev()
  });
  win.icon = path.join(__dirname, "common", "icon.ico");
  win.setMenu(null);
  win.setMinimumSize(min_width, min_height);
  if (isDev() === true) {
    win.webContents.openDevTools({ detach: false });
  }
  win.loadURL("http://localhost:" + process.env.API_UI_PORT + "/template/" + page);
  win.setTitle(title);
  win.on("close", close);
  return win;
}

function createServerWindow() {
  return new Promise((resolve, reject) => {
    if (!isApiEnabled()) { resolve(); }
    else {
      serverWindow = createWindow(1280, 610, 1024, 300, "Server", false, "server.jade", () => { });
      serverWindow.webContents.once("dom-ready", () => {
        serverWindow.webContents.send("server-start", process.env);
        resolve();
      });
    }
  });
}

function createSchedulerWindow() {
  return new Promise((resolve, reject) => {
    if (!isApiEnabled()) { resolve(); }
    else {
      schedulerWindow = createWindow(1280, 610, 1024, 300, "Scheduler", false, "scheduler.jade", () => { });
      schedulerWindow.webContents.once("dom-ready", () => {
        schedulerWindow.webContents.send("scheduler-start", process.env);
        resolve();
      });
    }
  });
}

function createMediaScannerWindow() {
  return new Promise((resolve, reject) => {
    if (!isApiEnabled()) { resolve(); }
    else {
      mediaScannerWindow = createWindow(1280, 610, 1024, 300, "MediaScanner", false, "mediascanner.jade", () => { });
      mediaScannerWindow.webContents.once("dom-ready", () => {
        mediaScannerWindow.webContents.send("mediascanner-start", process.env);
        resolve();
      });
    }
  });
}

function createWebUIWindow() {
  return new Promise((resolve, reject) => {
    if (!isUiEnabled()) { resolve(); }
    else {
      if (webUIWindow !== null) {
        webUIWindow.show();
      }
      else {
        var res = sr.get();
        webUIWindow = new BrowserWindow({ width: res[0] * 0.8, height: res[1] * 0.8, webPreferences: { nodeIntegration: true } });
        webUIWindow.icon = path.join(__dirname, "common", "icon.ico");
        webUIWindow.setMenu(null);
        //webUIWindow.setMinimumSize(min_width, min_height);
        if (isDev() === true) {
          webUIWindow.webContents.openDevTools({ detach: false });
        }
        webUIWindow.loadURL("http://localhost:" + process.env.API_UI_PORT);
        webUIWindow.setTitle("Alloy");
        webUIWindow.on("close", (e) => {
          e.preventDefault();
          webUIWindow.hide();
        });

        webUIWindow.webContents.once("dom-ready", () => {
          webUIWindow.webContents.send("webui-start", process.env);
          resolve();
        });
      }
    }
  });
}

function createSplashScreen() {
  return new Promise((resolve, reject) => {
    var res = sr.get();
    splashWindow = new BrowserWindow({ width: res[0] * 0.1, height: res[1] * 0.4, webPreferences: { nodeIntegration: true }, frame: false });
    splashWindow.icon = path.join(__dirname, "common", "icon.ico");
    splashWindow.setMenu(null);
    //webUIWindow.setMinimumSize(min_width, min_height);
    if (isDev() === true) {
      splashWindow.webContents.openDevTools({ detach: false });
    }
    splashWindow.loadURL(url.format({
      pathname: path.join(__dirname, "alloydbui", "html", "splash.html"),
      protocol: "file:",
      slashes: true
    }));
    //webUIWindow.loadURL("http://localhost:" + process.env.API_UI_PORT);
    splashWindow.setTitle("Alloy");


    splashWindow.webContents.once("dom-ready", () => {
      splashWindow.webContents.send("webui-start", process.env);
      resolve();
    });
  });
}

function createMainWindow() {
  return new Promise((resolve, reject) => {
    var res = sr.get();
    mainWindow = createWindow(res[0] * 0.6, res[1] * 0.7, 1024, 300, "Alloy", false, "alloydb.jade", onClose);
    mainWindow.webContents.once("dom-ready", () => { resolve(); });
  });
}

function createTrayMenu() {
  var icon = path.join(__dirname, "common", "icon.ico");
  var t = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show Web UI",
      click: createWebUIWindow
    },
    {
      label: "Rescan",
      click: doRescan
    },
    {
      label: "Cleanup",
      click: doCleanup
    },
    {
      label: "Inc. Cleanup",
      click: doIncCleanup
    },
    {
      label: "Backup",
      click: doBackup
    },
    {
      label: "Exit",
      click: function () {
        app.exit(0);
      }
    }
  ]);
  t.setToolTip("Alloy");
  t.setContextMenu(contextMenu);

  t.on("click", () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
  mainWindow.on("show", () => {
    t.setHighlightMode("always");
  });
  mainWindow.on("hide", () => {
    t.setHighlightMode("never");
  });
  return t;
}

function createTasks() {
  logger.debug("alloydb", "creating tasks");
  if (isApiEnabled()) {
    schedulerWindow.webContents.send("scheduler-create-jobs", [
      { name: "DB Checkpoint", time: "0 */6 * * *", callback: "task-database-checkpoint" },
      { name: "DB Backup", time: "0 0 * * *", callback: "task-database-backup" },
      { name: "Clean Database", time: "0 0 * * *", callback: "task-database-cleanup" },
      { name: "Incremental Clean", time: "0 0 * * *", callback: "task-database-inc-cleanup" },
      { name: "Rescan Library", time: "0 0 * * 0", callback: "task-database-scan" }
    ]);
  }
}

function showWebUI(e, data) {
  if (!running) { return; }
  logger.info("alloydb", "requesting webUI window");
  createWebUIWindow();
}

function setupRoutes() {
  if (mainWindow) {
    ipcMain.on("download-progress", (event, payload) => mainWindow.webContents.send("download-progress", payload));
    ipcMain.on("download-error", (event, payload) => mainWindow.webContents.send("download-error", payload));
    ipcMain.on("download-complete", (event, payload) => mainWindow.webContents.send("download-complete", payload));
    ipcMain.on("url-info-result", (event, payload) => mainWindow.webContents.send("url-info-result", payload));
    ipcMain.on("search-result", (event, payload) => mainWindow.webContents.send("search-result", payload));
    ipcMain.on("print", (event, payload) => mainWindow.webContents.send("print", payload));
  }

  //server ICP
  if (serverWindow) {
    ipcMain.on("server-start", (event, payload) => serverWindow.webContents.send("server-start", payload));
    ipcMain.on("config-get-media-paths", (event, payload) => serverWindow.webContents.send("config-get-media-paths", payload));
    ipcMain.on("config-media-paths", (event, payload) => mainWindow.webContents.send("config-media-paths", payload));
    ipcMain.on("config-add-media-path", (event, payload) => serverWindow.webContents.send("config-add-media-path", payload));
    ipcMain.on("config-remove-media-path", (event, payload) => serverWindow.webContents.send("config-remove-media-path", payload));
    ipcMain.on("config-get-file-list", (event, payload) => serverWindow.webContents.send("config-get-file-list", payload));
    ipcMain.on("config-file-list", (event, payload) => mainWindow.webContents.send("config-file-list", payload));
    ipcMain.on("config-get-file-parent", (event, payload) => serverWindow.webContents.send("config-get-file-parent", payload));
    ipcMain.on("config-file-parent", (event, payload) => mainWindow.webContents.send("config-file-parent", payload));
    ipcMain.on("system-get-stats", (event, payload) => serverWindow.webContents.send("system-get-stats", payload));
    ipcMain.on("system-stats", (event, payload) => mainWindow.webContents.send("system-stats", payload));
  }

  //mediaScanner ICP
  if (mediaScannerWindow) {
    ipcMain.on("mediascanner-start", (event, payload) => mediaScannerWindow.webContents.send("mediascanner-start", payload));
    ipcMain.on("mediascanner-scan-start", (event, payload) => mediaScannerWindow.webContents.send("mediascanner-scan-start", payload));
    ipcMain.on("mediascanner-scan-cancel", (event, payload) => mediaScannerWindow.webContents.send("mediascanner-scan-cancel", payload));
    ipcMain.on("mediascanner-cleaup-start", (event, payload) => mediaScannerWindow.webContents.send("mediascanner-cleaup-start", payload));
    ipcMain.on("mediascanner-inc-cleaup-start", (event, payload) => mediaScannerWindow.webContents.send("mediascanner-inc-cleaup-start", payload));
    ipcMain.on("mediascanner-watcher-configure", (event, payload) => mediaScannerWindow.webContents.send("mediascanner-watcher-configure", payload));
    ipcMain.on("mediascanner-status", (event, payload) => mainWindow.webContents.send("mediascanner-status", payload));
  }

  //scheduler ICP
  if (schedulerWindow) {
    ipcMain.on("scheduler-start", (event, payload) => schedulerWindow.webContents.send("scheduler-start", payload));
    ipcMain.on("scheduler-create-job", (event, payload) => schedulerWindow.webContents.send("scheduler-create-job", payload));
    ipcMain.on("scheduler-current-schedule", (event, payload) => mainWindow.webContents.send("scheduler-current-schedule", payload));
    ipcMain.on("scheduler-run-task", (event, payload) => schedulerWindow.webContents.send("scheduler-run-task", payload));
    ipcMain.on("scheduler-job-created", (event, payload) => {
      logger.debug("alloydb", "created job: " + payload.name + " - " + payload.callback);
    });
  }

  //misc ICP
  ipcMain.on("task-database-checkpoint", doCheckpoint);
  ipcMain.on("task-database-backup", doBackup);
  ipcMain.on("task-database-cleanup", doCleanup);
  ipcMain.on("task-database-inc-cleanup", doIncCleanup);
  ipcMain.on("task-database-scan", doRescan);
  ipcMain.on("task-alloydb-toggle-api", doToggleApiServer);
  ipcMain.on("task-alloydb-toggle-ui", doToggleUiServer);
  ipcMain.on("request-web-ui", showWebUI);
  ipcMain.on("web-request", (event, payload) => {
    const request = net.request({ method: payload.method, url: payload.url, });
    let body = "";
    request.on("response", (response) => {
      response.on("data", (chunk) => { body += chunk.toString(); });
      response.on("end", () => { event.returnValue = body; });
    });
    request.end();
  });

  ipcMain.on("log-update", (event) => {
    queryLog();
  });

  ipcMain.on("logger-get-logs", (event) => {
    queryLog();
  });

  ipcMain.on("log", (event, payload) => { logger.log(payload.source, payload.data); });
  ipcMain.on("error", (event, payload) => { logger.error(payload.source, payload.data); });
  ipcMain.on("debug", (event, payload) => { logger.debug(payload.source, payload.data); });
  ipcMain.on("info", (event, payload) => { logger.info(payload.source, payload.data); });

  ipcMain.on("open-dev", (event) => {
    mainWindow.webContents.openDevTools({ detach: false });
    serverWindow.webContents.openDevTools({ detach: true });
    serverWindow.show();
    mediaScannerWindow.webContents.openDevTools({ detach: true });
    mediaScannerWindow.show();
    schedulerWindow.webContents.openDevTools({ detach: true });
    schedulerWindow.show();
  });
}

logger.callback = queryLog;

appServer.use(favicon(path.join(__dirname, "common", "icon.ico")));
appServer.use("/node_modules/", express.static(path.join(__dirname, "node_modules")));
appServer.use("/alloydbui/js/", express.static(path.join(__dirname, "alloydbui", "js")));
appServer.use("/alloydbui/css/", express.static(path.join(__dirname, "alloydbui", "css")));
appServer.use("/alloydbui/img/", express.static(path.join(__dirname, "alloydbui", "img")));

if (isUiEnabled()) {
  appServer.use("/content", express.static(path.join(__dirname, "alloydbweb", "frontend", "content")));
}

appServer.set("view engine", "jade");
if (isUiEnabled()) {
  if (isDev()) {
    logger.info("alloydb", "Running in DEV mode");
    logger.info("alloydb", "compiling webpack");
    const webpack = require("webpack");
    const webpackconfig = require("./alloydbweb/webpack.config");
    const webpackMiddleware = require("webpack-dev-middleware");
    const webpackHotMiddleware = require("webpack-hot-middleware");
    const webpackCompiler = webpack(webpackconfig);
    const wpmw = webpackMiddleware(webpackCompiler, {});
    appServer.use(wpmw);
    const wphmw = webpackHotMiddleware(webpackCompiler);
    appServer.use(wphmw);
  } else {
    appServer.use(express.static(path.join(__dirname, "alloydbweb", "dist")));
  }
}

appServer.use(function (req, res, next) {
  res.io = io;
  next();
});

appServer.use(bodyParser.json());
appServer.use(bodyParser.urlencoded({ extended: false }));

var index = require("./alloydbweb/routes/index");
appServer.use("/", index);

if (isUiEnabled()) {
  io.on("connection", function (socket) {
    sockets.socketConnect(socket, db);
    //sabnzbd.socketConnect(socket);
    //musicbrainz.socketConnect(socket);
    logger.debug("alloyui", "WebUI Client connected");
    socket.on("log", function (data) {
      var obj = {};
      obj.level = data.method;
      obj.label = "clientui";
      obj.message = data.message;
      logger.log(data.method, obj);
    });
  });

  clearInterval(timer);
  timer = setInterval(function () {
    io.emit("ping", { status: "success", server_time: moment().format("hh:mm:ss a") });
  }, 500);
}

var views = [];
var uiViews = getDirectoriesRecursive(path.join(__dirname, "alloydbui", "html"));
views = views.concat(uiViews);
console.log("ui enabled: " + isUiEnabled());
if (isUiEnabled()) {
  var webViews = getDirectoriesRecursive(path.join(__dirname, "alloydbweb", "frontend", "views"));
  var componentdirs = getDirectoriesRecursive(path.join(__dirname, "alloydbweb", "frontend", "components"));
  var directivedirs = getDirectoriesRecursive(path.join(__dirname, "alloydbweb", "frontend", "directives"));
  views = views.concat(webViews, componentdirs, directivedirs);
}
appServer.set("views", views);

if (process.env.MODE === "dev" && isUiEnabled()) {
  process.env.JADE_PORT = utils.normalizePort(process.env.JADE_PORT || "4567");
  var livereload = require("livereload").createServer({ exts: ["jade"], port: process.env.JADE_PORT });
  livereload.watch(path.join(__dirname, "web", "frontend"));
}

logger.info("alloydb", "loading database " + process.env.DATABASE);

app.on("window-all-closed", () => {

});

app.on("ready", () => {
  createSplashScreen().then(() => {
    db = require("better-sqlite3")(process.env.DATABASE);
    db.pragma("journal_mode = WAL");

    require("./common/migrate")(db, path.join(__dirname, "/migrations"));

    server.listen(process.env.API_UI_PORT);

    server.on("listening", function () {
      logger.info("alloydb", "Primary Server listening");
      createServerWindow().then(() => {
        createSchedulerWindow().then(() => {
          createMediaScannerWindow().then(() => {
            createMainWindow().then(() => {
              setupRoutes();
              createTrayMenu();
              mainWindow.webContents.send("app-loaded");
              splashWindow.close();
              mainWindow.show();
              setTimeout(createTasks, 250);
              running = true;
            });
          });
        });
      });
    });
  });


});