const _ = require("underscore");
const fs = require("fs");
const path = require("path");

const moment = require("moment");
const express = require("express");
const webpack = require("webpack");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const webpackconfig = require("../../webpack.config");
const webpackMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");


var config = require("../../common/config");
var logger = require("../../common/logger");
var utils = require("./core/utils");
var index = require("./routes/index");

var timer = {};

logger.info("alloyui", "Starting up Alloy");

var db = require("./core/database");
db.init().then(function () {
  logger.info("alloyui", "DB Initialized");

  logger.info("alloyui", "Loading Plugins");
  var sabnzbd = require("./core/plugins/sabnzbd");
  var musicbrainz = require("./core/plugins/musicbrainz");
  logger.info("alloyui", "Finished Loading Plugins");

  const app = express();
  var server = require("http").Server(app);
  var io = require("socket.io")(server);
  db.io = io;
  sabnzbd.io = io;
  musicbrainz.io = io;

  app.use(
    "/content",
    express.static(path.join(__dirname, "..", "frontend", "content"))
  );

  if (process.env.MODE === "dev") {
    const webpackCompiler = webpack(webpackconfig);
    const wpmw = webpackMiddleware(webpackCompiler, {});
    app.use(wpmw);
    const wphmw = webpackHotMiddleware(webpackCompiler);
    app.use(wphmw);
  } else {
    app.use(express.static("dist"));
  }

  app.use(
    favicon(path.join(__dirname, "..", "..", "common", "appicon.ico"))
  );

  // view engine setup
  function flatten(lists) {
    return lists.reduce((a, b) => a.concat(b), []);
  }
  function getDirectories(srcpath) {
    return fs
      .readdirSync(srcpath)
      .map(file => path.join(srcpath, file))
      .filter(path => fs.statSync(path).isDirectory());
  }
  function getDirectoriesRecursive(srcpath) {
    return [
      srcpath,
      ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))
    ];
  }
  var viewdirs = getDirectoriesRecursive(
    path.join(__dirname, "..", "frontend", "views")
  );
  var componentdirs = getDirectoriesRecursive(
    path.join(__dirname, "..", "frontend", "components")
  );
  var directivedirs = getDirectoriesRecursive(
    path.join(__dirname, "..", "frontend", "directives")
  );

  app.set("views", viewdirs.concat(componentdirs, directivedirs));
  app.set("view engine", "jade");
  app.use(function (req, res, next) {
    res.io = io;
    next();
  });
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );

  /* Configure Routes. */
  app.use("/", index);
  app.use("/", express.static(path.join(__dirname, "..", "frontend")));
  app.use(
    "/node_modules/",
    express.static(path.join(__dirname, "..", "node_modules"))
  );
  app.use(
    "/bower_components/",
    express.static(path.join(__dirname, "..", "bower_components"))
  );
  app.use(
    "/controllers/",
    express.static(path.join(__dirname, "..", "frontend", "controllers"))
  );
  app.use(
    "/factories/",
    express.static(path.join(__dirname, "..", "frontend", "factories"))
  );
  app.use(
    "/directives/",
    express.static(path.join(__dirname, "..", "frontend", "directives"))
  );

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    err.url = req.path;
    logger.error("alloyui", JSON.stringify(err));
    next(err);
  });

  if (process.env.MODE === "dev") {
    app.locals.pretty = true;
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      err.url = req.path;
      logger.error("alloyui", JSON.stringify(err));
      res.render("error", {
        message: err.message,
        error: err
      });
    });
  } else {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      logger.error("alloyui", JSON.stringify(err));
      res.render("error", {
        message: err.message,
        error: {}
      });
    });
  }

  io.on("connection", function (socket) {
    db.socketConnect(socket);
    sabnzbd.socketConnect(socket);
    musicbrainz.socketConnect(socket);
    logger.debug("alloyui", "Client connected");
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

  server.listen(utils.normalizePort(process.env.PORT || "3000"));

  server.on("error", utils.onError);
  server.on("listening", function () {
    var addr = server.address();
    var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    sabnzbd.login();
    logger.info("alloyui", "Listening on " + bind);
  });

  if (process.env.MODE === "dev") {
    process.env.JADE_PORT = utils.normalizePort(process.env.JADE_PORT || "4567");
    var livereload = require("livereload").createServer({
      exts: ["jade"],
      port: process.env.JADE_PORT
    });
    livereload.watch(path.join(__dirname, "..", "frontend"));
  }
});