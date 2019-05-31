const md5 = require("js-md5");
const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
var electron = require("electron");
var { app } = electron;
const dotenv = require("dotenv");

var envPath = path.join(__dirname, ".env");
console.log(process.mainModule.filename);
var dev = process.mainModule.filename.indexOf("app.asar");
if(dev === -1) { envPath = ".env"; }
const result = dotenv.config({ path: envPath });
if (result.error) {
  throw result.error;
}
console.log(result.parsed);

process.env.APP_DIR = __dirname;
process.env.BASE_DIR = app.getPath("userData");
process.env.MODE = process.env.MODE ? process.env.MODE : "prod";
console.log("starting up on port " + process.env.API_UI_PORT);
process.env.API_UI_PORT = process.env.API_UI_PORT ? process.env.API_UI_PORT : 6003;
process.env.DATA_DIR = path.join(process.env.BASE_DIR, "data");
process.env.BACKUP_DATA_DIR = path.join(process.env.DATA_DIR, "backup");
process.env.LOGS_DIR = path.join(process.env.BASE_DIR, "logs");
process.env.CONFIG_FILE = path.join(process.env.DATA_DIR, "config.json");
process.env.DATABASE = path.join(process.env.DATA_DIR, "database.db");
process.env.DATABASE_WAL = path.join(process.env.DATA_DIR, "database.db-wal");
process.env.DATABASE_SHM = path.join(process.env.DATA_DIR, "database.db-shm");
process.env.TEST_DATABASE = path.join(process.env.DATA_DIR, "testdb.db");
process.env.COVER_ART_DIR = path.join(process.env.DATA_DIR, "images");
process.env.COVER_ART_NO_ART = path.join(process.env.APP_DIR, "common", "no_art.jpg");

process.env.UUID_BASE = "1b671a64-40d5-491e-99b0-da01ff1f3341";
process.env.ARTIST_NFO = "artist.nfo";
process.env.ALBUM_NFO = "album.nfo";
process.env.FANART_IMAGE = "fanart.jpg";
process.env.COVERART_IMAGE = "Cover.jpg";
process.env.FOLDER_IMAGE = "folder.jpg";
process.env.LOGO_IMAGE = "logo.png";

var config = {
  api_key: "",
  lastfm_api_key: "",
  lastfm_api_secret: "",
  brainz_api_url: "",
  ui_only: false
};

if (!fs.existsSync(process.env.DATA_DIR)) { shell.mkdir("-p", process.env.DATA_DIR); }
if (!fs.existsSync(process.env.LOGS_DIR)) { shell.mkdir("-p", process.env.LOGS_DIR); }
if (!fs.existsSync(process.env.COVER_ART_DIR)) { shell.mkdir("-p", process.env.COVER_ART_DIR); }

if (process.env.MODE === "test") {
  process.env.DATABASE = path.join(process.env.DATA_DIR, "test_database.db");
  process.env.DATABASE_WAL = path.join(process.env.DATA_DIR, "test_database.db-wal");
  process.env.DATABASE_SHM = path.join(process.env.DATA_DIR, "test_database.db-shm");
  if (fs.existsSync(process.env.DATABASE)) { shell.rm(process.env.DATABASE); }
  if (fs.existsSync(process.env.DATABASE_WAL)) { shell.rm(process.env.DATABASE_WAL); }
  if (fs.existsSync(process.env.DATABASE_SHM)) { shell.rm(process.env.DATABASE_SHM); }
}

/// remove db debug
//if (fs.existsSync(process.env.DATABASE)) shell.rm(process.env.DATABASE);
//if (fs.existsSync(process.env.DATABASE_WAL)) shell.rm(process.env.DATABASE_WAL);
//if (fs.existsSync(process.env.DATABASE_SHM)) shell.rm(process.env.DATABASE_SHM);

if (fs.existsSync(process.env.CONFIG_FILE)) {
  config = JSON.parse(fs.readFileSync(process.env.CONFIG_FILE, "utf8"));
} else {

  config.api_key = md5(Math.random().toString());
  fs.writeFileSync(process.env.CONFIG_FILE, JSON.stringify(config, null, 2), function (err, data) {
    if (err) {
      console.log(err);
    }
    else {
      console.log("updated!");
    }
  });
}

process.env.API_KEY = config.api_key;
process.env.LASTFM_API_KEY = config.lastfm_api_key;
process.env.LASTFM_API_SECRET = config.lastfm_api_secret;
process.env.BRAINZ_API_URL = config.brainz_api_url;
process.env.UI_ONLY = config.ui_only;
