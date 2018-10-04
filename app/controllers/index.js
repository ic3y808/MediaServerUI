'use strict';

var angular = require('angular');

angular.module('subsonic').controller('artistController', require('./controller.artist'));
angular.module('subsonic').controller('artistsController', require('./controller.artists'));
angular.module('subsonic').controller('genreController', require('./controller.genre'));
angular.module('subsonic').controller('genresController', require('./controller.genres'));
angular.module('subsonic').controller('homeController', require('./controller.home'));
angular.module('subsonic').controller('indexController', require('./controller.index'));
angular.module('subsonic').controller('playingController', require('./controller.playing'));
angular.module('subsonic').controller('playlistController', require('./controller.playlist'));
angular.module('subsonic').controller('playlistsController', require('./controller.playlists'));
angular.module('subsonic').controller('podcastsController', require('./controller.podcasts'));
angular.module('subsonic').controller('settingsController', require('./controller.settings'));
angular.module('subsonic').controller('starredController', require('./controller.starred'));
angular.module('subsonic').controller('statusController', require('./controller.status'));