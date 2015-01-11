'use strict';

var q = require('q');
var request = require('superagent');

var properties = require('../config/properties');

exports.getBlueprints = function(username, password) {
    var deferred = q.defer();

    var promise = deferred.promise;

    request.
        get(properties.ravelloUrl + properties.baseUrl + '/blueprints').
        set('Content-Length', 0).
        accept('application/json').
        auth(username, password).
        end(deferred.makeNodeResolver());

    return promise.then(function(result) {
        return result;
    });
};

exports.getBlueprintById = function(bpId, username, password) {
    var deferred = q.defer();

    request.
        get(properties.ravelloUrl + properties.baseUrl + '/blueprints/' + bpId).
        set('Content-Length', 0).
        accept('application/json').
        auth(username, password).
        end(deferred.makeNodeResolver());

    deferred.promise.then(function(result) {
        return result;
    });

    return deferred.promise;
};