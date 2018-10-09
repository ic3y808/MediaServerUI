import angular from 'angular';
import angularRoute from 'angular-route';

import './styles/index'

import 'underscore';
import 'popper.js';
import 'tooltip.js';
import 'jquery-easing';
import 'moment';
import 'bootstrap';
import 'typeface-roboto'

require("ag-grid-community");
import * as agGridCommunity from 'ag-grid-community';
//require("modules/ag-grid-community/dist/styles/ag-grid.css");
//require("modules/ag-grid-community/dist/styles/ag-theme-dark.css");
import SubsonicAPI from './API/subsonic.api';
import Clipboard from 'clipboard';

import Components from './components';
import Services from './services';
import AppConfig from './config.js';
import ApplicationRun from './run.js';

agGridCommunity.initialiseAgGridWithAngular1(angular);
$('[data-toggle="popover"]').popover();

angular.module('subsonic', [angularRoute, 'agGrid', Components.name, Services.name])
  .config(AppConfig)
  .run(ApplicationRun);
