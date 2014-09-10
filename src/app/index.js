window.L = require('leaflet');
window.$ = window.jQuery = require('jquery');
var _ = require('underscore');
var moment = require('moment');

L.Icon.Default.imagePath = 'css/images';

var map = L.map('map', {zoom: 2, center: [0,0]});

map.addLayer(L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png'))

var featureGroup = L.featureGroup().addTo(map);

var markers = {};
var polyLines = {};

var raw;
var data = {};

$.get('/data/latest', function(d) {

	raw = d;

	appendData(d);

	populateMap();

	setInterval(function() {

		$.get('/data/latest', function(d) {

			var newData = _.filter(d, function(item) { return !_.findWhere(raw, item); });

			raw = d;

			var appended = appendData(newData);

			appendToMap(appended);

		}, 'json');

	}, 5 * 1000);

}, 'json');

function appendData(d) {

	var appended = {};

	_.each(d, function(pos) {

		if(!data[pos.userId])
			data[pos.userId] = [];

		if(!appended[pos.userId])
			appended[pos.userId] = [];

		var parsedPos = {
			coords: L.latLng([pos.lat,pos.lon]),
			time: pos.time
		};

		appended[pos.userId].push(parsedPos);
		data[pos.userId].push(parsedPos);

	});

	return appended;

}

function populateMap() {

	var userIds = _.keys(data);

	_.each(userIds, function(user) {

		var latLons = _.map(data[user], function(pos) { return pos.coords; });

		markers[user] = L.featureGroup().addTo(map);

		_.each(data[user], function(pos) {
			getMarker(pos).addTo(markers[user]);
		});

		polyLines[user] = L.polyline(latLons).addTo(featureGroup);

	});

	map.fitBounds(featureGroup.getBounds());

}

function appendToMap(d) {

	var userIds = _.keys(d);

	_.each(userIds, function(user) {

		_.each(d[user], function(pos) {

			getMarker(pos).addTo(markers[user]);

			polyLines[user].addLatLng(pos.coords);

		});

	});

}

function getMarker(pos) {

	var marker = L.marker(pos.coords, {
		riseOnHover: true
	})

	marker.bindPopup('<p>' + moment(pos.time).fromNow() + '</p>')

	setInterval(function() {
		marker.bindPopup('<p>' + moment(pos.time).fromNow() + '</p>')		
	}, 10 * 1000);

	return marker;

}