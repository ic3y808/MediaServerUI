const md5 = require("js-md5");
const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
var electron = require("electron");
var { app } = electron;
const dotenv = require("dotenv");
var envPath = path.join(__dirname, ".env");
var dev = process.mainModule.filename.indexOf("app.asar");
if (dev === -1) { envPath = ".env"; }
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
process.env.FFMPEG_PATH = require("ffmpeg-static").path.replace("app.asar", "app.asar.unpacked");
process.env.DATA_DIR = path.join(process.env.BASE_DIR, "data");
process.env.BACKUP_DATA_DIR = path.join(process.env.DATA_DIR, "backup");
process.env.LOGS_DIR = path.join(process.env.BASE_DIR, "logs");
process.env.CONVERTED_MEDIA_DIR = path.join(process.env.DATA_DIR, "converted");
process.env.CONVERTED_STARRED_MEDIA_DIR = path.join(process.env.DATA_DIR, "converted_starred");
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

module.exports.config = {
  api_key: "",
  lastfm_api_key: "",
  lastfm_api_secret: "",
  brainz_api_url: "",
  ui_enabled: true,
  api_enabled: true
};

if (!fs.existsSync(process.env.DATA_DIR)) { shell.mkdir("-p", process.env.DATA_DIR); }
if (!fs.existsSync(process.env.LOGS_DIR)) { shell.mkdir("-p", process.env.LOGS_DIR); }
if (!fs.existsSync(process.env.CONVERTED_MEDIA_DIR)) { shell.mkdir("-p", process.env.CONVERTED_MEDIA_DIR); }
if (!fs.existsSync(process.env.CONVERTED_STARRED_MEDIA_DIR)) { shell.mkdir("-p", process.env.CONVERTED_STARRED_MEDIA_DIR); }
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

module.exports.getConfig = function () {

  if (fs.existsSync(process.env.CONFIG_FILE)) {
    var config = JSON.parse(fs.readFileSync(process.env.CONFIG_FILE, "utf8"));
    console.log(config);
    return config;
  } else { return null; }

};

module.exports.saveConfig = function () {
  return new Promise((resolve, reject) => {
    fs.writeFileSync(process.env.CONFIG_FILE, JSON.stringify(module.exports.config, null, 2), function (err, data) {
      if (err) {
        reject(err);
      }
      else {
        resolve();
      }
    });
  });
};


var confResult = module.exports.getConfig();

if (confResult === null) {
  module.exports.config.api_key = md5(Math.random().toString());
  module.exports.saveConfig().then((result) => {
    console.log("Created default config");
  }).catch((err) => {
    console.log(err);
  });
} else {
  module.exports.config = confResult;
  process.env.API_KEY = module.exports.config.api_key;
  process.env.LASTFM_API_KEY = module.exports.config.lastfm_api_key;
  process.env.LASTFM_API_SECRET = module.exports.config.lastfm_api_secret;
  process.env.BRAINZ_API_URL = module.exports.config.brainz_api_url;
  process.env.UI_ENABLED = module.exports.config.ui_enabled;
  process.env.API_ENABLED = module.exports.config.api_enabled;
}

