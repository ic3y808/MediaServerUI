'use strict';
var express = require('express');
var structures = require('./structures');
var router = express.Router();
var logger = require('../../../common/logger');
var moment = require('moment');
var utils = require('./utils');
var _ = require('underscore');


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
  var topTracks = res.locals.db.prepare('SELECT * FROM Tracks WHERE starred=? ORDER BY play_count DESC LIMIT 25').all('true')
  var starredAlbums = res.locals.db.prepare('SELECT * FROM Albums WHERE starred=?').all('true');
  
  starredAlbums.forEach(album => {
    album.tracks = res.locals.db.prepare('SELECT * FROM Tracks WHERE album_id=?').all(album.id);
    album.play_count = 0;
    album.tracks.forEach(track=>{
      album.play_count += track.play_count;
    });

  });
  var topStarredAlbums = _.sortBy(starredAlbums, function(o) { return o.play_count; });

  var starredArtists = res.locals.db.prepare('SELECT * FROM Artists WHERE starred=?').all('true');
  starredArtists.forEach(artist => {
    starredArtists.tracks = res.locals.db.prepare('SELECT * FROM Tracks WHERE artist_id=?').all(artist.id);
    starredArtists.albums = res.locals.db.prepare('SELECT * FROM Albums WHERE artist_id=?').all(artist.id);
    starredArtists.albums.forEach(album => {
      album.tracks = res.locals.db.prepare('SELECT * FROM Tracks WHERE album_id=?').all(album.id);
    });
  });
  res.json({ starred: { tracks: starredTracks, albums: starredAlbums, artists: starredArtists, top_tracks:topTracks, top_albums: topStarredAlbums } });
});

/**
 * This function comment is parsed by doctrine
 * @route GET /list/history
 * @produces application/json 
 * @consumes application/json 
 * @group list - List API
 * @returns {Object} 200 - Returns play and action history.
 * @security ApiKeyAuth
 */
router.get('/history', function (req, res) {
  var history = res.locals.db.prepare('SELECT * FROM History ORDER BY time DESC').all();
  res.json({ history: history });
});

/**
 * This function comment is parsed by doctrine
 * @route PUT /list/history
 * @produces application/json 
 * @consumes application/json 
 * @group list - List API
 * @param {string} id.query        
 * @param {string} type.query      
 * @param {string} action.query    
 * @param {string} title.query    
 * @param {int} time.query      
 * @param {string} artist.query    
 * @param {string} artist_id.query 
 * @param {string} album.query     
 * @param {string} album_id.query  
 * @param {string} genre.query     
 * @returns {Object} 200 - Returns play and action history.
 * @security ApiKeyAuth
 */
router.put('/history', function (req, res) {
  try {
    var time =  moment().unix();
    var d = {
      id: req.query.id,
      type: req.query.type,
      action: req.query.action,
      title: req.query.title,
      time: time,
      artist: req.query.artist,
      artist_id: req.query.artist_id,
      album: req.query.album,
      album_id: req.query.album_id,
      genre: req.query.genre
    }

      res.locals.db.prepare("INSERT INTO History (id, type, action, time, title, artist, artist_id, album, album_id, genre) VALUES (?,?,?,?,?,?,?,?,?,?)").run(
        d.id,
        d.type,
        d.action,
        d.time,
        d.title,
        d.artist,
        d.artist_id,
        d.album,
        d.album_id,
        d.genre
      )
    
    res.send(new structures.StatusResult("success"));
  } catch (err) {
    res.send(new structures.StatusResult("failed"));
  }
});

module.exports = router;
