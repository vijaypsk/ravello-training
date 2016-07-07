'use strict';

var _ = require('lodash');
var q = require('q');

var logger = require('../config/logger');

var bucketsService = require('../services/buckets-service');

/* --- Public functions --- */

exports.getBuckets = function(request, response, next) {
	var user = request.user;

	var ravelloUsername = user.ravelloCredentials ? user.ravelloCredentials.username : '';
	var ravelloPassword = user.ravelloCredentials ? user.ravelloCredentials.password : '';

	bucketsService.getAllBuckets(ravelloUsername, ravelloPassword).then(
		function(result) {
			response.json(result.body);
		}
	).catch(next);
};
