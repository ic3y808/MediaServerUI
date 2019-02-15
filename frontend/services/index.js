import angular from 'angular';

import CacheService from './cache.service';
import LoggerService from './logger.service';
import AppUtilitiesService from './appUtilities.service';
import BackendService from './backend.service';
import AlloyDbService from './alloyDbService.service';
import MediaElement from './mediaElement.service';
import MediaPlayer from './mediaPlayer.service';

export default angular
  .module('app.services', [])
  .service('Cache', CacheService)
  .service('Logger', LoggerService)
  .service('AppUtilities', AppUtilitiesService)
  .service('Backend', BackendService)
  .service('AlloyDbService', AlloyDbService)
  .service('MediaElement', MediaElement)
  .service('MediaPlayer', MediaPlayer)
;