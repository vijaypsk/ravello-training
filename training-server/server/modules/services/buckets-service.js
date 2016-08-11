'use strict';

var _ = require('lodash');

var q = require('q');
var request = require('superagent');

var properties = require('../config/properties');
var errorHandler = require('../utils/error-handler');

exports.getAllBuckets = function(username, password) {
	var deferred = q.defer();
	request.
		get(properties.ravelloUrl + properties.baseUrl + '/costBuckets?permissions=execute').
		set('Content-Length', 0).
		set('X-LongToString', true).
		accept('application/json').
		auth(username, password).
		end(errorHandler.handleSuperagentError(deferred));

	return deferred.promise;
};