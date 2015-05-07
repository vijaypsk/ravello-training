'use strict';

var fs = require('fs');
var errorHandler = require('../utils/error-handler');

exports.getVersion = function(request, response, next) {
	fs.readFile('revision.txt', 'utf8', function(err, data) {
		if (err) {
			next(errorHandler.createError(404, 'Could not get version', err));
		} else {
			console.log(data);
			response.send(200, data);
		}
	});
};