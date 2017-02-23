var express = require('express');
var app = express();
require('es6-promise').polyfill();
require('isomorphic-fetch');
var moment = require('moment');
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json


app.set('port', (process.env.PORT || 5000));

app.post('/webhook', function (req, res) {
  /* const myHeaders = new Headers(); */
  /* myHeaders.append("X-AUTH", process.env.xauth); */

  var params = req.body.result.parameters;
  var city = params['geo-city'];
  var direction;
  if (city === 'South Station') {
    direction = params.direction === 'leaving' ? 0 : 1;
  } else {
    direction = params.direction === 'leaving' ? 1 : 0;
  }

  fetch(`http://realtime.mbta.com/developer/api/v2/schedulebystop?api_key=${process.env.mbtakey}&stop=${encodeURIComponent(city)}&direction=${direction}&route=CR-Providence&max_time=1440`, { method: 'GET' }).then(resp => {
    return resp.json();
  }).then(data => {
    const times = data.mode[0].route[0].direction[0].trip.map(trip => {
      const name = trip.trip_name;
      const time = /\((.+) from.*\)/i.exec(name)[1];
      return time;
    })
    res.send({
      "speech": `${times.join(',')}`,
      "displayText": `${times.join(',')}`,
      "data": {},
      "contextOut": [],
      "source": "MBTA"
    });
  });
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
