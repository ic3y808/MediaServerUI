'use strict';

var angular = require('angular');

angular.module('subsonic').controller('chromecastService', require('./factory.chromecast'));
angular.module('subsonic').controller('subsonicService', require('./factory.subsonic'));