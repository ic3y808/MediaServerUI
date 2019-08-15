
var electron = require("electron");
var { app } = electron;
const dotenv = require("dotenv");
const shell = require("shelljs");
const fs = require("fs");
const path = require("path");
var envPath = path.join(__dirname, ".env");
var dev = process.mainModule.filename.indexOf("app.asar");
var test = process.env.MODE === "test";


if (dev === -1) { envPath = ".env"; }
const result = dotenv.config({ path: envPath });
if (result.error) {
  throw result.error;
}

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;
process.env.ELECTRON_ENABLE_LOGGING = true;
process.env.MODE = process.env.MODE ? process.env.MODE : "prod";
process.env.APP_DIR = __dirname;
process.env.BASE_DIR = app.getPath("userData");
process.env.API_UI_PORT = process.env.API_UI_PORT ? process.env.API_UI_PORT : 6003;

if (test) {
  process.env.BASE_DIR = path.join(__dirname, "test_data");
  process.env.API_PORT = process.env.API_PORT_TEST;
  process.env.API_UI_PORT = process.env.API_UI_PORT_TEST;
  //clear data
  if (fs.existsSync(process.env.BASE_DIR)) { shell.rm("-r", process.env.BASE_DIR); }
  shell.mkdir("-p", process.env.BASE_DIR);
  const demoArtistDir = path.join(process.env.BASE_DIR, "..", "test", "test_media", "Spiritualized");
  const testMediaDir = path.join(process.env.BASE_DIR, "MediaRoot");
  shell.mkdir("-p", testMediaDir);
  shell.cp("-r", demoArtistDir, testMediaDir);
}

process.env.FFMPEG_PATH = require("ffmpeg-static").path.replace("app.asar", "app.asar.unpacked");
process.env.DATA_DIR = path.join(process.env.BASE_DIR, "data");
process.env.BACKUP_DATA_DIR = path.join(process.env.DATA_DIR, "backup");
process.env.LOGS_DIR = path.join(process.env.BASE_DIR, "logs");
process.env.CONVERTED_MEDIA_DIR = path.join(process.env.DATA_DIR, "converted");
process.env.CONVERTED_STARRED_MEDIA_DIR = path.join(process.env.DATA_DIR, "converted_starred");
process.env.CONVERTED_PLAYLIST_MEDIA_DIR = path.join(process.env.DATA_DIR, "converted_playlists");
process.env.CONFIG_FILE = path.join(process.env.DATA_DIR, "config.json");
process.env.DATABASE = path.join(process.env.DATA_DIR, "database.db");
process.env.DATABASE_WAL = path.join(process.env.DATA_DIR, "database.db-wal");
process.env.DATABASE_SHM = path.join(process.env.DATA_DIR, "database.db-shm");
process.env.LOGS_DATABASE = path.join(process.env.DATA_DIR, "logs.db");
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

if (!fs.existsSync(process.env.DATA_DIR)) { shell.mkdir("-p", process.env.DATA_DIR); }
if (!fs.existsSync(process.env.LOGS_DIR)) { shell.mkdir("-p", process.env.LOGS_DIR); }
if (!fs.existsSync(process.env.CONVERTED_MEDIA_DIR)) { shell.mkdir("-p", process.env.CONVERTED_MEDIA_DIR); }
if (!fs.existsSync(process.env.CONVERTED_STARRED_MEDIA_DIR)) { shell.mkdir("-p", process.env.CONVERTED_STARRED_MEDIA_DIR); }
if (!fs.existsSync(process.env.CONVERTED_PLAYLIST_MEDIA_DIR)) { shell.mkdir("-p", process.env.CONVERTED_PLAYLIST_MEDIA_DIR); }
if (!fs.existsSync(process.env.COVER_ART_DIR)) { shell.mkdir("-p", process.env.COVER_ART_DIR); }