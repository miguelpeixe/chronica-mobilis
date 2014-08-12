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

Use [Self-Hosted GPS Tracker](https://play.google.com/store/apps/details?id=fr.herverenault.selfhostedgpstracker) Android app and set URL to your application:

```
http://localhost:8000/updateLocation/[userId]
```

Access data at http://localhost:8000/data

Start a new CSV base by accessing http://localhost:8000/reset