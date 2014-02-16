'use strict';

/**
 * Module dependencies.
 */

var express = require('express');

var config = require('./server/modules/config');
var routes = require('./server/modules/routes');

var app = express();

config(app);
routes(app);

app.listen(app.get('port'));

