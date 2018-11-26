export default function ApplicationConfig($routeProvider, $locationProvider) {
  "ngInject";
  // adding a new route requires that route to also be added to backend/routes/index.js
  // this allows the variables to be passed when navigating directly to that page instead of linking to that page. 
  $routeProvider.when('/', {
    template: '<home/>',
  }).when('/fresh', {
    template: '<fresh/>',
  }).when('/status', {
    template: '<status/>',
  }).when('/index', {
    template: '<index/>',
  }).when('/starred', {
    template: '<starred/>',
  }).when('/playlist', {
    template: '<playlist/>',
  }).when('/playlists', {
    template: '<playlists/>',
  }).when('/genres', {
    template: '<genres/>',
  }).when('/genre/:id', {
    template: '<genre/>',
  }).when('/podcasts', {
    template: '<podcasts/>',
  }).when('/playing', {
    template: '<playing/>',
  }).when('/config', {
    template: '<config/>',
  }).when('/config/:id', {
    template: '<config/>'
  }).when('/activity', {
    template: '<activity/>',
  }).when('/activity/:id', {
    template: '<activity/>'
  }).when('/artists', {
    template: '<artists/>',
  }).when('/artist/:id', {
    template: '<artist/>',
  }).when('/albums', {
    template: '<albums/>',
  }).when('/album/:id', {
    template: '<album/>',
  }).otherwise({
    redirectTo: '/'
  });
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  }).hashPrefix('');
}