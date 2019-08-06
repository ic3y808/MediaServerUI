var express = require("express");
var router = express.Router();
var structures = require("../../common/structures");
var path = require("path");
var utils = require("../../common/utils");
var _ = require("lodash");
var moment = require("moment");
var db = {};
var logger = require("../../common/logger");


/**
 * This function comment is parsed by doctrine
 * @route GET /browse/artists_index
 * @produces application/json 
 * @consumes application/json 
 * @group browse - Browse API
 * @returns {Array.<MusicFolder>}  Returns an array of MusicFolder objects
 * @returns {MusicFolder} 200 - Returns all configured top level music folders. Takes no extra parameters
 * @security ApiKeyAuth
 */
router.get("/artists_index", function (req, res) {
  var artists = res.locals.db.prepare("SELECT DISTINCT * FROM Artists ORDER BY name COLLATE NOCASE ASC").all();
  var finalResult = utils.createIndex(artists);
  var result = {
    index: finalResult
  };

  res.json(result);
});

/**
 * This function comment is parsed by doctrine
 * @route GET /browse/artists
 * @produces application/json 
 * @consumes application/json 
 * @group browse - Browse API
 * @param {int} limit.query The list limit.
 * @param {int} offset.query The list offset. 
 * @returns {Array.<Artist>} 200 - Returns an array of Artist objects
 * @security ApiKeyAuth
 */
