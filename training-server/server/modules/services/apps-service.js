'use strict';

var q = require('q');
var request = require('superagent');

var properties = require('../config/properties');
var errorHandler = require('../utils/error-handler');

exports.getApps = function(username, password) {
    var deferred = q.defer();

    request.
        get(properties.ravelloUrl + properties.baseUrl + "/applications").
        set('Content-Length', 0).
        set('X-LongToString', true).
        accept('application/json').
        auth(username, password).
        end(errorHandler.handleSuperagentError(deferred));

    return deferred.promise;
};

exports.getApp = function(appId, username, password) {
    var deferred = q.defer();

    request.
        get(properties.ravelloUrl + properties.baseUrl + "/applications/" + appId).
        set('Content-Length', 0).
        set('X-LongToString', true).
        accept('application/json').
        auth(username, password).
        end(errorHandler.handleSuperagentError(deferred));

    deferred.promise.catch(
        function(error) {
            if (error && error.status === 404) {
                error.message = 'Could not get application information from Ravello';
            }
            return q.reject(error);
        }
    );

    return deferred.promise;
};

exports.getAppVms = function(appId, username, password) {
    var deferred = q.defer();

    request.
        get(properties.ravelloUrl + properties.baseUrl + "/applications/" + appId + ";deployment/vms").
        set('Content-Length', 0).
        set('X-LongToString', true).
        accept('application/json').
        auth(username, password).
        end(errorHandler.handleSuperagentError(deferred));

    return deferred.promise;
};

exports.getAppDeployment = function(appId, username, password) {
    var deferred = q.defer();

    request.
        get(properties.ravelloUrl + properties.baseUrl + "/applications/" + appId + ";deployment").
        set('Content-Length', 0).
        set('X-LongToString', true).
        accept('application/json').
        auth(username, password).
        end(errorHandler.handleSuperagentError(deferred));

    deferred.promise.catch(
        function(error) {
            if (error && error.status === 404) {
                error.message = 'Could not get application deployment information from Ravello';
            }
            return q.reject(error);
        }
    );

    return deferred.promise;
};

exports.createApp = function(name, description, bpId, bucketId, username, password) {
    var deferred = q.defer();

    var dto = {
        name: name,
        description: description,
        baseBlueprintId: bpId,
        design: {},
        costBucket: {
            id: bucketId
        }
    };

    request.
        post(properties.ravelloUrl + properties.baseUrl + "/applications").
        send(dto).
        set('X-LongToString', true).
        type('application/json').
        accept('application/json').
        auth(username, password).
        end(errorHandler.handleSuperagentError(deferred));

    return deferred.promise;
};

exports.deleteApp = function(appId, username, password) {
    var deferred = q.defer();

    request.
        del(properties.ravelloUrl + properties.baseUrl + "/applications/" + appId).
        set('Content-Length', 0).
        set('X-LongToString', true).
        accept('application/json').
        auth(username, password).
        end(errorHandler.handleSuperagentError(deferred));

    return deferred.promise;
};

exports.publishApp = function(appId, publishDetails, username, password) {
    var deferred = q.defer();

    var dto = {
        optimizationLevel: publishDetails.method || 'COST_OPTIMIZED',
        startAllVms: publishDetails.startAfterPublish
    };

	if (dto.optimizationLevel === 'PERFORMANCE_OPTIMIZED') {
		dto.preferredRegion = publishDetails.region;
	}

    request.
        post(properties.ravelloUrl + properties.baseUrl + "/applications/" + appId + "/publish").
        send(dto).
        set('X-LongToString', true).
        type('application/json').
        accept('application/json').
        auth(username, password).
        end(errorHandler.handleSuperagentError(deferred));

    return deferred.promise;
};

exports.appAction = function(appId, action, username, password) {
    var deferred = q.defer();

	// It seems to be necessary to do this, even though it is redundant. Otherwise, VMs in the App will turn to ERROR state.
	var dto = {
		id: appId
	};

    request.
        post(properties.ravelloUrl + properties.baseUrl + "/applications/" + appId + "/" + action).
		send(dto).
        set('Content-Length', 0).
        set('X-LongToString', true).
        accept('application/json').
        auth(username, password).
        end(errorHandler.handleSuperagentError(deferred));

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
        set('X-LongToString', true).
        accept('application/json').
        auth(username, password).
        end(errorHandler.handleSuperagentError(deferred));

    return deferred.promise;
};

exports.batchVmsActions = function(appId, vmIds, action, username, password) {
    var deferred = q.defer();

    var dto = {
        ids: vmIds
    };

    request.
        post(properties.ravelloUrl + properties.baseUrl + "/applications/" + appId + "/vms/" + action).
        send(dto).
        set('Content-Length', 0).
        set('X-LongToString', true).
        accept('application/json').
        auth(username, password).
        end(errorHandler.handleSuperagentError(deferred));

    return deferred.promise;
};

exports.vmVnc = function(appId, vmId, username, password) {
    var deferred = q.defer();

    request.
        get(properties.ravelloUrl + properties.baseUrl + "/applications/" + appId + "/vms/" + vmId + "/vncUrl").
        set('Content-Length', 0).
        set('X-LongToString', true).
		accept('application/json').
		auth(username, password).
        end(errorHandler.handleSuperagentError(deferred));

    return deferred.promise;
};

