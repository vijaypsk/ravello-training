'use strict';

var q = require('q');
var _ = require('lodash');
var logger = require('../config/logger');

function initErrorsMiddleware(app) {
	app.use(function(error, request, response, next) {
		var errorStatus = 500;
		var errorMessage = error;
		var errorReason = error;
		var ravelloOpId = undefined;

		if (error && _.isObject(error)) {
			if (error.message) {
				errorMessage = error.message;
			} else {
				errorMessage = error.toString();
			}

			if (error.reason) {
				errorReason = error.reason;
			}

			if (error.status) {
				errorStatus = error.status;
			}

			if (error.ravelloOpId) {
				ravelloOpId = error.ravelloOpId;
			}
		}

		logger.error({reason: errorReason, status: errorStatus, ravelloOpId: ravelloOpId}, errorMessage);

		response.send(errorStatus, errorMessage);
	});
}

function createError(status, message, reason, ravelloOpId) {
	return {
		status: status,
		message: message,
		reason: reason,
		ravelloOpId: ravelloOpId
	};
}

function handleSuperagentError(deferred) {
	return function(error, response) {
		var status = 500;
		var errorMessage = null;
		var ravelloOpId = null;

		if (error) {
			errorMessage = error.message || error.toString();

		} else if (response && response.status) {
			status = response.status;

			if (response.status === 401) {
				errorMessage = 'You are not authorized to work against Ravello. Please check your Ravello Credentials.';

			} else if (response.status === 429) {
				errorMessage = 'You have reached the organization rate limit for simultaneous actions that can be taken against Ravello. ' +
					'Please consult the Ravello administrator for changing those limits for your organization. ' +
					'In the meantime, you can try to perform actions on less applications every time.'

			} else if (response.status >= 400) {
				errorMessage =
					response.headers['error-message'] ||
					(response.body && response.body.operationMessages && response.body.operationMessages.length ?
						response.body.operationMessages[0].message : null) ||
					response.text ||
					response.error;
			}
		}

		if (response && response.headers && response.headers['operation-id']) {
			ravelloOpId = response.headers['operation-id'];
		}

		if (errorMessage) {
			deferred.reject(createError(status, errorMessage, error, ravelloOpId));
		} else if (arguments.length > 2) {
			deferred.resolve(_.last(arguments, arguments.length - 1));
		} else {
			deferred.resolve(response);
		}
	};
}

function handleMongoError(errorStatus, errorMessage) {
	return function(error) {
		return q.reject(createError(errorStatus, errorMessage, error));
	}
}

module.exports.initErrorsMiddleware = initErrorsMiddleware;
module.exports.createError = createError;
module.exports.handleSuperagentError = handleSuperagentError;
module.exports.handleMongoError = handleMongoError;
