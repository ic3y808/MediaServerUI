const fs = require("fs");
const md5 = require("js-md5");
const mime = require("mime-types");
const ffprobe = require("ffprobe-static");
const execSync = require("child_process").execSync;

/**
 * @typedef Config
 * @property {string} api_key
 * @property {string} brainz_api_url
 * @property {string} lastfm_api_key
 * @property {string} lastfm_api_secret
 * @property {string} brainz_api_url
 * @property {boolean} ui_enabled
 * @property {boolean} api_enabled
 * @property {string} log_level
 */
module.exports.Config = class Config {

  constructor(obj) {
    if (!arguments.length) {
      this.api_key = md5(Math.random().toString());
      this.brainz_api_url = "https://api.lidarr.audio";
      this.lastfm_api_key = "";
      this.lastfm_api_secret = "";
      this.ui_enabled = true;
      this.api_enabled = true;
    } else {
      this.api_key = obj.api_key;
      this.brainz_api_url = obj.brainz_api_url;
      this.lastfm_api_key = obj.lastfm_api_key;
      this.lastfm_api_secret = obj.lastfm_api_secret;
      this.brainz_api_url = obj.brainz_api_url;
      this.ui_enabled = obj.ui_enabled;
      this.api_enabled = obj.api_enabled;
    }
  }
};

/**
 * @typedef MediaPath
 * @property {string} path
 * @property {string} displayName
 */
module.exports.MediaPath = class MediaPath {

  constructor(path, displayName) {
    this.path = path;
    this.displayName = displayName;
  }
};

/**
 * @typedef Ping
 * @property {string} status
 */
module.exports.Ping = class Ping {

  constructor(status) {
    this.status = status;
  }
};

/**
 * @typedef License
 * @property {string} licenseType
 */
module.exports.License = class License {

  constructor(license) {
    this.license = license;
  }

  licenseType() {
    if (this.license === "test") { return "Test License"; }
    else { return "Unknown License"; }
  }

};

/**
 * @typedef MusicFolder
 * @property {integer} id
 * @property {string} name
 */
module.exports.MusicFolder = class MusicFolder {

  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
};

/**
 * @typedef StatusResult
 * @property {string} result
 */
module.exports.StatusResult = class StatusResult {

  constructor(result) {
    this.result = result;
  }
};

/**
 * @typedef Directory 
 * @property {integer} id
 * @property {string} parent
 * @property {string} name
 * @property {string} path
 * @property {string} starred
 * @property {string} artist
 * @property {string} title
 * @property {string} coverArt
 */
module.exports.Directory = class Directory {
  constructor(id, parent, name, path, starred, artist, title, coverArt) {
    this.id = id;
    this.parent = parent;
    this.name = name;
    this.path = path;
    this.starred = starred;
    this.artist = artist;
    this.title = title;
    this.coverArt = coverArt;
  }
};

/**
 * @typedef Genre 
 * @property {integer} id
 * @property {string} songCount
 * @property {string} albumCount
 * @property {string} name
 */
module.exports.Genre = class Genre {
  constructor(id, songCount, albumCount, name) {
    this.id = id;
    this.songCount = songCount;
    this.albumCount = albumCount;
    this.name = name;
  }
};

/**
 * @typedef Album 
 * @property {integer} id
 * @property {string} name
 * @property {string} artist
 * @property {string} artistId
 * @property {string} coverArt
 * @property {integer} songCount
 * @property {integer} duration
 * @property {string} created
 */
module.exports.Album = class Album {
  constructor(id, name, artist, artistId, coverArt, songCount, duration, created) {
    this.id = id;
    this.name = name;
    this.artist = artist;
    this.artistId = artistId;
    this.coverArt = coverArt;
    this.songCount = songCount;
    this.duration = duration;
    this.created = created;
  }
};

/**
 * @typedef Artist 
 * @property {integer} id
 * @property {string} name
 * @property {string} coverArt
 * @property {integer} albumCount
 * @property {integer} songCount
 */
module.exports.Artist = class Artist {
  constructor(id, name, coverArt, albumCount, songCount) {
    this.id = id;
    this.name = name;
    this.coverArt = coverArt;
    this.albumCount = albumCount;
    this.songCount = songCount;
  }
};

/**
 * @typedef Song 
 * @property {string} id
 * @property {string} path
 * @property {string} converted_path
 * @property {string} converted_content_type
 * @property {integer} converted_size
 * @property {string} title
 * @property {string} artist
 * @property {string} artist_id
 * @property {string} album
 * @property {string} album_id
 * @property {string} album_path
 * @property {string} genre
 * @property {string} cover_art
 * @property {string} starred
 * @property {string} rating
 * @property {string} bpm
 * @property {integer} year
 * @property {integer} play_count 
 * @property {string} size
 * @property {string} content_type
 * @property {string} created
 * @property {string} last_modified
 * @property {string} duration
 * @property {string} bitRate
 * @property {string} suffix
 * @property {integer} no
 * @property {integer} of
 */
