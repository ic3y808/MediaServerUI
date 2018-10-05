function config($routeProvider, $locationProvider) {
  $(".content").css("display", "none");
  $(".loader").css("display", "block");
  $routeProvider.when('/', {
    templateUrl: 'template/home.jade',
    controller: 'HomeController'
  }).when('/status', {
    templateUrl: 'template/status.jade',
    controller: 'StatusController'
  }).when('/index', {
    templateUrl: 'template/index-view.jade',
    controller: 'IndexController'
  }).when('/starred', {
    templateUrl: 'template/starred.jade',
    controller: 'StarredController'
  }).when('/playlist', {
    templateUrl: 'template/playlist.jade',
    controller: 'PlaylistController'
  }).when('/playlists', {
    templateUrl: 'template/playlists.jade',
    controller: 'PlaylistsController'
  }).when('/genres', {
    templateUrl: 'template/genres.jade',
    controller: 'GenresController'
  }).when('/genre/:id', {
    templateUrl: 'template/genre.jade',
    controller: 'GenreController'
  }).when('/podcasts', {
    templateUrl: 'template/podcasts.jade',
    controller: 'PodcastsController'
  }).when('/playing', {
    templateUrl: 'template/playing.jade',
    controller: 'PlayingController'
  }).when('/settings', {
    templateUrl: 'template/settings.jade',
    controller: 'SettingsController'
  }).when('/artists', {
    templateUrl: 'template/artists.jade',
    controller: 'ArtistsController'
  }).when('/artist/:id', {
    templateUrl: 'template/artist.jade',
    controller: 'ArtistController'
  }).otherwise({
    redirectTo: '/'
  });
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  }).hashPrefix('');
}

export default ['$routeProvider', '$locationProvider', config];