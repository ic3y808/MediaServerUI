agGrid.initialiseAgGridWithAngular1(angular);

var app = angular.module('subsonic',
    [
        'ngRoute',
        'ngSanitize',
        'agGrid',
        'com.2fdevs.videogular',
        'com.2fdevs.videogular.plugins.controls',
        'com.2fdevs.videogular.plugins.overlayplay',
        'com.2fdevs.videogular.plugins.poster',
        'com.benjipott.videogular.plugins.chromecast',
        'factories-subsonic',
        'controllers-home',
        'controllers-settings',
        'controllers-status',
        'controllers-music',
        'controllers-artist',
        'controllers-playlist'
    ]);

app.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $(".content").css("display", "none");
        $(".loader").css("display", "block");
        $routeProvider.when('/', {
            templateUrl: 'template/home.jade',
            controller: 'homeController'
        }).when('/status', {
            templateUrl: 'template/status.jade',
            controller: 'statusController'
        }).when('/playlist', {
            templateUrl: 'template/playlist.jade',
            controller: 'playlistController'
        }).when('/settings', {
            templateUrl: 'template/settings.jade',
            controller: 'settingsController'
        }).when('/music', {
            templateUrl: 'template/music.jade',
            controller: 'musicController'
        }).when('/artist/:id', {
            templateUrl: 'template/artist.jade',
            controller: 'artistController'
        }).otherwise({
            redirectTo: '/'
        });
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        }).hashPrefix('');
    }
]);

app.factory('audio', function ($document) {
    var audio = $document[0].getElementById('playlist-audio');
    return audio;
}); 

