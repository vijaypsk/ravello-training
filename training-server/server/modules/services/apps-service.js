'use strict';

var q = require('q');
var request = require('superagent');

var properties = require('../config/properties');

exports.getApps = function(username, password) {
    var deferred = q.defer();

    request.
        get(properties.ravelloUrl + properties.baseUrl + "/applications").
        set('Content-Length', 0).
        accept('application/json').
        auth(username, password).
        end(deferred.makeNodeResolver());

    return deferred.promise.then(function(result) {
        return result.body;
    });
};

exports.getApp = function(appId, username, password) {
    var deferred = q.defer();

    request.
        get(properties.ravelloUrl + properties.baseUrl + "/applications/" + appId).
        set('Content-Length', 0).
        accept('application/json').
        auth(username, password).
        end(deferred.makeNodeResolver());

    return deferred.promise;
};

exports.getAppVms = function(appId, username, password) {
    var deferred = q.defer();

    request.
        get(properties.ravelloUrl + properties.baseUrl + "/applications/" + appId + ";deployment/vms").
        set('Content-Length', 0).
        accept('application/json').
        auth(username, password).
        end(deferred.makeNodeResolver());

    return deferred.promise;
};

exports.getAppDeployment = function(appId, username, password) {
    var deferred = q.defer();

    request.
        get(properties.ravelloUrl + properties.baseUrl + "/applications/" + appId + ";deployment").
        set('Content-Length', 0).
        accept('application/json').
        auth(username, password).
        end(deferred.makeNodeResolver());

    return deferred.promise;
};

exports.createApp = function(name, description, bpId, username, password) {
    var deferred = q.defer();

    var dto = {
        name: name,
        description: description,
        baseBlueprintId: bpId,
        design: {}
    };

    request.
        post(properties.ravelloUrl + properties.baseUrl + "/applications").
        send(dto).
        type('application/json').
        accept('application/json').
        auth(username, password).
        end(deferred.makeNodeResolver());

    return deferred.promise;
};

exports.deleteApp = function(appId, username, password) {
    var deferred = q.defer();

    request.
        del(properties.ravelloUrl + properties.baseUrl + "/applications/" + appId).
        set('Content-Length', 0).
        accept('application/json').
        auth(username, password).
        end(deferred.makeNodeResolver());

    return deferred.promise;
};

exports.publishApp = function(appId, username, password) {
    var deferred = q.defer();

    var dto = {
        optimizationLevel: properties.defaultOptimizationLevel
    };

    request.
        post(properties.ravelloUrl + properties.baseUrl + "/applications/" + appId + "/publish").
        send(dto).
        type('application/json').
        accept('application/json').
        auth(username, password).
        end(deferred.makeNodeResolver());

    return deferred.promise;
};

exports.appAction = function(appId, action, username, password) {
    var deferred = q.defer();

    request.
        post(properties.ravelloUrl + properties.baseUrl + "/applications/" + appId + "/" + action).
        set('Content-Length', 0).
        accept('application/json').
        auth(username, password).
        end(deferred.makeNodeResolver());

    return deferred.promise;
};

exports.appAutoStop = function(appId, secondsFromNow, username, password) {
    var deferred = q.defer();

    var dto = {
        expirationFromNowSeconds: secondsFromNow
    };

    request.
        post(properties.ravelloUrl + properties.baseUrl + "/applications/" + appId + "/setExpiration").
        send(dto).
        accept('application/json').
        auth(username, password).
        end(deferred.makeNodeResolver());

    return deferred.promise;
};

exports.vmAction = function(appId, vmId, action, username, password) {
    var deferred = q.defer();

    request.
        post(properties.ravelloUrl + properties.baseUrl + "/applications/" + appId + "/vms/" + vmId + "/" + action).
        set('Content-Length', 0).
        accept('application/json').
        auth(username, password).
        end(deferred.makeNodeResolver());

    return deferred.promise;
};

exports.vmVnc = function(appId, vmId, username, password) {
    var deferred = q.defer();

    request.
        get(properties.ravelloUrl + properties.baseUrl + "/applications/" + appId + "/vms/" + vmId + "/vncUrl").
        set('Content-Length', 0).
		accept('application/json').
		auth(username, password).
        end(deferred.makeNodeResolver());

    return deferred.promise;
};