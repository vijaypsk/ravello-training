'use strict';

angular.module('trng.proxies').factory('AppsProxy', [
    '$http',
    '$q',
    'CommonConstants',
    'TrainingMainTracker',
    function($http, $q, CommonConstants, TrainingMainTracker) {
        var service = {
            createApp: function(appName, appDescription, blueprintId, userId) {
                var dto = {
                    name: appName,
                    description: appDescription,
                    baseBlueprintId: blueprintId,
                    userId: userId
                };

                var promise = $http.post(CommonConstants.baseUrl + '/rest/applications', dto);
                TrainingMainTracker.addPromise(promise);
                return promise;
            },

            deleteApp: function(appId, userId) {
                var requestConfig = {
                    params: {
                        studentId: userId
                    }
                };

                var promise = $http.delete(CommonConstants.baseUrl + '/rest/applications/' + appId, requestConfig);
                TrainingMainTracker.addPromise(promise);
                return promise;
            },

            startApp: function(appId) {
                var promise = $http.post(CommonConstants.baseUrl + '/rest/applications/' + appId + '/start');
                TrainingMainTracker.addPromise(promise);
                return promise;
            },

            stopApp: function(appId) {
                var promise = $http.post(CommonConstants.baseUrl + '/rest/applications/' + appId + '/stop');
                TrainingMainTracker.addPromise(promise);
                return promise;
            },

            startVm: function(appId, vmId) {
                var promise = $http.post(CommonConstants.baseUrl + '/rest/applications/' + appId + '/vms/' + vmId + "/start");
                TrainingMainTracker.addPromise(promise);
                return promise;
            },

            stopVm: function(appId, vmId) {
                var promise = $http.post(CommonConstants.baseUrl + '/rest/applications/' + appId + '/vms/' + vmId + "/stop");
                TrainingMainTracker.addPromise(promise);
                return promise;
            },

            restartVm: function(appId, vmId) {
                var promise = $http.post(CommonConstants.baseUrl + '/rest/applications/' + appId + '/vms/' + vmId + "/restart");
                TrainingMainTracker.addPromise(promise);
                return promise;
            },

            consoleVm: function(appId, vmId) {
                var promise = $http.get(CommonConstants.baseUrl + '/rest/applications/' + appId + '/vms/' + vmId + "/vncUrl");
                TrainingMainTracker.addPromise(promise);
                return promise;
            }
        };

        return service;
    }
]);
