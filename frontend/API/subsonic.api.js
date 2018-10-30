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

window.SubsonicAPI = function () {
  function md5cycle(x, k) {
    var a = x[0],
      b = x[1],
      c = x[2],
      d = x[3];

    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);

    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);

    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);

    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);

    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
  }

  function cmn(q, a, b, x, s, t) {
    a = add32(add32(a, q), add32(x, t));
    return add32(a << s | a >>> 32 - s, b);
  }

  function ff(a, b, c, d, x, s, t) {
    return cmn(b & c | ~b & d, a, b, x, s, t);
  }

  function gg(a, b, c, d, x, s, t) {
    return cmn(b & d | c & ~d, a, b, x, s, t);
  }

  function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }

  function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  function md51(s) {
    var txt = '';
    var n = s.length,
      state = [1732584193, -271733879, -1732584194, 271733878],
      i = void 0;
    for (i = 64; i <= s.length; i += 64) {
      md5cycle(state, md5blk(s.substring(i - 64, i)));
    }
    s = s.substring(i - 64);
    var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < s.length; i++) {
      tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
    }
    tail[i >> 2] |= 0x80 << (i % 4 << 3);
    if (i > 55) {
      md5cycle(state, tail);
      for (i = 0; i < 16; i++) {
        tail[i] = 0;
      }
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return state;
  }

  /* there needs to be support for Unicode here,
   * unless we pretend that we can redefine the MD-5
   * algorithm for multi-byte characters (perhaps
   * by adding every four 16-bit characters and
   * shortening the sum to 32 bits). Otherwise
   * I suggest performing MD-5 as if every character
   * was two bytes--e.g., 0040 0025 = @%--but then
   * how will an ordinary MD-5 sum be matched?
   * There is no way to standardize text to something
   * like UTF-8 before transformation; speed cost is
   * utterly prohibitive. The JavaScript standard
   * itself needs to look at this: it should start
   * providing access to strings as preformed UTF-8
   * 8-bit unsigned value arrays.
   */
  function md5blk(s) {
    /* I figured global was faster.   */
    var md5blks = [],
      i = void 0; /* Andy King said do it this way. */
    for (i = 0; i < 64; i += 4) {
      md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
    }
    return md5blks;
  }

  var hex_chr = '0123456789abcdef'.split('');

  function rhex(n) {
    var s = '',
      j = 0;
    for (; j < 4; j++) {
      s += hex_chr[n >> j * 8 + 4 & 0x0F] + hex_chr[n >> j * 8 & 0x0F];
    }
    return s;
  }

  function hex(x) {
    for (var i = 0; i < x.length; i++) {
      x[i] = rhex(x[i]);
    }
    return x.join('');
  }

  function md5(s) {
    return hex(md51(s));
  }

  /* this function is much faster,
  so if possible we use it. Some IEs
  are the only ones I know of that
  need the idiotic second function,
  generated by an if clause.  */

  function add32(a, b) {
    return a + b & 0xFFFFFFFF;
  }

  if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
    (function () {
      function add32(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF),
          msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return msw << 16 | lsw & 0xFFFF;
      }
    })();
  }

  String.prototype.hexEncode = function () {
    var r = '';
    var i = 0;
    var h = void 0;
    while (i < this.length) {
      h = this.charCodeAt(i++).toString(16);
      while (h.length < 2) {
        h = h;
      }
      r += h;
    }
    return 'enc:' + r;
  };

  var SubsonicAPI = function () {
    function SubsonicAPI(obj) {
      var _this = this;

      _classCallCheck(this, SubsonicAPI);

      if (typeof obj !== 'object') {
        throw new Error('Input must be an object & contain url, user, password & appName fields');
        return;
      }
      if (obj.hasOwnProperty('ip') && obj.hasOwnProperty('port') && obj.hasOwnProperty('user') && obj.hasOwnProperty('password') && obj.hasOwnProperty('appName') && obj.hasOwnProperty('https')) {
        if (!obj.md5Auth) {
          obj.md5Auth = true;
        }
        this.params = {
          u: obj.user,
          f: 'json',
          c: obj.appName
        };
        this._user = obj.user;
        this._md5Auth = obj.md5Auth;
        this._url = function () {
          var portString = void 0;
          switch (obj.port) {
            case 80:
              portString = '';
              break;
            case 443:
              portString = '';
              break;
            default:
              portString = '';
              break;
          }
          if (obj.https) {
            return 'https://' + obj.ip + portString;
          } else {
            return 'http://' + obj.ip + portString;
          }
        }();
        this._password = obj.password;
        this._fishVersion(this._url).then(function (version) {
          _this.params.v = version;
          _this.ping().then(function (res) {
            if (res.status === 'ok') {
              _this.getUserInfo().then(function (userInfo) {
                var responseEvent = new CustomEvent('subsonicApi-ready', {
                  detail: {
                    status: res.status,
                    user: userInfo
                  }
                });
                document.dispatchEvent(responseEvent);
              });
            } else {
              var responseEvent = new CustomEvent('subsonicApi-ready', {
                detail: {
                  status: res.status,
                  error: res.error.messsage
                }
              });
              document.dispatchEvent(responseEvent);
            }
          });
        }, function () {
          throw new TypeError('Error attempting to fetch subsonic version from given address');
        });
      } else {
        throw new TypeError('Input must be an object & contain url, user, password & appName fields');
        return;
      }
    }

    /**
     * conver object to url query string
     */


    _createClass(SubsonicAPI, [{
      key: '_toQueryString',
      value: function _toQueryString(params) {
        var r = [];
        for (var n in params) {
          n = encodeURIComponent(n);
          r.push(params[n] === null ? n : n + '=' + encodeURIComponent(params[n]));
        }
        return r.join('&');
      }

      /**
       * return subsonic api url
       *
       * @param {String} method
       * @param {Object} options
       */

    }, {
      key: '_buildUrl',
      value: function _buildUrl(method, options) {
        if (options !== null && typeof options === 'object') {
          options = '&' + this._toQueryString(options);
        }
        if (!options) {
          options = '';
        }

        if (this._versionCompare(this.params.v, '1.13.0') >= 0 && this._md5Auth) {
          if (this.params.p) {
            delete this.params.p;
          }
          this.params.s = this._makeSalt(6);
          this.params.t = md5(this._password + this.params.s);
          return this._url + '/rest/' + method + '.view?' + this._toQueryString(this.params) + options;
        } else {
          if (this.params.t) {
            delete this.params.t;
          }
          if (this.params.s) {
            delete this.params.s;
          }
          this.params.p = this._password.hexEncode();
          return this._url + '/rest/' + method + '.view?' + this._toQueryString(this.params) + options;
        }
      }

      /**
       * send xmlHttpRequest to the given url
       *
       * @param {String} url
       */

    }, {
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

      /**
       * generates a string of the given length
       *
       * @param {Number} length
       */

    }, {
      key: '_makeSalt',
      value: function _makeSalt(length) {
        var text = "";
        var possible = "ABCD/EFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      }

      /**
       * ping given url to detect api version
       *
       * @param {String} url
       */

    }, {
      key: '_fishVersion',
      value: function _fishVersion(url) {
        var _this3 = this;

        return new Promise(function (resolve, reject) {
          _this3._xhr(url + '/rest/ping.view?f=json').then(function (e) {
            var res = e.target.response['subsonic-response'];
            resolve(res.version);
          }, reject);
        });
      }

      /**
       * compare 2 api versions ** I did not write this function **
       */

    }, {
      key: '_versionCompare',
      value: function _versionCompare(v1, v2, options) {
        if (v1 === undefined || v1 === '' || v2 === undefined || v2 === '') return 0;
        var lexicographical = options && options.lexicographical,
          zeroExtend = options && options.zeroExtend,
          v1parts = v1.split('.'),
          v2parts = v2.split('.');

        function isValidPart(x) {
          return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
        }
        if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
          return NaN;
        }
        if (zeroExtend) {
          while (v1parts.length < v2parts.length) {
            v1parts.push("0");
          }
          while (v2parts.length < v1parts.length) {
            v2parts.push("0");
          }
        }
        if (!lexicographical) {
          v1parts = v1parts.map(Number);
          v2parts = v2parts.map(Number);
        }
        for (var i = 0; i < v1parts.length; ++i) {
          if (v2parts.length == i) {
            return 1;
          }
          if (v1parts[i] == v2parts[i]) {
            continue;
          } else if (v1parts[i] > v2parts[i]) {
            return 1;
          } else {
            return -1;
          }
        }
        if (v1parts.length != v2parts.length) {
          return -1;
        }
        return 0;
      }

      /**
       * Get details about the user, including which authorization roles and folder access it has.
       * Can be used to enable/disable certain features in the client, such as jukebox control.
       */

    }, {
      key: 'getUserInfo',
      value: function getUserInfo() {
        var _this4 = this;

        return new Promise(function (resolve, reject) {
          var url = _this4._buildUrl('getUser', {
            username: _this4._user
          });
          _this4._xhr(url).then(function (e) {
            _this4.userPermissions = e.target.response['subsonic-response'].user;
            resolve(_this4.userPermissions);
          });
        });
      }

      /**
       * abort the last api call
       */

    }, {
      key: 'abort',
      value: function abort() {
        if (this._lastXhr) {
          this._lastXhr.abort();
        }
      }

      /**
       * Used to test connectivity with the server. Takes no extra parameters.
       */

    }, {
      key: 'ping',
      value: function ping() {
        var _this5 = this;

        return new Promise(function (resolve, reject) {
          var url = _this5._buildUrl('ping');
          _this5._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'];
            resolve(res);
          }, function (e) {
            reject(e);
          });
        });
      }

      /**
       *  without ID: Returns all playlists a user is allowed to play.
       * with ID: Returns a listing of files in a saved playlist.
       *
       * @param {Number} id
       */

    }, {
      key: 'getPlaylist',
      value: function getPlaylist(id) {
        var _this6 = this;

        return new Promise(function (resolve, reject) {
          var url = _this6._buildUrl(function () {
            if (id) {
              return 'getPlaylist';
            } else {
              return 'getPlaylists';
            }
          }(), function () {
            if (id) {
              return {
                id: id
              };
            } else {
              return;
            }
          }());
          _this6._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].playlists;
            resolve(function () {
              if (res.hasOwnProperty('playlist')) {
                return res.playlist;
              } else {
                return [];
              }
            }());
          }, reject);
        });
      }

      /**
       * Returns all configured top-level music folders. Takes no extra parameters.
       */

    }, {
      key: 'getMusicFolders',
      value: function getMusicFolders() {
        var _this7 = this;

        return new Promise(function (resolve, reject) {
          var url = _this7._buildUrl('getMusicFolders');
          _this7._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].musicFolders.musicFolder;
            resolve(res);
          }, reject);
        });
      }

      /**
       * Returns an indexed structure of all artists.
       *
       * @param {Number} id
       */

    }, {
      key: 'getIndexes',
      value: function getIndexes(id) {
        var _this8 = this;

        return new Promise(function (resolve, reject) {
          var url = _this8._buildUrl('getIndexes', function (id) {
            if (id) {
              return {
                musicFolderId: id
              };
            } else {
              return;
            }
          }(id));
          _this8._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].indexes.index;
            resolve(res);
          }, reject);
        });
      }

      /**
       * Returns a listing of all files in a music directory.
       * Typically used to get list of albums for an artist, or list of songs for an album.
       *
       * @param {Number} id
       */

    }, {
      key: 'getMusicDirectory',
      value: function getMusicDirectory(id) {
        var _this9 = this;

        return new Promise(function (resolve, reject) {
          if (!id) {
            throw new Error('id required');
            return;
          }
          var url = _this9._buildUrl('getMusicDirectory', {
            id: id
          });
          _this9._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].directory;
            resolve(res);
          }, reject);
        });
      }
    }, {
      key: 'getArtists',
      value: function getArtists() {
        var _this10 = this;

        return new Promise(function (resolve, reject) {
          var url = _this10._buildUrl('getArtists');
          _this10._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].artists.index;
            resolve(res);
          });
        });
      }

      /**
       * without id: Similar to getIndexes, but organizes music according to ID3 tags.
       * with id: Returns details for an artist, including a list of albums. This method organizes music according to ID3 tags.
       *
       * @param {Number} id
       */

    }, {
      key: 'getArtist',
      value: function getArtist(id) {
        var _this11 = this;

        return new Promise(function (resolve, reject) {
          var url = _this11._buildUrl('getArtist', {
            id: id
          });
          _this11._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].artist;
            if (res.album) {
              res.album.sort(function sorting(a, b) {
                return a.discNumber - b.discNumber || a.track - b.track;
              });
            }
            resolve(res);
          });
        });
      }

      /**
       * Streams a given media file.
       *
       * @param {Number} id
       * @param {Number} bitRate
       */

    }, {
      key: 'streamUrl',
      value: function streamUrl(id, bitRate) {
        if (!id) {
          throw new Error('id required');
          return;
        }
        return this._buildUrl('stream', {
          id: id,
          maxBitRate: bitRate || 320,
          estimateContentLength: false
        });
      }

      /**
       * Downloads a given media file.
       * Similar to stream, but this method returns the original media data without transcoding or downsampling.
       *
       * @param {Number} id
       */

    }, {
      key: 'downloadUrl',
      value: function downloadUrl(id) {
        if (!id) {
          throw new Error('id required');
          return;
        }
        return this._buildUrl('download', {
          id: id
        });
      }

      /**
       * Returns top songs for the given artist, using data from last.fm.
       *
       * @param {Number} count
       * @param {String} artist
       */

    }, {
      key: 'getTopSongs',
      value: function getTopSongs(artist, count) {
        var _this12 = this;

        return new Promise(function (resolve, reject) {
          if (!artist) throw new Error('artist name is required');
          var url = _this12._buildUrl('getTopSongs', {
            count: count || 50,
            artist: artist
          });
          _this12._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].topSongs.song;
            resolve(res);
          }, reject);
        });
      }

      /**
       * Returns all genres.
       */

    }, {
      key: 'getGenres',
      value: function getGenres() {
        var _this13 = this;

        return new Promise(function (resolve, reject) {
          var url = _this13._buildUrl('getGenres');
          _this13._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].genres.genre;
            resolve(res);
          }, reject);
        });
      }

      /**
       * Returns details for an album, including a list of songs.
       * This method organizes music according to ID3 tags.
       *
       * @param {Number} id
       */

    }, {
      key: 'getAlbum',
      value: function getAlbum(id) {
        var _this14 = this;

        return new Promise(function (resolve, reject) {
          if (!id) {
            throw new Error('id required');
            return;
          }
          var url = _this14._buildUrl('getAlbum', {
            id: id
          });
          _this14._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].album;
            resolve(res);
          }, reject);
        });
      }

      /**
       * Returns a list of random, newest, highest rated etc. albums.
       * Similar to the album lists on the home page of the Subsonic web interface.
       *
       * @param {String} sort
       * @param {Number} count
       * @param {Number} offset
       * @param {Number} folderId
       */

    }, {
      key: 'getAlbumInfo',
      value: function getAlbumInfo(id) {
        var _this14 = this;

        return new Promise(function (resolve, reject) {
          if (!id) {
            throw new Error('id required');
          }
          var url = _this14._buildUrl('getAlbumInfo', {
            id: id
          });
          _this14._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].albumInfo;
            resolve(res);
          }, reject);
        });
      }

      /**
       * Returns a list of random, newest, highest rated etc. albums.
       * Similar to the album lists on the home page of the Subsonic web interface.
       *
       * @param {String} sort
       * @param {Number} count
       * @param {Number} offset
       * @param {Number} folderId
       */

    }, {
      key: 'getAlbumInfo2',
      value: function getAlbumInfo2(id) {
        var _this14 = this;

        return new Promise(function (resolve, reject) {
          if (!id) {
            throw new Error('id required');
            return;
          }
          var url = _this14._buildUrl('getAlbumInfo2', {
            id: id
          });
          _this14._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].albumInfo;
            resolve(res);
          }, reject);
        });
      }

      /**
       * Returns a list of random, newest, highest rated etc. albums.
       * Similar to the album lists on the home page of the Subsonic web interface.
       *
       * @param {String} sort
       * @param {Number} count
       * @param {Number} offset
       * @param {Number} folderId
       */

    }, {
      key: 'getAlbumList',
      value: function getAlbumList(sort, count, offset, folderId) {
        var _this15 = this;

        return new Promise(function (resolve, reject) {
          if (sort) {
            var reqObj = {
              size: count || 60,
              offset: offset || 0,
              type: sort
            };
            if (folderId) reqObj.musicFolderId = folderId;
            var url = _this15._buildUrl('getAlbumList', reqObj);
            _this15._xhr(url).then(function (e) {
              var res = e.target.response['subsonic-response'].albumList.album;
              resolve(res);
            }, reject);
          } else {
            throw new Error('sort method required');
          }
        });
      }

      /**
       * Similar to getAlbumList, but organizes music according to ID3 tags.
       *
       * @param {String} sort
       * @param {Number} count
       * @param {Number} offset
       * @param {Number} folderId
       */

    }, {
      key: 'getAlbumList2',
      value: function getAlbumList2(sort, count, offset, folderId) {
        var _this16 = this;

        return new Promise(function (resolve, reject) {
          if (sort) {
            var reqObj = {
              size: count || 60,
              offset: offset || 0,
              type: sort
            };
            if (folderId) reqObj.musicFolderId = folderId;
            var url = _this16._buildUrl('getAlbumList2', reqObj);
            _this16._xhr(url).then(function (e) {
              var res = e.target.response['subsonic-response'].albumList2.album;
              resolve(res);
            }, reject);
          } else {
            throw new Error('sort method required');
          }
        });
      }

      /**
       *  Returns artist info with biography, image URLs and similar artists, using data from last.fm.
       *
       * @param {Number} id
       * @param {Number} count
       */

    }, {
      key: 'getArtistInfo',
      value: function getArtistInfo(id, count) {
        var _this17 = this;

        return new Promise(function (resolve, reject) {
          if (!id) {
            var err = new Error('id required');
            throw err;
            reject(err);
            return;
          }
          var url = _this17._buildUrl('getArtistInfo', {
            id: id,
            count: count || 60
          });
          _this17._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].artistInfo;
            resolve(res);
          }, reject);
        });
      }

      /**
       * Similar to getArtistInfo, but organizes music according to ID3 tags.
       *
       * @param {Number} id
       * @param {Number} count
       */

    }, {
      key: 'getArtistInfo2',
      value: function getArtistInfo2(id, count) {
        var _this18 = this;

        return new Promise(function (resolve, reject) {
          if (!id) {
            var err = new Error('id required');
            throw err;
            reject(err);
            return;
          };
          var url = _this18._buildUrl('getArtistInfo2', {
            id: id,
            count: count || 60
          });
          _this18._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].artistInfo2;
            resolve(res);
          }, reject);
        });
      }

      /**
       *  Returns a random collection of songs from the given artist and similar artists, using data from last.fm.
       *  Typically used for artist radio features.
       *
       * @param {Number} id
       * @param {Number} count
       */

    }, {
      key: 'getSimilarSongs',
      value: function getSimilarSongs(id, count) {
        var _this19 = this;

        return new Promise(function (resolve, reject) {
          if (!id) {
            var err = new Error('id required');
            throw err;
            reject(err);
            return;
          }
          var url = _this19._buildUrl('getSimilarSongs', {
            id: id,
            count: count || 60
          });
          _this19._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].similarSongs;
            resolve(res);
          }, reject);
        });
      }

      /**
       * Similar to getSimilarSongs, but organizes music according to ID3 tags.
       *
       * @param {Number} id
       * @param {Number} count
       */

    }, {
      key: 'getSimilarSongs2',
      value: function getSimilarSongs2(id, count) {
        var _this20 = this;

        return new Promise(function (resolve, reject) {
          if (!id) {
            var err = new Error('id required');
            throw err;
            reject(err);
            return;
          }
          var url = _this20._buildUrl('getSimilarSongs2', {
            id: id,
            count: count || 60
          });
          _this20._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].similarSongs2;
            resolve(res);
          }, reject);
        });
      }

      /**
       * Returns details for a song.
       *
       * @param {Number} id
       */

    }, {
      key: 'getSong',
      value: function getSong(id) {
        var _this21 = this;

        return new Promise(function (resolve, reject) {
          if (!id) {
            var err = new Error('id required');
            throw err;
            reject(err);
            return;
          }
          var url = _this21._buildUrl('getSong', {
            id: id
          });
          _this21._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'];
            resolve(res);
          }, reject);
        });
      }

      /**
       * Returns starred songs, albums and artists.
       *
       * @param {Number} folderId
       */

    }, {
      key: 'getStarred',
      value: function getStarred(folderId) {
        var _this11 = this;

        return new Promise(function (resolve, reject) {
          var url = _this11._buildUrl('getStarred');
          _this11._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].starred;

            resolve(res);
          }, reject);
        });


      }

      /**
       * Similar to getStarred, but organizes music according to ID3 tags.
       *
       * @param {Number} folderId
       */

    }, {
      key: 'getStarred2',
      value: function getStarred2(folderId) {
        var _this23 = this;

        return new Promise(function (resolve, reject) {
          var url = _this23._buildUrl('getStarred2', function () {
            if (folderId) {
              return {
                musicFolderId: folderId
              };
            } else {
              return;
            }
          }());
          _this23._xhr(url).then(function (e) {
            var res = e.target.resolve['subsonic-response'].starred2;
            resolve(res);
          }, reject);
        });
      }

      /**
       * Returns cover art as a blob
       *
       * @param {Number} id
       * @param {Number} size - max image size in px
       */

    }, {
      key: 'getCoverArt',
      value: function getCoverArt(id, size) {
        var _this24 = this;

        return new Promise(function (resolve, reject) {
          if (!id) {
            var err = new Error('id required');
            throw err;
            reject(err);
            return;
          }
          var url = _this24._buildUrl('getCoverArt', {
            id: id,
            size: size || 500
          });
          resolve(url);
        });
      }

      /**
       * Attaches a star to a song, album or artist.
       *
       * @param {Number} id
       */

    }, {
      key: 'star',
      value: function star(id) {
        var _this25 = this;

        return new Promise(function (resolve, reject) {
          if (!id) {
            var err = new Error('id required');
            throw err;
            reject(err);
            return;
          }
          var url = _this25._buildUrl('star', {
            id: id
          });
          _this25._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'];
            resolve(res);
          }, reject);
        });
      }

      /**
       * Removes the star from a song, album or artist.
       *
       * @param {Number} id
       */

    }, {
      key: 'unstar',
      value: function unstar(id) {
        var _this26 = this;

        return new Promise(function (resolve, reject) {
          if (!id) {
            var err = new Error('id required');
            throw err;
            reject(err);
            return;
          }
          var url = _this26._buildUrl('unstar', {
            id: id
          });
          _this26._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'];
            resolve(res);
          }, reject);
        });
      }

      /**
       * Sets the rating for a music file.
       *
       * @param {Number} id
       * @param {Number} rating
       */

    }, {
      key: 'setRating',
      value: function setRating(id, rating) {
        var _this27 = this;

        return new Promise(function (resolve, reject) {
          if (!id) {
            var err = new Error('id required');
            throw err;
            reject(err);
            return;
          }
          var url = _this27._buildUrl('setRating', {
            id: id,
            rating: rating
          });
          _this27._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'];
            resolve(res);
          }, reject);
        });
      }

      /**
       * "Scrobbles" a given music file on last.fm.
       * Requires that the user has configured his/her last.fm credentials on the Subsonic server (Settings > Personal).
       *
       * @param {Number} id
       */

    }, {
      key: 'scrobble',
      value: function scrobble(id) {
        var _this28 = this;

        return new Promise(function (resolve, reject) {
          if (!id) {
            var err = new Error('id required');
            throw err;
            reject(err);
            return;
          }
          var url = _this28._buildUrl('scrobble', {
            id: id,
            time: new Date().getTime()
          });
          _this28._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'];
            resolve(res);
          }, reject);
        });
      }

      /**
       * Returns a listing of files matching the given search criteria. Supports paging through the result.
       *
       * @param {Object} obj - a object wihsearch params
       */

    }, {
      key: 'search',
      value: function search(obj) {
        var _this29 = this;

        return new Promise(function (resolve, reject) {
          if (!obj) {
            var err = new Error('search object required');
            reject(err);
            return;
          }
          var url = _this29._buildUrl('search', obj);
          _this29._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].searchResult.match;
            resolve(res);
          }, reject);
        });
      }

      /**
       * Returns albums, artists and songs matching the given search criteria. Supports paging through the result.
       *
       * @param {Object} obj - a object wihsearch params
       */

    }, {
      key: 'search2',
      value: function search2(obj) {
        var _this30 = this;

        return new Promise(function (resolve, reject) {
          if (!obj) {
            var err = new Error('search object required');
            reject(err);
            return;
          }
          var url = _this30._buildUrl('search2', obj);
          _this30._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].search2Result.match;
            resolve(res);
          }, reject);
        });
      }

      /**
       *
       *
       * @param {Object} obj - a object wihsearch params
       */

    }, {
      key: 'search3',
      value: function search3(obj) {
        var _this31 = this;

        return new Promise(function (resolve, reject) {
          if (!obj) {
            var err = new Error('search object required');
            reject(err);
            return;
          }
          var url = _this31._buildUrl('search3', obj);
          _this31._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].search3Result.match;
            resolve(res);
          }, reject);
        });
      }
    },
    {
      key: 'startScan',
      value: function startScan() {
        var _this32 = this;

        return new Promise(function (resolve, reject) {
          var url = _this32._buildUrl('startScan');
          _this32._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].scanStatus;
            resolve(res);
          }, reject);
        });
      }

      /**
       *
       *
       * @param {Object} obj - a object wihsearch params
       */

    },
    {
      key: 'getScanStatus',
      value: function getScanStatus() {
        var _this33 = this;

        return new Promise(function (resolve, reject) {
          var url = _this33._buildUrl('getScanStatus');
          _this33._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].scanStatus;
            resolve(res);
          }, reject);
        });
      }

      /**
       *
       *
       * @param {Object} obj - a object wihsearch params
       */

    },
    {
      key: 'createShare',
      value: function createShare(id, description, expires) {
        var _this33 = this;
        if (!id) {
          throw new Error('id required');
          return;
        }
        return new Promise(function (resolve, reject) {
          var url = _this33._buildUrl('createShare', {
            id: id,
            description: description || '',
            expires: expires || null
          });
          _this33._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].shares.share[0];
            resolve(res);
          }, reject);
        });
      }

      /**
       *
       *
       * @param {Object} obj - a object wihsearch params
       */

    },
    {
      key: 'getSongsByGenre',
      value: function getSongsByGenre(genre, count, offset) {
        var _this34 = this;
        if (!genre) {
          throw new Error('genre required');
          return;
        }
        return new Promise(function (resolve, reject) {
          var url = _this34._buildUrl('getSongsByGenre', {
            genre: genre,
            count: count || 500,
            offset: offset || 0
          });
          _this34._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].songsByGenre;
            resolve(res);
          }, reject);
        });
      }

      /**
       *
       *
       * @param {Object} obj - a object wihsearch params
       */

    },
    {
      key: 'getRandomSongs',
      value: function getRandomSongs(size, genre, fromYear, toYear) {
        var _this35 = this;

        return new Promise(function (resolve, reject) {
          var url = _this35._buildUrl('getRandomSongs', {
            size: size || 10

          });
          _this35._xhr(url).then(function (e) {
            var res = e.target.response['subsonic-response'].randomSongs;
            resolve(res);
          }, reject);
        });
      }

      /**
       *
       *
       * @param {Object} obj - a object wihsearch params
       */

    }
    ]);

    return SubsonicAPI;
  }();

  return SubsonicAPI;
}();
//# sourceMappingURL=subsonic-api.js.map