app.run(function ($rootScope, audio, subsonicService) {
    $rootScope.isLoggedIn = false;
    $rootScope.activeSong = "";
    $rootScope.playing = false;
    $rootScope.selectedIndex = 0;
    $rootScope.tracks = [{
        'track': 1,
        'name': '',
        'length': '',
        'file': ''
    },];
    $rootScope.settings = [];
    $rootScope.trackCount = function() { return $rootScope.tracks.length; }
    $rootScope.selectedTrack = function () {
        return $rootScope.tracks[$rootScope.selectedIndex]
    };
    $rootScope.audioSource = function () {
        return $rootScope.selectedTrack();
    };

    $rootScope.loadTrack = function (index) {
        $rootScope.selectedIndex = index;
        console.log('loadTrack')
       
   

        var source = $rootScope.audioSource();
        console.log(source)
        source.artistUrl = "/artist/" + source.artistId;
        source.albumUrl = "/album/" + source.albumId;
        source.url = $rootScope.subsonic.streamUrl(source.id, 320);

        audio.src = source.url;

        $('#artistInfo').html(source.artist);
        $('#artistInfo').attr("href", source.artistUrl);
        $('#trackInfo').html(source.title);
        $('#trackInfo').attr("href", source.albumUrl);
        

        $rootScope.subsonic.getArtist(source.artistId).then(function (artist) {
            if (artist.coverArt) {
                $rootScope.subsonic.getCoverArt(artist.coverArt, 128).then(function (result) {
                    $('#nowPlayingImageHolder').attr('src', result);
                    $rootScope.$digest();
                })
            }
        })



        audio.load();
        audio.play();
        $('#volumeSlider').val(audio.volume * 100)  
    }

    $rootScope.play = function () {
        audio.play();
    }

    $rootScope.pause = function () {
        audio.pause();
    }

    $rootScope.stop = function () {
        audio.stop();
    }

    $rootScope.previous = function () {
        $rootScope.selectedIndex--;
        $rootScope.selectedIndex = ($rootScope.selectedIndex < 0 ? $rootScope.tracks.length - 1 : $rootScope.selectedIndex);
        $rootScope.loadTrack($rootScope.selectedIndex);
    };
    $rootScope.next = function () {
        $rootScope.selectedIndex++;
        $rootScope.selectedIndex = ($rootScope.selectedIndex >= $rootScope.tracks.length ? 0 : $rootScope.selectedIndex);
        $rootScope.loadTrack($rootScope.selectedIndex);
    };

    $rootScope.formatTime = function (seconds) {
        minutes = Math.floor(seconds / 60);
        minutes = (minutes >= 10) ? minutes : "0" + minutes;
        seconds = Math.floor(seconds % 60);
        seconds = (seconds >= 10) ? seconds : "0" + seconds;
        return minutes + ":" + seconds;
    }

    $("#playlist-audio").on("play", function () {
        $rootScope.$apply(function () {
            $rootScope.playing = true;
            $("#playPauseIcon").addClass("fa-pause");
            $("#playPauseIcon").removeClass("fa-play");
        });
    });
    $("#playlist-audio").on("pause", function () {
        $rootScope.$apply(function () {
            $rootScope.playing = false;
            $("#playPauseIcon").removeClass("fa-pause");
            $("#playPauseIcon").addClass("fa-play");
        });
    });
    $("#playlist-audio").on("ended", function () {
        $rootScope.$apply(function () {
            if (($rootScope.selectedIndex + 1) === $rootScope.tracks.length) {
                $rootScope.playing = false;
                $rootScope.selectedIndex = 0;
                $('#playlist-audio').src = $rootScope.audioSource();
                $("#playPauseIcon").removeClass("fa-pause");
                $("#playPauseIcon").addClass("fa-play");
                $('#subProgress').attr('aria-valuenow', 0).css('width', "0%");
                $('#mainProgress').attr('aria-valuenow', 0).css('width', "0%");
                $('#mainTimeDisplay').html("0:00 / 0:00");
            } else {
                $rootScope.playing = true;
                $rootScope.next();
            }
        });
    });
    $("#playlist-audio").on("canplaythrough", function () {
        console.log(audio.duration);
        $('#mainTimeDisplay').html("0:00 / " + $rootScope.formatTime(audio.duration));
        $('#subProgress').attr('aria-valuenow', 0).css('width', "0%");
        $('#mainProgress').attr('aria-valuenow', 0).css('width', "0%");

    });
    $("#playlist-audio").on("timeupdate", function () {
        var playPercent = 100 * (audio.currentTime / audio.duration);
        var buffered = audio.buffered;
        var loaded;


        if (buffered.length) {
            loaded = 100 * buffered.end(0) / audio.duration;
        }

       
        $('#subProgress').attr('aria-valuenow', loaded).css('width', loaded + "%");
        $('#mainProgress').attr('aria-valuenow', playPercent).css('width', playPercent + "%");
        $('#mainTimeDisplay').html($rootScope.formatTime(audio.currentTime) + " / " + $rootScope.formatTime(audio.duration));
    });

    $("#skipBackButton").click(function () {
        $rootScope.previous();
    });
    $("#playPauseButton").click(function () {
        if ($rootScope.playing) $rootScope.pause();
        else $rootScope.play();
    });
    $("#stopButton").click(function () {
        $rootScope.stop();
    });
    $("#skipNextButton").click(function () {
        $rootScope.next();
    });

    $("#volumeSlider").on('change', function() { audio.volume = $('#volumeSlider').val() / 100 });

    $rootScope.socket = io('//' + document.location.hostname + ':' + document.location.port);
    $rootScope.socket.on('ping', function (data) {
        if (data)
            $('#ping').html("<code>Connected: " + JSON.parse(data).date + "</code>");
    });
    $rootScope.socket.on('settings_event', function (data) {
        if (data) {
            console.log('settings event')
            var d = data[0];
            if (d) {
                $rootScope.settings = {
                    "subsonic_username": d.subsonic_username,
                    "subsonic_password": d.subsonic_password,
                    "subsonic_address": d.subsonic_address,
                    "subsonic_port": d.subsonic_port,
                    "subsonic_use_ssl": d.subsonic_use_ssl
                }
                $rootScope.$broadcast('settingsReloadedEvent');
                $rootScope.$digest();
                var login = subsonicService.login();
                if (login)
                    login.then(function () {
                        $rootScope.$digest();
                    });
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
        $('.menu-collapsed').toggleClass('d-none');
        $('.sidebar-submenu').toggleClass('d-none');
        $('.submenu-icon').toggleClass('d-none');
        $('.content').toggleClass('content-wide');
        $('#sidebar-container').toggleClass('sidebar-expanded sidebar-collapsed');

        // Treating d-flex/d-none on separators with title
        var SeparatorTitle = $('.sidebar-separator-title');
        if (SeparatorTitle.hasClass('d-flex')) {
            SeparatorTitle.removeClass('d-flex');
        } else {
            SeparatorTitle.addClass('d-flex');
        }

        // Collapse/Expand icon
        $('#collapse-icon').toggleClass('fa-angle-double-left fa-angle-double-right');
        $rootScope.isMenuCollapsed = !$rootScope.isMenuCollapsed;
    }

    $('#subProgress').attr('aria-valuenow', 0).css('width', "0%");
    $('#mainProgress').attr('aria-valuenow', 0).css('width', "0%");

    $rootScope.socket.emit('load_settings');
    console.log('wee')
});