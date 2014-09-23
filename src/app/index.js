var cm = require('./cm');

/*
 * Initializing our config var with basic options
 */
var config = {
	tiles: 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', // TileLayer
};

/*
 * Markers and lines options and styling
 * Marker options documentation: http://leafletjs.com/reference.html#marker
 * PolyLine options documentation: http://leafletjs.com/reference.html#polyline (see http://leafletjs.com/reference.html#path for further options)
 */
config.layerOptions = {
	'default': {
		line: {
			color: '#333'
		},
		marker: {
			// marker options goes here
		}
	},
	'miguelpeixe': {
		line: {
			color: '#fff'
		},
		marker: {
			// marker options goes here
		}
	}
};

/*
 * Array of interactions to execute when ground user is close to determined position
 */
config.discoveries = [
	{
		user: 'miguelpeixe', // null or false to exec on all users
		coords: [1,1], // latitude and longitude coordinates
		distance: 20, // max distance radius in meters. Default is 20
		init: true, // should it run when this location has already been passed by the ground user. Default is false
		callback: function(pos) {
			/*
			 * Magic goes here
			 * Receives an object with user, coords, and date
			 */
			console.log(pos);
		}
	},
	{
		coords: [-54,13],
		distance: 10,
		callback: function(pos) {
			alert('someone is passing by here!');
		}
	}
];

var map = cm(config);