class ApplicationConfig {
  constructor($routeProvider, $locationProvider) {
    "ngInject";
    $routeProvider.when('/', {
      template: '<home></home>',
    }).when('/fresh', {
      template: '<fresh></fresh>',
    }).when('/status', {
      template: '<status></status>',
    }).when('/index', {
      template: '<index></index>',
    }).when('/starred', {
      template: '<starred></starred>',
    }).when('/playlist', {
      template: '<playlist></playlist>',
    }).when('/playlists', {
      template: '<playlists></playlists>',
    }).when('/genres', {
      template: '<genres></genres>',
    }).when('/genre/:id', {
      template: '<genre></genre>',
    }).when('/podcasts', {
      template: '<podcasts></podcasts>',
    }).when('/playing', {
      template: '<playing></playing>',
    }).when('/settings/subsonic', {
      template: '<subsonicSettings></subsonicSettings>',
    }).when('/artists', {
      template: '<artists></artists>',
    }).when('/artist/:id', {
      template: '<artist></artist>',
    }).otherwise({
      redirectTo: '/'
    });
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    }).hashPrefix('');
    }
  }

export default ApplicationConfig;