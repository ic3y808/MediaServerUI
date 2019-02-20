const fs = require("fs");
const md5 = require('js-md5');
const path = require("path");
const shell = require("shelljs");

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////LIKELY DON'T EDIT THIS FILE//////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

process.env.BASE_DIR = __dirname;
process.env.DATA_DIR = path.join(process.env.BASE_DIR, "..", "data");
process.env.LOGS_DIR = path.join(process.env.DATA_DIR, "logs");
process.env.CONFIG_FILE = path.join(process.env.DATA_DIR, "config.json")
process.env.DATABASE = path.join(process.env.DATA_DIR, "database.db");
process.env.DATABASE_WAL = path.join(process.env.DATA_DIR, "database.db-wal");
process.env.DATABASE_SHM = path.join(process.env.DATA_DIR, "database.db-shm");
process.env.TEST_DATABASE = path.join(process.env.DATA_DIR, "testdb.db");
process.env.COVER_ART = path.join(process.env.DATA_DIR, "images");

process.env.UUID_BASE = '1b671a64-40d5-491e-99b0-da01ff1f3341';
process.env.ARTIST_NFO = 'artist.nfo';
process.env.ALBUM_NFO = 'album.nfo';
process.env.FANART_IMAGE = 'fanart.jpg';
process.env.COVERART_IMAGE = 'Cover.jpg';
process.env.FOLDER_IMAGE = 'folder.jpg';
process.env.LOGO_IMAGE = 'logo.png';


var config = {
  api_key: "",
  lastfm_api_key: "",
  lastfm_api_secret: "",
  brainz_api_url: ""
};

if (!fs.existsSync(process.env.DATA_DIR)) shell.mkdir("-p", process.env.DATA_DIR);
if (!fs.existsSync(process.env.LOGS_DIR)) shell.mkdir("-p", process.env.LOGS_DIR);
if (!fs.existsSync(process.env.COVER_ART)) shell.mkdir("-p", process.env.COVER_ART);

/// remove db debug
//if (fs.existsSync(process.env.DATABASE)) shell.rm(process.env.DATABASE);
//if (fs.existsSync(process.env.DATABASE_WAL)) shell.rm(process.env.DATABASE_WAL);
//if (fs.existsSync(process.env.DATABASE_SHM)) shell.rm(process.env.DATABASE_SHM);

if (fs.existsSync(process.env.CONFIG_FILE)) {
  config = JSON.parse(fs.readFileSync(process.env.CONFIG_FILE, 'utf8'));
} else {

  config.api_key = md5(Math.random().toString());
  fs.writeFileSync(process.env.CONFIG_FILE, JSON.stringify(config, null, 2), function (err, data) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('updated!');
    }
  });
}

process.env.API_KEY = config.api_key;
process.env.LASTFM_API_KEY = config.lastfm_api_key;
process.env.LASTFM_API_SECRET = config.lastfm_api_secret;
process.env.BRAINZ_API_URL = config.brainz_api_url;