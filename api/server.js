"use strict";
const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const express = require("express");

process.env.DATA_DIR = path.join(__dirname, "..", "data");

if (!fs.existsSync(process.env.DATA_DIR))
  shell.mkdir("-p", process.env.DATA_DIR);

process.env.API_KEY = "123456";
process.env.BASE_DIR = __dirname;
process.env.DATABASE = path.join(process.env.DATA_DIR, "database.db");
process.env.COVER_ART = path.join(__dirname, "images");
process.env.LASTFM_API_KEY = "ed6f8571e2be230fce3b0cc0203c5a27";
process.env.LASTFM_API_SECRET = "f0fb2b471befe70b265dd72e3e42b545";


const db = require("better-sqlite3")(process.env.DATABASE);
db.prepare("PRAGMA journal_mode = WAL;").run();

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

dbm.up().then(function() {
  console.log("successfully migrated database");

  var app = express();
  app.use(express.json());
  app.use(express.urlencoded());

  app.use(function(req, res, next) {
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

  app.use(function(req, res, next) {
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

  app.use("/api/v1", function(req, res, next) {
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

  var setupRoute = function(route) {
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
  app.use(function(req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
  });

  // error handlers

  // development error handler
  // will print stacktrace
  if (process.env.MODE === "dev") {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      console.log(err.message);
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err.message);
  });

  app.set("port", process.env.API_PORT || 4000);

  var server = app.listen(app.get("port"), function() {
    scheduler.createJob("Clean Database", "0 * * * *", function() {
      console.log("Doing db cleanup");
      mediaScanner.incrementalCleanup();
    });

    scheduler.createJob("Scan LastFM", "0 0 * * 0", function() {
      console.log("Doing LastFM Scan");
      lastFMScanner.incrementalScan();
    });
	
	if(process.platform === "win32"){
		const WindowsTrayicon = require("windows-trayicon");
		const myTrayApp = new WindowsTrayicon({
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
			  id: "get_status",
			  caption: "Get Status"
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
			  id: "item-4-id-exit",
			  caption: "Exit"
			}
		  ]
		});

		myTrayApp.item(id => {
		  switch (id) {
			case "item-1-id": {
			  mediaScanner.startFullScan();
			  myTrayApp
				.balloon("Starting Scan", "The library rescan has been started")
				.then(() => {});
			  break;
			}
			case "item-2-id": {
			  mediaScanner.startQuickScan();
			  myTrayApp
				.balloon("Starting Scan", "The library rescan has been started")
				.then(() => {});
			  break;
			}
			case "get_status": {
			  mediaScanner.incrementalCleanup();

			  break;
			}
			case "cancel_scan": {
			  mediaScanner.cancelScan();
			  myTrayApp
				.balloon("Cancelling Scan", "The library rescan has been cancelled")
				.then(() => {});
			  break;
			}
			case "item-3-id": {
			  lastFMScanner.startScan();
			  myTrayApp
				.balloon(
				  "Starting Scan",
				  "The Last.FM info rescan has been started"
				)
				.then(() => {});
			  break;
			}
			case "rescanMusicbrainz": {
			  musicbrainzScanner.startScan();
			  myTrayApp
				.balloon(
				  "Starting Scan",
				  "The MusicBrainz info rescan has been started"
				)
				.then(() => {});
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

    console.log("Express server listening on port " + server.address().port);
  });
});
