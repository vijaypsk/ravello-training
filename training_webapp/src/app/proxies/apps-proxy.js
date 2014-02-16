'use strict';

angular.module('trng.proxies').factory('trng.proxies.AppsProxy', [
    '$http',
    '$q',
    'app.config',
    function($http, $q, config) {
        var service = {
            startVm: function(appId, vmId) {
                return $http.post(config.baseUrl + '/rest/applications/' + appId + '/vms/' + vmId + "/start");
            },

            stopVm: function(appId, vmId) {
                return $http.post(config.baseUrl + '/rest/applications/' + appId + '/vms/' + vmId + "/stop");
            }
        };

        return service;
    }
]);
