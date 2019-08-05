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
const migrate = require("./common/migrate");
var sr = require("screenres");
const url = require("url");
var loggerTag = "alloydb";

let mainWindow = null;
let serverWindow = null;
let mediaScannerWindow = null;
let schedulerWindow = null;
let webUIWindow = null;
let splashWindow = null;
let tray = null;
var timer = {};
var db = {};


function isDev() { return process.env.MODE === "dev"; }
function isTest() { return process.env.MODE === "test"; }
function isDevToolsEnabled() { if (isDev() || isTest()) { return true; } return false; }
function isApiEnabled() { return process.env.API_ENABLED === "true"; }
function isUiEnabled() { return process.env.UI_ENABLED === "true"; }
function isPacked() { return process.mainModule.filename.indexOf("app.asar") > -1; }

/* Single Instance Check */
if (!isTest()) {
  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    app.quit();
  } else {
    app.on("second-instance", (event, commandLine, workingDirectory) => {
      // Someone tried to run a second instance, we should focus our window.
      if (mainWindow) {
        if (mainWindow.isMinimized()) { mainWindow.restore(); }
        mainWindow.show();
        mainWindow.focus();
      }
    });
  }
}

process.on("exit", () => {
  if (db) { db.close(); }
  if (tray) { tray.destroy(); }
});
process.on("SIGHUP", () => process.exit(128 + 1));
process.on("SIGINT", () => process.exit(128 + 2));
process.on("SIGTERM", () => process.exit(128 + 15));


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

function doClose() {
  if (splashWindow) { splashWindow.close(); }
  if (serverWindow) { serverWindow.close(); }
  if (schedulerWindow) { schedulerWindow.close(); }
  if (mediaScannerWindow) { mediaScannerWindow.close(); }
  app.exit(0);
}

function onClose(e) {
  if (!isTest()) {
    e.preventDefault();
    mainWindow.hide();
  } else {
    doClose();
  }
}

function doCheckpoint() {
  logger.info(loggerTag, "Starting checkpoint");
  db.checkpoint();
  logger.info(loggerTag, "Checkpoint Complete");
}

function doBackup() {
  logger.info(loggerTag, "Starting backup");
  if (!fs.existsSync(process.env.BACKUP_DATA_DIR)) { shell.mkdir("-p", process.env.BACKUP_DATA_DIR); }
  db.backup(path.join(process.env.BACKUP_DATA_DIR, `backup-${Date.now()}.db`));
  logger.info(loggerTag, "Backup Complete");
}

function doCleanup() {
  logger.info(loggerTag, "Starting Cleanup");
  mediaScannerWindow.webContents.send("mediascanner-cleaup-start");
}

function doIncCleanup() {
  logger.info(loggerTag, "Starting Incremental Cleanup");
  mediaScannerWindow.webContents.send("mediascanner-inc-cleaup-start");
}

function doRescan() {
  logger.info(loggerTag, "Starting Rescan");
  mediaScannerWindow.webContents.send("mediascanner-scan-start");
}

function doReache() {
  logger.info(loggerTag, "Starting Re-Cache of streamable media");
  mediaScannerWindow.webContents.send("mediascanner-recache-start");
}

function doToggleApiServer(e, data) {
  logger.info(loggerTag, "Changing API server settings to " + JSON.stringify(data));
  if (data.enabled === true) { settings.config.api_enabled = "true"; }
  else { settings.config.api_enabled = "false"; }
  settings.saveConfig();
}

function doToggleUiServer(e, data) {
  logger.info(loggerTag, "Changing UI server settings to " + JSON.stringify(data));
  if (data.enabled === true) { settings.config.ui_enabled = "true"; }
  else { settings.config.ui_enabled = "false"; }
  settings.saveConfig();
}

function doDisconnectDb(callback) {
  try {
    db.close();
  } catch (error) {
    if (error) {
      logger.error("alloyui", JSON.stringify(error));
    }
  }
  callback();
}

function doLoadSettings(key, callback) {
  try {
    var settingsResult = db.prepare("SELECT * from Settings WHERE settings_key=?").get(key);
    if (settingsResult && settingsResult.settings_value) {
      var settings = JSON.parse(settingsResult.settings_value);
      if (settings) {
        callback({ key: key, data: settings });
      } callback(null);
    } callback(null);
  } catch (err) {
    logger.error(loggerTag, err);
    callback(null);
  }
}

function doSaveSettings(key, value, callback) {
  try {
    const stmt = db.prepare("INSERT OR REPLACE INTO Settings (settings_key, settings_value) VALUES (?, ?) ON CONFLICT(settings_key) DO UPDATE SET settings_value=?");
    var obj = JSON.stringify(value);
    const info = stmt.run(key, obj, obj);
  } catch (err) {
    if (err) {
      logger.error(loggerTag, err);
    }
  }
  callback();
}

