'use strict';

var request = require('superagent');
var q = require('q');

var properties = require('../config/properties');
var serviceResultHandler = require('../utils/error-handler');

exports.login = function(username, password) {
    var deferred = q.defer();

    request.
        post(properties.ravelloUrl + properties.baseUrl + '/login').
        set('Content-Length', 0).
        accept('application/json').
        auth(username, password).
        end(serviceResultHandler.handleSuperagentError(deferred));

    return deferred.promise;
};

