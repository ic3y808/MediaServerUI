"use strict";
const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const express = require("express");
const config = require("../common/config");
const logger = require("../common/logger");


const db = require("better-sqlite3")(process.env.DATABASE);
db.pragma('journal_mode = WAL');

process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));

var bodyParser = require("body-parser");
var routes = require("./routes/index");
var scheduler = require("./scheduler");
var MediaScanner = require("./api/v1/mediaScanner");
var LastFMScanner = require("./api/v1/lastfmScanner");
var MusicBrainzScanner = require("./api/v1/musicbrainzScanner");
var Scheduler = require("./scheduler");
var dbmigrate = require("db-migrate");
var dbm = dbmigrate.getInstance(true);
var myTrayApp = {};

var notify = function (title, message) {
  if (process.platform === "win32") {
    if (myTrayApp)
      myTrayApp.balloon(title, message);
  }
};

dbm.up().then(function () {
  logger.debug("alloydb", "successfully migrated database");

  var app = express();
  app.use(express.json());
  app.use(express.urlencoded());

  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "PUT, POST, GET, DELETE, OPTIONS"
    );

    if (req.method === "OPTIONS") {
      res.send(200);
    } else {
      next();
    }
  });

  var mediaScanner = new MediaScanner(db);
  var lastFMScanner = new LastFMScanner(db);
  var musicbrainzScanner = new MusicBrainzScanner(db);
  var scheduler = new Scheduler();

  app.use(function (req, res, next) {
    res.locals.notify = notify;
    res.locals.db = db;
    res.locals.mediaScanner = mediaScanner;
    res.locals.lastFMScanner = lastFMScanner;
    res.locals.musicbrainzScanner = musicbrainzScanner;
    res.locals.scheduler = scheduler;
    next();
  });

  // view engine setup
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "pug");

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, "public")));

  if (!fs.existsSync(process.env.COVER_ART)) {
    fs.mkdirSync(process.env.COVER_ART);
  }

  app.use("/api/v1", function (req, res, next) {
    if (req.query.api_key !== process.env.API_KEY) return res.sendStatus(401);
    next();
  });

  var expressSwagger = require("express-swagger-generator")(app);

  var options = {
    swaggerDefinition: {
      info: {
        description: "This is a sample server",
        title: "Swagger",
        version: "1.0.0"
      },
      host: "localhost:" + process.env.API_PORT,
      basePath: "/api/v1",
      produces: ["application/json"],
      schemes: ["http", "https"],
      securityDefinitions: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "query",
          name: "api_key"
        }
      }
    },
    basedir: __dirname, //app absolute path
    files: ["./api/**/*.js"] //Path to the API handle folder
  };

  expressSwagger(options);

  app.use("/", routes);

  var setupRoute = function (route) {
    var tempRoute = require(route);
    tempRoute.db = db;
    tempRoute.mediaScanner = mediaScanner;
    tempRoute.scheduler = scheduler;
    return tempRoute;
  };
  // V1 API

  app.use("/api/v1/system", setupRoute("./api/v1/system"));
  app.use("/api/v1/media", setupRoute("./api/v1/media"));
  app.use("/api/v1/browse", setupRoute("./api/v1/browse"));
  app.use("/api/v1/list", setupRoute("./api/v1/list"));
  app.use("/api/v1/search", setupRoute("./api/v1/search"));
  app.use("/api/v1/playlist", setupRoute("./api/v1/playlist"));
  app.use("/api/v1/config", setupRoute("./api/v1/config"));
  app.use("/api/v1/share", setupRoute("./api/v1/share"));
  app.use("/api/v1/annotation", setupRoute("./api/v1/annotation"));
  app.use("/api/v1/lastfm", setupRoute("./api/v1/lastfm"));

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    var error = req.path + " - " + err.status + " - " + err.message;
    logger.error('alloyui', error);
    next(err);
  });

  // error handlers

  // development error handler
  // will print stacktrace
  if (process.env.MODE === "dev") {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      var error = req.path + " - " + err.status + " - " + err.message;
      logger.error('alloyui', error);
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    var error = req.path + " - " + err.status + " - " + err.message;
    logger.error('alloyui', error);
  });

  app.set("port", process.env.API_PORT || 4000);



  var configTray = function () {
    if (process.platform === "win32") {
      const WindowsTrayicon = require("windows-trayicon");
      myTrayApp = new WindowsTrayicon({
        title: "Alloy",
        icon: path.resolve(__dirname, "icon.ico"),
        menu: [
          {
            id: "item-1-id",
            caption: "Rescan Libraries"
          },
          {
            id: "item-2-id",
            caption: "Quick Rescan Libraries"
          },
          {
            id: "cancel_scan",
            caption: "Cancel Scan"
          },
          {
            id: "item-3-id",
            caption: "Rescan Last.fm"
          },
          {
            id: "rescanMusicbrainz",
            caption: "Rescan MusicBrainz"
          },
          {
            id: "cleanup",
            caption: "Cleanup"
          },
          {
            id: "item-4-id-exit",
            caption: "Exit"
          }
        ]
      });

      myTrayApp.item(id => {
        switch (id) {
          case "item-1-id": {
            mediaScanner.startFullScan();
            notify("Starting Scan", "The library rescan has been started");
            break;
          }
          case "item-2-id": {
            mediaScanner.startQuickScan();
            notify("Starting Scan", "The library rescan has been started");
            break;
          }
          case "cleanup": {
            mediaScanner.incrementalCleanup();

            break;
          }
          case "cancel_scan": {
            mediaScanner.cancelScan();
            musicbrainzScanner.cancelScan();
            lastFMScanner.cancelScan();
            notify("Cancelling Scan", "The library rescan has been cancelled");
            break;
          }
          case "item-3-id": {
            lastFMScanner.startScan();
            notify(
              "Starting Scan",
              "The Last.FM info rescan has been started"
            );
            break;
          }
          case "rescanMusicbrainz": {
            musicbrainzScanner.startScan();
            notify(
              "Starting Scan",
              "The MusicBrainz info rescan has been started"
            );
            break;
          }
          case "item-4-id-exit": {
            myTrayApp.exit();
            process.exit(0);
            break;
          }
        }
      });
    }
  }

  var server = app.listen(app.get("port"), function () {
    scheduler.createJob("Clean Database", "0 0 * * *", function () {
      logger.info("alloydb", "Doing db cleanup");
      notify("Database Cleanup", "Starting incremental cleanup from scheduler");
      mediaScanner.incrementalCleanup();
    });

    scheduler.createJob("Scan LastFM", "0 0 * * 0", function () {
      logger.info("alloydb", "Doing LastFM Scan");
      notify("Database Scan", "Starting LastFM scan from scheduler");
      lastFMScanner.incrementalScan();
    });

    scheduler.createJob("DB Checkpoint", "0 */6 * * *", function () {
      logger.info("alloydb", "Doing db checkpoint");
      db.checkpoint();
    });

    configTray();

    notify("AlloyDB Started", "AlloyDB is Listening on port " + server.address().port);
    logger.info("alloydb", "AlloyDB Started, AlloyDB is Listening on port " + server.address().port);
  });
});
