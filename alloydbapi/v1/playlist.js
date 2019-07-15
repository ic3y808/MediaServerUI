var express = require("express");
var router = express.Router();
var structures = require("../../common/structures");
var db = {};

/**

 * @route GET /playlist/playlists
 * @produces application/json 
 * @consumes application/json 
 * @group playlist - Playlist API
 * @returns {Array.<Playlist>} 200 - Returns an array of playlists.
 * @security ApiKeyAuth
 */
router.get("/playlists", function (req, res) {
  var result = {
    playlists: res.locals.db.prepare("SELECT * from Playlists").all(),
  };

  result.playlists.forEach((playlist) => {
    playlist.tracks = res.locals.db.prepare("SELECT * from PlaylistTracks WHERE id=?").all(playlist.id);
  });

  res.json(result);
});

/**

 * @route PUT /playlist/playlists
 * @produces application/json 
 * @consumes application/json 
 * @group playlist - Playlist API
 * @param {string} id.query leave blank if creating a new playlist
 * @param {string} name.query required if creating a playlist
 * @param {string} songId.query ID of a song to add to the playlist. Use one songId parameter for each song in the playlist.
 * @param {string} songIds.query ID of a song to add to the playlist. Use one songId parameter for each song in the playlist.
 * @param {string} replace.query Replaces the contents of the playlist with the id/s
 * @param {string} cache.query Changes the playlist Cache setting
 * @returns {Playlist} 200 - The newly created/updated playlist is returned
 * @security ApiKeyAuth
 */
router.put("/playlists", function (req, res) {
  var id = req.query.id;
  var name = req.query.name;
  var songId = req.query.songId;
  var songIds = req.query.songIds;
  var replace = req.query.replace;
  var cache = req.query.cache;

  if (id && songId) {
    var existing = res.locals.db.prepare("SELECT * from PlaylistTracks WHERE id=? AND song_id=?").all(id, songId);
    if (existing.length === 0) {
      res.locals.db.prepare("INSERT INTO PlaylistTracks (`id`, `song_id`) VALUES (?, ?);").run(id, songId);
    }
  }
  else if (id && songIds) {
    var ids = songIds.split(",");

    var existingTracks = res.locals.db.prepare("SELECT * from PlaylistTracks WHERE id=?").all(id);

    if (replace === "true") {
      existingTracks.forEach((existingId) => {
        res.locals.db.prepare("DELETE from PlaylistTracks WHERE id=? AND song_id=?").run(id, existingId.song_id);
      });
    }

    ids.forEach((newId) => {
      var existingEntry = res.locals.db.prepare("SELECT * FROM PlaylistTracks WHERE id=? AND song_id=?").get(id, newId);
      if (existingEntry === undefined) {
        res.locals.db.prepare("INSERT INTO PlaylistTracks (`id`, `song_id`) VALUES (?, ?);").run(id, newId);
      }
    });
  }
  else if (!id && name && songId) {
    var existinPlaylist = res.locals.db.prepare("SELECT * from Playlists").all();
    if (existinPlaylist.length === 0) {
      var info = res.locals.db.prepare("INSERT INTO Playlists (`name`) VALUES (?);").run(name);
      res.locals.db.prepare("INSERT INTO PlaylistTracks (`id`, `song_id`) VALUES (?, ?);").run(info.lastInsertRowid, songId);
    } else {
      res.locals.db.prepare("INSERT INTO PlaylistTracks (`id`, `song_id`) VALUES (?, ?);").run(existinPlaylist[0].id, songId);
    }
  } else if (!id && name && !songId) {

    res.locals.db.prepare("INSERT INTO Playlists (`name`) VALUES (?);").run(name);

  }
  else if (id && cache) {
    res.locals.db.prepare("UPDATE Playlists SET cache=? WHERE id=?").run(cache, id);
  }
  res.send(new structures.StatusResult("Done"));
});

/**
 * @route DELETE /playlist/playlists
 * @produces application/json 
 * @consumes application/json 
 * @group playlist - Playlist API
 * @param {string} id.query.required ID of the playlist
 * @returns {Playlist} 200 - The updated playlist is returned or a error is presented if the playlist is deleted/not found
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.delete("/playlists", function (req, res) {
  var id = req.query.id;

  var existingTracks = res.locals.db.prepare("SELECT * from PlaylistTracks WHERE id=?").all(id);

  if (existingTracks.length > 0) {
    existingTracks.forEach((track) => {
      res.locals.db.prepare("DELETE FROM PlaylistTracks WHERE id=? AND song_id=?").run(id, track.id);
    });
  }

  var existinPlaylist = res.locals.db.prepare("SELECT * from Playlists WHERE id=?").get(id);
  if (existinPlaylist) {
    res.locals.db.prepare("DELETE FROM Playlists WHERE id=?").run(id);
  }

  res.send(new structures.StatusResult("Deleted"));
});


/**

 * @route GET /playlist
 * @produces application/json 
 * @consumes application/json 
 * @group playlist - Playlist API
 * @param {string} id.query.required
 * @returns {Playlist} 200 - Returns a playlist.
 * @security ApiKeyAuth
 */
router.get("/", function (req, res) {
  var id = req.query.id;
  if (id) {
    var result = {
      playlist: res.locals.db.prepare("SELECT * from Playlists WHERE id=?").get(id)
    };
    result.playlist.tracks = [];
    var trackIds = res.locals.db.prepare("SELECT * from PlaylistTracks WHERE id=?").all(id);
    trackIds.forEach((id) => {
      var t = res.locals.db.prepare("SELECT * from Tracks WHERE id=?").get(id.song_id);
      if (t) { result.playlist.tracks.push(t); }
    });
    res.json(result);
  } else {
    res.send(new structures.StatusResult("An ID Is required"));
  }
});

module.exports = router;
module.exports.db = {};