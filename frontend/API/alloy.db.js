var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

window.AlloyApi = function () {

  var AlloyApi = function () {
    function AlloyApi(obj) {
      var _this = this;

      _classCallCheck(this, AlloyApi);

      if (typeof obj !== 'object') {
        throw new Error('Input must be an object & contain url & apikey');
        return;
      }
      if (obj.hasOwnProperty('alloydb_host') && obj.hasOwnProperty('alloydb_port') && obj.hasOwnProperty('alloydb_apikey')) {

      } else {
        throw new TypeError('Input must be an object & contain url and apikey fields');
        return;
      }

      this._settings = obj;
    }


    _createClass(AlloyApi, [{
      key: '_toQueryString',
      value: function _toQueryString(params) {
        var r = [];
        for (var n in params) {
          n = encodeURIComponent(n);
          r.push(params[n] === null ? n : n + '=' + encodeURIComponent(params[n]));
        }
        return r.join('&');
      }
    },
    {
      key: '_buildUrl',
      value: function _buildUrl(method, options) {
        if (options !== null && typeof options === 'object') {
          options = '&' + this._toQueryString(options);
        }
        if (!options) {
          options = '';
        }

        if (this._settings.alloydb_use_ssl)
          this._url = "https://";
        else
          this._url = "http://";

        this._url += this._settings.alloydb_host;
        if (this._settings.alloydb_include_port_in_url)
          this._url += ":" + this._settings.alloydb_port;
        return this._url + '/api/v1/' + method + '?' + this._toQueryString(this.params) + options;

      }
    },
    {
      key: '_xhr',
      value: function _xhr(url, dataType) {
        var _this2 = this;

        return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, true);
          xhr.responseType = dataType || 'json';
          xhr.onload = resolve;
          xhr.onerror = reject;
          xhr.send();
          _this2._lastXhr = xhr;
        });
      }
    },
    {
      key: '_xhrput',
      value: function _xhrput(url, dataType) {
        var _this2 = this;

        return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open("PUT", url, true);
          xhr.responseType = dataType || 'json';
          xhr.onload = resolve;
          xhr.onerror = reject;
          xhr.send();
          _this2._lastXhr = xhr;
        });
      }
    },
    {
      key: '_xhrdel',
      value: function _xhrput(url, dataType) {
        var _this2 = this;

        return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open("DELETE", url, true);
          xhr.responseType = dataType || 'json';
          xhr.onload = resolve;
          xhr.onerror = reject;
          xhr.send();
          _this2._lastXhr = xhr;
        });
      }
    },
    {
      key: '_get',
      value: function _get(method, options) {
        var _that = this;
        var opt = {};
        Object.assign(opt, { api_key: _that._settings.alloydb_apikey }, options);
        return new Promise(function (resolve, reject) {
          var url = _that._buildUrl(method, opt);
          _that._xhr(url).then(function (e) {
            var res = e.target.response;
            resolve(res);
          }, function (e) {
            reject(e);
          });
        });
      }
    },
    {
      key: '_put',
      value: function _put(method, options) {
        var _that = this;
        var opt = {};
        Object.assign(opt, { api_key: _that._settings.alloydb_apikey }, options);
        return new Promise(function (resolve, reject) {
          var url = _that._buildUrl(method, opt);
          _that._xhrput(url).then(function (e) {
            var res = e.target.response;
            resolve(res);
          }, function (e) {
            reject(e);
          });
        });
      }
    },
    {
      key: '_delete',
      value: function _delete(method, options) {
        var _that = this;
        var opt = {};
        Object.assign(opt, { api_key: _that._settings.alloydb_apikey }, options);
        return new Promise(function (resolve, reject) {
          var url = _that._buildUrl(method, opt);
          _that._xhrdel(url).then(function (e) {
            var res = e.target.response;
            resolve(res);
          }, function (e) {
            reject(e);
          });
        });
      }
    },
    {
      key: 'ping',
      value: function ping() {
        return this._get('system/ping');
      }
    },
    {
      key: 'getSchedulerStatus',
      value: function getSchedulerStatus() {
        return this._get('system/scheduler');
      }
    },
    {
      key: 'getLibraryInfo',
      value: function getLibraryInfo() {
        return this._get('system/stats');
      }
    },
    {
      key: 'getMediaPaths',
      value: function getLibraryInfo() {
        return this._get('config/mediapaths');
      }
    },
    {
      key: 'getMusicFolders',
      value: function getMusicFolders() {
        return this._get('browse/music_folders');
      }
    },
    {
      key: 'getMusicFoldersIndex',
      value: function getMusicFoldersIndex() {
        return this._get('browse/music_folders_index');
      }
    },
    {
      key: 'getRandomSongs',
      value: function getRandomSongs() {
        return this._get('list/random_songs');
      }
    },
    {
      key: 'getFresh',
      value: function getFresh(daysBack) {
        return this._get('browse/fresh', { days_back: daysBack });
      }
    },
    {
      key: 'getStarred',
      value: function getStarred() {
        return this._get('list/starred');
      }
    },
    {
      key: 'getAlbums',
      value: function getAlbums() {
        return this._get('list/album_list');
      }
    },
    {
      key: 'getAlbum',
      value: function id(id) {
        return this._get('browse/album', { id: id });
      }
    },
    {
      key: 'getGenres',
      value: function getGenres() {
        return this._get('browse/genres');
      }
    },
    {
      key: 'getSongsByGenre',
      value: function getSongsByGenre(id) {
        return this._get('list/songs_by_genre', { id: id });
      }
    },
    {
      key: 'getArtist',
      value: function getArtist(id) {
        return this._get('browse/artist', { id: id });
      }
    },
    {
      key: 'getArtistInfo',
      value: function getArtistInfo(artist) {
        return this._get('lastfm/artist_info', { artist: artist });
      }
    },
    {
      key: 'getAlbumInfo',
      value: function getAlbumInfo(artist, album) {
        return this._get('lastfm/album_info', { artist: artist, album: album });
      }
    },
    {
      key: 'getTrackInfo',
      value: function getTrackInfo(id) {
        return this._get('lastfm/track_info', { id: id });
      }
    },
    {
      key: 'scanFullStart',
      value: function scanFullStart() {
        return this._get('system/start_full_scan');
      }
    },
    {
      key: 'scanQuickStart',
      value: function scanQuickStart() {
        return this._get('system/start_quick_scan');
      }
    },
    {
      key: 'scanStatus',
      value: function scanStatus() {
        return this._get('system/scan_status');
      }
    },
    {
      key: 'scanCancel',
      value: function scanCancel() {
        return this._get('system/cancel_scan');
      }
    },
    {
      key: 'search',
      value: function search(query) {
        return this._get('search', { any: query });
      }
    },
    {
      key: 'addPlay',
      value: function addPlay(id) {
        return this._put('annotation/add_play', { id: id });
      }
    },
    {
      key: 'love',
      value: function love(params) {
        return this._put('lastfm/love', params);
      }
    },
    {
      key: 'unlove',
      value: function unlove(params) {
        return this._delete('lastfm/love', params);
      }
    },
    {
      key: 'star',
      value: function star(params) {
        return this._put('annotation/star', params);
      }
    },
    {
      key: 'unstar',
      value: function unstar(params) {
        return this._put('annotation/unstar', params);
      }
    },
    {
      key: 'stream',
      value: function stream(id, quality) {
        return this._buildUrl('media/stream', { api_key: this._settings.alloydb_apikey, id: id, quality: quality })
      }
    },
    {
      key: 'download',
      value: function download(id, quality) {
        return this._buildUrl('media/download', { api_key: this._settings.alloydb_apikey, id: id })
      }
    },
    {
      key: 'getCoverArt',
      value: function getCoverArt(id) {
        return this._buildUrl('media/cover_art', { api_key: this._settings.alloydb_apikey, id: id })
      }
    },
    {
      key: 'lastFmLogin',
      value: function lastFmLogin(username, password) {
        return this._put('lastfm/lastfm_login', { username: username, password: password });
      }
    },
    {
      key: 'scrobble',
      value: function scrobble(id) {
        return this._put('lastfm/scrobble', { id: id, submission: 'true' });
      }
    },
    {
      key: 'scrobbleNowPlaying',
      value: function scrobbleNowPlaying(id) {
        return this._put('lastfm/scrobble', { id: id, submission: 'false' });
      }
    },
    ]);

    return AlloyApi;
  }();

  return AlloyApi;
}();