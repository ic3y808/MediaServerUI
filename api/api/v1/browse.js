'use strict';
var express = require('express');
var router = express.Router();
var structures = require('./structures');
var path = require('path');
var utils = require('./utils');
var logger = require('../../../common/logger');

var onlyUnique = function (value, index, self) {
  return self.indexOf(value) === index;
}

/**
 * This function comment is parsed by doctrine
 * @route GET /browse/music_folders
 * @produces application/json 
 * @consumes application/json 
 * @group browse - Browse API
 * @returns {Array.<MusicFolder>}  Returns an array of MusicFolder objects
 * @returns {MusicFolder} 200 - Returns all configured top level music folders. Takes no extra parameters
 * @security ApiKeyAuth
 */
router.get('/music_folders', function (req, res) {
  var artists = {};
  artists.artists = res.locals.db.prepare('SELECT DISTINCT * FROM BasePaths ORDER BY base_path COLLATE NOCASE ASC').all();
  res.json(artists);
});

/**
 * This function comment is parsed by doctrine
 * @route GET /browse/music_folders_index
 * @produces application/json 
 * @consumes application/json 
 * @group browse - Browse API
 * @returns {Array.<MusicFolder>}  Returns an array of MusicFolder objects
 * @returns {MusicFolder} 200 - Returns all configured top level music folders. Takes no extra parameters
 * @security ApiKeyAuth
 */
router.get('/music_folders_index', function (req, res) {
  var artists = res.locals.db.prepare('SELECT DISTINCT * FROM Artists ORDER BY name COLLATE NOCASE ASC').all();
  var result = {};

  var testForLetter = function (character) {
    try {
      //Variable declarations can't start with digits or operators
      //If no error is thrown check for dollar or underscore. Those are the only nonletter characters that are allowed as identifiers
      eval("let " + character + ";");
      let regExSpecial = /[^\$_]/;
      return regExSpecial.test(character);
    } catch (error) {
      return false;
    }
  }

  artists.forEach(function (artist) {
    var indexName = artist.name.slice(0, 1).toUpperCase();
    if (testForLetter(indexName)) {
      if (!result[indexName]) result[indexName] = [];
      result[indexName].push(artist);
    } else {
      if (!result['#']) result['#'] = [];
      result['#'].push(artist);
    }

  });
  var finalResult = [];
  for (var key in result) {
    finalResult.push({
      name: key,
      value: result[key]
    })
  }

  res.json({
    index: finalResult
  });
});

/**
 * This function comment is parsed by doctrine
 * @route GET /browse/indexes
 * @produces application/json 
 * @consumes application/json 
 * @group browse - Browse API
 * @returns {Array.<Directory>}  Returns an array of Directory objects
 * @param {string} musicFolderId.query
 * @param {string} ifModifiedSince.query
 * @returns {Ping} 200 - Returns an indexed structure of all artists.
 * @security ApiKeyAuth
 */
router.get('/indexes', function (req, res) {
  res.send('respond with a resource');
});

/**
 * This function comment is parsed by doctrine
 * @route GET /browse/music_directory
 * @produces application/json 
 * @consumes application/json 
 * @group browse - Browse API
 * @returns {Array.<Directory>}  Returns an array of Directory objects
 * @param {string} id.query.required
 * @returns {Directory} 200 - Returns a listing of all files in a music directory. Typically used to get list of albums for an artist, or list of songs for an album.
 * @security ApiKeyAuth
 */
router.get('/music_directory', function (req, res) {
  res.send('respond with a resource');
});

/**
 * This function comment is parsed by doctrine
 * @route GET /browse/genres
 * @produces application/json 
 * @consumes application/json 
 * @group browse - Browse API
 * @returns {Array.<Genre>}  Returns an array of Genre objects
 * @security ApiKeyAuth
 */
router.get('/genres', function (req, res) {

  var result = {};
  result.genres = res.locals.db.prepare('SELECT * FROM Genres ORDER BY track_count DESC').all();
  res.json(result);
});

/**
 * This function comment is parsed by doctrine
 * @route GET /browse/artists
 * @produces application/json 
 * @consumes application/json 
 * @group browse - Browse API
 * @returns {Array.<Artist>} 200 - Returns an array of Artist objects
 * @security ApiKeyAuth
 */
router.get('/artists', function (req, res) {
  var artists = res.locals.db.prepare('SELECT * FROM Artists ORDER BY name ASC').all();
  res.json({
    artists: artists
  });
});

/**
 * This function comment is parsed by doctrine
 * @route GET /browse/artist
 * @produces application/json 
 * @consumes application/json 
 * @group browse - Browse API
 * @param {string} id.query.required
 * @returns {Artist} 200 - Returns an artist
 * @security ApiKeyAuth
 */
router.get('/artist', function (req, res) {
  var id = req.query.id;

  var result = {
    artist: res.locals.db.prepare('SELECT * FROM Artists WHERE id=?').get(id),
    tracks: res.locals.db.prepare('SELECT * FROM Tracks WHERE artist_id=? ORDER BY album ASC, no ASC, of ASC').all(id),
    albums: res.locals.db.prepare('SELECT * FROM Albums WHERE artist_id=?').all(id),
    links: res.locals.db.prepare('SELECT * FROM Links WHERE artist_id=?').all(id)
  };

  result.prev = res.locals.db.prepare('SELECT id, name FROM Artists WHERE sort_order=?').get(result.artist.sort_order - 1);
  result.next = res.locals.db.prepare('SELECT id, name FROM Artists WHERE sort_order=?').get(result.artist.sort_order + 1);
  
  var totalSize = 0;
  result.tracks.forEach(track => {
    totalSize += track.size;
  });

  result.size = utils.toHumanReadable(totalSize);

  res.json(result);
});

