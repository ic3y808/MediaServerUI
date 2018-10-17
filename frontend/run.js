import io from 'socket.io-client';

class ApplicationRun {
  constructor($window, $rootScope, MediaService, ChromecastService, SubsonicService) {
    "ngInject";
    console.log('starting application');
    var myWindow = angular.element($window);
    myWindow.on('__onGCastApiAvailable', function (isAvailable) {
      console.log('cast is ' + isAvailable);
      $rootScope.isCastAvailable = isAvailable;
    });
    $rootScope.isLoggedIn = false;
    $rootScope.activeSong = "";
    $rootScope.playing = false;
    $rootScope.currentVolume = MediaService.volume;
    $rootScope.selectedIndex = 0;
    $rootScope.repeatEnabled = false;
    $rootScope.tracks = [];
    $rootScope.settings = [];

    $rootScope.apply = function () {
      if (!$rootScope.$$phase) {
        //$digest or $apply
      }
    }

    $rootScope.castSession = function () {
      return cast.framework.CastContext.getInstance().getCurrentSession();
    };

    $rootScope.trackCount = function () {
      return $rootScope.tracks.length;
    };

    $rootScope.showTrackCount = function () {
      return $rootScope.tracks.length > 0;
    };

    $rootScope.selectedTrack = function () {
      return $rootScope.tracks[$rootScope.selectedIndex];
    };

    $rootScope.audioSource = function () {
      return $rootScope.selectedTrack();
    };

    $rootScope.remotePlayerConnected = function () {
      if (!$rootScope.remotePlayer) return false;
      return $rootScope.remotePlayer.isConnected;
    };

    $rootScope.loadTrack = function (index) {
      $rootScope.selectedIndex = index;
      console.log('loadTrack');
      $('#mainTimeDisplay').html("Loading...");

      var source = $rootScope.audioSource();
      source.artistUrl = "/artist/" + source.artistId;
      source.albumUrl = "/album/" + source.albumId;
      if (source && source.id) {
        source.url = $rootScope.subsonic.streamUrl(source.id, 320);

        if (source.artistId) {
          $rootScope.subsonic.getArtistInfo2(source.artistId, 50).then(function (result) {
            console.log("getArtistDetails result");

            if (result) {

              if ($rootScope.remotePlayerConnected()) {
                $rootScope.setupRemotePlayer();


                var mediaInfo = new chrome.cast.media.MediaInfo(source.url, source.transcodedContentType);

                mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
                //mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
                //mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.MOVIE;
                //mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.TV_SHOW;
                //mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.PHOTO;
                mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.MUSIC_TRACK;
                mediaInfo.customData = JSON.stringify(source);
                mediaInfo.metadata.title = source.title;
                mediaInfo.metadata.images = [{
                  'url': result.largeImageUrl.replace('300x300', '1280x400')
                }];

                var request = new chrome.cast.media.LoadRequest(mediaInfo);
                cast.framework.CastContext.getInstance().getCurrentSession().loadMedia(request);


              } else {
                console.log(source);
                MediaService.src = source.url;
                MediaService.load();
                if ($rootScope.shouldSeek) {
                  $rootScope.shouldSeek = false;
                  MediaService.currentTime = $rootScope.prePlannedSeek;
                }
                var playPromise = MediaService.play();

                if (playPromise !== undefined) {
                  playPromise.then(_ => {
                    console.log('success playing');
                    $('#artistInfo').html(source.artist);
                    $('#artistInfo').attr("href", source.artistUrl);
                    $('#trackInfo').html(source.title);
                    $('#trackInfo').attr("href", "/playing");

                    if (source.starred) {
                      $("#likeButtonIcon").removeClass('heart-o');
                      $("#likeButtonIcon").addClass('heart');
                    } else {
                      $("#likeButtonIcon").removeClass('heart');
                      $("#likeButtonIcon").addClass('heart-o');
                    }

                    $("#playPauseIcon").addClass("fa-pause");
                    $("#playPauseIcon").removeClass("fa-play");
                    $('#nowPlayingImageHolder').attr('src', result.smallImageUrl);
                    $('#volumeSlider').val($rootScope.currentVolume * 100);
                    $rootScope.$broadcast('trackChangedEvent', result);
                    $rootScope.$digest();
                  }).catch(error => {
                    console.log('playing failed ' + error);
                  });
                }
              }
            }
          });
        } else {
          $rootScope.next();
        }
      } else {
        $rootScope.next();
      }
    };

    $rootScope.play = function () {
      if ($rootScope.remotePlayerConnected()) {
        if ($rootScope.remotePlayer.isPaused) {
          $rootScope.remotePlayerController.playOrPause();
        }

      } else {
        var playPromise = MediaService.play();

        if (playPromise !== undefined) {
          playPromise.then(_ => {
            console.log('success playing');
          }).catch(error => {
            console.log('playing failed ' + error);
          });
        }
      }
    };

    $rootScope.pause = function () {
      if ($rootScope.remotePlayerConnected()) {
        if (!$rootScope.remotePlayer.isPaused) {
          $rootScope.remotePlayerController.playOrPause();
        }
      } else {
        MediaService.pause();
      }
    };

    $rootScope.stop = function () {
      MediaService.stop();
    };

    $rootScope.previous = function () {
      $rootScope.selectedIndex--;
      $rootScope.selectedIndex = ($rootScope.selectedIndex < 0 ? $rootScope.tracks.length - 1 : $rootScope.selectedIndex);
      $rootScope.loadTrack($rootScope.selectedIndex);
    };
    $rootScope.next = function () {
      if (!$rootScope.repeatEnabled) $rootScope.selectedIndex++;
      $rootScope.selectedIndex = ($rootScope.selectedIndex >= $rootScope.tracks.length ? 0 : $rootScope.selectedIndex);
      $rootScope.loadTrack($rootScope.selectedIndex);
    };

    $rootScope.formatTime = function (seconds) {
      var minutes = Math.floor(seconds / 60);
      minutes = (minutes >= 10) ? minutes : "0" + minutes;
      seconds = Math.floor(seconds % 60);
      seconds = (seconds >= 10) ? seconds : "0" + seconds;
      return minutes + ":" + seconds;
    };

    $('#media-player').on('error', function failed(e) {
      // audio playback failed - show a message saying why
      // to get the source of the audio element use $(this).src
      console.log('player error ' + e.target.error);
      switch (e.target.error.code) {
        case e.target.error.MEDIA_ERR_ABORTED:
          alert('You aborted the video playback.');
          break;
        case e.target.error.MEDIA_ERR_NETWORK:
          alert('A network error caused the audio download to fail.');
          break;
        case e.target.error.MEDIA_ERR_DECODE:
          alert('The audio playback was aborted due to a corruption problem or because the video used features your browser did not support.');
          break;
        case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          alert('The video audio not be loaded, either because the server or network failed or because the format is not supported.');
          break;
        default:
          alert('An unknown error occurred.');
          break;
      }
    });

    $rootScope.setContentBackground = function (img) {
      $('.container').css('background-image', 'url(' + img + ')');
    };

    $rootScope.resetContentBackground = function (img) {
      $('.container').css('background-image', 'url("")');
    };

    $("#media-player").on("play", function () {
      $rootScope.$apply(function () {
        $rootScope.playing = true;
        $("#playPauseIcon").addClass("fa-pause");
        $("#playPauseIcon").removeClass("fa-play");
      });
    });

    $("#media-player").on("pause", function () {
      $rootScope.$apply(function () {
        $rootScope.playing = false;
        $("#playPauseIcon").removeClass("fa-pause");
        $("#playPauseIcon").addClass("fa-play");
      });
    });

    $("#media-player").on("ended", function () {
      if (($rootScope.selectedIndex + 1) === $rootScope.tracks.length) {
        $rootScope.playing = false;
        $rootScope.selectedIndex = 0;
        $('#media-player').src = $rootScope.audioSource();
        $("#playPauseIcon").removeClass("fa-pause");
        $("#playPauseIcon").addClass("fa-play");
        $('#subProgress').attr('aria-valuenow', 0).css('width', "0%");
        $('#mainProgress').attr('aria-valuenow', 0).css('width', "0%");
        $('#mainTimeDisplay').html("");
      } else {
        $rootScope.playing = true;
        $rootScope.next();
      }
    });

    $("#media-player").on("canplaythrough", function () {
      $('#mainTimeDisplay').html("0:00 / " + $rootScope.formatTime(MediaService.duration));
      $('#subProgress').attr('aria-valuenow', 0).css('width', "0%");
      $('#mainProgress').attr('aria-valuenow', 0).css('width', "0%");
      $("#playPauseIcon").addClass("fa-pause");
      $("#playPauseIcon").removeClass("fa-play");
    });

    $("#media-player").on("timeupdate", function () {

      var duration = MediaService.duration;
      if (!isFinite(duration))
        duration = $rootScope.selectedTrack().duration;

      var playPercent = 100 * (MediaService.currentTime / duration);
      if (!isNaN(playPercent)) {
        var buffered = MediaService.buffered;
        var loaded;


        if (buffered.length) {
          loaded = 100 * buffered.end(0) / duration;
        }


        $('#subProgress').attr('aria-valuenow', loaded).css('width', loaded + "%");
        $('#mainProgress').attr('aria-valuenow', playPercent).css('width', playPercent + "%");
        $('#mainTimeDisplay').html($rootScope.formatTime(MediaService.currentTime) + " / " + $rootScope.formatTime(duration));
      }
    });

    $("#muteButton").click(function () {
      var vol = 0;
      if ($rootScope.remotePlayerConnected()) {
        $rootScope.remotePlayerController.muteOrUnmute();
        $rootScope.isMuted = $rootScope.remotePlayer.isMuted;
        if ($rootScope.isMuted) {
          vol = 0;
          $('#volumeSlider').val(vol);
        } else {
          vol = $rootScope.remotePlayer.volumeLevel;
          $('#volumeSlider').val(vol * 100);
        }
      } else {
        $rootScope.isMuted = !$rootScope.isMuted;
        if ($rootScope.isMuted) {
          MediaService.volume = 0;
          $('#volumeSlider').val(0);
        } else {
          MediaService.volume = $rootScope.currentVolume;
          $('#volumeSlider').val($rootScope.currentVolume * 100);
        }
      }
    });

    $("#skipBackButton").click(function () {
      $rootScope.previous();
    });

    $("#playPauseButton").click(function () {

      if ($rootScope.remotePlayerConnected()) {
        if (!$rootScope.remotePlayer.isPaused) $rootScope.pause();
        else $rootScope.play();

      } else {
        if ($rootScope.playing) $rootScope.pause();
        else $rootScope.play();
      }


    });

    $("#skipNextButton").click(function () {
      $rootScope.next();
    });

    $("#repeatButton").click(function () {
      $rootScope.repeatEnabled = !$rootScope.repeatEnabled;
      $("#repeatButton").toggleClass('button-selected');
    });

    $("#downloadButton").click(function () {
      var dlUrl = $rootScope.subsonic.downloadUrl($rootScope.selectedTrack().id);
      var win = window.open(dlUrl, '_blank');
    });

    $("#likeButton").click(function () {
      console.log('liking track');
      console.log($rootScope.selectedTrack());
      var track = $rootScope.selectedTrack();
      if (track.starred) {
        $rootScope.subsonic.unstar($rootScope.selectedTrack().id).then(function (result) {
          console.log('UnStarred');
          $rootScope.selectedTrack().starred = undefined;
          console.log(result);
          $("#likeButtonIcon").addClass('heart-o');
          $("#likeButtonIcon").removeClass('heart');

        });
      } else {
        $rootScope.subsonic.star($rootScope.selectedTrack().id).then(function (result) {
          console.log('starred');
          $rootScope.selectedTrack().starred = 1;
          $("#likeButtonIcon").removeClass('heart-o');
          $("#likeButtonIcon").addClass('heart');
          console.log(result);
        });
      }

    });

    $rootScope.$on('$routeChangeStart', function ($event, next, current) {
      $(".main-content").css("display", "none");
      $(".loader").css("display", "block");

    });

    $rootScope.$on('$routeChangeSuccess', function ($event, next, current) {
      console.log('routeChangeSuccess');
      $rootScope.$broadcast('windowResized');
      $rootScope.$broadcast('menuSizeChange');
    });

    $rootScope.hideLoader = function () {
      $(".loader").css("display", "none");
      $(".main-content").css("display", "block");
    };

    $rootScope.fallbackCopyTextToClipboard = function (text) {
      var textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
      }

      document.body.removeChild(textArea);
    };
    $rootScope.copyTextToClipboard = function (text) {
      if (!navigator.clipboard) {
        $rootScope.fallbackCopyTextToClipboard(text);
        return;
      }
      navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
      }, function (err) {
        console.error('Async: Could not copy text: ', err);
      });
    };

    $("#shareButton").click(function () {
      console.log('shareButton');
      $rootScope.subsonic.createShare($rootScope.selectedTrack().id, 'Shared from MediaCenterUI').then(function (result) {
        $('#shareButton').popover({
          animation: true,
          content: 'Success! Url Copied to Clipboard.',
          delay: {
            "show": 0,
            "hide": 5000
          },
          placement: 'top'
        }).popover('show');
        var url = result.url.toString();
        $rootScope.copyTextToClipboard(url);
        setTimeout(() => {
          $('#shareButton').popover('hide');
        }, 5000);
      });

    });

    $('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
    });

    $("#volumeSlider").on('change', function () {

    });

    $("#volumeSlider").on('input change', function () {
      var level = $rootScope.currentVolume = $('#volumeSlider').val() / 100;
      if ($rootScope.remotePlayerConnected()) {
        $rootScope.remotePlayer.volumeLevel = level;
        $rootScope.remotePlayerController.setVolumeLevel();
      } else {
        MediaService.volume = level;
      }
    });

    $("#clickProgress").click(function (e) {
      var seekto = NaN;

      if ($rootScope.remotePlayerConnected()) {
        var currentMediaDuration = $rootScope.remotePlayer.duration;
        seekto = currentMediaDuration * ((e.offsetX / $("#clickProgress").width()));
        if (!isNan(seekto)) {
          $rootScope.remotePlayer.currentTime = seekto;
          $rootScope.remotePlayerController.seek();
        }
      } else {
        var duration = MediaService.duration;
        if (!isFinite(duration))
          duration = $rootScope.selectedTrack().duration;
        seekto = duration * ((e.offsetX / $("#clickProgress").width()));
        if (!isNan(seekto)) {
          MediaService.currentTime = seekto;
        }
      }
    });


    $rootScope.socket = io('//' + document.location.hostname + ':' + document.location.port);
    $rootScope.socket.on('ping', function (data) {
      if (data)
        $('#ping').html("<code>Connected: " + JSON.parse(data).date + "</code>");
    });
    $rootScope.socket.on('settings_event', function (data) {
      if (data) {
        console.log('settings event');
        var d = data[0];
        if (d) {
          $rootScope.settings = {
            "subsonic_username": d.subsonic_username,
            "subsonic_password": d.subsonic_password,
            "subsonic_address": d.subsonic_address,
            "subsonic_port": d.subsonic_port,
            "subsonic_use_ssl": d.subsonic_use_ssl,
            "subsonic_include_port_in_url": d.subsonic_include_port_in_url
          };
          $rootScope.$broadcast('settingsReloadedEvent');
          $rootScope.$digest();
          SubsonicService.login();
        }
      }
    });



    $('#body-row .collapse').collapse('hide');

    // Collapse/Expand icon
    $('#collapse-icon').addClass('fa-angle-double-left');

    // Collapse click
    $('[data-toggle=sidebar-colapse]').click(function () {
      $rootScope.SidebarCollapse();
    });

    $rootScope.SidebarCollapse = function () {
      $rootScope.isMenuCollapsed = !$rootScope.isMenuCollapsed;
      $('.menu-collapsed').toggleClass('d-none');
      $('.sidebar-submenu').toggleClass('d-none');
      $('.submenu-icon').toggleClass('d-none');
      $('.list-group').toggleClass('card-5');
      $('.sidebar').toggleClass('sidebar-expanded sidebar-collapsed');

      // Treating d-flex/d-none on separators with title
      var SeparatorTitle = $('.sidebar-separator-title');
      if (SeparatorTitle.hasClass('d-flex')) {
        SeparatorTitle.removeClass('d-flex');
      } else {
        SeparatorTitle.addClass('d-flex');
      }

      // Collapse/Expand icon
      $('#collapse-icon').toggleClass('fa-angle-double-left fa-angle-double-right');

      $rootScope.$broadcast('menuSizeChange');
    };

    $('#subProgress').attr('aria-valuenow', 0).css('width', "0%");
    $('#mainProgress').attr('aria-valuenow', 0).css('width', "0%");

    $('.list-group li').click(function (e) {
      e.preventDefault();

      $that = $(this);

      $that.parent().find('li').removeClass('active');
      $that.addClass('active');
    });

    jQuery(".list-group").hover(function () {
      jQuery(this).addClass("active");
    },
      function () {
        jQuery(this).removeClass("active");
      });
    $rootScope.socket.emit('load_settings');

    function debounce(func, wait, immediate) {
      var timeout;
      return function () {
        var context = this,
          args = arguments;
        var later = function () {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    }

    var windowResized = debounce(function () {
      $rootScope.$broadcast('windowResized');
    }, 25);

    $(window).on('resize', windowResized);


    $rootScope.remoteUpdateInfo = function () {
      if ($rootScope.remotePlayerConnected()) {
        var currentMediaTime = $rootScope.remotePlayer.currentTime;
        var currentMediaDuration = $rootScope.remotePlayer.duration;

        var playPercent = 100 * (currentMediaTime / currentMediaDuration);
        if (!isNaN(playPercent)) {
          $('#subProgress').attr('aria-valuenow', "100").css('width', "100%");
          $('#mainProgress').attr('aria-valuenow', playPercent).css('width', playPercent + "%");
          $('#mainTimeDisplay').html($rootScope.formatTime(currentMediaTime) + " / " + $rootScope.formatTime(currentMediaDuration));
        }


      }
    };

    $rootScope.startProgressTimer = function () {
      $rootScope.stopProgressTimer();
      $rootScope.timer = setInterval($rootScope.remoteUpdateInfo, 250);
    };

    /**
     * Stops the timer to increment the media progress bar
     */
    $rootScope.stopProgressTimer = function () {
      if ($rootScope.timer) {
        clearInterval($rootScope.timer);
        $rootScope.timer = null;
      }
    };

    Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
      get: function () {
        return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
      }
    });

    $rootScope.setupRemotePlayer = function () {

      if (!$rootScope.remoteConfigured) {
        $rootScope.remotePlayerController.addEventListener(
          cast.framework.RemotePlayerEventType.IS_PAUSED_CHANGED,
          function () {
            if ($rootScope.remotePlayer.isPaused) {
              $("#playPauseIcon").addClass("fa-play");
              $("#playPauseIcon").removeClass("fa-pause");
            } else {
              $("#playPauseIcon").addClass("fa-pause");
              $("#playPauseIcon").removeClass("fa-play");
            }
          }
        );

        $rootScope.remotePlayerController.addEventListener(
          cast.framework.RemotePlayerEventType.IS_MUTED_CHANGED,
          function () {
            $rootScope.isMuted = $rootScope.remotePlayer.isMuted;
            if ($rootScope.isMuted) {
              vol = 0;
              $('#volumeSlider').val(vol);
            } else {
              vol = $rootScope.remotePlayer.volumeLevel;
              $('#volumeSlider').val(vol * 100);
            }
          }
        );

        $rootScope.remotePlayerController.addEventListener(
          cast.framework.RemotePlayerEventType.VOLUME_LEVEL_CHANGED,
          function () {
            $('#volumeSlider').val($rootScope.remotePlayer.volumeLevel * 100);
          }
        );

        $rootScope.remotePlayerController.addEventListener(
          cast.framework.RemotePlayerEventType.PLAYER_STATE_CHANGED,
          function () {
            console.log('state change ');
            console.log($rootScope.remotePlayer.playerState);

            if ($rootScope.remotePlayer.playerState === null) {
              if ($rootScope.remotePlayer.savedPlayerState) {
                $rootScope.shouldSeek = true;
                $rootScope.prePlannedSeek = $rootScope.remotePlayer.savedPlayerState.currentTime;
                $rootScope.loadTrack($rootScope.selectedIndex);
                console.log('saved state');
              } else {
                $rootScope.next();
              }
            }
            if ($rootScope.remotePlayer.playerState === 'BUFFERING') {
              $('#mainTimeDisplay').html("Buffering...");
            }
            if ($rootScope.remotePlayer.playerState === 'PLAYING' && $rootScope.shouldSeek) {
              $rootScope.shouldSeek = false;
              $rootScope.remotePlayer.currentTime = $rootScope.prePlannedSeek;
              $rootScope.remotePlayerController.seek();

            }


            if (MediaService.playing) {
              $rootScope.shouldSeek = true;
              $rootScope.prePlannedSeek = MediaService.currentTime;
              MediaService.pause();
              $rootScope.loadTrack($rootScope.selectedIndex);
            }
            $rootScope.isMuted = $rootScope.remotePlayer.isMuted;
            if ($rootScope.isMuted) {
              $('#volumeSlider').val(0);
            } else {
              $('#volumeSlider').val($rootScope.remotePlayer.volumeLevel * 100);
            }
            if ($rootScope.remotePlayer.isPaused) {
              $("#playPauseIcon").addClass("fa-play");
              $("#playPauseIcon").removeClass("fa-pause");
            } else {
              $("#playPauseIcon").addClass("fa-pause");
              $("#playPauseIcon").removeClass("fa-play");
            }
            // TODO fix resume support
            if ($rootScope.remotePlayer.mediaInfo && $rootScope.remotePlayer.mediaInfo.metadata) {
              //id = $rootScope.remotePlayer.mediaInfo.contentId;

              //id = id.split("&")[6];
              //id = id.substring(3,id.length - 1);

              //$rootScope.subsonic.getSong2(id).then(function (result) {
              //    console.log("getArtistDetails result")
              //    console.log(result)

              //    if (result) {

              //       

              //        $('#artistInfo').html(source.artist);
              //        $('#artistInfo').attr("href", source.artistUrl);
              //        $('#trackInfo').html(source.title);
              //        $('#trackInfo').attr("href", source.albumUrl);

              //        if (source.starred) {
              //            $("#likeButtonIcon").removeClass('heart-o');
              //            $("#likeButtonIcon").addClass('heart');
              //        } else {
              //            $("#likeButtonIcon").removeClass('heart');
              //            $("#likeButtonIcon").addClass('heart-o');
              //        }

              //        $("#playPauseIcon").addClass("fa-pause");
              //        $("#playPauseIcon").removeClass("fa-play");




              //        $('#nowPlayingImageHolder').attr('src', result.smallImageUrl);
              //        $rootScope.$digest();
              //    }
              //});
            }
          }
        );
        $rootScope.startProgressTimer();
        $rootScope.remoteConfigured = true;
      }
      if ($rootScope.remotePlayerConnected()) {
        if (MediaService.playing) {
          $rootScope.shouldSeek = true;
          $rootScope.prePlannedSeek = MediaService.currentTime;
          MediaService.pause();
          $rootScope.loadTrack($rootScope.selectedIndex);
        }
      }

    };

    $rootScope.setupLocalPlayer = function () {
      $rootScope.stopProgressTimer();
      $rootScope.remoteConfigured = false;
    };

    $rootScope.switchPlayer = function () {
      console.log('switchPlayer');


      if (cast && cast.framework) {
        if ($rootScope.remotePlayerConnected()) {

          $rootScope.setupRemotePlayer();
          return;
        }
      }


      $rootScope.setupLocalPlayer();
    };

    $rootScope.goBack = function () {
      window.history.back();
    };

    $rootScope.checkIfNowPlaying = function (track) {
      var selected = $rootScope.selectedTrack();
      if (selected && track) {
        return track.id === selected.id;
      }
      return false;
    };

    $rootScope.shuffle = function (array) {
      var currentIndex = array.length, temporaryValue, randomIndex;
      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        var existing = array[currentIndex];
        var existing2 = array[randomIndex];
        if(existing && existing2){

          while(true){
            if(array[randomIndex].artist === array[currentIndex].artist)
            randomIndex = Math.floor(Math.random() * currentIndex);
            else break;
          }
        }
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    };

    setTimeout(() => {
      if (ChromecastService.castStatus()) {
        ChromecastService.initializeCast();
      }
    }, 1000);

  }
}

export default ApplicationRun;