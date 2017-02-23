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

  console.log(JSON.stringify(req.body))

  fetch(`http://realtime.mbta.com/developer/api/v2/schedulebystop?api_key=${process.env.mbtakey}&stop=South%20Attleboro&direction=0&route=CR-Providence&max_time=1440`, { method: 'GET' }).then(resp => {
    return resp.json();
  }).then(data => {
    const times = data.mode[0].route[0].direction[0].trip.map(trip => {
      const name = trip.trip_name;
      const time = /\((.+) from.*\)/i.exec(name)[1];
      return time;
    })
    res.send({
      "speech": `From South Attleboro you can leave at ${times.join(',')}`,
      "displayText": `From South Attleboro you can leave at ${times.join(',')}`,
      "data": {},
      "contextOut": [],
      "source": "MBTA"
    });
  });
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
