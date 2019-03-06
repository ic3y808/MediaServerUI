import AppUtilities from "./appUtilities.service";
import '../API/cast.framework';
import '../API/cast.v1';
var isCastAvailable = false;
window.__onGCastApiAvailable = function (isAvailable) {
  isCastAvailable = isAvailable;
};

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
    this.Logger.debug('init media player');
    this.activeSong = "";
    this.playing = false;
    this.paused = false;
    this.currentVolume = this.MediaElement.volume;
    this.selectedIndex = 0;
    this.repeatEnabled = false;
    this.$rootScope.checkIfNowPlaying = this.checkIfNowPlaying;
    this.$rootScope.tracks = [];
    this.$rootScope.currentTrack = {};

    this.MediaElement.addEventListener('play', () => {
      this.playing = true;
      this.paused = false;
      this.togglePlayPause();
      AppUtilities.apply();
    });

    this.MediaElement.addEventListener('pause', () => {
      this.playing = false;
      this.paused = true;
      this.togglePlayPause();
      AppUtilities.apply();
    });

    this.MediaElement.addEventListener('ended', () => {
      if ((this.selectedIndex + 1) === this.$rootScope.tracks.length) {
        this.playing = false;
        this.paused = false;
        this.selectedIndex = 0;
        this.togglePlayPause();
        $('#media-player').src = this.selectedTrack();
        $('#subProgress').attr('aria-valuenow', 0).css('width', "0%");
        $('#mainProgress').attr('aria-valuenow', 0).css('width', "0%");
        $('#mainTimeDisplay').html("");
        this.Logger.debug('Playlist ended');
        this.AppUtilities.broadcast('playlistEndEvent');

      } else {
        this.playing = true;
        this.next();
      }
    });

    this.MediaElement.addEventListener('canplaythrough', () => {
      $('#mainTimeDisplay').html("0:00 / " + this.AppUtilities.formatTime(MediaElement.duration));
      $('#subProgress').attr('aria-valuenow', 0).css('width', "0%");
      $('#mainProgress').attr('aria-valuenow', 0).css('width', "0%");
      this.togglePlayPause();
    });

    this.MediaElement.addEventListener('timeupdate', () => {
      var duration = MediaElement.duration;
      if (!isFinite(duration))
        duration = this.selectedTrack().duration;

      var playPercent = 100 * (MediaElement.currentTime / duration);
      if (!isNaN(playPercent)) {
        var buffered = MediaElement.buffered;
        var loaded;


        if (buffered.length) {
          loaded = 100 * buffered.end(0) / duration;
        }


        $('#subProgress').attr('aria-valuenow', loaded).css('width', loaded + "%");
        $('#mainProgress').attr('aria-valuenow', playPercent).css('width', playPercent + "%");
        $('#mainTimeDisplay').html(this.AppUtilities.formatTime(MediaElement.currentTime) + " / " + this.AppUtilities.formatTime(duration));
      }
    });
  }

  castStatus() {
    return isCastAvailable;
  }

  initializeCast() {
    if (isCastAvailable) {
      var options = {};
      options.receiverApplicationId = 'DAB06F7C';
      options.autoJoinPolicy = chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED;
      cast.framework.CastContext.getInstance().setOptions(options);
      this.remotePlayer = new cast.framework.RemotePlayer();
      this.remotePlayerController = new cast.framework.RemotePlayerController(this.remotePlayer);
      this.remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
        () => {
          this.Logger.debug('switchPlayer');
          if (cast && cast.framework) {
            if (this.remotePlayerConnected()) {

              this.setupRemotePlayer();
              return;
            }
          }
          this.setupLocalPlayer();
        }
      );

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
      return null
    }
  }

  previousTrack() {
    if (this.selectedIndex - 1 > 0) {
      return this.$rootScope.tracks[this.selectedIndex - 1];
    } else {
      return null
    }
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
    if (!this.remotePlayer) return false;
    return this.remotePlayer.isConnected;
  }

  checkNowPlayingImage(source) {
    if (source.cover_art) {
      source.image = this.AlloyDbService.getCoverArt({
        track_id: source.cover_art
      });

      this.AppUtilities.apply();

    }
  }

  checkPlaylistBeginning(newIndex) {
    if (newIndex <= 0) {
      this.playing = false;
      this.selectedIndex = 0;
      this.togglePlayPause();
      $('#media-player').src = this.selectedTrack();
      $('#subProgress').attr('aria-valuenow', 0).css('width', "0%");
      $('#mainProgress').attr('aria-valuenow', 0).css('width', "0%");
      $('#mainTimeDisplay').html("");
      this.Logger.debug('Playlist ended');
      this.AppUtilities.broadcast('playlistBeginEvent');
      return true;
    }
    return false;
  }

  checkPlaylistEnding(newIndex) {
    if (newIndex >= this.$rootScope.tracks.length) {
      this.playing = false;
      this.selectedIndex = 0;
      this.togglePlayPause();
      $('#media-player').src = this.selectedTrack();
      $('#subProgress').attr('aria-valuenow', 0).css('width', "0%");
      $('#mainProgress').attr('aria-valuenow', 0).css('width', "0%");
      $('#mainTimeDisplay').html("");
      this.Logger.debug('Playlist ended');
      this.AppUtilities.broadcast('playlistEndEvent');
      return true;
    }
    return false;
  }

  generateRemoteMetadata(source) {

    return new Promise((resolve, reject) => {
      if (!source) {
        throw new Error('source required');
      }
      if (!source.artistId) {
        throw new Error('no artist id');
      }
      //this.AlloyDbService.getArtistInfo(source.artistId).then(function (result) {
      //  var mediaInfo = new chrome.cast.media.MediaInfo(source.url, 'audio/mp3' /*source.transcodedContentType*/);
      //  mediaInfo.metadata = new chrome.cast.media.MusicTrackMediaMetadata();
      //  //mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
      //  //mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.MOVIE;
      //  //mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.TV_SHOW;
      //  //mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.PHOTO;
      //  mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.MUSIC_TRACK;
      //  mediaInfo.metadata.customData = JSON.stringify(source);
      //  mediaInfo.metadata.albumArtist = source.albumArtist;
      //  mediaInfo.metadata.albumName = source.album;
      //  mediaInfo.metadata.artist = source.artist;
      //  mediaInfo.metadata.artistName = source.artist;
      //  mediaInfo.metadata.composer = source.artist;
      //  mediaInfo.metadata.discNumber = source.track;
      //  mediaInfo.metadata.songName = source.title;
      //  mediaInfo.metadata.title = source.title;
      //  mediaInfo.metadata.images = [{
      //    'url': result.largeImageUrl.replace('300x300', '1280x400')
      //  }];
      //  resolve(mediaInfo);
      //});
    });
  }

  togglePlayPause() {
    var playing = false;
    if (this.remotePlayerConnected()) {
      playing = this.remotePlayer.playerState === 'PLAYING';
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
      playing = this.remotePlayer.playerState === 'PLAYING';
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
    instance.AlloyDbService.scrobble(source.id).then(scrobbleResult => {
      if (scrobbleResult) instance.Logger.info('scrobble result: ' + JSON.stringify(scrobbleResult.result) + " : " + source.artist + " - " + source.title);
    });
    instance.AlloyDbService.scrobbleNowPlaying(source.id).then(scrobbleResult => {
      if (scrobbleResult) instance.Logger.info('scrobbleNowPlaying result: ' + JSON.stringify(scrobbleResult.result) + " : " + source.artist + " - " + source.title);
    });
  }

  addPlay(instance, source) {
    instance.AlloyDbService.addPlay(source.id).then(result => {
      if (result) {
        instance.Logger.info('addPlay resut: ' + JSON.stringify(result.result) + " : " + source.artist + " - " + source.title);
        source.play_count++;
        instance.AppUtilities.broadcast('trackChangedEvent', source);
        instance.AppUtilities.apply();
      }
    });
  }

  loadTrack(index) {

    this.selectedIndex = index;
    this.Logger.debug('load track');
    $('#mainTimeDisplay').html("Loading...");

    var source = this.selectedTrack();
    this.$rootScope.currentTrack = source;
    this.Logger.debug(source.artist + " - " + source.title);
    source.artistUrl = "/artist/" + source.artist_id;
    source.albumUrl = "/album/" + source.album_id;
    if (source && source.id) {
      source.url = this.AlloyDbService.stream(source.id, 320);
      //if (source.artistId) {
      this.checkStarred(source);
      this.checkArtistInfo(source);
      this.checkNowPlayingImage(source);

      if (this.remotePlayerConnected()) {
        this.setupRemotePlayer();
        this.generateRemoteMetadata(source).then(mediaInfo => {
          var request = new chrome.cast.media.LoadRequest(mediaInfo);
          cast.framework.CastContext.getInstance().getCurrentSession().loadMedia(request);
          this.scrobble(t, source);
          this.togglePlayPause();
          this.startProgressTimer();
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
          playPromise.then(_ => {
            this.scrobble(this, source);
            this.addPlay(this, source);
            this.Title.setTitle(source.artist + " " + source.title)
            this.togglePlayPause();
            this.AppUtilities.broadcast('trackChangedEvent', source);
          }).catch(error => {
            this.Logger.error('playing failed ' + error);
            //this.next();
          });
        } else {
          //next();
        }
      }
      //} else {
      //  next();
      //}
    } else {
      //next();
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
        playPromise.then(_ => {
          this.Logger.debug('success playing');
        }).catch(error => {
          this.Logger.error('playing failed ' + error);
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
    if (!this.repeatEnabled) this.selectedIndex--;
    if (!this.checkPlaylistBeginning(this.selectedIndex)) {
      this.loadTrack(this.selectedIndex);
    }
  }
  next() {
    if (!this.repeatEnabled) this.selectedIndex++;
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
    if (source.starred === 'true') {
      $("#likeButtonIcon").removeClass('fa-star-o');
      $("#likeButtonIcon").addClass('fa-star');
    } else {
      $("#likeButtonIcon").removeClass('fa-star');
      $("#likeButtonIcon").addClass('fa-star-o');
    }
  }

  checkArtistInfo(source) {
    $('#artistInfo').html(source.artist);
    $('#artistInfo').attr("href", source.artistUrl);
    $('#trackTitle').html(source.title);
    $('#trackTitle').attr("href", source.albumUrl);
  }

  startProgressTimer() {
    this.stopProgressTimer();
    this.timer = setInterval(() => {
      if (this.remotePlayerConnected()) {
        var currentMediaTime = this.remotePlayer.currentTime;
        var currentMediaDuration = this.remotePlayer.duration;
        var playPercent = 100 * (currentMediaTime / currentMediaDuration);
        if (!isNaN(playPercent)) {
          $('#subProgress').attr('aria-valuenow', "100").css('width', "100%");
          $('#mainProgress').attr('aria-valuenow', playPercent).css('width', playPercent + "%");
          $('#mainTimeDisplay').html(this.AppUtilities.formatTime(currentMediaTime) + " / " + this.AppUtilities.formatTime(currentMediaDuration));
        }
      }
    }, 250);
  }

  stopProgressTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
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
            vol = 0;
            $('#volumeSlider').val(vol);
          } else {
            vol = this.remotePlayer.volumeLevel;
            $('#volumeSlider').val(vol * 100);
          }
        }
      );

      this.remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.VOLUME_LEVEL_CHANGED,
        () => {
          $('#volumeSlider').val(this.remotePlayer.volumeLevel * 100);
        }
      );

      this.remotePlayerController.addEventListener(
        cast.framework.RemotePlayerEventType.MEDIA_INFO_CHANGED,
        () => {
          this.Logger.debug('media info change');
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
          this.Logger.debug('state change ');
          this.Logger.debug(this.remotePlayer.playerState);

          if (this.remotePlayer.playerState === null) {
            if (this.remotePlayer.savedPlayerState) {
              this.shouldSeek = true;
              this.prePlannedSeek = this.remotePlayer.savedPlayerState.currentTime;
              this.loadTrack(this.selectedIndex);
              this.Logger.debug('saved state');
            } else {
              this.next();
            }
          }
          if (this.remotePlayer.playerState === 'BUFFERING') {
            $('#mainTimeDisplay').html("Buffering...");
          }
          if (this.remotePlayer.playerState === 'PLAYING' && this.shouldSeek) {
            this.shouldSeek = false;
            this.remotePlayer.currentTime = this.prePlannedSeek;
            this.remotePlayerController.seek();
            this.AppUtilities.broadcast('trackChangedEvent', this.selectedTrack());
          }


          if (this.MediaElement.playing) {
            this.shouldSeek = true;
            this.prePlannedSeek = this.MediaElement.currentTime;
            this.MediaElement.pause();
            this.loadTrack(this.selectedIndex);
          }
          this.isMuted = this.remotePlayer.isMuted;
          if (this.isMuted) {
            $('#volumeSlider').val(0);
          } else {
            $('#volumeSlider').val(this.remotePlayer.volumeLevel * 100);
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

            //        $('#artistInfo').html(source.artist);
            //        $('#artistInfo').attr("href", source.artistUrl);
            //        $('#trackInfo').html(source.title);
            //        $('#trackInfo').attr("href", source.albumUrl);

            //        if (source.starred) {
            //            $("#likeButtonIcon").removeClass('star-o');
            //            $("#likeButtonIcon").addClass('star');
            //        } else {
            //            $("#likeButtonIcon").removeClass('star');
            //            $("#likeButtonIcon").addClass('star-o');
            //        }

            //        this.togglePlayPause();




            //        $('#nowPlayingImageHolder').attr('src', result.smallImageUrl);
            //    }
            //});
          }
        }
      );
      this.startProgressTimer();
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
    this.stopProgressTimer();
    this.remoteConfigured = false;
  }

  checkIfNowPlaying(type, obj) {
    var selected = this.selectedTrack();
    if (selected && type && obj) {
      if (type === 'track') {
        return track.id === selected.id;
      } else if (type === 'artist') {
        return track.id === selected.artist_id;
      } else if (type === 'album') {
        return track.id === selected.album_id;
      }
    }
    return false;
  }
}