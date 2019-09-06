var express = require("express");
var router = express.Router();
var structures = require("../../common/structures");

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
      res.locals.getLastfmSession(function (result) {
        if (result.success) {
          res.locals.lastFM.getTrackInfo({
            artist: track.artist,
            track: track.title,
            callback: function (result) {
              res.send(result);
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

    res.locals.getLastfmSession(function (result) {
      if (result.success) {
        res.locals.lastFM.getArtistInfo({
          artist: artist,
          callback: function (result) {
            res.json(result);
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

    res.locals.getLastfmSession(function (result) {
      if (result.success) {
        res.locals.lastFM.getAlbumInfo({
          artist: artist,
          album: album,
          callback: function (result) {
            res.json(result);
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

    res.locals.getLastfmSession(function (result) {
      if (result.success) {
        res.locals.lastFM.getGenreInfo({
          genre: genre,
          callback: function (result) {
            res.send(result);
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
      res.locals.getLastfmSession(function (result) {
        if (result.success) {
          res.locals.lastFM.loveTrack({
            artist: track.artist,
            track: track.title,
            callback: function (result) {
              res.send(new structures.StatusResult(result));
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
      res.locals.getLastfmSession(function (result) {
        if (result.success) {
          res.locals.lastFM.unloveTrack({
            artist: track.artist,
            track: track.title,
            callback: function (result) {
              res.send(new structures.StatusResult(result));
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
      res.locals.getLastfmSession(function (result) {
        if (result.success) {
          if (submission === "true") {
            res.locals.lastFM.scrobbleNowPlayingTrack({
              artist: track.artist,
              track: track.title,
              callback: function (result) {
                res.send(new structures.StatusResult(result));
              }
            });
          } else {
            res.locals.lastFM.scrobbleTrack({
              artist: track.artist,
              track: track.title,
              callback: function (result) {
                res.send(new structures.StatusResult(result));
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