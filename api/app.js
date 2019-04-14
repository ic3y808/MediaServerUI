"use strict";
const fs = require("fs");
const path = require("path");

const fileUpload = require("express-fileupload");

const express = require("express");
const config = require("../common/config");
const logger = require("../common/logger");


var bodyParser = require("body-parser");
var routes = require("./routes/index");
var Watcher = require("./watcher");
var Backup = require("./backup");
var MediaScanner = require("./api/v1/mediaScanner");
var LastFMScanner = require("./api/v1/lastfmScanner");
var MusicBrainzScanner = require("./api/v1/musicbrainzScanner");
var Scheduler = require("./scheduler");
var dbmigrate = require("db-migrate");
var dbm = dbmigrate.getInstance(true);


class App {
  constructor() {
    this.db = require("better-sqlite3")(process.env.DATABASE);
    this.db.pragma("journal_mode = WAL");
    process.on("exit", () => {
      this.db.close();
      if (this.trayApp) { this.trayApp.exit(); }
    });
    process.on("SIGHUP", () => process.exit(128 + 1));
    process.on("SIGINT", () => process.exit(128 + 2));
    process.on("SIGTERM", () => process.exit(128 + 15));


    this.mediaScanner = new MediaScanner(this.db);
    this.lastFMScanner = new LastFMScanner(this.db);
    this.musicbrainzScanner = new MusicBrainzScanner(this.db);
    this.watcher = new Watcher(this.db, this.mediaScanner);
    this.scheduler = new Scheduler();
    this.backup = new Backup(this.db);


  }

  migrate() {
    return dbm.up();
  }

  notify(title, message) {
    if (process.platform === "win32") {
      if (this.trayApp) { this.trayApp.balloon(title, message); }
    }
  }

  configTray() {
    if (process.platform === "win32") {
      const WindowsTrayicon = require("windows-trayicon");
      this.trayApp = new WindowsTrayicon({
        title: "Alloy",
        icon: path.resolve(__dirname, "..", "common", "appicon.ico"),
        menu: [
          {
            id: "item-1-id",
            caption: "Rescan Libraries"
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
            id: "inccleanup",
            caption: "Inc. Cleanup"
          },
          {
            id: "doBackup",
            caption: "Backup"
          },
          {
            id: "item-4-id-exit",
            caption: "Exit"
          }
        ]
      });

      this.trayApp.item((id) => {
        switch (id) {
          case "item-1-id": {
            this.mediaScanner.startScan();
            this.notify("Starting Scan", "The library rescan has been started");
            break;
          }
          case "cleanup": {
            this.mediaScanner.cleanup();
            break;
          }
          case "inccleanup": {
            this.mediaScanner.incrementalCleanup();
            break;
          }
          case "cancel_scan": {
            this.mediaScanner.cancelScan();
            this.musicbrainzScanner.cancelScan();
            this.lastFMScanner.cancelScan();
            this.notify("Cancelling Scan", "The library rescan has been cancelled");
            break;
          }
          case "item-3-id": {
            this.lastFMScanner.startScan();
            this.notify(
              "Starting Scan",
              "The Last.FM info rescan has been started"
            );
            break;
          }
          case "rescanMusicbrainz": {
            this.musicbrainzScanner.startScan();
            this.notify(
              "Starting Scan",
              "The MusicBrainz info rescan has been started"
            );
            break;
          }
          case "doBackup": {
            this.backup.doBackup();
            this.notify(
              "Starting Backup",
              "Alloy DB is being backed up"
            );
            break;
          }
          case "item-4-id-exit": {
            if (this.trayApp) { this.trayApp.exit(); }
            process.exit(0);
            break;
          }
        }
      });
    }
  }

