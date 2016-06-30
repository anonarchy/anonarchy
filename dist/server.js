'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

;(function () {
  "use strict";

  var Yavanna = require('@benchristel/yavanna')();

  if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') window.Yavanna = Yavanna;
  if ((typeof global === 'undefined' ? 'undefined' : _typeof(global)) === 'object') global.Yavanna = Yavanna;
})();

;(function () {
  "use strict";

  var express = require('express');
  var path = require('path');

  var app = express();

  console.log(path.join(__dirname, 'public'));

  app.use('/assets', express.static(path.join(__dirname, 'public')));

  app.get('/', function (req, res) {
    var html = '<!DOCTYPE html>\n  <html>\n    <head>\n      <title>Best Website Ever!</title>\n    </head>\n    <body>\n      <script src="/assets/js/browser.js"></script>\n    </body>\n  </html>\n  ';

    res.send(html);
  });

  app.get('/user', function (req, res) {
    res.header('Content-Type', 'application/json');
    res.end('{"name":"Bob"}');
  });

  app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
  });
})();