/**
 * This function comment is parsed by doctrine
 * @route GET /browse/album
 * @produces application/json 
 * @consumes application/json 
 * @group browse - Browse API
 * @param {string} id.query.required
 * @returns {Album} 200 - Returns an album
 * @security ApiKeyAuth
 */
router.get('/album', function (req, res) {
  var id = req.query.id;
  var result = {
    album: res.locals.db.prepare('SELECT * FROM Albums WHERE id=?').get(id),
    tracks: res.locals.db.prepare('SELECT * FROM Tracks WHERE album_id=? ORDER BY album ASC, no ASC, of ASC').all(id),
  }
  result.artist = res.locals.db.prepare('SELECT * FROM Artists WHERE id=?').get(result.album.artist_id);

  var totalSize = 0;
  result.tracks.forEach(track => {
    totalSize += track.size;
  });
  result.size = utils.toHumanReadable(totalSize);

  res.json(result);
});

/**
 * This function comment is parsed by doctrine
 * @route GET /browse/genre
 * @produces application/json 
 * @consumes application/json 
 * @group browse - Browse API
 * @param {string} id.query.required
 * @returns {Genre} 200 - Returns a genre
 * @security ApiKeyAuth
 */
router.get('/genre', function (req, res) {
  var id = req.query.id;
  var genre = res.locals.db.prepare('SELECT * FROM Genres WHERE id=?').all(id)
  var tracks = res.locals.db.prepare('SELECT * FROM Tracks WHERE genre_id=? ORDER BY artist ASC, album ASC, no ASC, of ASC').all(id)

  var totalSize = 0;
  tracks.forEach(track => {
    totalSize += track.size;
  });

  var size = utils.toHumanReadable(totalSize);

  Object.assign(genre[0], {
    tracks: tracks,
    size: size
  })

  res.json(genre[0]);
});

/**
 * This function comment is parsed by doctrine
 * @route GET /browse/song
 * @produces application/json 
 * @consumes application/json 
 * @group browse - Browse API
 * @param {string} id.query.required
 * @returns {Song} 200 - Returns a song
 * @security ApiKeyAuth
 */
router.get('/song', function (req, res) {
  var id = req.query.id;
  res.send('respond with a resource');
});

/**
 * This function comment is parsed by doctrine
 * @route GET /browse/artist_info
 * @produces application/json 
 * @consumes application/json 
 * @group browse - Browse API
 * @param {string} id.query.required
 * @param {int} count.query
 * @param {boolean} includeNotPresent.query
 * @returns {ArtistInfo} 200 - Returns artist info with biography, image URLs and similar artists, using data from last.fm.
 * @security ApiKeyAuth
 */
router.get('/artist_info', function (req, res) {
  var id = req.query.id;
  var count = req.query.count;
  var includeNotPresent = req.query.includeNotPresent;
  res.send('respond with a resource');
});

/**
 * This function comment is parsed by doctrine
 * @route GET /browse/similar_songs
 * @produces application/json 
 * @consumes application/json 
 * @group browse - Browse API
 * @param {string} id.query.required
 * @param {int} count.query
 * @returns {Array.<Song>} 200 - Returns a random collection of songs from the given artist and similar artists, using data from last.fm. Typically used for artist radio features.
 * @security ApiKeyAuth
 */
router.get('/similar_songs', function (req, res) {
  var id = req.query.id;
  var count = req.query.count;
  res.send('respond with a resource');
});

/**
 * This function comment is parsed by doctrine
 * @route GET /browse/top_songs
 * @produces application/json 
 * @consumes application/json 
 * @group browse - Browse API
 * @param {string} artist.query.required The artist name.
 * @param {int} count.query Max number of songs to return.
 * @returns {Array.<Song>} 200 - Returns top songs for the given artist, using data from last.fm.
 * @security ApiKeyAuth
 */
router.get('/top_songs', function (req, res) {
  var artist = req.query.artist;
  var count = req.query.count;
  res.send('respond with a resource');
});

/**
 * This function comment is parsed by doctrine
 * @route GET /browse/fresh
 * @produces application/json 
 * @consumes application/json 
 * @group browse - Browse API
 * @param {string} limit.query
 * @returns {Object} 200 - Returns the newest additions to the library
 * @security ApiKeyAuth
 */
router.get('/fresh', function (req, res) {
  var limit = req.query.limit === undefined ? 10 : req.query.limit;
  var result = {
    fresh: {}
  };
  //var tracks = res.locals.db.prepare("SELECT * FROM Tracks WHERE CAST((last_modified/1000) AS LONG) >= strftime('%s', 'now', '-" + days_back + " day');").all()
  var albums = res.locals.db.prepare("SELECT DISTINCT album_id, album, cover_art FROM Tracks ORDER BY last_modified DESC, album ASC, no ASC, of ASC LIMIT ?").all(limit)

  albums.forEach(function (album) {
    album.tracks = res.locals.db.prepare("SELECT * FROM Tracks WHERE album_id=? ORDER BY album ASC, no ASC, of ASC").all(album.album_id)
    album.track_count = album.tracks.length;
  });
  result.fresh.albums = albums;
  res.json(result);
});

module.exports = router;