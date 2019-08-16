
const fs = require("fs");
const url = require("url");
const path = require("path");
const cron = require("cron").CronJob;
const shell = require("shelljs");
const moment = require("moment");
const screenRes = require("screenres");
const bodyParser = require("body-parser");
const favoriteIcon = require("serve-favicon");

const electron = require("electron");
const { app, net, BrowserWindow, ipcMain, Menu, Tray, nativeImage } = electron;

const utils = require("./common/utils");
const migrate = require("./common/migrate");
const structures = require("./common/structures");

const express = require("express");
const appServer = express();
const server = require("http").Server(appServer);
const io = require("socket.io")(server);

require("./env");

var logdb = require("better-sqlite3")(process.env.LOGS_DATABASE);
logdb.prepare("CREATE TABLE IF NOT EXISTS `Logs` (`id`	INTEGER PRIMARY KEY AUTOINCREMENT, `timestamp` TEXT, `level` TEXT, `label` TEXT, `message` TEXT);").run();

var loggerTag = "AlloyDB";
let mainWindow = null;
let apiServerWindow = null;
let mediaScannerWindow = null;
let webUIWindow = null;
let splashWindow = null;
let tray = null;
var timer = {};
var db = {};
var jobs = [];
var config = new structures.Config();

function isDev() { return process.env.MODE === "dev"; }
function isTest() { return process.env.MODE === "test"; }
function isDevToolsEnabled() { if (isDev() || isTest()) { return true; } return false; }
function isApiServerEnabled() { return process.env.API_ENABLED === "true"; }
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
  if (logdb) { logdb.close(); }
  if (tray) { tray.destroy(); }
});
process.on("SIGHUP", () => process.exit(128 + 1));
process.on("SIGINT", () => process.exit(128 + 2));
process.on("SIGTERM", () => process.exit(128 + 15));

function queryLog() {
  var sql = "SELECT * FROM Logs ORDER BY timestamp DESC LIMIT 1000";
  try {
    var results = logdb.prepare(sql).all();
    if (mainWindow) { mainWindow.webContents.send("logger-logs", results); }
  } catch (err) {
    if (err) {
      console.log(err.message);
      console.log(err.stack);
    }
    console.log(sql);
  }
}

function log(obj) {
  if (process.env.MODE === "dev" || process.env.MODE === "test") {
    console.log("[" + obj.level + "]\t[" + obj.label + "] \t" + obj.message);
  }
  var sql = "INSERT INTO Logs (timestamp, level, label, message) VALUES (?,?,?,?)";
  try {
    if (obj === undefined || obj.level === undefined || obj.label === undefined || obj.message === undefined) {
      console.log("Errror: Log message is invalid or is not an objet");
      console.log(JSON.stringify(obj));
    }
    logdb.prepare(sql).run(new Date().toISOString(), obj.level, obj.label, obj.message.toString());
    queryLog();
  } catch (err) {
    if (err) {
      console.log(err.message);
      console.log(err.stack);
    }
    console.log(sql);
    console.log(JSON.stringify(obj));
  }
}

function info(messsage) { log({ level: "info", label: loggerTag, message: messsage }); }
function debug(debug) { log({ level: "debug", label: loggerTag, message: debug }); }
function error(error) { log({ level: "error", label: loggerTag, message: error }); }

function getConfig() {
  if (fs.existsSync(process.env.CONFIG_FILE)) {
    return new structures.Config(JSON.parse(fs.readFileSync(process.env.CONFIG_FILE, "utf8")));
  } else { return null; }
}

function saveConfig() {
  return new Promise((resolve, reject) => {
    fs.writeFileSync(process.env.CONFIG_FILE, JSON.stringify(config, null, 2), function (err, data) {
      if (err) {
        debug(err);
        reject(err);
      }
      else {
        resolve();
      }
    });
  });
}

function initConfig() {
  var confResult = getConfig();
  if (confResult === null) {
    config = new structures.Config();
    saveConfig().then((result) => {
      info("Created default config");
    }).catch((err) => {
      debug(err);
    });
  } else {
    config = confResult;
  }
  process.env.API_KEY = config.api_key;
  process.env.LASTFM_API_KEY = config.lastfm_api_key;
  process.env.LASTFM_API_SECRET = config.lastfm_api_secret;
  process.env.BRAINZ_API_URL = config.brainz_api_url;
  process.env.UI_ENABLED = config.ui_enabled;
  process.env.API_ENABLED = config.api_enabled;
  process.env.LOG_LEVEL = config.log_level;
}

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

