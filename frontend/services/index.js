import angular from 'angular';

import AppUtilitiesService from './appUtilities.service';
import BackendService from './backend.service';
import SubsonicService from './subsonicService.service';
import MediaElement from './mediaElement.service';
import MediaPlayer from './mediaPlayer.service';

export default angular
  .module('app.services', [])
  .service('AppUtilities', AppUtilitiesService)
  .service('Backend', BackendService)
  .service('SubsonicService', SubsonicService)
  .service('MediaElement', MediaElement)
  .service('MediaPlayer', MediaPlayer)
;