'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable('Tracks', {
    columns: {
      id: { type: 'string', unique: true },
      path: { type: 'string', defaultValue: '', unique: true },
      base_path: { type: 'string', defaultValue: '' },
      base_id: { type: 'string', defaultValue: 0 },
      title: { type: 'string', defaultValue: '' },
      artist: { type: 'string', defaultValue: '' },
      artist_id: { type: 'string', defaultValue: 0 },
      album: { type: 'string', defaultValue: '' },
      album_id: { type: 'string', defaultValue: 0 },
      album_path: { type: 'string', defaultValue: '' },
      genre: { type: 'string', defaultValue: '' },
      genre_id: { type: 'string', defaultValue: 0 },
      cover_art: { type: 'string', defaultValue: '' },
      starred: { type: 'string', defaultValue: 'false' },
      rating: { type: 'string', defaultValue: '' },
      bpm: { type: 'string', defaultValue: '' },
      year: { type: 'int', defaultValue: 0 },
      play_count: { type: 'int', defaultValue: 0 },
      size: { type: 'int', defaultValue: 0 },
      content_type: { type: 'string', defaultValue: '' },
      created: { type: 'int', defaultValue: 0 },
      last_modified: { type: 'int', defaultValue: 0 },
      duration: { type: 'int', defaultValue: 0 },
      bitrate: { type: 'string', defaultValue: '' },
      suffix: { type: 'string', defaultValue: '' },
      no: { type: 'int', defaultValue: 0 },
      of: { type: 'int', defaultValue: 0 },
      musicbrainz_trackid: { type: 'string' },
      musicbrainz_albumid: { type: 'string' },
      musicbrainz_artistid: { type: 'string' },
      musicbrainz_albumartistid: { type: 'string' },
      musicbrainz_releasegroupid: { type: 'string' },
      musicbrainz_workid: { type: 'string' },
      musicbrainz_trmid: { type: 'string' },
      musicbrainz_discid: { type: 'string' },
      acoustid_id: { type: 'string' },
      acoustid_fingerprint: { type: 'string' },
      musicip_puid: { type: 'string' },
      musicip_fingerprint: { type: 'string' },
      last_fm_info: { type: 'string' }
    },
    ifNotExists: true
  });
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  "version": 1
};
