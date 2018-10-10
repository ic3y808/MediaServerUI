import angular from 'angular';

import ChromecastFactory from './factory.chromecast';
import SubsonicFactory from './factory.subsonic';

export default angular
  .module('app.factories', [])
  .factory('chromecastService', ChromecastFactory)
  .factory('subsonicService', SubsonicFactory)
;