function getSchedule() {
  var results = [];
  jobs.forEach((job) => {
    try {
      var lastDate = job.lastExecution === undefined ? "not yet run" : moment(job.lastExecution).local().format("hh:mm:ss a");
      var nextDate = job.nextDates().local().format("hh:mm:ss a MM/DD/YY");
      results.push({ name: job.name, running: job.running, callback: job.callback, source: job.cronTime.source, timezone: job.cronTime.zone, lastExecution: lastDate, nextExecution: nextDate });
    } catch (err) {
      debug(err);
    }
  });
  return results;
}

function createJob(data, callback) {
  debug("Adding Job " + data.name + " - " + data.callback);
  var job = new cron(data.time, callback, null, true, moment.tz.guess());
  job.name = data.name;
  job.callback = data.callback;
  jobs.push(job);
  mainWindow.webContents.send("scheduler-current-schedule", getSchedule());
}

function doClose() {
  if (splashWindow) { splashWindow.close(); }
  if (apiServerWindow) { apiServerWindow.close(); }
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
  info("Starting checkpoint");
  db.checkpoint();
  info("Checkpoint Complete");
}

function doBackup() {
  info("Starting backup");
  if (!fs.existsSync(process.env.BACKUP_DATA_DIR)) { shell.mkdir("-p", process.env.BACKUP_DATA_DIR); }
  db.backup(path.join(process.env.BACKUP_DATA_DIR, `backup-${Date.now()}.db`));
  info("Backup Complete");
}

function doCleanup() {
  info("Starting Cleanup");
  mediaScannerWindow.webContents.send("mediascanner-cleaup-start");
}

function doIncCleanup() {
  info("Starting Incremental Cleanup");
  mediaScannerWindow.webContents.send("mediascanner-inc-cleaup-start");
}

function doRescan() {
  info("Starting Rescan");
  mediaScannerWindow.webContents.send("mediascanner-scan-start");
}

function doReache() {
  info("Starting Re-Cache of streamable media");
  mediaScannerWindow.webContents.send("mediascanner-recache-start");
}

function doDebug() {
  if (mainWindow) {
    mainWindow.webContents.openDevTools({ detach: false });
  }
  if (apiServerWindow) {
    apiServerWindow.webContents.openDevTools({ detach: true });
    apiServerWindow.show();
  }
  if (mediaScannerWindow) {
    mediaScannerWindow.webContents.openDevTools({ detach: true });
    mediaScannerWindow.show();
  }
  if (webUIWindow) {
    webUIWindow.webContents.openDevTools({ detach: true });
    webUIWindow.show();
  }
}

function doToggleApiServer(e, data) {
  info("Changing API server settings to " + JSON.stringify(data));
  if (data.enabled === true) { config.api_enabled = "true"; }
  else { config.api_enabled = "false"; }
  saveConfig();
}

function doToggleUiServer(e, data) {
  info("Changing UI server settings to " + JSON.stringify(data));
  if (data.enabled === true) { config.ui_enabled = "true"; }
  else { config.ui_enabled = "false"; }
  saveConfig();
}

function doDisconnectDb(callback) {
  try {
    db.close();
  } catch (err) {
    if (err) {
      error(err);
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
    debug(err);
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
      debug(err);
    }
  }
  callback();
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
  debug("Loading Page: http://localhost:" + process.env.API_UI_PORT + "/template/" + page);
  win.setTitle(title);
  win.on("close", close);
  return win;
}

function createApiServerWindow() {
  return new Promise((resolve, reject) => {
    if (!isApiServerEnabled()) { resolve(); }
    else {
      apiServerWindow = createWindow(1280, 610, 1024, 300, "Api Server", false, "apiServer.jade", () => { });
      apiServerWindow.webContents.once("dom-ready", () => {
        resolve();
      });
    }
  });
}

function createMediaScannerWindow() {
  return new Promise((resolve, reject) => {
    if (!isApiServerEnabled()) { resolve(); }
    else {
      mediaScannerWindow = createWindow(1280, 610, 1024, 300, "MediaScanner", false, "mediascanner.jade", () => { });
      mediaScannerWindow.webContents.once("dom-ready", () => {
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
        var res = screenRes.get();
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
    var res = screenRes.get();
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
    var res = screenRes.get();
    mainWindow = createWindow(res[0] * 0.65, res[1] * 0.75, 1024, 300, "Alloy", false, "alloydb.jade", onClose);
    mainWindow.on("show", () => {
      tray.setHighlightMode("always");
    });
    mainWindow.on("hide", () => {
      tray.setHighlightMode("never");
    });
    mainWindow.webContents.once("dom-ready", () => {
      mainWindow.webContents.send("setup-env", process.env);
      resolve();
    });
  });
}

function createTrayMenu() {
  return new Promise((resolve, reject) => {
    var icon = path.join(__dirname, "common", "icon.ico");
    if (process.platform === "linux") {
      icon = path.join(__dirname, "common", "icon.png");
    }
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
        label: "Debug",
        click: doDebug
      },
      {
        label: "Exit",
        click: function () {
          app.exit(0);
        }
      }
    ]);
    tray.on("click", () => {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    });

    tray.setToolTip("Alloy");
    tray.setContextMenu(contextMenu);
    resolve();
  });
}

