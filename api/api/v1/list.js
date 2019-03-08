'use strict';
var express = require('express');
var router = express.Router();
var logger = require('../../../common/logger');



/**
 * This function comment is parsed by doctrine
 * @route GET /list/random_songs
 * @produces application/json 
 * @consumes application/json 
 * @group list - List API
 * @param {int} size.query The number of songs to return. default 100
 * @param {int} fromYear.query Only return songs published after or in this year.
 * @param {int} toYear.query 	Only return songs published before or in this year.
 * @param {string} genre.query Only returns songs belonging to this genre.
 * @param {string} musicFolderId.query  Only return albums in the music folder with the given ID. See MusicFolders
 * @returns {Array.<Song>} 200 - Returns an array of random songs.
 * @security ApiKeyAuth
 */
router.get('/random_songs', function (req, res) {

  var fromYear = 0;
  var toYear = 999999;
  var genre = req.query.genre;
  var size = req.query.size;
  var musicFolderId = req.query.musicFolderId;

  if (req.query.fromYear)
    fromYear = req.query.fromYear;
  if (req.query.toYear)
    toYear = req.query.toYear;
  if (!size)
    size = 100;
  var random = {};
  if (genre) {
    random.random = res.locals.db.prepare('SELECT * FROM Tracks WHERE year >= ? AND year <= ? AND genre=? COLLATE NOCASE ORDER BY RANDOM() LIMIT ?').all(fromYear, toYear, genre, size);
  } else {
    random.random = res.locals.db.prepare('SELECT * FROM Tracks WHERE year >= ? AND year <= ? ORDER BY RANDOM() LIMIT ?').all(fromYear, toYear, size);
  }
  res.json(random)
});

/**
 * This function comment is parsed by doctrine
 * @route GET /list/starred
 * @produces application/json 
 * @consumes application/json 
 * @group list - List API
 * @returns {StarredMedia} 200 - Returns a collection of starred media.
 * @security ApiKeyAuth
 */
router.get('/starred', function (req, res) {
  var starredTracks = res.locals.db.prepare('SELECT * FROM Tracks WHERE starred=?').all('true')
  var starredAlbums = res.locals.db.prepare('SELECT * FROM Albums WHERE starred=?').all('true');
  starredAlbums.forEach(album => {
    album.tracks = res.locals.db.prepare('SELECT * FROM Tracks WHERE album_id=?').all(album.id);
  });
  var starredArtists = res.locals.db.prepare('SELECT * FROM Artists WHERE starred=?').all('true');
  starredArtists.forEach(artist=>{
    starredArtists.tracks = res.locals.db.prepare('SELECT * FROM Tracks WHERE artist_id=?').all(artist.id);
    starredArtists.albums = res.locals.db.prepare('SELECT * FROM Albums WHERE artist_id=?').all(artist.id);
    starredArtists.albums.forEach(album => {
      album.tracks = res.locals.db.prepare('SELECT * FROM Tracks WHERE album_id=?').all(album.id);
    });
  });
  res.json({ starred: { tracks: starredTracks, albums: starredAlbums, artists: starredArtists } });
});

module.exports = router;