  create() {
    return this.migrate().then(() => {
      logger.debug("alloydb", "successfully migrated database");

      this.app = express();
      this.app.use(express.json());
      this.app.use(express.urlencoded());
      this.app.use(fileUpload({
        limits: { fileSize: 1024 * 1024 * 1024 },
      }));
      this.app.use((req, res, next) => {
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

      this.app.use((req, res, next) => {
        res.locals.notify = this.notify;
        res.locals.db = this.db;
        res.locals.mediaScanner = this.mediaScanner;
        res.locals.lastFMScanner = this.lastFMScanner;
        res.locals.musicbrainzScanner = this.musicbrainzScanner;
        res.locals.scheduler = this.scheduler;
        res.locals.watcher = this.watcher;
        res.locals.backup = this.backup;
        next();
      });

      // view engine setup
      this.app.set("views", path.join(__dirname, "views"));
      this.app.set("view engine", "pug");

      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({ extended: false }));
      this.app.use(express.static(path.join(__dirname, "public")));
      var coverDir = process.env.COVER_ART_DIR;
      if (!fs.existsSync(coverDir)) {
        fs.mkdirSync(coverDir);
      }

      this.app.use("/api/v1", (req, res, next) => {
        if (req.query.api_key !== process.env.API_KEY) { return res.sendStatus(401); }
        next();
      });

      var expressSwagger = require("express-swagger-generator")(this.app);

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

      this.app.use("/", routes);

      var setupRoute = (route) => {
        var tempRoute = require(route);
        tempRoute.db = this.db;
        tempRoute.mediaScanner = this.mediaScanner;
        tempRoute.scheduler = this.scheduler;
        tempRoute.watcher = this.watcher;
        tempRoute.backup = this.backup;
        return tempRoute;
      };
      // V1 API

      this.app.use("/api/v1/system", setupRoute("./api/v1/system"));
      this.app.use("/api/v1/media", setupRoute("./api/v1/media"));
      this.app.use("/api/v1/browse", setupRoute("./api/v1/browse"));
      this.app.use("/api/v1/search", setupRoute("./api/v1/search"));
      this.app.use("/api/v1/playlist", setupRoute("./api/v1/playlist"));
      this.app.use("/api/v1/config", setupRoute("./api/v1/config"));
      this.app.use("/api/v1/share", setupRoute("./api/v1/share"));
      this.app.use("/api/v1/annotation", setupRoute("./api/v1/annotation"));
      this.app.use("/api/v1/lastfm", setupRoute("./api/v1/lastfm"));

      // catch 404 and forward to error handler
      this.app.use((req, res, next) => {
        var err = new Error("Not Found");
        err.status = 404;
        var error = req.path + " - " + err.status + " - " + err.message;
        logger.error("alloyui", error);
        next(err);
      });

      // error handlers

      // development error handler
      // will print stacktrace
      if (process.env.MODE === "dev") {
        this.app.use((err, req, res, next) => {
          res.status(err.status || 500);
          var error = req.path + " - " + err.status + " - " + err.message;
          logger.error("alloyui", error);
        });
      }

      // production error handler
      // no stacktraces leaked to user
      this.app.use((err, req, res, next) => {
        res.status(err.status || 500);
        var error = req.path + " - " + err.status + " - " + err.message;
        logger.error("alloyui", error);
      });

      this.app.set("port", process.env.API_PORT || 4000);


    });
  }

  startServer(cb) {
    this.server = this.app.listen(this.app.get("port"), () => {
      this.scheduler.createJob("Clean Database", "0 0 * * *", () => {
        logger.info("alloydb", "Doing db cleanup");
        this.notify("Database Cleanup", "Starting incremental cleanup from scheduler");
        this.mediaScanner.incrementalCleanup();
      });

      this.scheduler.createJob("Scan LastFM", "0 0 * * 0", () => {
        logger.info("alloydb", "Doing LastFM Scan");
        this.notify("Database Scan", "Starting LastFM scan from scheduler");
        //lastFMScanner.incrementalScan();
      });

      this.scheduler.createJob("DB Checkpoint", "0 */6 * * *", () => {
        logger.info("alloydb", "Doing db checkpoint");
        this.db.checkpoint();
      });

      this.scheduler.createJob("Rescan Library", "0 0 * * 0", () => {
        logger.info("alloydb", "Doing full rescan");
        this.mediaScanner.startScan();
      });

      this.scheduler.createJob("Do Backup", "0 0 * * 0", () => {
        logger.info("alloydb", "Doing database backup");
        this.backup.doBackup();
      });

      this.configTray();
      this.watcher.configFileWatcher();

      this.notify("AlloyDB Started", "AlloyDB is Listening on port " + this.server.address().port);
      logger.info("alloydb", "AlloyDB Started, AlloyDB is Listening on port " + this.server.address().port);
      if (cb) { cb(this.server); }
    });
  }

  stopServer() {
    // if (this.server) this.server.close();
    process.exit(0);
  }
}

module.exports = App;


