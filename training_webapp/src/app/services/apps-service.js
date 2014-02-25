'use strict';

angular.module('trng.services').factory('trng.services.AppsService', [
	'trng.proxies.AppsProxy',
	function(appsProxy) {

		var service = {
            startApp: function(appId) {
                return appsProxy.startApp(appId);
            },

            stopApp: function(appId) {
                return appsProxy.stopApp(appId);
            },

            startVm: function(appId, vmId) {
                return appsProxy.startVm(appId, vmId);
            },

            stopVm: function(appId, vmId) {
                return appsProxy.stopVm(appId, vmId);
            },

            restartVm: function(appId, vmId) {
                return appsProxy.restartVm(appId, vmId);
            },

            consoleVm: function(appId, vmId) {
                return appsProxy.consoleVm(appId, vmId);
            }
        };
		
		return service;
}]);
