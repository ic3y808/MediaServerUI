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
        console.log(obj);

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
      key: 'ping',
      value: function ping() {
        var _that = this;
        return new Promise(function (resolve, reject) {
          var url = _that._buildUrl('system/ping', { api_key: _that._settings.alloydb_apikey });
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
      key: 'getLibraryInfo',
      value: function getLibraryInfo() {
        var _that = this;
        return new Promise(function (resolve, reject) {
          var url = _that._buildUrl('system/stats', { api_key: _that._settings.alloydb_apikey });
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
      key: 'getMediaPaths',
      value: function getLibraryInfo() {
        var _that = this;
        return new Promise(function (resolve, reject) {
          var url = _that._buildUrl('config/mediapaths', { api_key: _that._settings.alloydb_apikey });
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
      key: 'getMusicFolders',
      value: function getMusicFolders() {
        var _that = this;
        return new Promise(function (resolve, reject) {
          var url = _that._buildUrl('browse/music_folders', { api_key: _that._settings.alloydb_apikey });
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
      key: 'getGenres',
      value: function getGenres() {
        var _that = this;
        return new Promise(function (resolve, reject) {
          var url = _that._buildUrl('browse/genres', { api_key: _that._settings.alloydb_apikey });
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
      key: 'getSongsByGenre',
      value: function getSongsByGenre(id) {
        var _that = this;
        return new Promise(function (resolve, reject) {
          var url = _that._buildUrl('list/songs_by_genre', { api_key: _that._settings.alloydb_apikey, id: id });
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
      key: 'getArtist',
      value: function getArtist(id) {
        var _that = this;
        return new Promise(function (resolve, reject) {
          var url = _that._buildUrl('browse/artist', { api_key: _that._settings.alloydb_apikey, id: id });
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
      key: 'getArtistInfo',
      value: function getArtistInfo(artist) {
        var _that = this;
        return new Promise(function (resolve, reject) {
          var url = _that._buildUrl('lastfm/artist_info', { api_key: _that._settings.alloydb_apikey, artist: artist });
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
      key: 'getTrackInfo',
      value: function getTrackInfo(id) {
        var _that = this;
        return new Promise(function (resolve, reject) {
          var url = _that._buildUrl('lastfm/track_info', { api_key: _that._settings.alloydb_apikey, id: id });
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
      key: 'scanStart',
      value: function scanStart() {
        var _that = this;
        return new Promise(function (resolve, reject) {
          var url = _that._buildUrl('system/start_scan', { api_key: _that._settings.alloydb_apikey });
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
      key: 'scanStatus',
      value: function scanStatus() {
        var _that = this;
        return new Promise(function (resolve, reject) {
          var url = _that._buildUrl('system/scan_status', { api_key: _that._settings.alloydb_apikey });
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
      key: 'scanCancel',
      value: function scanCancel() {
        var _that = this;
        return new Promise(function (resolve, reject) {
          var url = _that._buildUrl('system/cancel_scan', { api_key: _that._settings.alloydb_apikey });
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
      key: 'search',
      value: function search(query) {
        var _that = this;
        return new Promise(function (resolve, reject) {
          var url = _that._buildUrl('search', { api_key: _that._settings.alloydb_apikey, any: query });
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
      key: 'stream',
      value: function stream(id, quality) {
        return this._buildUrl('media/stream', { api_key: this._settings.alloydb_apikey, id: id, quality: quality })
      }
    },
    ]);

    return AlloyApi;
  }();

  return AlloyApi;
}();
//# sourceMappingURL=subsonic-api.js.map