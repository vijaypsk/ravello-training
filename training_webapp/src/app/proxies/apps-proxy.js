'use strict';

angular.module('trng.proxies').factory('trng.proxies.AppsProxy', [
    '$http',
    '$q',
    'app.config',
    function($http, $q, config) {
        var service = {
            startApp: function(appId) {
                return $http.post(config.baseUrl + '/rest/applications/' + appId + '/start');
            },

            stopApp: function(appId) {
                return $http.post(config.baseUrl + '/rest/applications/' + appId + '/stop');
            },

            startVm: function(appId, vmId) {
                return $http.post(config.baseUrl + '/rest/applications/' + appId + '/vms/' + vmId + "/start");
            },

            stopVm: function(appId, vmId) {
                return $http.post(config.baseUrl + '/rest/applications/' + appId + '/vms/' + vmId + "/stop");
            },

            consoleVm: function(appId, vmId) {
                return $http.get(config.baseUrl + '/rest/applications/' + appId + '/vms/' + vmId + "/vncUrl");
            }
        };

        return service;
    }
]);
