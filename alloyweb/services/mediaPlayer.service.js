import { findIndex } from "lodash";
export default class MediaPlayer {
  constructor($rootScope, Title, Logger, MediaElement, AppUtilities, Backend, AlloyDbService) {
    "ngInject";
    this.$rootScope = $rootScope;
    this.Title = Title;
    this.Logger = Logger;
    this.MediaElement = MediaElement;
    this.AppUtilities = AppUtilities;
    this.Backend = Backend;
    this.AlloyDbService = AlloyDbService;
    this.Logger.debug("init media player");
    this.activeSong = "";
    this.playing = false;
    this.paused = false;
    this.currentVolume = this.MediaElement.volume;
    this.selectedIndex = 0;
    this.repeatEnabled = false;
    this.$rootScope.checkIfNowPlaying = this.checkIfNowPlaying;
    this.$rootScope.tracks = [];
    this.$rootScope.currentTrack = {};
    this.currentProgressPercent = 0;
    this.$rootScope.MediaPlayer = this;
    this.$rootScope.playTrack = this.playTrack;
    this.$rootScope.playAlbum = this.playAlbum;
    this.$rootScope.playArtist = this.playArtist;


    this.MediaElement.addEventListener("play", () => {
      this.playing = true;
      this.paused = false;
      this.togglePlayPause();
      this.AppUtilities.broadcast("playbackStatusChangedEvent");
      AppUtilities.apply();
    });

    this.MediaElement.addEventListener("pause", () => {
      this.playing = false;
      this.paused = true;
      this.togglePlayPause();
      this.AppUtilities.broadcast("playbackStatusChangedEvent");
      AppUtilities.apply();
    });

    this.MediaElement.addEventListener("ended", () => {
      if ((this.selectedIndex + 1) === this.$rootScope.tracks.length) {
        this.playing = false;
        this.paused = false;
        this.selectedIndex = 0;
        this.togglePlayPause();
        $("#media-player").src = this.selectedTrack();
        this.currentProgressPercent = 0;
        this.currentTime = "";
        this.currentDuration = "";
        $("#subProgress").attr("aria-valuenow", 0).css("width", "0%");

        this.Logger.debug("Playlist ended");
        this.AppUtilities.broadcast("playbackStatusChangedEvent");
        this.AppUtilities.broadcast("playlistEndEvent");

      } else {
        this.playing = true;
        this.next();
      }
    });

    this.MediaElement.addEventListener("canplaythrough", () => {
      this.currentTime = "0:00";
      this.currentDuration = this.AppUtilities.formatTime(MediaElement.duration);
      this.currentProgressPercent = 0;
      $("#subProgress").attr("aria-valuenow", 0).css("width", "0%");
      this.togglePlayPause();
    });

    this.MediaElement.addEventListener("timeupdate", () => {
      var duration = MediaElement.duration;
      if (!isFinite(duration)) { duration = this.selectedTrack().duration; }

      var playPercent = 100 * (MediaElement.currentTime / duration);
      if (!isNaN(playPercent)) {
        var buffered = MediaElement.buffered;

        if (buffered.length) {
          var loaded = 100 * buffered.end(0) / duration;
          $("#subProgress").attr("aria-valuenow", loaded).css("width", loaded + "%");
        }

        this.currentProgressPercent = playPercent;
        this.currentTime = this.AppUtilities.formatTime(this.MediaElement.currentTime);
        this.currentDuration = this.AppUtilities.formatTime(duration);
        this.AppUtilities.apply();
      }
    });
    var castCheck = setInterval(() => {
      if (this.castStatus() === true) {
        Logger.debug("cast status " + this.castStatus());
        this.initializeCast();
        clearInterval(castCheck);
      }
    }, 10000);
  }

  castStatus() {
    return window.isCastAvailable;
  }

  castConnectionChanged() {
    this.Logger.debug("switchPlayer");
    if (cast && cast.framework) {
      if (this.remotePlayerConnected()) {

        this.setupRemotePlayer();
        return;
      }
    }
    this.setupLocalPlayer();
  }