function queryLog() {
  logger.query(300, (results) => {
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
    win.webContents.openDevTools({ detach: true });
  }
  win.loadURL("http://localhost:" + process.env.API_UI_PORT + "/template/" + page);
  logger.debug(loggerTag, "loading page: http://localhost:" + process.env.API_UI_PORT + "/template/" + page);
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
    splashWindow = new BrowserWindow({ width: res[0] * 0.1, height: Math.min(Math.max(res[1] * 0.4, 375), 375), alwaysOnTop: !isDev(), webPreferences: { nodeIntegration: true }, frame: isDev() });
    splashWindow.icon = path.join(__dirname, "common", "icon.ico");
    splashWindow.setMenu(null);
    splashWindow.loadURL(url.format({
      pathname: path.join(__dirname, "alloydbui", "html", "splash.html"),
      protocol: "file:",
      slashes: true
    }));
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
    mainWindow.webContents.once("dom-ready", () => {
      logger.watchLogs();
      resolve();
    });
  });
}

function createTrayMenu() {
  return new Promise((resolve, reject) => {
    var icon = path.join(__dirname, "common", "icon.ico");
    tray = new Tray(icon);

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
        label: "Recache",
        click: doReache
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
    tray.setToolTip("Alloy");
    tray.setContextMenu(contextMenu);

    tray.on("click", () => {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    });
    mainWindow.on("show", () => {
      tray.setHighlightMode("always");
    });
    mainWindow.on("hide", () => {
      tray.setHighlightMode("never");
    });
    resolve();
  });
}

function createTasks() {
  logger.debug(loggerTag, "creating tasks");
  if (isApiEnabled()) {
    schedulerWindow.webContents.send("scheduler-create-jobs", [
      { name: "DB Checkpoint", time: "0 */6 * * *", callback: "task-database-checkpoint" },
      { name: "DB Backup", time: "0 0 * * *", callback: "task-database-backup" },
      { name: "Clean Database", time: "0 0 * * *", callback: "task-database-cleanup" },
      { name: "Incremental Clean", time: "0 0 * * *", callback: "task-database-inc-cleanup" },
      { name: "Rescan Library", time: "0 0 * * 0", callback: "task-database-scan" },
      { name: "Cache Starred", time: "0 0 * * 0", callback: "task-database-cache-starred" }
    ]);
  }
}

