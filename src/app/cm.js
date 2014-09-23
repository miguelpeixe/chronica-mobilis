window.L = require('leaflet');
window.$ = window.jQuery = require('jquery');
var _ = require('underscore');
var moment = require('moment');

L.Icon.Default.imagePath = 'css/images';

module.exports = function(options) {

	options = options || {};

	config = _.extend({
		mapContainer: 'map',
		tiles: 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png',
		zoom: 2,
		center: [0,0],
		data: 'latest',
		interval: 5,
		markers: true,
		layerOptions: {}
	}, options);

	var map = L.map(config.mapContainer, {zoom: config.zoom, center: config.center});

	map.addLayer(L.tileLayer(config.tiles));

	var featureGroup = L.featureGroup().addTo(map);

	var markers = {};
	var polyLines = {};

	var raw;
	var data = {};

	var discoveries = [];
	if(config.discoveries) {
		_.each(config.discoveries, function(discovery) {
			if(discovery.coords && typeof discovery.callback == 'function') {
				discovery.coords = L.latLng(discovery.coords[0], discovery.coords[1]);
				discovery.distance = discovery.distance || 20;
				discoveries.push(discovery);
			}
		});
	}

	$.get('/data/' + config.data, function(d) {

		raw = d;

		var appended = appendData(d);

		initMap();

		execDiscoveries(appended, true);

		setInterval(function() {

			$.get('/data/' + config.data, function(d) {

				var newData = _.filter(d, function(item) { return !_.findWhere(raw, item); });

				raw = d;

				var appended = appendData(newData);

				if(!_.isEmpty(appended)) {
					appendToMap(appended);
					execDiscoveries(appended, false);
				};

			}, 'json');

		}, config.interval * 1000);

	}, 'json');

	function initMap() {

		var userIds = _.keys(data);

		if(userIds.length) {
			_.each(userIds, function(user) {

				var latLons = _.map(data[user], function(pos) { return pos.coords; });

				if(config.markers) {
					markers[user] = L.featureGroup().addTo(map);
					_.each(data[user], function(pos) {
						getMarker(pos, getMarkerOptions(user)).addTo(markers[user]);
					});
				}

				polyLines[user] = L.polyline(latLons, getLineOptions(user)).addTo(featureGroup);

			});
			map.fitBounds(featureGroup.getBounds());
		}

	}

	function appendData(d) {

		var appended = {};

		_.each(d, function(pos) {

			if(!data[pos.userId])
				data[pos.userId] = [];

			if(!appended[pos.userId])
				appended[pos.userId] = [];

			var parsedPos = {
				user: pos.userId,
				coords: L.latLng([pos.lat,pos.lon]),
				time: pos.time
			};

			appended[pos.userId].push(parsedPos);
			data[pos.userId].push(parsedPos);

		});

		return appended;

	}

	function appendToMap(d) {

		var userIds = _.keys(d);

		_.each(userIds, function(user) {

			_.each(d[user], function(pos) {

				if(config.markers) {
					getMarker(pos, getMarkerOptions(user)).addTo(markers[user]);
				}

				polyLines[user].addLatLng(pos.coords);

			});

		});

	}

	function getLineOptions(user) {

		var lineOptions = {};

		if(config.layerOptions[user] && config.layerOptions[user].line) {
			lineOptions = config.layerOptions[user].line;
		};

		return lineOptions;

	}

	function getMarkerOptions(user) {

		var markerOptions = {
			riseOnHover: true
		};

		if(config.layerOptions[user] && config.layerOptions[user].marker) {
			markerOptions = _.extend(markerOptions, config.layerOptions[user].marker);
		}

		return markerOptions;
	}

	function getMarker(pos, options) {

		var marker = L.marker(pos.coords, options);

		marker.bindPopup('<p>' + moment(pos.time).fromNow() + '</p>')

		setInterval(function() {
			marker.bindPopup('<p>' + moment(pos.time).fromNow() + '</p>')		
		}, 10 * 1000);

		return marker;

	}

	function execDiscoveries(d, init) {
		if(discoveries) {
			_.each(discoveries, function(discovery) {

				if(!init || (init && discovery.init)) {
					_.each(d, function(positions, user) {
						_.each(positions, function(pos) {
							if(pos.coords.distanceTo(discovery.coords) <= discovery.distance
								&& (!discovery.user || discovery.user == pos.user)) {
								discovery.callback(pos);
							}
						});
					});
				}

			});
		}
	}

	return map;

};