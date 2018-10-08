import 'popper.js';
import 'tooltip.js';
import 'bootstrap';
import 'underscore';
import 'typeface-roboto'
import 'jquery-easing';
import 'moment';

//require('./less/reset.less');
require('./css/styles.css');
//require('./less/styles.less');


require("ag-grid-community");
import * as agGridCommunity from 'ag-grid-community';
require("modules/ag-grid-community/dist/styles/ag-grid.css");
require("modules/ag-grid-community/dist/styles/ag-theme-dark.css");


import './scss/app.scss';
import angular from 'angular';
import angularRoute from 'angular-route';
import SubsonicAPI from './API/subsonic.api.es6';
import Clipboard from 'clipboard';
import ChromecastFactory from './factories/factory.chromecast.es6';
import SubsonicFactory from './factories/factory.subsonic.es6';
import MediaFactory from './factories/factory.media.es6';
import ArtistController from './controllers/controller.artist.es6';
import ArtistsController from './controllers/controller.artists.es6';
import GenreController from './controllers/controller.genre.es6';
import GenresController from './controllers/controller.genres.es6';
import HomeController from './controllers/controller.home.es6';
import IndexController from './controllers/controller.index.es6';
import PlayingController from './controllers/controller.playing.es6';
import PlaylistController from './controllers/controller.playlist.es6';
import PlaylistsController from './controllers/controller.playlists.es6';
import PodcastsController from './controllers/controller.podcasts.es6';
import SettingsController from './controllers/controller.settings.es6';
import StarredController from './controllers/controller.starred.es6';
import StatusController from './controllers/controller.status.es6';
import AppConfig from './config.es6.js';
import ApplicationRun from './run.es6.js';

agGridCommunity.initialiseAgGridWithAngular1(angular);
$('[data-toggle="popover"]').popover();

angular.module('subsonic', [angularRoute, 'agGrid'])
  .factory('ChromecastService', ChromecastFactory)
  .factory('SubsonicService', SubsonicFactory)
  .factory('MediaService', MediaFactory)
  .controller('ArtistController', ArtistController)
  .controller('ArtistsController', ArtistsController)
  .controller('GenreController', GenreController)
  .controller('GenresController', GenresController)
  .controller('HomeController', HomeController)
  .controller('IndexController', IndexController)
  .controller('PlayingController', PlayingController)
  .controller('PlaylistController', PlaylistController)
  .controller('PlaylistsController', PlaylistsController)
  .controller('PodcastsController', PodcastsController)
  .controller('SettingsController', SettingsController)
  .controller('StarredController', StarredController)
  .controller('StatusController', StatusController)
  .config(AppConfig)
  .run(ApplicationRun);
