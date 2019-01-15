require('./_.js')
require('./api')
require('./controller')
require('./cover')
require('./flash')
require('./hit')
require('./html5')
require('./main')
//require('./modernizr')
require('./playlistloader')
require('./signal')

var Api = require('./api');
var players = {};

var coverflow = window.coverflow = function(id) {
	if (!id) {
		for (var key in players) {
			id = players[key].id;
		}
	}
	if (id) {
		var foundPlayer = players[id];
		if (foundPlayer) {
			return foundPlayer;
		} else {
			return players[id] = new Api(id);
		}
	}
	return null;
};

if (typeof jQuery !== 'undefined') {
	jQuery.fn.coverflow = function(method) {
		var player = coverflow(this[0].id);
		if (player[method]) {
			return player[method].apply(player, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object') {
			return player.setup.apply(player, arguments);
		} else if (!method) {
			return player;
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.coverflow');
		}
	};
}

module.exports = coverflow;