function createTasks() {
  debug("Creating Tasks");
  if (isApiServerEnabled()) {
    createJob({ name: "DB Checkpoint", time: "0 */6 * * *", callback: "task-database-checkpoint" }, doCheckpoint);
    createJob({ name: "DB Backup", time: "0 0 * * *", callback: "task-database-backup" }, doBackup);
    createJob({ name: "Clean Database", time: "0 0 * * *", callback: "task-database-cleanup" }, doCleanup);
    createJob({ name: "Incremental Clean", time: "0 0 * * *", callback: "task-database-inc-cleanup" }, doIncCleanup);
    createJob({ name: "Rescan Library", time: "0 0 * * 0", callback: "task-database-scan" }, doRescan);
    createJob({ name: "Cache Starred", time: "0 0 * * 0", callback: "task-database-cache-starred" }, doReache);
  }
}

function createBaseServer() {
  return new Promise((resolve, reject) => {
    appServer.set("view engine", "jade");
    appServer.use(bodyParser.json());
    appServer.use(bodyParser.urlencoded({ extended: false }));
    appServer.use(favoriteIcon(path.join(__dirname, "common", "icon.ico")));
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
        api_enabled: isApiServerEnabled(),
        web_ui_enabled: isUiEnabled()
      };
      if (isDev()) {
        if (req.path.indexOf(".map") === -1) {
          debug(req.method + "~" + req.protocol + "://" + req.hostname + req.path);
        }
      }
      next();
    });

    appServer.get("/template/:name", function (req, res) {
      if (req.params && req.params.name.indexOf("jade") !== -1) { res.render(req.params.name, res.locals.jadeOptions); }
    });

    var views = [];
    var uiViews = getDirectoriesRecursive(path.join(__dirname, "alloydbui"));

    views = views.concat(uiViews);

    info("API Server Enabled: " + isUiEnabled());
    info("WebUI Enabled: " + isUiEnabled());

    if (isUiEnabled()) {
      appServer.use("/content", express.static(path.join(__dirname, "alloydbweb", "content")));
      var webViews = getDirectoriesRecursive(path.join(__dirname, "alloydbweb", "views"));
      var componentdirs = getDirectoriesRecursive(path.join(__dirname, "alloydbweb", "components"));
      var directivedirs = getDirectoriesRecursive(path.join(__dirname, "alloydbweb", "directives"));
      views = views.concat(webViews, componentdirs, directivedirs);

      if (isDev()) {
        info("Running in DEV mode");
        debug("compiling webpack");
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
        debug("Socket Client connected");
        socket.on("load_settings", function (key) {
          debug("Load settings for key: " + key);
          doLoadSettings(key, function (result) {
            debug("Settings Loaded");
            socket.emit("settings_loaded_event", result);
          });
        });
        socket.on("save_settings", function (settings) {
          debug("Save settings for key: " + settings.key);
          doSaveSettings(settings.key, settings.data, function () {
            debug("Settings Saved");
            socket.emit("settings_saved_event");
          });
        });
        socket.on("disconnect_db", function () {
          info("UI requested db to disconnect: ");
          doDisconnectDb(function () {
            info("shutting down.... restart server");
            process.exit(0);
          });
        });
        socket.on("log", function (data) {
          log(data);
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
      if (req.path.indexOf(".map") === -1) { error(err.status + " - " + req.path); }
      next(err);
    });

    if (isDev()) {
      appServer.locals.pretty = true;
      appServer.use(function (err, req, res, next) {
        res.status(err.status || 500);
        err.url = req.path;
        if (req.path.indexOf(".map") === -1) { error(err.status + " - " + req.path); }
        res.render("error", {
          message: err.message,
          error: err
        });
      });
    } else {
      appServer.use(function (err, req, res, next) {
        res.status(err.status || 500);
        if (req.path.indexOf(".map") === -1) { error(err.status + " - " + req.path); }
        res.render("error", {
          message: err.message,
          error: {}
        });
      });
    }

    info("Loading Database " + process.env.DATABASE);
    db = require("better-sqlite3")(process.env.DATABASE);
    db.pragma("journal_mode = WAL");
    migrate.log = log;
    migrate.migrate(db, path.join(__dirname, "/migrations"));


    if (isTest()) {
      migrate.insertTestData(db, path.join(__dirname, "/migrations"));
      //migrate.test(db, path.join(__dirname, "/migrations"));
    }

    server.listen(process.env.API_UI_PORT);
    server.on("listening", function () {
      info("UI Server listening on port " + process.env.API_UI_PORT);
      resolve();
    });
  });
}

