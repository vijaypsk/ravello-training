'use strict';

/**
 * Module dependencies.
 */

var express = require('express');
var cluster = require('express-cluster');

var properties = require('./server/modules/config/properties');
var logger = require('./server/modules/config/logger');

var config = require('./server/modules/config/config');
var routes = require('./server/modules/config/routes');
var errorHandler = require('./server/modules/utils/error-handler');

function main() {
	init();

	if (properties.numOfWorkers === 1) {
		runSingle();
	} else {
		runCluster();
	}
}

function init() {
	logger.init();
}

function run() {
	var app = express();

	config(app);
	routes(app);
	errorHandler.initErrorsMiddleware(app);

	app.listen(app.get('port'));
}

function runSingle() {
	logger.info('Starting in single mode, no cluster');
	run();
}

function runCluster() {
	cluster(function(worker) {
		logger.info('Starting worker # %s', worker.id);
		run();
	}, {count: properties.numOfWorkers});
}

main();