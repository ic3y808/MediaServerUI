var http = require("http");
var crypto = require("crypto");
var xml2js = require("xml2js");
var querystring = require("querystring");

class LastFM {

  _getInfo(opt) {
    try {
      if (typeof opt.callback !== "function") {
        opt.callback({
          "@": { status: "error" },
          error: { "#": "Function not specified." }
        });
      } else {
        var method = "";
        var params = "";
        if (opt.track !== undefined && opt.track !== "") {
          method = "track";
          params = "&track=" + encodeURIComponent(opt.track);
        } else if (opt.artist !== undefined && opt.artist !== "" && (opt.album === undefined || opt.album === "")) {
          method = "artist";
        } else if (opt.album !== undefined && opt.album !== "" && opt.album !== undefined && opt.album !== "") {
          method = "album";
          params = "&album=" + encodeURIComponent(opt.album);
        } else if (opt.genre !== undefined && opt.genre !== "") {
          method = "tag";
          params = "&tag=" + encodeURIComponent(opt.genre);
        }

        http.get({
          host: "ws.audioscrobbler.com",
          port: 80,
          timeout: 3000,
          path: "/2.0/?method=" + method + ".getinfo&api_key=" + this.api_key + "&autocorrect=1&username=" + this.username + "&artist=" + encodeURIComponent(opt.artist) + params
        }, function (res) {
          var body = "";
          res.on("data", function (chunk) {
            body += chunk;
          });
          res.on("end", function () {
            var parser = new xml2js.Parser(xml2js.defaults["0.1"]);
            parser.parseString(body, function (err, result) {
              if (typeof opt.callback === "function") {
                opt.callback(result);
              }
            });
          });
        });
      }
    } catch (e) {
      if (this.debug) { console.log("Exception getting track info: ", e); }
    }
  }

  now() {
    return new Date().getTime();
  }

  md5(string) {
    return crypto.createHash("md5").update(string, "utf8").digest("hex");
  }

  login(options) {
    options = options || {};
    this.debug = options.debug || false;

    this.api_key = options.api_key;
    if (options.api_secret !== undefined && options.api_secret !== "") { this.api_secret = options.api_secret; }
    if (options.username !== undefined && options.username !== "") { this.username = options.username; }
    if (options.password !== undefined && options.password !== "") { this.password = options.password; }
    if (options.session_key !== undefined && options.session_key !== "") { this.session_key = options.session_key; }
    if (options.authToken !== undefined && options.authToken !== "") { this.authToken = options.authToken; }
  }

  getSessionKey(callback) {
    var authToken = this.authToken ? this.authToken : this.md5(this.username + this.md5(this.password));
    var sig = "api_key" + this.api_key + "authToken" + authToken + "methodauth.getMobileSessionusername" + this.username + this.api_secret;
    var api_sig = this.md5(sig);
    var lastfmObj = this;
    http.get({
      host: "ws.audioscrobbler.com",
      port: 80,
      path: "/2.0/?method=auth.getMobileSession&" +
        "username=" + this.username + "&" +
        "authToken=" + authToken + "&" +
        "api_key=" + this.api_key + "&" +
        "api_sig=" + api_sig
    }, function (res) {
      var body = "";
      res.on("data", function (chunk) {
        body += chunk;
      });
      res.on("end", function () {
        try {
          var parser = new xml2js.Parser(xml2js.defaults["0.1"]);
          parser.parseString(body, function (err, result) {
            var ret = {
              success: result && result["@"].status === "ok"
            };
            if (ret.success) {
              ret.session_key = result.session.key;
              lastfmObj.session_key = result.session.key;
            } else { ret.error = result.error["#"]; }
            if (typeof callback === "function") {
              callback(ret);
            }
          });
        } catch (e) {
          if (lastfmObj.debug) { console.log("Exception: ", e); }
        }
      });
    });
  }

  scrobbleTrack(opt) {
    Object.assign(opt || {}, { method: "track.scrobble" });
    this.doScrobble(opt);
  }

  loveTrack(opt) {
    Object.assign(opt || {}, { method: "track.love" });
    this.doScrobble(opt);
  }

