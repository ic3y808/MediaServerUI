export default function ApplicationConfig($routeProvider, $locationProvider) {
  "ngInject";
  // adding a new route requires that route to also be added to backend/routes/index.js
  // this allows the variables to be passed when navigating directly to that page instead of linking to that page. 
  var buildRoute = (route, element) => {
    $routeProvider.when(route, {
      template: element,
    })
  };

  buildRoute('/', '<home/>');
  buildRoute('/activity', '<activity/>');
  buildRoute('/activity/:id', '<activity/>');
  buildRoute('/artists', '<artists/>');
  buildRoute('/artist/:id', '<artist/>');
  buildRoute('/albums', '<albums/>');
  buildRoute('/album/:id', '<album/>');
  buildRoute('/album/:id/:trackid', '<album/>');
  buildRoute('/charts', '<charts/>');
  buildRoute('/config', '<config/>');
  buildRoute('/config/:id', '<config/>');
  buildRoute('/database', '<database/>');
  buildRoute('/fresh', '<fresh/>');
  buildRoute('/genres/:id', '<genres/>');
  buildRoute('/genre/:id', '<genre/>');
  buildRoute('/genre/:id/trackid', '<genre/>');
  buildRoute('/history', '<history/>');
  buildRoute('/index', '<index/>');
  buildRoute('/playing', '<playing/>');
  buildRoute('/playlists', '<playlists/>');
  buildRoute('/playlist/:id', '<playlist/>');
  buildRoute('/playlist/:id/trackid', '<playlist/>');
  buildRoute('/starred', '<starred/>');
  buildRoute('/status', '<status/>');

  $routeProvider.otherwise({
    templateUrl: '/template/fourofour.jade',
  })

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  }).hashPrefix('');
}