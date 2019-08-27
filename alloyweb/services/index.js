import angular from "angular";

import CacheService from "./cache.service";
import TitleService from "./title.service";
import LoggerService from "./logger.service";
import AppUtilitiesService from "./appUtilities.service";
import AuthenticationService from "./authentication.service";
import BackendService from "./backend.service";
import AlloyDbService from "./alloyDbService.service";
import MediaElement from "./mediaElement.service";
import MediaPlayer from "./mediaPlayer.service";
import UserService from "./user.service";

export default angular
  .module("app.services", [])
  .service("Cache", CacheService)
  .service("Title", TitleService)
  .service("Logger", LoggerService)
  .service("AppUtilities", AppUtilitiesService)
  .service("AuthenticationService", AuthenticationService)
  .service("Backend", BackendService)
  .service("AlloyDbService", AlloyDbService)
  .service("MediaElement", MediaElement)
  .service("MediaPlayer", MediaPlayer)
  .service("UserService", UserService)
  ;