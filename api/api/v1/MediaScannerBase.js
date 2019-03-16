const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const logger = require('../../../common/logger');
const moment = require('moment');
const mime = require('mime-types');
const fs = require('fs');
const _ = require('lodash');
class MediaScannerBase {

  constructor(database) {
    this.db = database;
    this.resetStatus();
  }

  shouldCancel() {
    if (this.scanStatus.shouldCancel) {
      this.updateStatus("Scanning Cacelled", false);
      return true;
    }
    return false;
  };

  cancelScan() {
    if (this.isScanning()) {
      this.scanStatus.shouldCancel = true;
      this.updateStatus('Starting cancel', false);
      logger.info("alloydb", 'Starting cancel scan');
    } else {
      this.updateStatus("Cancelled scanning", false);
      logger.info("alloydb", 'Cancelled scanning');
    }
  };

  resetStatus() {
    this.scanStatus = {
      status: '',
      isScanning: false,
      shouldCancel: false
    };
  };

  updateStatus(status, isScanning) {
    this.scanStatus.status = status;
    this.scanStatus.isScanning = isScanning;
    logger.info("alloydb", JSON.stringify(this.scanStatus));
  };

  getStatus() {
    return this.scanStatus;
  }

  isScanning() {
    return this.scanStatus.isScanning;
  };

  downloadPage(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, false); // `false` makes the request synchronous
    request.send(null);

