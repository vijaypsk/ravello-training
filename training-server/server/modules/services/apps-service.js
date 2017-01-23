    'use strict';

    var q = require('q');
    var request = require('superagent');
    var Agenda = require('agenda');
    var moment = require('moment-timezone');
    var mongoose = require('mongoose-q')(require('mongoose'));

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

    exports.scheduleApp = function(appDto) {
        var deferred = q.defer();
        
        var mongoConnectionString = "mongodb://training:training@localhost/training";
        var agenda = new Agenda({db: {address: mongoConnectionString,collection: "scheduledjobs"}});
        // mongoose.connection.on('connected', () => {
        //     console.log('agenda scheduledjobs');
        //     agenda.mongo(mongoose.connection.collection('scheduledjobs').conn.db, 'scheduledjobs');
        // });
        function zonalTimeInSec (ipdate, timezone){
            var result = moment.tz(ipdate,timezone).format('X');
            //console.log('Date is ',ipdate,' Timezone is ',timezone,' Result is ',result);
            return result;
        };
            
        var startTimeInSec = zonalTimeInSec(appDto.schedule.startTime,'UTC');
        var currentTimeInSec = zonalTimeInSec(new Date(),'UTC');
        var timeDiff = startTimeInSec - currentTimeInSec;
        

        var jobName = 'create app in '+timeDiff+' seconds';
        console.log('jobName is ',jobName);
        agenda.define(jobName, function(job, done) {
            console.log(job.attrs.data.appData.name,' is getting created soon');
            console.log(job.attrs.data.appData);
            job.remove(function(err) {
                if(!err) console.log("Successfully removed job from collection");
            });
            done();
        });

        agenda.on('ready', function() {
                console.log('inside ready ',timeDiff);
                agenda.schedule('in '+timeDiff+' seconds', jobName, {appData: appDto});
                agenda.start();
        });
        console.log('scheduleapps ',deferred.promise);

        //console.log('About to schedule ',appDto);
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
    console.log('deleteApp ',deferred.promise);
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

