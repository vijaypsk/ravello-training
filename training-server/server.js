'use strict';

/**
 * Module dependencies.
 */

var express = require('express');
var cluster = require('express-cluster');

var properties = require('./server/modules/config/properties');
var logger = require('./server/modules/config/logger');

cluster(function(worker) {
	// console.log('Starting worker #' + worker.id);
	logger.info('Starting worker # %s', worker.id);

	var config = require('./server/modules/config/config');
	var routes = require('./server/modules/config/routes');

	var app = express();

	config(app);
	routes(app);

	app.listen(app.get('port'));
}, {count: properties.numOfWorkers});