    if (request.status === 200) {
      return JSON.parse(request.responseText);
    } else return null;
  }

  checkCounts() {
    logger.info("alloydb", 'checking counts');
    this.updateStatus('checking counts', true);
    var genres = this.db.prepare('SELECT * FROM Genres').all();
    genres.forEach(g => {
      var albums = [];
      var artists = [];
      var tracks = this.db.prepare('SELECT * FROM Tracks WHERE genre_id=?').all(g.id);
      tracks.forEach(track => {
        artists.push(track.artist_id);
        albums.push(track.album_id);
      });
      albums = _.uniq(albums);
      artists = _.uniq(artists);
      this.db.prepare("UPDATE Genres SET track_count=?, artist_count=?, album_count=? WHERE id=?").run(tracks.length, artists.length, albums.length, g.id);
    });
  };

  checkSortOrder() {
    logger.info("alloydb", 'checking table sort orders');
    this.updateStatus('checking base sort order', true);
    var allArtists = this.db.prepare('SELECT * FROM Artists ORDER BY name COLLATE NOCASE ASC').all();
    for (var i = 0; i < allArtists.length; ++i) {
      this.db.prepare("UPDATE Artists SET sort_order=? WHERE id=?").run(i, allArtists[i].id);
    }
  };

  checkEmptyArtists() {
    logger.info("alloydb", 'checking empty artists');
    this.updateStatus('checking missing media', true);
    var allMedia = this.db.prepare('SELECT * FROM Artists').all();
    allMedia.forEach(artist => {
      var anyArtists = this.db.prepare('SELECT * FROM Tracks WHERE artist_id=?').all(artist.id);
      if (anyArtists.length === 0) {
        this.db.prepare("DELETE FROM Artists WHERE id=?").run(artist.id);
        this.writeScanEvent("delete-artist", artist, "Deleted mapped artist because it was empty", "success");
      }
    });
  };

  checkEmptyAlbums() {
    logger.info("alloydb", 'checking empty albums');
    this.updateStatus('checking missing albums', true);
    var allMedia = this.db.prepare('SELECT * FROM Albums').all();
    allMedia.forEach(album => {
      var anyTracks = this.db.prepare('SELECT * FROM Tracks WHERE album_id=?').all(album.id);
      if (anyTracks.length === 0) {
        this.db.prepare("DELETE FROM Albums WHERE id=?").run(album.id);
        this.writeScanEvent("delete-album", album, "Deleted mapped album because it was empty", "success");
      }
    });
  };

  checkEmptyGenres() {
    logger.info("alloydb", 'checking empty genres');
    this.updateStatus('checking empty genres', true);
    var allMedia = this.db.prepare('SELECT * FROM Genres').all();
    allMedia.forEach(genre => {
      var anyGenres = this.db.prepare('SELECT * FROM Tracks WHERE genre_id=?').all(genre.id);
      if (anyGenres.length === 0) {
        this.db.prepare("DELETE FROM Genres WHERE id=?").run(genre.id);
        this.writeScanEvent("delete-genre", genre, "Deleted mapped genre because it was empty", "success");
      }
    });
  };

  checkEmptyPlaylists() {
    logger.info("alloydb", 'checking empty playlists');
    this.updateStatus('checking empty playlists', true);
    var allPlayslits = this.db.prepare('SELECT * FROM Playlists').all();
    allPlayslits.forEach(playlist => {
      var anyTracks = this.db.prepare('SELECT * FROM PlaylistTracks WHERE id=?').all(playlist.id);
      if (anyTracks.length === 0) {
        this.db.prepare("DELETE FROM Playlists WHERE id=?").run(playlist.id);
        this.writeScanEvent("delete-playlist", playlist, "Deleted playlist because it was empty", "success");
      }
    });
  };

  checkExtraAlbumArt() {
    logger.info("alloydb", 'checking extra art');
    this.updateStatus('checking extra art', true);
    if (!fs.existsSync(process.env.COVER_ART_DIR)) {
      fs.mkdirSync(process.env.COVER_ART_DIR);
    }

    fs.readdir(process.env.COVER_ART_DIR, function (err, items) {
      items.forEach(file => {
        var anyArt = this.db.prepare('SELECT * FROM CoverArt WHERE id=?').all(file.replace('.jpg', ''));
        if (anyArt.length === 0) del.sync(path.join(process.env.COVER_ART_DIR, file));
      });
    });
  }

  checkTracksExist() {
    var allTracks = this.db.prepare('SELECT * FROM Tracks').all();
    allTracks.forEach(track => {
      if (!fs.existsSync(track.path)) {
        this.db.prepare('DELETE FROM Tracks WHERE id = ?').run(track.id);
        this.writeScanEvent("delete-track", track, "Deleted mapped track, file no longer exists", "success");
      }
    });
  }

  checkHistory() {
    var allHistory = this.db.prepare('SELECT * FROM History').all();
    allHistory.forEach(item => {
      var track = this.db.prepare('SELECT * FROM Tracks WHERE id=?').get(item.id);
      if(track) {
        try {

            item.title= track.title;
            item.artist= track.artist;
            item.artist_id= track.artist_id;
            item.album= track.album;
            item.album_id= track.album_id;
            item.genre= track.genre;
            item.genre_id= track.genre_id;
          
    
          var sql = 'REPLACE INTO History (history_id, id, type, action, time, title, artist, artist_id, album, album_id, genre, genre_id) VALUES(@history_id, @id, @type, @action, @time, @title, @artist, @artist_id, @album, @album_id, @genre, @genre_id)  ';
          var insert = this.db.prepare(sql);
          insert.run(item);
        } catch (err) {
          if (err) logger.error("alloydb", JSON.stringify(err));
          logger.info("alloydb", sql);
          logger.info("alloydb", values);
        }
      }
    });
  }

  cleanup() {
    logger.info("alloydb", 'Starting cleanup');
    //this.checkTracksExist();
    //this.checkEmptyPlaylists();
    //this.checkEmptyArtists();
    //this.checkEmptyGenres();
    //this.checkSortOrder();
    //this.checkCounts();
    this.checkHistory();
    logger.info("alloydb", 'Cleanup complete');
    this.updateStatus('Scan Complete', false);
  }

  incrementalCleanup() {
    if (this.isScanning()) {
      logger.debug("alloydb", 'scan in progress');
    } else {
      logger.info("alloydb", 'incrementalCleanup');
      this.cleanup();
    }
  }

  writeDb(data, table) {
    var sql = 'INSERT OR REPLACE INTO ' + table + ' (';
    var values = {};
    Object.keys(data).forEach(function (key, index) {
      if (index == Object.keys(data).length - 1)
        sql += key;
      else
        sql += key + ', ';
    });



    sql += ') VALUES (';


    Object.keys(data).forEach(function (key, index) {
      if (index == Object.keys(data).length - 1)
        sql += '@' + key;
      else
        sql += '@' + key + ', ';
    });

    sql += ')';

    try {
      var insert = this.db.prepare(sql);


      Object.keys(data).forEach(function (key, index) {
        var a = {};
        a[key] = data[key];
        Object.assign(values, a);
      });

      insert.run(values);
    } catch (err) {
      if (err) logger.error("alloydb", JSON.stringify(err));
      logger.info("alloydb", sql);
      logger.info("alloydb", values);
    }
  };

  writeScanEvent(type, obj, reason, result) {
    try {
      var data = {
        event_type: type,
        reason: reason,
        result: result,
        time: moment().unix(),
        path: obj.path,
        title: '',
        artist: '',
        artist_id: '',
        album: '',
        album_id: '',
        quality: '',
      }

      if (data.path && !fs.lstatSync(data.path).isDirectory()) {
        data.quality = mime.lookup(data.path);
      }

      switch (type) {
        case 'insert-track':
        case 'delete-track':
          data.artist = obj.artist;
          data.artist_id = obj.artist_id;
          data.album = obj.album;
          data.title = obj.title;
          data.album_id = obj.album_id;
          break;
        case 'insert-album':
        case 'delete-album':
          data.artist = obj.artist;
          data.artist_id = obj.artist_id;
          data.album = obj.name;
          data.title = obj.name;
          data.album_id = obj.id;
          break;
        case 'insert-artist':
        case 'delete-artist':
          data.artist = obj.name;
          data.artist_id = obj.id;
          break;
        case 'insert-playlist':
        case 'delete-playlist':
          data.title = obj.name;
          break;
        case 'insert-genre':
        case 'delete-genre':
          data.title = obj.name;
          break;
      }
      this.writeDb(data, "ScanEvents");
    } catch (err) {

    }

  }
}

module.exports = MediaScannerBase;