  unloveTrack(opt) {
    Object.assign(opt || {}, { method: "track.unlove" });
    this.doScrobble(opt);
  }

  scrobbleNowPlayingTrack(opt) {
    Object.assign(opt || {}, { method: "track.updateNowPlaying" });
    this.doScrobble(opt);
  }

  addTrackTags(opt) {
    Object.assign(opt || {}, { method: "track.addTags" });
    this.doScrobble(opt);
  }

  doScrobble(options) {
    if (this.debug) { console.log("Starting scrobbleTrack: ", options); }
    options = options || {};
    if ((this.api_secret === undefined || this.api_secret === "") && typeof options.callback === "function") {
      options.callback({
        success: false,
        error: "API Secret not specified."
      });
    }
    if ((this.username === undefined || this.username === "") && typeof options.callback === "function") {
      options.callback({
        success: false,
        error: "Username not specified."
      });
    }
    if (((this.password === undefined || this.password === "") && !this.authToken) && typeof options.callback === "function") {
      options.callback({
        success: false,
        error: "Password not specified."
      });
    }

    options.timestamp = options.timestamp ? Math.floor(options.timestamp) : Math.floor(this.now() / 1000);

    if (this.debug) { console.log("Using session key: " + this.session_key + "\n\n"); }
    var sig = "api_key" + this.api_key + "artist" + options.artist + "method" + options.method + "sk" + this.session_key + (options.tags ? "tags" + options.tags : "") + "timestamp" + options.timestamp + "track" + options.track + this.api_secret;
    var api_sig = this.md5(sig);

    var post_obj = {
      api_key: this.api_key,
      method: options.method,
      sk: this.session_key,
      api_sig: api_sig,
      timestamp: options.timestamp,
      artist: options.artist,
      track: options.track
    };

    if (options.tags) { post_obj.tags = options.tags; }
    var post_data = querystring.stringify(post_obj);

    //	console.log("post_data: ", post_data);

    var post_options = {
      host: "ws.audioscrobbler.com",
      port: "80",
      path: "/2.0/",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": post_data.length
      }
    };

