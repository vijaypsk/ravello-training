'use strict';

angular.module('trng.proxies').factory('trng.proxies.AppsProxy', ['$http', '$q', function($http, $q) {
	var service = {
        startVm: function(appId, vmId) {
            return $http.post('/rest/applications/' + appId + '/vms/' + vmId + "/start");
        },

        stopVm: function(appId, vmId) {
            return $http.post('/rest/applications/' + appId + '/vms/' + vmId + "/stop");
        }
    };

    return service;
}]);
