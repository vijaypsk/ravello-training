'use strict';

angular.module('trng.services').factory('trng.services.AppsService', [
	'trng.proxies.AppsProxy',
	function(appsProxy) {

		var service = {
            startVm: function(appId, vmId) {
                return appsProxy.startVm(appId, vmId);
            },

            stopVm: function(appId, vmId) {
                return appsProxy.stopVm(appId, vmId);
            }
        };
		
		return service;
}]);
