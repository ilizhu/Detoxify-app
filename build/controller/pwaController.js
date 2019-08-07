'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _appDataService = require('../service/appDataService');

var _appDataService2 = _interopRequireDefault(_appDataService);

var _config = require('../config.js');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  Copyright 2019 Sandoche ADITTANE & Farbod SARAF

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

var express = require('express');
var router = express.Router();


router.get('/:appId', function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res, next) {
    var appInfos, protocol, fullUrl;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _appDataService2.default)(req.params.appId);

          case 3:
            appInfos = _context.sent;
            protocol = req.headers['x-forwarded-proto'] ? 'https' : 'http';
            fullUrl = protocol + '://' + req.get('host') + req.originalUrl;

            res.render('pwa/pwa', { data: appInfos, config: _config2.default, fullUrl: fullUrl });
            _context.next = 13;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](0);

            res.status(_context.t0.status);
            res.render('error', { error: _context.t0 });

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 9]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());

router.get('/:appId/manifest\.json', function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res, next) {
    var appInfos;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return (0, _appDataService2.default)(req.params.appId);

          case 3:
            appInfos = _context2.sent;

            res.set('Content-Type', 'application/json');
            res.render('pwa/manifest', { data: appInfos });
            _context2.next = 12;
            break;

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2['catch'](0);

            res.status(_context2.t0.status);
            res.render('error', { error: _context2.t0 });

          case 12:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 8]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
// 获取sw.js
router.get('/:appId/service-worker\.js', function (req, res, next) {
  try {
    res.set('Content-Type', 'application/javascript');
    res.send('/*\n      Copyright 2016 Google Inc. All Rights Reserved.\n      Licensed under the Apache License, Version 2.0 (the "License");\n      you may not use this file except in compliance with the License.\n      You may obtain a copy of the License at\n          http://www.apache.org/licenses/LICENSE-2.0\n      Unless required by applicable law or agreed to in writing, software\n      distributed under the License is distributed on an "AS IS" BASIS,\n      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n      See the License for the specific language governing permissions and\n      limitations under the License.\n    */\n    \n    // Names of the two caches used in this version of the service worker.\n    // Change to v2, etc. when you update any of the local resources, which will\n    // in turn trigger the install event again.\n    const PRECACHE = \'' + req.params.appId + '-precache-v4\';\n    const RUNTIME = \'runtime\';\n    const VERSION = \'' + _config2.default.version + '\';\n    console.log("SW\u7248\u672C:",VERSION);\n    // A list of local resources we always want to be cached.\n    const PRECACHE_URLS = [\n      \'/pwa/' + req.params.appId + '/\',\n      \'/pwa/' + req.params.appId + '\',\n      \'/stylesheets/pwa.css\'\n    ];\n    \n    // The install handler takes care of precaching the resources we always need.\n    self.addEventListener(\'install\', event => {\n      event.waitUntil(\n        caches.open(PRECACHE)\n          .then(cache => cache.addAll(PRECACHE_URLS))\n          .then(self.skipWaiting())\n      );\n    });\n    \n    // The activate handler takes care of cleaning up old caches.\n    self.addEventListener(\'activate\', event => {\n      const currentCaches = [PRECACHE, RUNTIME];\n      event.waitUntil(\n        caches.keys().then(cacheNames => {\n          return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));\n        }).then(cachesToDelete => {\n          return Promise.all(cachesToDelete.map(cacheToDelete => {\n            return caches.delete(cacheToDelete);\n          }));\n        }).then(() => self.clients.claim())\n      );\n    });\n    \n    // The fetch handler serves responses for same-origin resources from a cache.\n    // If no response is found, it populates the runtime cache with the response\n    // from the network before returning it to the page.\n    self.addEventListener(\'fetch\', event => {\n      // Skip cross-origin requests, like those for Google Analytics.\n      if (event.request.url.startsWith(self.location.origin)) {\n        event.respondWith(\n          caches.match(event.request).then(cachedResponse => {\n            if (cachedResponse) {\n              return cachedResponse;\n            }\n    \n            return caches.open(RUNTIME).then(cache => {\n              return fetch(event.request).then(response => {\n                // Put a copy of the response in the runtime cache.\n                return cache.put(event.request, response.clone()).then(() => {\n                  return response;\n                });\n              });\n            });\n          })\n        );\n      }\n    });');
  } catch (e) {
    res.status(e.status);
    res.render('error', { error: e });
  }
});

module.exports = router;
//# sourceMappingURL=pwaController.js.map