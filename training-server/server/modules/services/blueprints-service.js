'use strict';

var q = require('q');
var request = require('superagent');

var properties = require('../config/properties');
var serviceResultHandler = require('../utils/error-handler');

exports.getBlueprints = function(username, password) {
    var deferred = q.defer();

    request.
        get(properties.ravelloUrl + properties.baseUrl + '/blueprints').
        set('Content-Length', 0).
        set('X-LongToString', true).
        accept('application/json').
        auth(username, password).
        end(serviceResultHandler.handleSuperagentError(deferred));

    return deferred.promise;
};

exports.getBlueprintById = function(bpId, username, password) {
    var deferred = q.defer();

    request.
        get(properties.ravelloUrl + properties.baseUrl + '/blueprints/' + bpId).
        set('Content-Length', 0).
        set('X-LongToString', true).
        accept('application/json').
        auth(username, password).
        end(serviceResultHandler.handleSuperagentError(deferred));

    return deferred.promise;
};

exports.getPublishLocations = function(bpId, username, password) {
    var deferred = q.defer();

    request.
        get(properties.ravelloUrl + properties.baseUrl + '/blueprints/' + bpId + '/publishLocations').
        set('Content-Length', 0).
        set('X-LongToString', true).
        accept('application/json').
        auth(username, password).
        end(serviceResultHandler.handleSuperagentError(deferred));

    return deferred.promise;
};
