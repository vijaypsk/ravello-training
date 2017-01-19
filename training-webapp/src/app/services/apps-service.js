'use strict';

angular.module('trng.services').factory('AppsService', [
	'AppsProxy',
	function(AppsProxy) {

		var service = {
			createApps: function(classId, appsData) {
				return AppsProxy.createApps(classId, appsData);
			},

			scheduleApps: function(classId, appsData) {
				return AppsProxy.scheduleApps(classId, appsData);
			},

            deleteApps: function(classId, appsData) {
                return AppsProxy.deleteApps(classId, appsData);
            },

            startApp: function(appId) {
                return AppsProxy.startApp(appId);
            },

            stopApp: function(appId) {
                return AppsProxy.stopApp(appId);
            },

			startBatchApps: function(classId, apps) {
                return AppsProxy.startBatchApps(classId, apps);
			},

			stopBatchApps: function(classId, apps) {
                return AppsProxy.stopBatchApps(classId, apps);
			},

            autoStopBatchApps: function(apps, autoStopMinutes) {
                return AppsProxy.autoStopBatchApps(apps, autoStopMinutes);
            },

            batchVmsStart: function(appId, vmIds) {
                return AppsProxy.batchVmsStart(appId, vmIds);
            },

            batchVmsStop: function(appId, vmIds) {
                return AppsProxy.batchVmsStop(appId, vmIds);
            },

            batchVmsRestart: function(appId, vmIds) {
                return AppsProxy.batchVmsRestart(appId, vmIds);
            },

            consoleVm: function(appId, vmId) {
                return AppsProxy.consoleVm(appId, vmId);
            }
        };
		
		return service;
    }
]);