function createBaseServer() {
  return new Promise((resolve, reject) => {
    logger.callback = queryLog;
    appServer.set("view engine", "jade");
    appServer.use(bodyParser.json());
    appServer.use(bodyParser.urlencoded({ extended: false }));
    appServer.use(favicon(path.join(__dirname, "common", "icon.ico")));
    appServer.use("/node_modules/", express.static(path.join(__dirname, "node_modules")));
    appServer.use("/alloydbui/js/", express.static(path.join(__dirname, "alloydbui", "js")));
    appServer.use("/alloydbui/css/", express.static(path.join(__dirname, "alloydbui", "css")));
    appServer.use("/alloydbui/img/", express.static(path.join(__dirname, "alloydbui", "img")));

    appServer.use(function (req, res, next) {
      res.io = io;
      res.locals.jadeOptions = {
        title: "Alloy (Preview)",
        jade_port: process.env.JADE_PORT,
        api_port: process.env.API_PORT,
        web_ui_port: process.env.API_UI_PORT,
        dev_mode: process.env.MODE === "dev",
        api_enabled: isApiEnabled(),
        web_ui_enabled: isUiEnabled()
      };
      next();
    });

    appServer.get("/template/:name", function (req, res) {
      if (req.params && req.params.name.indexOf("jade") !== -1) { res.render(req.params.name, res.locals.jadeOptions); }
    });

    var views = [];
    var uiViews = getDirectoriesRecursive(path.join(__dirname, "alloydbui", "html"));
    views = views.concat(uiViews);

    logger.debug(loggerTag, "api enabled: " + isUiEnabled());
    logger.debug(loggerTag, "ui enabled: " + isUiEnabled());

    if (isUiEnabled()) {
      appServer.use("/content", express.static(path.join(__dirname, "alloydbweb", "content")));
      var webViews = getDirectoriesRecursive(path.join(__dirname, "alloydbweb", "views"));
      var componentdirs = getDirectoriesRecursive(path.join(__dirname, "alloydbweb", "components"));
      var directivedirs = getDirectoriesRecursive(path.join(__dirname, "alloydbweb", "directives"));
      views = views.concat(webViews, componentdirs, directivedirs);

      if (isDev()) {
        logger.info(loggerTag, "Running in DEV mode");
        logger.info(loggerTag, "compiling webpack");
        const webpack = require("webpack");
        const webpackconfig = require("./alloydbweb/webpack.config");
        const webpackMiddleware = require("webpack-dev-middleware");
        const webpackHotMiddleware = require("webpack-hot-middleware");
        const webpackCompiler = webpack(webpackconfig);
        const wpmw = webpackMiddleware(webpackCompiler, {});
        appServer.use(wpmw);
        const wphmw = webpackHotMiddleware(webpackCompiler);
        appServer.use(wphmw);
        process.env.JADE_PORT = utils.normalizePort(process.env.JADE_PORT || "4567");
        var livereload = require("livereload").createServer({ exts: ["jade"], port: process.env.JADE_PORT });
        livereload.watch(path.join(__dirname, "alloydbweb"));
      } else {
        appServer.use(express.static(path.join(__dirname, "alloydbweb", "dist")));
      }
      appServer.use("/", require("./alloydbweb/routes/index"));

      io.on("connection", function (socket) {

        socket.on("load_settings", function (key) {
          logger.debug("alloyui", "Load settings requested for key: " + key);
          doLoadSettings(key, function (result) {
            logger.debug("alloyui", "Settings Loaded");
            socket.emit("settings_loaded_event", result);
          });
        });
        socket.on("save_settings", function (settings) {
          logger.debug("alloyui", "Save settings requested for key: " + settings.key);
          doSaveSettings(settings.key, settings.data, function () {
            logger.debug("alloyui", "Settings Saved");
            socket.emit("settings_saved_event");
          });
        });
        socket.on("disconnect_db", function () {
          logger.info("alloyui", "UI requested db to disconnect: ");
          doDisconnectDb(function () {
            logger.info("alloyui", "shutting down.... restart server");
            process.exit(0);
          });
        });
        logger.debug("alloyui", "WebUI Client connected");
        socket.on("log", function (data) {
          var obj = {};
          obj.level = data.method;
          obj.label = "clientui";
          obj.message = data.message;
          logger.log(obj);
        });
      });

      clearInterval(timer);
      timer = setInterval(function () {
        io.emit("ping", { status: "success", server_time: moment().format("hh:mm:ss a") });
      }, 500);
    }

    appServer.set("views", views);

    // catch 404 and forward to error handler
    appServer.use(function (req, res, next) {
      var err = new Error("Not Found");
      err.status = 404;
      err.url = req.path;
      logger.error(loggerTag, err);
      next(err);
    });

    if (isDev()) {
      appServer.locals.pretty = true;
      appServer.use(function (err, req, res, next) {
        res.status(err.status || 500);
        err.url = req.path;
        logger.error(loggerTag, err);
        res.render("error", {
          message: err.message,
          error: err
        });
      });
    } else {
      appServer.use(function (err, req, res, next) {
        res.status(err.status || 500);
        logger.error(loggerTag, err);
        res.render("error", {
          message: err.message,
          error: {}
        });
      });
    }

    logger.info(loggerTag, "loading database " + process.env.DATABASE);
    db = require("better-sqlite3")(process.env.DATABASE);
    db.pragma("journal_mode = WAL");

    migrate.migrate(db, path.join(__dirname, "/migrations"));


    if (isTest()) {
      migrate.insertTestData(db, path.join(__dirname, "/migrations"));
      migrate.test(db, path.join(__dirname, "/migrations"));
    }

    server.listen(process.env.API_UI_PORT);
    server.on("listening", function () {
      logger.info(loggerTag, "Primary Server listening on port " + process.env.API_UI_PORT);
      resolve();
    });
  });
}

function showWebUI(e, data) {
  logger.info(loggerTag, "requesting webUI window");
  createWebUIWindow();
}

function setupRoutes() {
  return new Promise((resolve, reject) => {
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
        logger.debug(loggerTag, "created job: " + payload.name + " - " + payload.callback);
      });
    }

    //misc ICP
    ipcMain.on("task-database-checkpoint", doCheckpoint);
    ipcMain.on("task-database-backup", doBackup);
    ipcMain.on("task-database-cleanup", doCleanup);
    ipcMain.on("task-database-inc-cleanup", doIncCleanup);
    ipcMain.on("task-database-scan", doRescan);
    ipcMain.on("task-database-cache-starred", doReache);
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

    ipcMain.on("app-quit", (event, payload) => { doClose(); });

    ipcMain.on("open-dev", (event) => {
      if (mainWindow) {
        mainWindow.webContents.openDevTools({ detach: false });
      }
      if (serverWindow) {
        serverWindow.webContents.openDevTools({ detach: true });
        serverWindow.show();
      }
      if (mediaScannerWindow) {
        mediaScannerWindow.webContents.openDevTools({ detach: true });
        mediaScannerWindow.show();
      }
      if (schedulerWindow) {
        schedulerWindow.webContents.openDevTools({ detach: true });
        schedulerWindow.show();
      }
      if (webUIWindow) {
        webUIWindow.webContents.openDevTools({ detach: true });
        webUIWindow.show();
      }

    });
    resolve();
  });
}

app.on("window-all-closed", () => {

});

app.on("ready", async () => {
  if (!isTest() && !isDev()) { await createSplashScreen(); }
  await createBaseServer();
  await createServerWindow();
  await createSchedulerWindow();
  await createMediaScannerWindow();
  await createMainWindow();
  await setupRoutes();
  if (!isTest()) { await createTrayMenu(); }
  if (splashWindow) { splashWindow.close(); }
  mainWindow.webContents.send("app-loaded");
  mainWindow.show();
  setTimeout(createTasks, 250);
});