router.get("/artists", function (req, res) {
  var limit = req.query.limit;
  var offset = req.query.offset;
  var result = { artists: [] };

  result.limit = limit;


  if (limit && !offset) {
    result.artists = res.locals.db.prepare("SELECT * FROM Artists ORDER BY name ASC LIMIT ?").all(limit);
    result.next_offset = limit;
  } else if (limit && offset) {
    result.next_offset = parseInt(offset, 10) + parseInt(limit, 10);
    result.artists = res.locals.db.prepare("SELECT * FROM Artists ORDER BY name ASC LIMIT ? OFFSET ?").all(limit, offset);
  } else {
    result.artists = res.locals.db.prepare("SELECT * FROM Artists ORDER BY name ASC").all();
    result.next_offset = 0;
  }


  res.json(result);
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
router.get("/artist", function (req, res) {
  var id = req.query.id;
  var all_albums = res.locals.db.prepare("SELECT * FROM Albums WHERE artist_id=?").all(id);
  var result = {
    artist: res.locals.db.prepare("SELECT * FROM Artists WHERE id=?").get(id),
    tracks: res.locals.db.prepare("SELECT * FROM Tracks WHERE artist_id=? ORDER BY album ASC, no ASC, of ASC").all(id),
    popular_tracks: res.locals.db.prepare("SELECT * FROM Tracks WHERE artist_id=? ORDER BY play_count DESC LIMIT 5").all(id),
    links: res.locals.db.prepare("SELECT * FROM Links WHERE artist_id=?").all(id),
    albums: [],
    EPs: [],
    singles: [],
    other: [],
    total_plays: 0
  };

  all_albums.forEach((album) => {
    album.tracks = res.locals.db.prepare("SELECT * FROM Tracks WHERE album_id=? ORDER BY album ASC, no ASC, of ASC").all(album.id);
    album.play_count = 0;
    album.tracks.forEach((track) => {
      album.play_count += track.play_count;
    });
    result.total_plays += album.play_count;
    switch (album.type) {
      case "EP":
        result.EPs.push(album);
        break;
      case "Album":
        result.albums.push(album);
        break;
      case "Single":
        result.singles.push(album);
        break;
      default:
        result.other.push(album);
        break;
    }
  });

  //result.prev = res.locals.db.prepare("SELECT id, name FROM Artists WHERE sort_order=?").get(result.artist.sort_order - 1);
  //result.next = res.locals.db.prepare("SELECT id, name FROM Artists WHERE sort_order=?").get(result.artist.sort_order + 1);

  var totalSize = 0;
  result.tracks.forEach((track) => {
    totalSize += track.size;
  });

  result.size = utils.toHumanReadable(totalSize);

  res.json(result);
});

/**
 * This function comment is parsed by doctrine
 * @route GET /browse/albums
 * @produces application/json 
 * @consumes application/json 
 * @group browse - Browse API
 * @param {string} type.query.required The list type. Must be one of the following: random, newest, highest, frequent, recent. you can also use alphabeticalByName or alphabeticalByArtist to page through all albums alphabetically, and starred to retrieve starred albums. Since 1.10.1 you can use byYear and byGenre to list albums in a given year range or genre.
 * @param {int} offset.query The list offset. Useful if you for example want to page through the list of newest albums.
 * @param {string} genre.query.required The name of the genre, e.g., "Rock".
 * @returns {Array.<Album>} 200 - Returns an array of albums.
 * @security ApiKeyAuth
 */
router.get("/albums", function (req, res) {
  var offset = req.query.offset;
  var genre = req.query.genre;
  var size = 1000;
  if (req.query.size) { size = req.query.size; }
  var result = {};
  if (genre) {
    result.albums = res.locals.db.prepare("SELECT * FROM Albums WHERE genre=? COLLATE NOCASE ASC").all(genre);
  } else {
    result.albums = res.locals.db.prepare("SELECT * FROM Albums ORDER BY name ASC, artist ASC").all();
  }
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
router.get("/album", function (req, res) {
  var id = req.query.id;
  var result = {
    album: res.locals.db.prepare("SELECT * FROM Albums WHERE id=?").get(id),
    tracks: res.locals.db.prepare("SELECT * FROM Tracks WHERE album_id=? ORDER BY album ASC, no ASC, of ASC").all(id),
  };
  if (result.album && result.album.artist_id) {
    result.artist = res.locals.db.prepare("SELECT * FROM Artists WHERE id=?").get(result.album.artist_id);
  }

  var totalSize = 0;
  result.tracks.forEach((track) => {
    totalSize += track.size;
  });
  result.size = utils.toHumanReadable(totalSize);

  res.json(result);
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
router.get("/genres", function (req, res) {
  var result = {};
  result.genres = res.locals.db.prepare("SELECT * FROM Genres ORDER BY artist_count DESC, album_count DESC, track_count DESC").all();
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
router.get("/genre", function (req, res) {
  var id = req.query.id;
  var result = {};
  result.genre = res.locals.db.prepare("SELECT * FROM Genres WHERE id=?").get(id);
  result.never_played = res.locals.db.prepare("SELECT * FROM Tracks WHERE genre_id=? AND play_count=0").all(id);
  result.popular_tracks = res.locals.db.prepare("SELECT * FROM Tracks WHERE genre_id=? ORDER BY play_count DESC LIMIT 30").all(id);
  result.tracks = res.locals.db.prepare("SELECT * FROM Tracks WHERE genre_id=? ORDER BY artist ASC, album ASC, no ASC, of ASC").all(id);
  var artistIds = [];
  var albumIds = [];
  result.tracks.forEach((track) => {
    artistIds.push(track.artist_id);
    albumIds.push(track.album_id);
  });

  artistIds = _.uniq(artistIds);
  albumIds = _.uniq(albumIds);

  result.artists = [];
  artistIds.forEach((id) => {
    var artist = res.locals.db.prepare("SELECT * FROM Artists WHERE id=?").get(id);
    artist.tracks = res.locals.db.prepare("SELECT * FROM Tracks WHERE artist_id=? ORDER BY album ASC, no ASC, of ASC").all(id);
    result.artists.push(artist);
  });

  result.albums = [];
  albumIds.forEach((id) => {
    var album = res.locals.db.prepare("SELECT * FROM Albums WHERE id=?").get(id);
    album.tracks = res.locals.db.prepare("SELECT * FROM Tracks WHERE artist_id=? ORDER BY album ASC, no ASC, of ASC").all(id);
    result.albums.push(album);
  });

  result.total_plays = 0;
  var totalSize = 0;
  result.tracks.forEach((track) => {
    totalSize += track.size;
    result.total_plays += track.play_count;
  });

  result.size = utils.toHumanReadable(totalSize);

  res.json(result);
});

/**
 * This function comment is parsed by doctrine
 * @route GET /browse/charts
 * @produces application/json 
 * @consumes application/json 
 * @group browse - Browse API
 * @param {int} limit.query Max number of songs to return.
 * @security ApiKeyAuth
 */
router.get("/charts", function (req, res) {
  var limit = req.query.limit ? req.query.limit : 40;
  var result = {
    charts: {}
  };

  var history = res.locals.db.prepare("SELECT * FROM History ORDER BY time ASC").all();
  var tags = [];
  history.forEach((item) => {
    var plays = 0;
    var t = res.locals.db.prepare("SELECT play_count FROM Tracks WHERE id=?").get(item.id);
    if (t) { plays = t.play_count; }
    var dateString = moment.unix(item.time).format("MM/DD/YYYY");
    var existing = _.find(tags, { date: dateString });
    if (existing) { existing.tags.push({ genre: item.genre, play_count: plays }); }
    else { tags.push({ date: dateString, tags: [{ genre: item.genre, play_count: plays }] }); }
  });

  tags.forEach((tag) => {
    function compare(a, b) {
      if (a.play_count > b.play_count) { return -1; }
      if (a.play_count < b.play_count) { return 1; }
      return 0;
    }

    var tempTags = _.uniq(tag.tags.sort(compare), "genre").slice(0, 10);
    tag.tags = [];
    tempTags.forEach((newTag) => {
      tag.tags.push(newTag.genre);
    });
  });

  result.charts.tags = tags;

  var allAlbums = res.locals.db.prepare("SELECT * FROM Albums ORDER BY RANDOM() LIMIT 50").all();
  result.charts.never_played_albums = [];
  allAlbums.forEach((album) => {
    if (result.charts.never_played_albums.length >= limit) { return; }
    var allTracks = res.locals.db.prepare("SELECT * FROM Tracks WHERE album_id=?").all(album.id);
    if (allTracks.length > 0) {
      var anyPlays = allTracks.every((obj) => {
        return obj.play_count === 0;
      });
      if (anyPlays === false) {
        album.tracks = allTracks;
        result.charts.never_played_albums.push(album);
      }
    }
  });

  result.charts.never_played_albums = _.shuffle(result.charts.never_played_albums);

  result.charts.top_tracks = res.locals.db.prepare("SELECT * FROM Tracks ORDER BY play_count DESC LIMIT ?").all(limit);
  result.charts.never_played = res.locals.db.prepare("SELECT * FROM Tracks WHERE play_count=0 ORDER BY RANDOM() LIMIT ?").all(limit);

  res.json(result);
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
router.get("/fresh", function (req, res) {
  var limit = req.query.limit === undefined ? 15 : req.query.limit;
  var result = {
    fresh: {
      albums: [],
      artists: [],
      tracks: []
    }
  };
  //var tracks = res.locals.db.prepare("SELECT * FROM Tracks WHERE CAST((last_modified/1000) AS LONG) >= strftime("%s", "now", "-" + days_back + " day");").all()
  var albumIds = res.locals.db.prepare("SELECT DISTINCT album_id FROM Tracks ORDER BY last_modified DESC, album ASC, no ASC, of ASC LIMIT ?").all(limit);
  var artistsIds = res.locals.db.prepare("SELECT DISTINCT artist_id FROM Tracks ORDER BY last_modified DESC, album ASC, no ASC, of ASC LIMIT ?").all(limit);
  result.fresh.tracks = [];


  artistsIds.forEach((id) => {
    var artist = res.locals.db.prepare("SELECT * FROM Artists WHERE id=?").get(id.artist_id);
    artist.tracks = res.locals.db.prepare("SELECT * FROM Tracks WHERE artist_id=?").all(artist.id);
    result.fresh.artists.push(artist);
  });
  albumIds.forEach((id) => {
    var album = res.locals.db.prepare("SELECT * FROM Albums WHERE id=?").get(id.album_id);
    album.tracks = res.locals.db.prepare("SELECT * FROM Tracks WHERE album_id=?").all(album.id);
    result.fresh.albums.push(album);
    album.tracks.forEach((track) => {
      result.fresh.tracks.push(track);
    });
  });
  result.fresh.tracks = _.shuffle(result.fresh.tracks).slice(0, limit);
  res.json(result);
});


/**
 * This function comment is parsed by doctrine
 * @route GET /browse/random_songs
 * @produces application/json 
 * @consumes application/json 
 * @group browse - Browse API
 * @param {int} size.query The number of songs to return. default 100
 * @param {int} fromYear.query Only return songs published after or in this year.
 * @param {int} toYear.query Only return songs published before or in this year.
 * @param {string} genre.query Only returns songs belonging to this genre.
 * @param {string} musicFolderId.query  Only return albums in the music folder with the given ID. See MusicFolders
 * @returns {Array.<Song>} 200 - Returns an array of random songs.
 * @security ApiKeyAuth
 */
router.get("/random_songs", function (req, res) {

  var fromYear = 0;
  var toYear = 999999;
  var genre = req.query.genre;
  var size = req.query.size;
  var musicFolderId = req.query.musicFolderId;

  if (req.query.fromYear) { fromYear = req.query.fromYear; }
  if (req.query.toYear) { toYear = req.query.toYear; }
  if (!size) { size = 100; }
  var random = {};
  if (genre) {
    random.random = res.locals.db.prepare("SELECT * FROM Tracks WHERE year >= ? AND year <= ? AND genre=? COLLATE NOCASE ORDER BY RANDOM() LIMIT ?").all(fromYear, toYear, genre, size);
  } else {
    random.random = res.locals.db.prepare("SELECT * FROM Tracks WHERE year >= ? AND year <= ? ORDER BY RANDOM() LIMIT ?").all(fromYear, toYear, size);
  }
  res.json(random);
});

/**
 * This function comment is parsed by doctrine
 * @route GET /browse/starred
 * @produces application/json 
 * @consumes application/json 
 * @group browse - Browse API
 * @returns {StarredMedia} 200 - Returns a collection of starred media.
 * @security ApiKeyAuth
 */
router.get("/starred", function (req, res) {
  var starredTracks = res.locals.db.prepare("SELECT * FROM Tracks WHERE starred=?").all("true");
  var topTracks = res.locals.db.prepare("SELECT * FROM Tracks WHERE starred=? ORDER BY play_count DESC LIMIT 25").all("true");
  var starredAlbums = res.locals.db.prepare("SELECT * FROM Albums WHERE starred=?").all("true");

  starredAlbums.forEach((album) => {
    album.tracks = res.locals.db.prepare("SELECT * FROM Tracks WHERE album_id=?").all(album.id);
    album.play_count = 0;
    album.tracks.forEach((track) => {
      album.play_count += track.play_count;
    });

  });
  var topStarredAlbums = _.sortBy(starredAlbums, function (o) {
    return o.play_count;
  }).reverse();

  var starredArtists = res.locals.db.prepare("SELECT * FROM Artists WHERE starred=? ORDER BY name ASC").all("true");
  starredArtists.forEach((artist) => {
    starredArtists.tracks = res.locals.db.prepare("SELECT * FROM Tracks WHERE artist_id=?").all(artist.id);
    starredArtists.albums = res.locals.db.prepare("SELECT * FROM Albums WHERE artist_id=? ORDER BY name ASC").all(artist.id);
    artist.play_count = 0;
    starredArtists.albums.forEach((album) => {
      album.tracks = res.locals.db.prepare("SELECT * FROM Tracks WHERE album_id=?").all(album.id);
      album.play_count = 0;
      album.tracks.forEach((track) => {
        album.play_count += track.play_count;
      });
      artist.play_count += album.play_count;
    });
  });

  var topStarredArtists = _.sortBy(starredArtists, function (o) {
    return o.play_count;
  }).reverse();


  res.json({
    starred: {
      tracks: starredTracks,
      albums: starredAlbums,
      artists: starredArtists,
      top_artists: topStarredArtists,
      top_tracks: topTracks,
      top_albums: topStarredAlbums
    }
  });
});

/**
 * This function comment is parsed by doctrine
 * @route GET /browse/history
 * @produces application/json 
 * @consumes application/json 
 * @group browse - Browse API
 * @param {int} limit.query Max number of songs to return.
 * @returns {Object} 200 - Returns play and action history.
 * @security ApiKeyAuth
 */
router.get("/history", function (req, res) {
  var limit = req.query.limit === undefined ? 50 : req.query.limit;
  var totalCount = res.locals.db.prepare("SELECT count(*) FROM  History;").all()[0]["count(*)"];
  var history = res.locals.db.prepare("SELECT * FROM History ORDER BY time DESC LIMIT ?").all(limit);
  res.json({ history: history, count: totalCount });
});

/**
 * This function comment is parsed by doctrine
 * @route PUT /browse/history
 * @produces application/json 
 * @consumes application/json 
 * @group browse - Browse API
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
 * @param {string} genre_id.query     
 * @returns {Object} 200 - Returns play and action history.
 * @security ApiKeyAuth
 */
router.put("/history", function (req, res) {
  try {
    var time = moment().unix();
    var d = {
      id: req.query.id,
      type: req.query.type,
      action: req.query.action,
      title: req.query.title,
      time,
      artist: req.query.artist,
      artist_id: req.query.artist_id,
      album: req.query.album,
      album_id: req.query.album_id,
      genre: req.query.genre,
      genre_id: req.query.genre_id
    };

    res.locals.db.prepare("INSERT INTO History (id, type, action, time, title, artist, artist_id, album, album_id, genre, genre_id) VALUES (?,?,?,?,?,?,?,?,?,?,?)").run(
      d.id,
      d.type,
      d.action,
      d.time,
      d.title,
      d.artist,
      d.artist_id,
      d.album,
      d.album_id,
      d.genre,
      d.genre_id
    );

    res.send(new structures.StatusResult("success"));
  } catch (err) {
    logger.error("api/browse/history", err);
    res.send(new structures.StatusResult("failed"));
  }
});

module.exports = router;
module.exports.db = {};