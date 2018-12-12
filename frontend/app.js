import angular from 'angular';
import angularRoute from 'angular-route';
__webpack_public_path__ = "http://localhost:" + SERVER_PORT + "/";

import './styles/index';
import 'underscore';
import 'popper.js';
import 'tooltip.js';
import 'jquery.flipster';
import 'moment';
import 'typeface-roboto';
import 'angular-sanitize';
import 'angular-auto-complete';
import 'bootstrap/js/dist/carousel';
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/popover';
import 'bootstrap/js/dist/tooltip';
import 'bootstrap/js/dist/util';

require("ag-grid-community");
import * as agGridCommunity from 'ag-grid-community';
import './API/subsonic.api';
import './API/cast.framework';
import './API/cast.v1';
import Components from './components';
import Services from './services';
import Factories from './factories';
import ApplicationConfig from './config.js';
import ApplicationRun from './run.js';

agGridCommunity.initialiseAgGridWithAngular1(angular);
$('[data-toggle="popover"]').popover();

angular.module('subsonic', [angularRoute, 'ngSanitize', 'agGrid', 'autoCompleteModule', Components.name, Factories.name, Services.name])
  .config(ApplicationConfig)
  .run(ApplicationRun);