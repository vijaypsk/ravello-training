'use strict';

angular.module('trng.proxies').factory('trng.proxies.AppsProxy', [
    '$http',
    '$q',
    'app.config',
    'trainingTracker',
    function($http, $q, config, trainingTracker) {
        var service = {
            startApp: function(appId) {
                var promise = $http.post(config.baseUrl + '/rest/applications/' + appId + '/start');
                trainingTracker.addPromise(promise);
                return promise;
            },

            stopApp: function(appId) {
                var promise = $http.post(config.baseUrl + '/rest/applications/' + appId + '/stop');
                trainingTracker.addPromise(promise);
                return promise;
            },

            startVm: function(appId, vmId) {
                var promise = $http.post(config.baseUrl + '/rest/applications/' + appId + '/vms/' + vmId + "/start");
                trainingTracker.addPromise(promise);
                return promise;
            },

            stopVm: function(appId, vmId) {
                var promise = $http.post(config.baseUrl + '/rest/applications/' + appId + '/vms/' + vmId + "/stop");
                trainingTracker.addPromise(promise);
                return promise;
            },

            consoleVm: function(appId, vmId) {
                var promise = $http.get(config.baseUrl + '/rest/applications/' + appId + '/vms/' + vmId + "/vncUrl");
                trainingTracker.addPromise(promise);
                return promise;
            }
        };

        return service;
    }
]);
