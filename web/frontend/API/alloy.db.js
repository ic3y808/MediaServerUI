export default class AlloyApi {
  constructor(obj) {
    if (typeof obj !== "object") {
      throw new Error("Input must be an object & contain url & apikey");
    }
    if (obj.hasOwnProperty("alloydb_host") && obj.hasOwnProperty("alloydb_port") && obj.hasOwnProperty("alloydb_apikey")) {

    } else {
      throw new TypeError("Input must be an object & contain url and apikey fields");
    }

    this._settings = obj;
  }

  _toQueryString(params) {
    var r = [];
    for (var n in params) {
      n = encodeURIComponent(n);
      r.push(params[n] === null ? n : n + "=" + encodeURIComponent(params[n]));
    }
    return r.join("&");
  }

  _buildUrl(method, options) {
    if (options !== null && typeof options === "object") {
      options = "&" + this._toQueryString(options);
    }
    if (!options) {
      options = "";
    }

    if (this._settings.alloydb_use_ssl) { this._url = "https://"; }
    else { this._url = "http://"; }

    this._url += this._settings.alloydb_host;
    if (this._settings.alloydb_include_port_in_url) { this._url += ":" + this._settings.alloydb_port; }
    return this._url + "/api/v1/" + method + "?" + this._toQueryString(this.params) + options;

  }

  _xhr(url, dataType) {
    var _this2 = this;

    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.responseType = dataType || "json";
      xhr.onload = resolve;
      xhr.onerror = reject;
      xhr.send();
      _this2._lastXhr = xhr;
    });
  }

  _xhrput(url, dataType) {
    var _this2 = this;

    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.open("PUT", url, true);
      xhr.responseType = dataType || "json";
      xhr.onload = resolve;
      xhr.onerror = reject;
      xhr.send();
      _this2._lastXhr = xhr;
    });
  }

  _xhrpost(url, data, dataType) {
    var _this2 = this;

    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      //xhr.responseType = dataType || "json";
      xhr.onload = resolve;
      xhr.onerror = reject;
      var formData = new FormData();
      formData.append("data", data);
      xhr.send(formData);
      _this2._lastXhr = xhr;
    });
  }

  _xhrdel(url, dataType) {
    var _this2 = this;

    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.open("DELETE", url, true);
      xhr.responseType = dataType || "json";
      xhr.onload = resolve;
      xhr.onerror = reject;
      xhr.send();
      _this2._lastXhr = xhr;
    });
  }

  _get(method, options) {
    var opt = {};
    Object.assign(opt, {
      api_key: this._settings.alloydb_apikey
    }, options);
    return new Promise((resolve, reject) => {
      var url = this._buildUrl(method, opt);
      this._xhr(url).then((e) => {
        var res = e.target.response;
        resolve(res);
      }, (e) => {
        reject(e);
      });
    });
  }

  _put(method, options) {
    var opt = {};
    Object.assign(opt, {
      api_key: this._settings.alloydb_apikey
    }, options);
    return new Promise((resolve, reject) => {
      var url = this._buildUrl(method, opt);
      this._xhrput(url).then((e) => {
        var res = e.target.response;
        resolve(res);
      }, (e) => {
        reject(e);
      });
    });
  }

  _post(method, data, options) {
    var opt = {};
    Object.assign(opt, {
      api_key: this._settings.alloydb_apikey
    }, options);
    return new Promise((resolve, reject) => {
      var url = this._buildUrl(method, opt);
      this._xhrpost(url, data).then((e) => {
        var res = e.target.response;
        resolve(res);
      }, (fe) => {
        reject(fe);
      });
    });
  }


  _delete(method, options) {
    var opt = {};
    Object.assign(opt, {
      api_key: this._settings.alloydb_apikey
    }, options);
    return new Promise((resolve, reject) => {
      var url = this._buildUrl(method, opt);
      this._xhrdel(url).then((e) => {
        var res = e.target.response;
        resolve(res);
      }, (e) => {
        reject(e);
      });
    });
  }

  ping() {
    return this._get("system/ping");
  }

  getSchedulerStatus() {
    return this._get("system/scheduler");
  }

  getLibraryInfo() {
    return this._get("system/stats");
  }

  getMediaPaths() {
    return this._get("config/mediapaths");
  }

  addMediaPath(mediaPath) {
    return this._put("config/mediapaths", mediaPath);
  }

  removeMediaPath(mediaPath) {
    return this._delete("config/mediapaths", mediaPath);
  }

  getFileList(path) {
    return this._get("config/file_list", {
      path: path
    });
  }

  getFileParent(path) {
    return this._get("config/file_parent", {
      path: path
    });
  }

  getArtistsIndex() {
    return this._get("browse/artists_index");
  }

  getRandomSongs() {
    return this._get("browse/random_songs");
  }

  getFresh(limit) {
    return this._get("browse/fresh", {
      limit: limit
    });
  }

  getStarred() {
    return this._get("browse/starred");
  }

  getHistory() {
    return this._get("browse/history");
  }

  getArtists() {
    return this._get("browse/artists");
  }

  getAlbums() {
    return this._get("browse/albums");
  }

  getAlbum(id) {
    return this._get("browse/album", { id });
  }

  getGenre(id) {
    return this._get("browse/genre", {
      id: id
    });
  }

  getGenres() {
    return this._get("browse/genres");
  }

  getArtist(id) {
    return this._get("browse/artist", {
      id: id
    });
  }

  getArtistInfo(artist) {
    return this._get("lastfm/artist_info", {
      artist: artist
    });
  }

  getAlbumInfo(artist, album) {
    return this._get("lastfm/album_info", {
      artist: artist,
      album: album
    });
  }

  getTrackInfo(id) {
    return this._get("lastfm/track_info", {
      id: id
    });
  }

  getGenreInfo(genre) {
    return this._get("lastfm/genre_info", {
      genre: genre
    });
  }

  scanStart() {
    return this._get("system/scan_start");
  }

  scanStatus() {
    return this._get("system/scan_status");
  }

  scanCancel() {
    return this._get("system/scan_cancel");
  }

  backup() {
    return this._get("system/do_backup");
  }

  restore(data) {
    return this._post("system/do_restore", data);
  }

  getCharts() {
    return this._get("browse/charts");
  }

  search(query) {
    return this._get("search", {
      any: query
    });
  }

  addPlay(id) {
    return this._put("annotation/add_play", { id });
  }

  addHistory(data) {
    return this._put("browse/history", data);
  }

  getPlaylist(id) {
    return this._get("playlist", { id });
  }

  getPlaylists() {
    return this._get("playlist/playlists");
  }

  addPlaylist(data) {
    return this._put("playlist/playlists", data);
  }

  updatePlaylist(data) {
    return this._put("playlist/playlists", data);
  }

  removePlaylist(data) {
    return this._delete("playlist/playlists", data);
  }

  love(params) {
    return this._put("lastfm/love", params);
  }

  unlove(params) {
    return this._delete("lastfm/love", params);
  }

  star(params) {
    return this._put("annotation/star", params);
  }

  unstar(params) {
    return this._put("annotation/unstar", params);
  }

  setRating(params) {
    return this._put("annotation/set_rating", params);
  }

  stream(id, quality) {
    return this._buildUrl("media/stream", {
      api_key: this._settings.alloydb_apikey,
      id,
      quality
    });
  }

  download(id, quality) {
    return this._buildUrl("media/download", {
      api_key: this._settings.alloydb_apikey,
      id
    });
  }

  getCoverArt(params) {
    Object.assign(params, { api_key: this._settings.alloydb_apikey });
    return this._buildUrl("media/cover_art", params);

  }

  scrobble(id) {
    return this._put("lastfm/scrobble", {
      id,
      submission: "true"
    });
  }

  scrobbleNowPlaying(id) {
    return this._put("lastfm/scrobble", {
      id,
      submission: "false"
    });
  }
}