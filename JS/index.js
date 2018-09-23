var app = angular.module('subsonic',
    [
        'ngRoute',
        'datatables',
        'datatables.bootstrap',
        'datatables.buttons',
        'factories-subsonic',
        'controllers-home',
        'controllers-settings',
        'controllers-status',
        'controllers-music'
    ]);

app.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {

        $routeProvider.when('/', {
            templateUrl: 'template/home.jade',
            controller: 'homeController'
        }).when('/status', {
            templateUrl: 'template/status.jade',
            controller: 'statusController'
        }).when('/settings', {
            templateUrl: 'template/settings.jade',
            controller: 'settingsController'
        }).when('/music', {
            templateUrl: 'template/music.jade',
            controller: 'musicController'
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
    $rootScope.socket = io('//' + document.location.hostname + ':' + document.location.port);
    $rootScope.socket.on('ping', function (data) {
        if (data)
            $('#ping').html("<code>Connected: " + JSON.parse(data).date + "</code>");
    });
    $rootScope.socket.on('settings_event', function (data) {
        if (data){
            console.log('settings event')
            console.log(data)
        }
        var d = data[0];
        if (d) {
            $rootScope.settings = {
                "subsonic_username": d.subsonic_username,
                "subsonic_password": d.subsonic_password,
                "subsonic_address": d.subsonic_address,
                "subsonic_port": d.subsonic_port,
                "subsonic_use_ssl": d.subsonic_use_ssl
            }
            $rootScope.$digest();
            var login = subsonicService.login();
            if (login)
                login.then(function () {
                    $rootScope.$digest();
                });
        }
    });
    $rootScope.socket.emit('load_settings');
});

app.factory('Page', function () {
    var title = '!P L A N E T ::::: B A S S!';
    return {
        title: function () {
            return title;
        },
        setTitle: function (newTitle) {
            title = newTitle;
        }
    };
});