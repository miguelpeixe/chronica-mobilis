var express = require('express'),
	serveIndex = require('serve-index'),
	moment = require('moment'),
	fs = require('fs');

var app = express();

// simple logger
app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});

app.use('/data', serveIndex('data', {'icons': true, 'view': 'details'}));
app.use('/', express.static(__dirname + '/dist'));

var users = [],
	data = [],
	time,
	filename;


function initData() {

	time = moment();
	data = [];
	filename = time.format('YYYY-MM-DD-HH-mm') + '.csv';

	fs.writeFileSync('data/' + filename, 'userId,lat,lon,time\r\n');

}

initData();

app.get('/reset', function(req, res) {

	initData();

	res.send('New CSV initialized.');

});

app.all('/updateLocation/:userId', function(req, res) {

	if(req.params.userId && req.query.lat && req.query.lon) {

		var reqData = {
			userId: req.params.userId,
			lat: parseFloat(req.query.lat),
			lon: parseFloat(req.query.lon),
			time: moment().format()
		};

		data.push(reqData);

		fs.appendFile('data/' + filename, reqData.userId + ',' + reqData.lat + ',' + reqData.lon + ',' + reqData.time + '\r\n', function(err) {
			if(err) {
				res.send(err);
			} else {
				res.send(reqData);
			}
		});


	} else {
		res.send();
	}

});

app.get('/data/latest', function(req, res) {
	res.send(data);
});

app.get('/data/:file', function(req, res) {
	res.set('Content-Type', 'text/plain');
	fs.readFile('data/' + req.params.file, function(err, data) {
		res.send(data);
	});
});

app.get('/*', function(req, res) {
	res.sendfile('dist/views/index.html');
});

var port = process.env.PORT || 8000;

app.listen(port);

console.log('App started on port ' + port);