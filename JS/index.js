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

app.run(function ($rootScope, subsonicService) {
    $rootScope.isLoggedIn = false;
    $rootScope.activeSong = "";
    $rootScope.settings = [];
    $rootScope.config = {
        sources: null,
        tracks: null,
        theme: 'bower_components/videogular-themes-default/videogular.css',
        plugins: {
            poster: 'http://www.videogular.com/assets/images/videogular.png'
        }
    };
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
    $('[data-toggle=sidebar-colapse]').click(function() {
        $rootScope.SidebarCollapse();
    });

    $rootScope.SidebarCollapse = function  () {
        $('.menu-collapsed').toggleClass('d-none');
        $('.sidebar-submenu').toggleClass('d-none');
        $('.submenu-icon').toggleClass('d-none');
        $('.content').toggleClass('content-wide');
        $('#sidebar-container').toggleClass('sidebar-expanded sidebar-collapsed');
        
        // Treating d-flex/d-none on separators with title
        var SeparatorTitle = $('.sidebar-separator-title');
        if ( SeparatorTitle.hasClass('d-flex') ) {
            SeparatorTitle.removeClass('d-flex');
        } else {
            SeparatorTitle.addClass('d-flex');
        }
        
        // Collapse/Expand icon
        $('#collapse-icon').toggleClass('fa-angle-double-left fa-angle-double-right');
        $rootScope.isMenuCollapsed = !$rootScope.isMenuCollapsed;
    }

    $rootScope.socket.emit('load_settings');
});