    var post_req = http.request(post_options, function (res) {
      res.setEncoding("utf8");
      res.on("data", function (chunk) {
        //			console.log('Response: ' + chunk);
        var parser = new xml2js.Parser(xml2js.defaults["0.1"]);
        parser.parseString(chunk, function (err, result) {
          try {
            if (result && result["@"].status === "ok") {
              //						console.log("Track scrobbled (" + options.method + " )");
              if (typeof options.callback === "function") {
                options.callback({
                  success: true
                });
              }
            } else {
              if (typeof options.callback === "function") {
                options.callback({
                  success: false,
                  error: result.error["#"]
                });
              }
            }
          } catch (e) {
            if (this.debug) { console.log("Exception parsing scrobble result: ", e); }
          }
        });
      });
    });
    post_req.write(post_data);
    post_req.end();
  }

  getTrackInfo(opt) {
    opt = opt || {};
    if ((opt.artist === undefined || opt.artist === "") && typeof opt.callback === "function") {
      opt.callback({
        success: false,
        error: "Artist not specified."
      });
    } else if ((opt.track === undefined || opt.track === "") && typeof opt.callback === "function") {
      opt.callback({
        success: false,
        error: "Track not specified."
      });
    } else if (typeof opt.callback === "function") {
      var the_callback = opt.callback;
      this._isTheMethodCaller = true;
      Object.assign(opt || {}, {
        callback: function (result) {
          this._isTheMethodCaller = false;
          if (result && result["@"].status === "ok") {
            the_callback({
              success: true,
              trackInfo: result.track
            });
          } else {
            if (result && result.error) {
              the_callback({
                success: false,
                error: result.error["#"]
              });
            } else {
              if (result && result.error) {
                the_callback({
                  success: false,
                  error: result.error["#"]
                });
              } else {
                the_callback({
                  success: false,
                  error: "error"
                });
              }
            }

          }
        }
      });
      this._getInfo(opt);
    }
  }

  getArtistInfo(opt) {
    opt = opt || {};
    opt.track = "";
    if ((opt.artist === undefined || opt.artist === "") && typeof opt.callback === "function") {
      opt.callback({
        success: false,
        error: "Artist not specified."
      });
    } else if (typeof opt.callback === "function") {
      var the_callback = opt.callback;
      this._isTheMethodCaller = true;
      Object.assign(opt || {}, {
        callback: function (result) {
          this._isTheMethodCaller = false;
          if (result && result["@"].status === "ok") {
            the_callback({
              success: true,
              artistInfo: result.artist
            });
          } else {
            if (result && result.error) {
              the_callback({
                success: false,
                error: result.error["#"]
              });
            } else {
              the_callback({
                success: false,
                error: "error"
              });
            }
          }
        }
      });
      this._getInfo(opt);
    }
  }

  getAlbumInfo(opt) {
    opt = opt || {};
    opt.track = "";
    if ((opt.artist === undefined || opt.artist === "") && (opt.album === undefined || opt.album === "") && typeof opt.callback === "function") {
      opt.callback({
        success: false,
        error: "Need to specify Artist and Album."
      });
    } else if (typeof opt.callback === "function") {
      var the_callback = opt.callback;
      this._isTheMethodCaller = true;
      Object.assign(opt || {}, {
        callback: function (result) {
          this._isTheMethodCaller = false;
          if (result && result["@"].status === "ok") {
            the_callback({
              success: true,
              albumInfo: result.album
            });
          } else {
            if (result && result.error) {
              the_callback({
                success: false,
                error: result.error["#"]
              });
            } else {
              the_callback({
                success: false,
                error: "error"
              });
            }
          }
        }
      });
      this._getInfo(opt);
    }
  }

  getGenreInfo(opt) {
    opt = opt || {};

    if ((opt.genre === undefined || opt.genre === "") && typeof opt.callback === "function") {
      opt.callback({
        success: false,
        error: "Need to specify Genre."
      });
    } else if (typeof opt.callback === "function") {
      var the_callback = opt.callback;
      this._isTheMethodCaller = true;
      Object.assign(opt || {}, {
        callback: function (result) {
          this._isTheMethodCaller = false;
          if (result && result["@"].status === "ok") {
            the_callback({
              success: true,
              genreInfo: result.tag
            });
          } else {
            if (result && result.error) {
              the_callback({
                success: false,
                error: result.error["#"]
              });
            } else {
              the_callback({
                success: false,
                error: "error"
              });
            }
          }
        }
      });
      this._getInfo(opt);
    }
  }

  getTags(opt) {
    var the_callback = opt.callback;
    this._isTheMethodCaller = true;
    Object.assign(opt || {}, {
      callback: function (result) {
        this._isTheMethodCaller = false;
        //			console.log("result: ", result);
        if (typeof the_callback === "function") {
          if (result && result["@"].status === "ok") {
            var tags = opt.track !== undefined && opt.track !== "" ? result.track.toptags.tag : result.artist.tags.tag;
            if (typeof tags === "object" && !tags.length) { tags = [tags]; }
            var args = {
              success: true,
              tags: tags || [],
              artist: opt.track !== undefined && opt.track !== "" ? result.track.artist.name : result.artist.name
            };
            if (opt.track !== undefined && opt.track !== "") { args.track = result.track.name; }
            the_callback(args);
          } else {
            if (result && result.error) {
              the_callback({
                success: false,
                error: result.error["#"]
              });
            } else {
              the_callback({
                success: false,
                error: "error"
              });
            }
          }
        }
      }
    });
    this._getInfo(opt);
  }

  getPlays(opt) {
    var the_callback = opt.callback;
    this._isTheMethodCaller = true;
    Object.assign(opt || {}, {
      callback: function (result) {
        this._isTheMethodCaller = false;
        if (typeof the_callback === "function") {
          if (result && result["@"].status === "ok") {
            var ret = {
              success: true,
              plays: opt.track !== undefined && opt.track !== "" ? result.track.userplaycount : result.artist.stats.userplaycount,
              artist: opt.track !== undefined && opt.track !== "" ? result.track.artist.name : result.artist.name
            };
            if (ret.plays === undefined) { ret.plays = 0; }
            if (opt.track !== undefined && opt.track !== "") { ret.track = result.track.name; }
            the_callback(ret);
          } else {
            if (result && result.error) {
              the_callback({
                success: false,
                error: result.error["#"]
              });
            } else {
              the_callback({
                success: false,
                error: "error"
              });
            }
          }
        }
      }
    });
    this._getInfo(opt);
  }

  getTracks(opt) {
    //	var the_callback = opt.callback;
    var page = opt.page ? opt.page : 1;
    http.get({
      host: "ws.audioscrobbler.com",
      port: 80,
      path: "/2.0/?method=user.getartisttracks&page=" + page + "&api_key=" + this.api_key + "&autocorrect=1&user=" + this.username + "&artist=" + encodeURIComponent(opt.artist)
    }, function (res) {
      var body = "";
      res.on("data", function (chunk) {
        body += chunk;
      });
      res.on("end", function () {
        var parser = new xml2js.Parser(xml2js.defaults["0.1"]);
        parser.parseString(body, function (err, result) {
          if (typeof opt.callback === "function") {
            opt.callback(result);
          }
        });
      });
    });
  }

  getAllTracks(opt) {
    var lastfm = this;
    var the_callback = opt.callback;
    var tracks = [];
    opt.callback = function (result) {
      if (result && result["@"].status === "failed") {
        the_callback({
          success: false,
          reason: result.error["#"]
        });
      } else {
        var numPages = result.artisttracks["@"].totalPages;
        for (var i = 0; i < result.artisttracks.track.length; i++) {
          if (tracks.indexOf(result.artisttracks.track[i].name) < 0) { tracks.push(result.artisttracks.track[i].name); }
        }
        if (result.artisttracks["@"].page < numPages) {
          opt.page++;
          lastfm.getTracks(opt);
        } else {
          the_callback({ success: true, artist: result.artisttracks["@"].artist, tracks: tracks });
        }
      }
    };
    opt.page = 1;
    this.getTracks(opt);
  }

  getTopArtists(opt) {
    var lastfm = this;
    var the_callback = opt.callback;
    delete opt.callback;
    lastfm.doGet({
      method: "user.gettopartists",
      args: opt,
      callback: function (result) {
        if (typeof the_callback === "function") {
          if (result && result["@"].status === "ok") {
            the_callback({
              success: true,
              topArtists: result.topartists.artist
            });
          } else {
            if (result && result.error) {
              the_callback({
                success: false,
                error: result.error["#"]
              });
            } else {
              the_callback({
                success: false,
                error: "error"
              });
            }
          }
        }
      }
    });
  }

  getSimilarArtists(opt) {
    var lastfm = this;
    var the_callback = opt.callback;
    delete opt.callback;
    lastfm.doGet({
      method: "artist.getsimilar",
      args: opt,
      callback: function (result) {
        if (typeof the_callback === "function") {
          if (result && result["@"].status === "ok") {
            the_callback({
              success: true,
              similarArtists: result.similarartists.artist
            });
          } else {
            if (result && result.error) {
              the_callback({
                success: false,
                error: result.error["#"]
              });
            } else {
              the_callback({
                success: false,
                error: "error"
              });
            }
          }
        }
      }
    });
  }

  doGet(opt) {
    var lastfm = this;
    var the_callback = opt.callback;
    opt.args.api_key = this.api_key;
    opt.args.method = opt.method;
    var path = "/2.0/?" + querystring.stringify(opt.args);
    http.get({
      host: "ws.audioscrobbler.com",
      port: 80,
      path: path
    }, function (res) {
      var body = "";
      res.on("data", function (chunk) {
        body += chunk;
      });
      res.on("end", function () {
        var parser = new xml2js.Parser(xml2js.defaults["0.1"]);
        parser.parseString(body, function (err, result) {
          if (typeof the_callback === "function") {
            the_callback(result);
          }
        });
      });
    });
  }
}

module.exports = LastFM;