function showWebUI(e, data) {
  info("requesting webUI window");
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
      ipcMain.on("scheduler-run-task", (event, payload) => {
        jobs.forEach((job) => {
          if (job.callback === payload.callback) {
            job.lastExecution = new Date();
            job.fireOnTick();
            mainWindow.webContents.send("scheduler-current-schedule", getSchedule());
          }
        });
      });
    }

    //server ICP
    if (apiServerWindow) {
      ipcMain.on("server-start", (event, payload) => apiServerWindow.webContents.send("server-start", payload));
      ipcMain.on("config-get-media-paths", (event, payload) => apiServerWindow.webContents.send("config-get-media-paths", payload));
      ipcMain.on("config-media-paths", (event, payload) => mainWindow.webContents.send("config-media-paths", payload));
      ipcMain.on("config-add-media-path", (event, payload) => apiServerWindow.webContents.send("config-add-media-path", payload));
      ipcMain.on("config-remove-media-path", (event, payload) => apiServerWindow.webContents.send("config-remove-media-path", payload));
      ipcMain.on("config-get-file-list", (event, payload) => apiServerWindow.webContents.send("config-get-file-list", payload));
      ipcMain.on("config-file-list", (event, payload) => mainWindow.webContents.send("config-file-list", payload));
      ipcMain.on("config-get-file-parent", (event, payload) => apiServerWindow.webContents.send("config-get-file-parent", payload));
      ipcMain.on("config-file-parent", (event, payload) => mainWindow.webContents.send("config-file-parent", payload));
      ipcMain.on("system-get-stats", (event, payload) => apiServerWindow.webContents.send("system-get-stats", payload));
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
    //if (schedulerWindow) {
    //  ipcMain.on("scheduler-start", (event, payload) => schedulerWindow.webContents.send("scheduler-start", payload));
    //  ipcMain.on("scheduler-create-job", (event, payload) => schedulerWindow.webContents.send("scheduler-create-job", payload));


    //  ipcMain.on("scheduler-job-created", (event, payload) => {
    //    debug("created job: " + payload.name + " - " + payload.callback);
    //  });
    //}

    //misc ICP
    ipcMain.on("app-quit", doClose);
    ipcMain.on("request-web-ui", showWebUI);
    ipcMain.on("task-database-checkpoint", doCheckpoint);
    ipcMain.on("task-database-backup", doBackup);
    ipcMain.on("task-database-cleanup", doCleanup);
    ipcMain.on("task-database-inc-cleanup", doIncCleanup);
    ipcMain.on("task-database-scan", doRescan);
    ipcMain.on("task-database-cache-starred", doReache);
    ipcMain.on("task-alloydb-toggle-api", doToggleApiServer);
    ipcMain.on("task-alloydb-toggle-ui", doToggleUiServer);


    ipcMain.on("web-request", (event, payload) => {
      const request = net.request({ method: payload.method, url: payload.url, });
      let body = "";
      request.on("response", (response) => {
        response.on("data", (chunk) => { body += chunk.toString(); });
        response.on("end", () => { event.returnValue = body; });
      });
      request.end();
    });

    ipcMain.on("log", (event, payload) => {
      log(payload);
    });

    ipcMain.on("log-update", (event) => {
      queryLog();
    });

    ipcMain.on("scheduler-get-schedule", (event) => {
      var schedule = getSchedule();
      event.returnValue = JSON.stringify(schedule);
      mainWindow.webContents.send("scheduler-current-schedule", schedule);
    });

    ipcMain.on("logger-get-logs", (event) => {
      queryLog();
    });

    ipcMain.on("open-dev", (event) => {
      doDebug();
    });
    resolve();
  });
}

app.on("window-all-closed", () => {

});

app.on("ready", async () => {
  info("Starting Alloy");
  initConfig();
  if (!isTest()) { await createTrayMenu(); }
  if (!isTest() && !isDev()) { await createSplashScreen(); }
  await createBaseServer();
  await createApiServerWindow();
  await createMediaScannerWindow();
  await createMainWindow();
  await setupRoutes();
 // if (splashWindow) { splashWindow.hide(); }
  mainWindow.webContents.send("app-loaded");
  mainWindow.show();
  setTimeout(createTasks, 250);
});