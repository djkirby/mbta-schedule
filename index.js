var express = require('express');
var app = express();
require('es6-promise').polyfill();
require('isomorphic-fetch');

app.set('port', (process.env.PORT || 5000));

app.post('/webhook', function (req, res) {
  /* const myHeaders = new Headers(); */
  /* myHeaders.append("X-AUTH", process.env.xauth); */
  res.send({
    "speech": "From South Attleboro you can leave at 3:55, 4:29, 5:55, or 6:35. Later you can leave South Station at 8:35, 9:45, 10:55, or 11:55.",
    "displayText": "From South Attleboro you can leave at 3:55, 4:29, 5:55, or 6:35. Later you can leave South Station at 8:35, 9:45, 10:55, or 11:55.",
    "data": {},
    "contextOut": [],
    "source": "MBTA"
  });
})

  app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