  initializeCast() {
    if (this.castStatus()) {
      var options = {};
      // options.receiverApplicationId = "DAB06F7C";
      options.receiverApplicationId = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
      options.autoJoinPolicy = chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED;
      cast.framework.CastContext.getInstance().setOptions(options);
      this.remotePlayer = new cast.framework.RemotePlayer();
      this.remotePlayerController = new cast.framework.RemotePlayerController(this.remotePlayer);

      this.remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.VOLUME_LEVEL_CHANGED, (e) => {
        this.Logger.debug("volume changed");
        this.Logger.debug(e);
      });
      this.remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.DURATION_CHANGED, (e) => {
        this.currentDuration = e.value;//this.AppUtilities.formatTime(e.value);
      });
      this.remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED, (e) => {
        this.currentTime = this.AppUtilities.formatTime(e.value);
        var playPercent = 100 * (e.value / this.currentDuration);
        this.currentProgressPercent = playPercent;
        this.AppUtilities.apply();
      });
      this.remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED, (e) => {
        this.Logger.debug("switch to cast");
      });

      this.castSession = cast.framework.CastContext.getInstance().getCurrentSession();
    }
  }

  castSession() {
    return this.getCurrentSession();
    //return cast.framework.CastContext.getInstance().getCurrentSession();
  }


  trackCount() {
    return this.$rootScope.tracks.length;
  }

  showTrackCount() {
    return this.$rootScope.tracks.length > 0;
  }

  selectedTrack() {
    return this.$rootScope.tracks[this.selectedIndex];
  }

  nextTrack() {
    if (this.selectedIndex + 1 < this.$rootScope.tracks.length) {
      return this.$rootScope.tracks[this.selectedIndex + 1];
    } else {
      return null;
    }
  }

  previousTrack() {
    if (this.selectedIndex - 1 > 0) {
      return this.$rootScope.tracks[this.selectedIndex - 1];
    } else {
      return null;
    }
  }

  playTrack(song, playlist) {
    this.Logger.debug("Play Track");
    this.$rootScope.tracks = playlist;
    var index = findIndex(this.$rootScope.tracks, function (track) {
      return track.id === song.id;
    });
    this.loadTrack(index);
  }

  playAlbum(album) {
    this.Logger.debug("Play Album");
    this.AlloyDbService.getAlbum(album.id).then((info) => {
      this.$rootScope.tracks = this.AppUtilities.shuffle(info.tracks);
      this.loadTrack(0);
    });
  }

  playArtist(artist) {
    this.Logger.debug("Play Artist");
    this.AlloyDbService.getArtist(artist.id).then((info) => {
      this.$rootScope.tracks = this.AppUtilities.shuffle(info.tracks);
      this.loadTrack(0);
    });
  }

  upcomingTracks(count) {
    var tracks = [];
    if (this.selectedIndex + 1 + count < this.$rootScope.tracks.length) {
      tracks = this.$rootScope.tracks.slice(this.selectedIndex + 1, this.selectedIndex + 1 + count);
    } else {
      tracks = this.$rootScope.tracks.slice(this.selectedIndex + 1, this.$rootScope.tracks.length);
    }
    return tracks;
  }

  previousTracks(count) {
    var tracks = [];
    if (this.selectedIndex - count > 0) {
      tracks = this.$rootScope.tracks.slice(this.selectedIndex - count, this.selectedIndex);
    } else {
      tracks = this.$rootScope.tracks.slice(0, this.selectedIndex);
    }
    tracks.reverse();
    return tracks;
  }

  remotePlayerConnected() {
    if (!this.remotePlayer) { return false; }
    return this.remotePlayer.isConnected;
  }

  checkNowPlayingImage(source) {
    if (source.cover_art) {
      source.image = this.AlloyDbService.getCoverArt({
        track_id: source.id
      });

      this.AppUtilities.apply();

    }
  }

  checkPlaylistBeginning(newIndex) {
    if (newIndex <= 0) {
      this.playing = false;
      this.selectedIndex = 0;
      this.currentProgressPercent = 0;
      this.togglePlayPause();
      $("#media-player").src = this.selectedTrack();
      $("#subProgress").attr("aria-valuenow", 0).css("width", "0%");
      $("#mainTimeDisplay").html("");
      this.Logger.debug("Playlist ended");
      this.AppUtilities.broadcast("playlistBeginEvent");
      return true;
    }
    return false;
  }

  checkPlaylistEnding(newIndex) {
    if (newIndex >= this.$rootScope.tracks.length) {
      this.playing = false;
      this.selectedIndex = 0;
      this.currentProgressPercent = 0;
      this.togglePlayPause();
      $("#media-player").src = this.selectedTrack();
      $("#mainTimeDisplay").html("");
      this.Logger.debug("Playlist ended");
      this.AppUtilities.broadcast("playlistEndEvent");
      return true;
    }
    return false;
  }

  generateRemoteMetadata(source) {
    return new Promise((resolve, reject) => {
      if (!source) {
        throw new Error("source required");
      }
      if (!source.artist_id) {
        throw new Error("no artist id");
      }

      var mediaInfo = new chrome.cast.media.MediaInfo(source.url, "audio/mp3" /*source.transcodedContentType*/);
      mediaInfo.metadata = new chrome.cast.media.MusicTrackMediaMetadata();
      mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.MUSIC_TRACK;
      mediaInfo.metadata.customData = JSON.stringify(source);
      mediaInfo.metadata.albumArtist = source.artist;
      mediaInfo.metadata.albumName = source.album;
      mediaInfo.metadata.artist = source.artist;
      mediaInfo.metadata.artistName = source.artist;
      mediaInfo.metadata.composer = source.artist;
      mediaInfo.metadata.discNumber = source.track;
      mediaInfo.metadata.songName = source.title;
      mediaInfo.metadata.title = source.title;
      mediaInfo.metadata.images = [{
        "url": this.AlloyDbService.getCoverArt({ track_id: source.id })
      }];
      resolve(mediaInfo);

    });
  }

  togglePlayPause() {
    var playing = false;
    if (this.remotePlayerConnected()) {
      playing = this.remotePlayer.playerState === "PLAYING";
    } else {
      playing = this.playing;
    }

    if (playing) {
      $("#playPauseIcon").addClass("icon-pause");
      $("#playPauseIcon").removeClass("icon-play");
    } else {
      $("#playPauseIcon").addClass("icon-play");
      $("#playPauseIcon").removeClass("icon-pause");
    }
  }

  toggleCurrentStatus() {
    var playing = false;
    if (this.remotePlayerConnected()) {
      playing = this.remotePlayer.playerState === "PLAYING";
    } else {
      playing = this.playing;
    }
    if (playing) {
      this.pause();
    } else {
      this.play();
    }
  }

  scrobble(instance, source) {
    instance.AlloyDbService.scrobble(source.id).then((scrobbleResult) => {
      if (scrobbleResult) { instance.Logger.debug("scrobble result: " + JSON.stringify(scrobbleResult.result) + " : " + source.artist + " - " + source.title); }
    });
    instance.AlloyDbService.scrobbleNowPlaying(source.id).then((scrobbleResult) => {
      if (scrobbleResult) { instance.Logger.debug("scrobbleNowPlaying result: " + JSON.stringify(scrobbleResult.result) + " : " + source.artist + " - " + source.title); }
    });
  }

  addPlay(instance, source) {
    instance.AlloyDbService.addPlay(source.id).then((result) => {
      if (result) {
        instance.Logger.debug("addPlay resut: " + JSON.stringify(result.result) + " : " + source.artist + " - " + source.title);
        source.play_count++;
        instance.AppUtilities.broadcast("trackChangedEvent", source);
        instance.AppUtilities.apply();
      }
    });
    instance.AlloyDbService.addHistory({ type: "track", action: "played", id: source.id, title: source.title, artist: source.artist, artist_id: source.artist_id, album: source.album, album_id: source.album_id, genre: source.genre, genre_id: source.genre_id }).then((result) => {
      if (result) {
        instance.Logger.debug("addHistory resut: " + JSON.stringify(result.result) + " : " + source.artist + " - " + source.title);
        instance.AlloyDbService.refreshHistory();
      }
    });
  }

  loadTrack(index) {
    this.selectedIndex = index;
    $("#mainTimeDisplay").html("Loading...");

    var source = this.selectedTrack();
    this.$rootScope.currentTrack = source;
    this.Logger.debug("loading track " + source.artist + " - " + source.title);
    source.artistUrl = "/artist/" + source.artist_id;
    source.albumUrl = "/album/" + source.album_id;
    if (source && source.id) {
      source.url = this.AlloyDbService.stream(source.id, this.$rootScope.settings.alloydb.alloydb_streaming_bitrate, this.$rootScope.settings.alloydb.alloydb_streaming_format);
      //if (source.artistId) {
      this.checkStarred(source);
      this.checkArtistInfo(source);
      this.checkNowPlayingImage(source);

      if (this.remotePlayerConnected()) {
        this.setupRemotePlayer();
        this.generateRemoteMetadata(source).then((mediaInfo) => {
          var request = new chrome.cast.media.LoadRequest(mediaInfo);
          cast.framework.CastContext.getInstance().getCurrentSession().loadMedia(request);
          this.scrobble(this, source);
          this.addPlay(this, source);
          this.togglePlayPause();
        });
      } else {

        this.MediaElement.src = source.url;
        this.MediaElement.load();
        if (this.shouldSeek) {
          this.shouldSeek = false;
          this.MediaElement.currentTime = prePlannedSeek;
        }
        var playPromise = this.MediaElement.play();

        if (playPromise !== undefined) {
          playPromise.then(() => {
            this.scrobble(this, source);
            this.addPlay(this, source);
            this.Title.setTitle(source.artist + " " + source.title, source.artist + " " + source.title);
            this.togglePlayPause();
            this.AppUtilities.broadcast("trackChangedEvent", source);
            this.AppUtilities.apply();
          }).catch((error) => {
            this.Logger.error("playing failed " + error.name + " " + error.message);
            //this.next();
          });
        }
      }
    }
  }

  play() {
    if (this.remotePlayerConnected()) {
      if (this.remotePlayer.isPaused) {
        this.remotePlayerController.playOrPause();
      }

    } else {
      var playPromise = this.MediaElement.play();

      if (playPromise !== undefined) {
        playPromise.then((_) => {
          this.Logger.debug("success playing");
        }).catch((error) => {
          this.Logger.error("playing failed " + error);
        });
      }
    }
  }

  pause() {
    if (this.remotePlayerConnected()) {
      if (!this.remotePlayer.isPaused) {
        this.remotePlayerController.playOrPause();
      }
    } else {
      this.MediaElement.pause();
    }
  }

  stop() {
    this.MediaElement.stop();
  }

  previous() {
    if (!this.repeatEnabled) { this.selectedIndex--; }
    if (!this.checkPlaylistBeginning(this.selectedIndex)) {
      this.loadTrack(this.selectedIndex);
    }
  }

  next() {
    if (!this.repeatEnabled) { this.selectedIndex++; }
    if (!this.checkPlaylistEnding(this.selectedIndex)) {
      this.loadTrack(this.selectedIndex);
    }
  }

  checkVolume() {
    if (this.remotePlayerConnected()) {
      return this.remotePlayer.volumeLevel;
    } else {
      return this.MediaElement.volume;
    }
  }

  checkStarred(source) {
    if (source.starred === "true") {
      $("#likeButtonIcon").removeClass("fa-star-o");
      $("#likeButtonIcon").addClass("fa-star");
    } else {
      $("#likeButtonIcon").removeClass("fa-star");
      $("#likeButtonIcon").addClass("fa-star-o");
    }
  }

  checkArtistInfo(source) {
    $("#artistInfo").html(source.artist);
    $("#artistInfo").attr("href", source.artistUrl);
    $("#trackTitle").html(source.title);
    $("#trackTitle").attr("href", source.albumUrl);
  }

  setupRemotePlayer() {

    if (!this.remoteConfigured) {
      this.remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.IS_PAUSED_CHANGED,
        () => {
          this.togglePlayPause(this.remotePlayer.isPaused);
        }
      );

      this.remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.IS_MUTED_CHANGED,
        () => {
          this.isMuted = this.remotePlayer.isMuted;
          if (this.isMuted) {
            $("#volumeSlider").val(0);
          } else {
            var vol = this.remotePlayer.volumeLevel;
            $("#volumeSlider").val(vol * 100);
          }
        }
      );

      this.remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.VOLUME_LEVEL_CHANGED,
        () => {
          $("#volumeSlider").val(this.remotePlayer.volumeLevel * 100);
        }
      );

      this.remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.MEDIA_INFO_CHANGED,
        () => {
          this.Logger.debug("media info change");
          this.Logger.debug(this.remotePlayer.mediaInfo);
          if (this.remotePlayer && this.remotePlayer.mediaInfo && this.remotePlayer.mediaInfo.metadata) {
            var customData = this.remotePlayer.mediaInfo.metadata.customData;
            if (customData) {
              if (this.$rootScope.tracks.length > 0) {

              } else {
                this.$rootScope.tracks[0] = JSON.parse(customData);
                this.selectedIndex = 0;
              }
            }
          }
        }
      );

      this.remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.PLAYER_STATE_CHANGED,
        () => {
          this.Logger.debug("state change ");
          this.Logger.debug(this.remotePlayer.playerState);

          if (this.remotePlayer.playerState === null) {
            if (this.remotePlayer.savedPlayerState) {
              this.shouldSeek = true;
              this.prePlannedSeek = this.remotePlayer.savedPlayerState.currentTime;
              this.loadTrack(this.selectedIndex);
              this.Logger.debug("saved state");
            } else {
              this.next();
            }
          }
          if (this.remotePlayer.playerState === "IDLE") {
            this.next();
          }
          if (this.remotePlayer.playerState === "BUFFERING") {
            $("#mainTimeDisplay").html("Buffering...");
          }
          if (this.remotePlayer.playerState === "PLAYING" && this.shouldSeek) {
            this.shouldSeek = false;
            this.remotePlayer.currentTime = this.prePlannedSeek;
            this.remotePlayerController.seek();
            this.AppUtilities.broadcast("trackChangedEvent", this.selectedTrack());
          }


          if (this.MediaElement.playing) {
            this.shouldSeek = true;
            this.prePlannedSeek = this.MediaElement.currentTime;
            this.MediaElement.pause();
            this.loadTrack(this.selectedIndex);
          }
          this.isMuted = this.remotePlayer.isMuted;
          if (this.isMuted) {
            $("#volumeSlider").val(0);
          } else {
            $("#volumeSlider").val(this.remotePlayer.volumeLevel * 100);
          }

          this.togglePlayPause();
          // TODO fix resume support
          if (this.remotePlayer.mediaInfo && this.remotePlayer.mediaInfo.metadata) {
            //id = this.remotePlayer.mediaInfo.contentId;

            //id = id.split("&")[6];
            //id = id.substring(3,id.length - 1);

            //this.AlloyDbService.getTrack(id).then(function (result) {
            //    this.Logger.debug("getArtistDetails result")
            //    this.Logger.debug(result)

            //    if (result) {

            //       

            //        $("#artistInfo").html(source.artist);
            //        $("#artistInfo").attr("href", source.artistUrl);
            //        $("#trackInfo").html(source.title);
            //        $("#trackInfo").attr("href", source.albumUrl);

            //        if (source.starred) {
            //            $("#likeButtonIcon").removeClass("star-o");
            //            $("#likeButtonIcon").addClass("star");
            //        } else {
            //            $("#likeButtonIcon").removeClass("star");
            //            $("#likeButtonIcon").addClass("star-o");
            //        }

            //        this.togglePlayPause();


            //        $("#nowPlayingImageHolder").attr("src", result.smallImageUrl);
            //    }
            //});
          }
        }
      );
      this.remoteConfigured = true;
    }
    if (this.remotePlayerConnected()) {
      if (this.MediaElement.playing) {
        this.shouldSeek = true;
        this.prePlannedSeek = this.MediaElement.currentTime;
        this.MediaElement.pause();
        this.loadTrack(this.selectedIndex);
      }
    }

  }

  setupLocalPlayer() {
    this.remoteConfigured = false;
  }

  checkIfNowPlaying(type, id) {
    var selected = this.selectedTrack();

    if (selected && type && id) {
      if (this.isPlaying) {
        if (type === "track") {
          return id === selected.id;
        } else if (type === "artist") {
          return id === selected.artist_id;
        } else if (type === "album") {
          return id === selected.album_id;
        } else if (type === "genre") {
          return id === selected.genre_id;
        }
      }

    }
    return false;
  }

  isPlaying() {
    return this.playing && !this.paused;
  }
}