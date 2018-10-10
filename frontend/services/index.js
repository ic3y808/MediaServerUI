import angular from 'angular';

import SubsonicService from './subsonicService.service';
import MediaService from './mediaService.service';
import ChromecastService from './chromecastService.service';

export default angular
  .module('app.services', [])
  .service('SubsonicService', SubsonicService)
  .service('MediaService', MediaService)
  .service('ChromecastService', ChromecastService)
;