export default function ApplicationConfig($routeProvider, $locationProvider) {
  "ngInject";
  // adding a new route requires that route to also be added to backend/routes/index.js
  // this allows the variables to be passed when navigating directly to that page instead of linking to that page. 
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
  }).when('/config', {
    template: '<config></config>',
  }).when('/config/:id', {
    template: '<config/>'
  }).when('/artists', {
    template: '<artists></artists>',
  }).when('/artist/:id', {
    template: '<artist></artist>',
  }).when('/albums', {
    template: '<albums></albums>',
  }).when('/album/:id', {
    template: '<album></album>',
  }).otherwise({
    redirectTo: '/'
  });
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  }).hashPrefix('');
}