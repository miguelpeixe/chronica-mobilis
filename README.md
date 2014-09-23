# Chronica Mobilis

Location server and map visualization platform for [Chronica Mobilis](http://chronicamobilis.net) project.

---

## Requirements

 - node 0.10.x
 - npm 1.5.x

## Installation

Install dependencies:

```
$ npm install
```

Run application:

```
$ npm start
```

## Usage

### Ground user setup

Use [Self-Hosted GPS Tracker](https://play.google.com/store/apps/details?id=fr.herverenault.selfhostedgpstracker) Android app and set URL to your application:

```
http://localhost:8000/updateLocation/[userId]
```

Access data at [http://localhost:8000/data](http://localhost:8000/data)

Start a new CSV base by accessing [http://localhost:8000/reset](http://localhost:8000/reset)

### Visualize tracking

Access [http://localhost:8000](http://localhost:8000) to view a map with updated locations from the last navigation

## Customize visualization interaction

Chronica Mobilis visualization has several features to customize and interact with the visualization. You can see an example by looking at how our front-end app is initialized [here](/src/app/index.js)

Here's a more detailed explanation on how it works:

### Initialize the app

Get the library and init a visualization with default options:

```javascript
var cm = require('./cm');
var map = cm();
```

### Deploy changes

After you change the code in the `src` directory, you'll need to deploy running this on your terminal:

```
$ npm run build
```

To watch for changes and deploy automatically, run this:

```
npm run watch
```

Both scripts are shortcuts to execute `grunt`.

### Options

`cm` receives an object with options. Returns a [L.Map](http://leafletjs.com/reference.html#map-class) so you can customize the map all you want.

Example with custom tiles:

```javascript
var options = {
	tiles: 'http://custom.tile.url/{z}/{x}/{y}.png'
};
var map = cm(options);
```

#### Basic options

 - `mapContainer`: *string* - ID for the map container (default is `map`)
 - `tiles`: *string* - custom tiles url (default is `http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png`)
 - `zoom`: *number* - default map zoom (default is `2`)
 - `center`: *array* - default map center (default is `[0,0]`)
 - `interval`: *number* - interval in seconds to look for new locations (default is `5`)
 - `markers`: *boolean* - `true` if you want to display markers on user locations (default is `true`)

#### Layers options

Location data can be displayed as [markers](http://leafletjs.com/reference.html#marker) and [lines](http://leafletjs.com/reference.html#polyline). You can set custom default options or specific user options to display these layers.

Check [Leaflet documentation](http://leafletjs.com/reference.html) on available [Markers](http://leafletjs.com/reference.html#marker) and [PolyLine](http://leafletjs.com/reference.html#polyline) options.

**Example**:

```javascript
var options = {};

options.layerOptions = {
	'default': {
		line: {
			color: '#333'
		},
		marker: {
			// marker options goes here
		}
	},
	'someuser': {
		line: {
			color: '#fff'
		},
		marker: {
			// marker options goes here
		}
	}
}

var map = cm(options);
```

#### Discoveries

Discoveries are callback functions that can be executed when a ground user pass close to a determined location.

**Options**:

 - `user`: *string* - specify if this callback should be executed to a specific user (*optional*)
 - `coords`: *array* - determined location in latitude and longitude coordinates (*required*)
 - `distance`: *number* - maximum distance radius in meters (*optional*, default is `20`)
 - `init`: *boolean* - set `true` if it should be executed on page load if the user has already passed by this location (*optional*)
 - `callback`: *function* (*required*)

**Example**:

```javascript
var options = {};

options.discoveries = [
	{
		user: 'someuser',
		coords: [1,1],
		init: true,
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
		distance: 5,
		callback: function(pos) {
			alert('someone very close from here!');
		}
	}
];

var map = cm(options);
```

#### Further development

If you'd like to create new features connected to your map, use [Leaflet documentation](http://leafletjs.com/reference.html) to work on the `L.Map` object returned by the `cm` constructor.