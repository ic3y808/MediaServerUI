import angular from 'angular';
import angularRoute from 'angular-route';
__webpack_public_path__ = "http://localhost:" + SERVER_PORT + "/";

import './styles/index'
import 'underscore';
import 'popper.js';
import 'tooltip.js';
import 'jquery-easing';
import 'jquery.flipster';
import 'moment';
import 'bootstrap';
import 'typeface-roboto'

require("ag-grid-community");
import * as agGridCommunity from 'ag-grid-community';
import SubsonicAPI from './API/subsonic.api';
import Clipboard from 'clipboard';
import Components from './components';
import Services from './services';
import Factories from './factories';
import ApplicationConfig from './config.js';
import ApplicationRun from './run.js';

agGridCommunity.initialiseAgGridWithAngular1(angular);
$('[data-toggle="popover"]').popover();

angular.module('subsonic', [angularRoute, 'agGrid', Components.name, Factories.name, Services.name])
  .config(ApplicationConfig)
  .run(ApplicationRun);