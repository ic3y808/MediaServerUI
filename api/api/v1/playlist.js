'use strict';
var express = require('express');
var router = express.Router();
var structures = require('./structures');

/**
 * This function comment is parsed by doctrine
 * @route GET /playlist/playlists
 * @produces application/json 
 * @consumes application/json 
 * @group playlist - Playlist API
 * @returns {Array.<Playlist>} 200 - Returns an array of playlists.
 * @security ApiKeyAuth
 */
router.get('/playlists', function (req, res) {
  res.json(res.locals.db.prepare('SELECT * from Playlists').all());
});

/**
 * This function comment is parsed by doctrine
 * @route PUT /playlist/playlists
 * @produces application/json 
 * @consumes application/json 
 * @group playlist - Playlist API
 * @param {string} id.query leave blank if creating a new playlist
 * @param {string} name.query required if creating a playlist
 * @param {string} songId.query ID of a song to add to the playlist. Use one songId parameter for each song in the playlist.
 * @returns {Playlist} 200 - The newly created/updated playlist is returned
 * @security ApiKeyAuth
 */
router.put('/playlists', function (req, res) {
  var id = req.query.id;
  var name = req.query.name;
  var songId = req.query.songId;

  if (id && songId) {
    res.locals.db.prepare('INSERT INTO PlaylistTracks (`id`, `song_id`) VALUES (?, ?);').run(id, songId);
  } else if (!id && name && songId) {
    var existinPlaylist = res.locals.db.prepare('SELECT * from Playlists').all();
    if (existinPlaylist.length === 0) {
      var info = res.locals.db.prepare('INSERT INTO Playlists (`name`) VALUES (?);').run(name);
      res.locals.db.prepare('INSERT INTO PlaylistTracks (`id`, `song_id`) VALUES (?, ?);').run(info.lastInsertRowid, songId);
    } else {
      res.locals.db.prepare('INSERT INTO PlaylistTracks (`id`, `song_id`) VALUES (?, ?);').run(existinPlaylist[0].id, songId);
    }
  }
  res.send(new structures.StatusResult("Done"));
});

/**
 * This function comment is parsed by doctrine
 * @route DELETE /playlist/playlists
 * @produces application/json 
 * @consumes application/json 
 * @group playlist - Playlist API
 * @param {string} id.query.required ID of the playlist
 * @returns {Playlist} 200 - The updated playlist is returned or a error is presented if the playlist is deleted/not found
 * @returns {Error}  default - Unexpected error
 * @security ApiKeyAuth
 */
router.delete('/playlists', function (req, res) {
  var id = req.query.id;
  var existinPlaylist = res.locals.db.prepare('SELECT * from Playlists WHERE id=?').all(id);
  if (existinPlaylist.length !== 0) {
    res.locals.db.prepare('DELETE FROM Playlists WHERE id=?').run(id);
  }
  var playlistTracks = res.locals.db.prepare('SELECT * from PlaylistTracks WHERE id=?').all(id);
  playlistTracks.forEach(track => {
    res.locals.db.prepare('DELETE FROM PlaylistTracks WHERE song_id=?').run(track.song_id);
  });
  res.send('Deleted');
});



/**
 * This function comment is parsed by doctrine
 * @route GET /playlist
 * @produces application/json 
 * @consumes application/json 
 * @group playlist - Playlist API
 * @param {string} id.query.required
 * @returns {Playlist} 200 - Returns a playlist.
 * @security ApiKeyAuth
 */
router.get('/', function (req, res) {
  var id = req.query.id;
  if (id) {
    var playlist = res.locals.db.prepare('SELECT * from Playlists WHERE id=?').all(id);
    if (playlist.length !== 0) {
      var playlistTracks = res.locals.db.prepare('SELECT * from PlaylistTracks WHERE id=?').all(id);
      if (playlistTracks.length !== 0) {
        playlist[0].tracks = playlistTracks;
        res.json(playlist[0]);
      }
    }
  } else {
    res.send(new structures.StatusResult("An ID Is required"));
  }
});


module.exports = router;
