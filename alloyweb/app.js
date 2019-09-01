__webpack_public_path__ = "http://localhost:" + API_UI_PORT + "/";
import angular from "angular";
import angularRoute from "angular-route";

import "./styles/index";
import "popper.js";
import "tooltip.js";
import "angular-bootstrap-contextmenu/contextMenu";
import "moment";

//import "typeface-roboto";
import "angular-cookies";
import "angular-sanitize";
import "bootstrap-datepicker";
import "bootstrap/dist/js/bootstrap.min";
import "highcharts/highcharts";
import "parsleyjs";

import "./API/alloy.db";
import "./API/angular-auto-complete";
import "./API/jquery.sortable";

import Directives from "./directives";
import Components from "./components";
import Services from "./services";
import ApplicationConfig from "./config.js";
import ApplicationRun from "./run.js";


angular.module("alloy", ["ng", angularRoute, "ngCookies", "ngSanitize", "autoCompleteModule", "ui.bootstrap.contextMenu", Services.name, Directives.name, Components.name])
  .config(ApplicationConfig)
  .run(ApplicationRun);

if (module.hot) {
  module.hot.accept();
  console.log("[HMR] Accepting module hot update.");
}  