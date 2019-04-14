var express = require("express");
var router = express.Router();
var structures = require("./structures");
var Lastfm = require("./simple-lastfm");
var CryptoJS = require("crypto-js");
var logger = require("../../../common/logger");

var getLastFm = (res, isPublic) => {
  if (res.locals.lastfm) {
    return res.locals.lastfm;
<<<<<<< HEAD
  } else {
    var lastfmSettings = res.locals.db.prepare("SELECT * from Settings WHERE settings_key=?").get("alloydb_settings");
    if (lastfmSettings && lastfmSettings.settings_value) {
      var settings = JSON.parse(lastfmSettings.settings_value);
      if (settings) {
        if (settings.alloydb_lastfm_username && settings.alloydb_lastfm_password) {
          res.locals.lastfm = new Lastfm({
            api_key: process.env.LASTFM_API_KEY,
            api_secret: process.env.LASTFM_API_SECRET,
            username: settings.alloydb_lastfm_username,
            password: CryptoJS.AES.decrypt(settings.alloydb_lastfm_password, "12345").toString(CryptoJS.enc.Utf8)
            //authToken: "xxx" // Optional, you can use this instead of password, where authToken = md5(username + md5(password))
          });
          return res.locals.lastfm;
        } else {
          res.send(new structures.StatusResult("No username or password."));
        }
      } else {
        res.send(new structures.StatusResult("Could not parse settings."));
=======
  }
  var lastfmSettings = res.locals.db.prepare("SELECT * from Settings WHERE settings_key=?").get("alloydb_settings");
  if (lastfmSettings && lastfmSettings.settings_value) {
    var settings = JSON.parse(lastfmSettings.settings_value);
    if (settings) {
      if (settings.alloydb_lastfm_username && settings.alloydb_lastfm_password) {
        res.locals.lastfm = new Lastfm({
          api_key: process.env.LASTFM_API_KEY,
          api_secret: process.env.LASTFM_API_SECRET,
          username: settings.alloydb_lastfm_username,
          password: CryptoJS.AES.decrypt(settings.alloydb_lastfm_password, "12345").toString(CryptoJS.enc.Utf8)
          //authToken: "xxx" // Optional, you can use this instead of password, where authToken = md5(username + md5(password))
        });
        return res.locals.lastfm;
>>>>>>> master
      }
      res.send(new structures.StatusResult("No username or password."));
    } else {
      res.send(new structures.StatusResult("Could not parse settings."));
    }
  } else {
    res.send(new structures.StatusResult("Could not load lastfm settings."));
  }
<<<<<<< HEAD

=======
  return null;
>>>>>>> master
};

var getLastfmSession = function (res, cb) {
  var lsfm = getLastFm(res);
  if (lsfm) { lsfm.getSessionKey(cb); }
  else {
    cb({ result: { failure: "failed" } });
  }
};

/**
 * This function comment is parsed by doctrine
 * @route GET /lastfm/track_info
 * @produces application/json
 * @consumes application/json
 * @group lastfm - Last.fm API
 * @param {string} id.query.required A string which uniquely identifies the file (song) or folder (album/artist) to rate.
 * @returns {Status} 200 - Returns the status of the delete 
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.get("/track_info", function (req, res) {
  var id = req.query.id;
  if (!id) {
    res.send(new structures.StatusResult("ID is Required."));
  } else {
    var track = res.locals.db.prepare("SELECT * from Tracks WHERE id=?").get(id);
    if (track) {
      getLastfmSession(res, function (result) {
        if (result.success) {
          getLastFm(res).getTrackInfo({
            artist: track.artist,
            track: track.title,
            callback: (result1) => {
              res.send(result1);
            }
          });
        } else {
          res.send(new structures.StatusResult(result));
        }
      });
    } else {
      res.send(new structures.StatusResult("No track found."));
    }
  }
});

/**
 * This function comment is parsed by doctrine
 * @route GET /lastfm/artist_info
 * @produces application/json
 * @consumes application/json
 * @group lastfm - Last.fm API
 * @param {string} artist.query.required A string which uniquely identifies the artist.
 * @returns {Status} 200 - Returns the status of the delete 
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.get("/artist_info", function (req, res) {
  var artist = req.query.artist;
  if (!artist) {
    res.send(new structures.StatusResult("Artist is Required."));
  } else {

    getLastfmSession(res, (result) => {
      if (result.success) {
        getLastFm(res).getArtistInfo({
<<<<<<< HEAD
          artist, callback: (result2) => {
            res.json(result2);
=======
          artist,
          callback(result1) {
            res.json(result1);
>>>>>>> master
          }
        });
      } else {
        res.send(new structures.StatusResult(result));
      }
    });
  }
});

/**
 * This function comment is parsed by doctrine
 * @route GET /lastfm/album_info
 * @produces application/json
 * @consumes application/json
 * @group lastfm - Last.fm API
 * @param {string} artist.query.required A string which uniquely identifies the artist.
 * @param {string} album.query.required A string which uniquely identifies the album.
 * @returns {Status} 200 - Returns the status of the delete 
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.get("/album_info", function (req, res) {
  var artist = req.query.artist;
  var album = req.query.album;
  if (!artist || !album) {
    res.send(new structures.StatusResult("Artist and Album are Required."));
  } else {

    getLastfmSession(res, function (result) {
      if (result.success) {
        getLastFm(res).getAlbumInfo({
          artist,
          album,
<<<<<<< HEAD
          callback: function (result) {
            res.json(result);
=======
          callback(result1) {
            res.json(result1);
>>>>>>> master
          }
        });
      } else {
        res.send(new structures.StatusResult(result));
      }
    });
  }
});

/**
 * This function comment is parsed by doctrine
 * @route GET /lastfm/genre_info
 * @produces application/json
 * @consumes application/json
 * @group lastfm - Last.fm API
 * @param {string} genre.query.required A string which uniquely identifies the genre.
 * @returns {Status} 200 - Returns the status of the delete 
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.get("/genre_info", function (req, res) {
  var genre = req.query.genre;

  if (!genre) {
    res.send(new structures.StatusResult("Genre is Required."));
  } else {

    getLastfmSession(res, function (result) {
      if (result.success) {
        getLastFm(res).getGenreInfo({
          genre,
<<<<<<< HEAD
          callback: function (result) {
            res.send(result);
=======
          callback(result1) {
            res.send(result1);
>>>>>>> master
          }
        });
      } else {
        res.send(new structures.StatusResult(result));
      }
    });
  }
});

/**
 * This function comment is parsed by doctrine
 * @route PUT /lastfm/love
 * @produces application/json
 * @consumes application/json
 * @group lastfm - Last.fm API
 * @param {string} id.query.required A string which uniquely identifies the file (song) or folder (album/artist) to rate.
 * @returns {Status} 200 - Returns the status of the delete 
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.put("/love", function (req, res) {
  var id = req.query.id;
  if (!id) {
    res.send(new structures.StatusResult("ID is Required."));
  } else {
    var track = res.locals.db.prepare("SELECT * from Tracks WHERE id=?").get(id);
    if (track) {
      getLastfmSession(res, function (result) {
        if (result.success) {
          getLastFm(res).loveTrack({
            artist: track.artist,
            track: track.title,
            callback(result1) {
              res.send(new structures.StatusResult(result1));
            }
          });

        } else {
          res.send(new structures.StatusResult(result));
        }
      });
    } else {
      res.send(new structures.StatusResult("No track found."));
    }
  }
});

/**
 * This function comment is parsed by doctrine
 * @route DELETE /lastfm/love
 * @produces application/json
 * @consumes application/json
 * @group lastfm - Last.fm API
 * @param {string} id.query.required A string which uniquely identifies the file (song) or folder (album/artist) to rate.
 * @returns {Status} 200 - Returns the status of the delete 
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.delete("/love", function (req, res) {
  var id = req.query.id;
  if (!id) {
    res.send(new structures.StatusResult("ID is Required."));
  } else {
    var track = res.locals.db.prepare("SELECT * from Tracks WHERE id=?").get(id);
    if (track) {
      getLastfmSession(res, function (result) {
        if (result.success) {
          getLastFm(res).unloveTrack({
            artist: track.artist,
            track: track.title,
            callback(result1) {
              res.send(new structures.StatusResult(result1));
            }
          });

        } else {
          res.send(new structures.StatusResult(result));
        }
      });
    } else {
      res.send(new structures.StatusResult("No track found."));
    }
  }
});

/**
 * This function comment is parsed by doctrine
 * @route PUT /lastfm/scrobble
 * @produces application/json 
 * @consumes application/json 
 * @group lastfm - Last.fm API
 * @param {string} id.query.required A string which uniquely identifies the file (song) or folder (album/artist) to rate.
 * @param {string} time.query The time (in milliseconds since 1 Jan 1970) at which the song was listened to.
 * @param {boolean} submission.query Whether this is a "submission" or a "now playing" notification.
 * @returns {StatusResult} 200 - Returns the status of star operation.
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.put("/scrobble", function (req, res) {
  var id = req.query.id;
  var time = req.query.time;
  var submission = req.query.submission;

  if (!id) {
    res.send(new structures.StatusResult("ID is Required."));
  } else {
    var track = res.locals.db.prepare("SELECT * from Tracks WHERE id=?").get(id);

    if (track) {
      getLastfmSession(res, function (result) {
        if (result.success) {
          if (submission === "true") {
            getLastFm(res).scrobbleNowPlayingTrack({
              artist: track.artist,
              track: track.title,
              callback(result1) {
                res.send(new structures.StatusResult(result1));
              }
            });
          } else {
            getLastFm(res).scrobbleTrack({
              artist: track.artist,
              track: track.title,
              callback(result1) {
                res.send(new structures.StatusResult(result1));
              }
            });
          }
        }
      });
    } else {
      res.send(new structures.StatusResult("No track found."));
    }
  }
});

module.exports = router;