module.exports.Song = class Song {
  constructor() {
    this.id = "";
    this.path = "";
    this.converted_path = "";
    this.converted_content_type = "";
    this.converted_size = "";
    this.title = "";
    this.artist = "";
    this.artist_id = "";
    this.album = "";
    this.album_id = "";
    this.album_path = "";
    this.genre = "";
    this.cover_art = "";
    this.starred = "false";
    this.rating = "";
    this.bpm = "";
    this.year = 0;
    this.play_count = 0;
    this.size = 0;
    this.content_type = "";
    this.created = 0;
    this.last_modified = 0;
    this.duration = 0;
    this.bitRate = "";
    this.suffix = "";
    this.no = 0;
    this.of = 0;
  }

  getStats() {
    if (fs.existsSync(this.path)) {
      var stats = fs.statSync(this.path);
      this.content_type = mime.lookup(this.path);
      this.size = stats.size;
      this.created = stats.ctime.getTime();
      this.last_modified = stats.mtime.getTime();
      var params = " -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1  \"" + this.path + "\"";
      try {
        var duration_out = execSync(ffprobe.path + params);
        this.duration = parseInt(duration_out.toString(), 10);
      } catch (ex) {

      }
    }
  }
};

/**
 * @typedef Playlist  
 * @property {integer} id
 * @property {string} name
 * @property {string} comment
 * @property {integer} songCount
 * @property {integer} duration
 * @property {string} coverArt
 */
module.exports.Playlist = class Playlist {
  constructor(id, name, comment, songCount, duration, coverArt) {
    this.id = id;
    this.name = name;
    this.comment = comment;
    this.songCount = songCount;
    this.duration = duration;
    this.coverArt = coverArt;
  }
};


/**
 * @typedef SimilarArtist 
 * @property {integer} id
 * @property {string} name
 */
module.exports.SimilarArtist = class SimilarArtist {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
};


/**
 * @typedef ArtistInfo 
 * @property {integer} biography
 * @property {string} musicBrainzId
 * @property {integer} lastFmUrl
 * @property {string} smallImageUrl
 * @property {string} mediumImageUrl
 * @property {integer} largeImageUrl
 * @property {Array.<SimilarArtist>} similarArtists
 */
module.exports.ArtistInfo = class ArtistInfo {
  constructor(biography, musicBrainzId, lastFmUrl, smallImageUrl, mediumImageUrl, largeImageUrl, similarArtists) {
    this.biography = biography;
    this.musicBrainzId = musicBrainzId;
    this.lastFmUrl = lastFmUrl;
    this.smallImageUrl = smallImageUrl;
    this.mediumImageUrl = mediumImageUrl;
    this.largeImageUrl = largeImageUrl;
    this.similarArtists = similarArtists;
  }
};

/**
 * @typedef StarredMedia 
 * @property {Array.<Artist>} artists
 * @property {Array.<Album>} albums
 * @property {Array.<Song>} songs
 */
module.exports.StarredMedia = class StarredMedia {
  constructor(artists, albums, songs) {
    this.artists = artists;
    this.albums = albums;
    this.songs = songs;
  }
};

/**
 * @typedef SearchResults 
 * @property {Array.<Artist>} artists
 * @property {Array.<Album>} albums
 * @property {Array.<Song>} songs
 */
module.exports.SearchResults = class SearchResults {
  constructor(artists, albums, songs) {
    this.artists = artists;
    this.albums = albums;
    this.songs = songs;
  }
};

/**
 * @typedef Share 
 * @property {integer} id
 * @property {string} url
 * @property {string} description
 * @property {integer} created
 * @property {integer} lastVisited
 * @property {string} expires
 * @property {string} visitCount
 */
module.exports.Share = class Share {
  constructor(id, url, description, created, lastVisited, expires, visitCount) {
    this.id = id;
    this.url = url;
    this.description = description;
    this.created = created;
    this.lastVisited = lastVisited;
    this.expires = expires;
    this.visitCount = visitCount;
  }
};

/**
 * @typedef LibraryStats 
 * @property {integer} track_count
 * @property {integer} artist_count
 * @property {integer} album_count
 * @property {integer} genre_count
 * @property {integer} memory_used

 */
module.exports.LibraryStats = class LibraryStats {
  constructor() {
    this.track_count = 0;
    this.artist_count = 0;
    this.album_count = 0;
    this.album_count = 0;
    this.memory_used = 0;
  }
};

/**
 * @typedef User
 * @property {integer} id
 * @property {string} type
 * @property {string} username
 * @property {string} password
 * @property {string} lastfm_username
 * @property {string} lastfm_password
 * @property {string} registered
 * @property {string} last_login
 * @property {string} now_playing
 */
module.exports.User = class User {

  constructor(obj) {
    if (!arguments.length) {
      this.id = -1;
      this.type = "";
      this.username = "";
      this.password = "";
      this.lastfm_username = "";
      this.lastfm_password = "";
      this.registered = "";
      this.last_login = "";
      this.now_playing = "";
    } else {
      Object.assign(this, obj);
    }
  }
};