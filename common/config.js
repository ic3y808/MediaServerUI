const fs = require("fs");
const md5 = require('js-md5');
const path = require("path");
const shell = require("shelljs");

process.env.BASE_DIR = __dirname;
process.env.DATA_DIR = path.join(process.env.BASE_DIR, "..", "data");
process.env.LOGS_DIR = path.join(process.env.DATA_DIR, "logs");
process.env.CONFIG_FILE = path.join(process.env.DATA_DIR, "config.json")
process.env.DATABASE = path.join(process.env.DATA_DIR, "database.db");
process.env.COVER_ART = path.join(process.env.DATA_DIR, "images");

var config = {
  api_key: "",
  lastfm_api_key: "",
  lastfm_api_secret: ""
};

if (!fs.existsSync(process.env.DATA_DIR)) shell.mkdir("-p", process.env.DATA_DIR);
if (!fs.existsSync(process.env.LOGS_DIR)) shell.mkdir("-p", process.env.LOGS_DIR);
if (!fs.existsSync(process.env.COVER_ART)) shell.mkdir("-p", process.env.COVER_ART);

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
process.env.LASTFM_API_KEY =config.lastfm_api_key;
process.env.LASTFM_API_SECRET = config.lastfm_api_secret;