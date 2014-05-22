'use strict';

angular.module('trng.services').factory('AppsService', [
	'AppsProxy',
	'AppsTransformer',
	function(AppsProxy, AppsTrans) {

		var service = {
            createApp: function(appName, appDescription, blueprintId, userId) {
                return AppsProxy.createApp(appName, appDescription, blueprintId, userId).then(
                    function(result) {
                        return AppsTrans.dtoToEntity(result.data);
                    }
                );
            },

            deleteApp: function(appId, userId) {
                return AppsProxy.deleteApp(appId, userId);
            },

            startApp: function(appId) {
                return AppsProxy.startApp(appId);
            },

            stopApp: function(appId) {
                return AppsProxy.stopApp(appId);
            },

            startVm: function(appId, vmId) {
                return AppsProxy.startVm(appId, vmId);
            },

            stopVm: function(appId, vmId) {
                return AppsProxy.stopVm(appId, vmId);
            },

            restartVm: function(appId, vmId) {
                return AppsProxy.restartVm(appId, vmId);
            },

            consoleVm: function(appId, vmId) {
                return AppsProxy.consoleVm(appId, vmId);
            }
        };
		
		return service;
    }
]);
