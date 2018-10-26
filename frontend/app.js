import angular from 'angular';
import angularRoute from 'angular-route';
import angularAnimate from 'angular-animate';
__webpack_public_path__ = "http://localhost:" + SERVER_PORT + "/";

import './styles/index';
import 'underscore';
import 'popper.js';
import 'tooltip.js';
//import 'jquery-easing';
import 'jquery.flipster';
import 'moment';
//import 'bootstrap';
import 'typeface-roboto';
import 'bootstrap/js/dist/carousel';
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/popover';
import 'bootstrap/js/dist/tooltip';
import 'bootstrap/js/dist/util';

require("ag-grid-community");
import * as agGridCommunity from 'ag-grid-community';
import SubsonicAPI from './API/subsonic.api';
import CastFramework from './API/cast.framework';
import CastAPI from './API/cast.v1';
//import Clipboard from 'clipboard';
import Components from './components';
import Services from './services';
import Factories from './factories';
import ApplicationConfig from './config.js';
import ApplicationRun from './run.js';

agGridCommunity.initialiseAgGridWithAngular1(angular);
$('[data-toggle="popover"]').popover();

angular.module('subsonic', [angularRoute, angularAnimate, 'agGrid', Components.name, Factories.name, Services.name])
  .config(ApplicationConfig)
  .run(ApplicationRun);