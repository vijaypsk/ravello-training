'use strict';

angular.module('trng.proxies').factory('AppsProxy', [
    '$http',
    '$q',
    'CommonConstants',
    'TrainingMainTracker',
    function($http, $q, CommonConstants, TrainingMainTracker) {
        var service = {
			createApps: function(classId, appsData) {
				var appsDtos = _.map(appsData, function(appData) {
					return {
						userId: appData.userId,
						name: appData.appName,
						description: appData.appDescription,
						baseBlueprintId: appData.blueprintId,
						publishDetails: appData.publishDetails
					};
				});

				var dto = {
					classId: classId,
					apps: appsDtos
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
                var promise = $http.post(CommonConstants.baseUrl + '/rest/applications/' + appId + '/action/start');
                TrainingMainTracker.addPromise(promise);
                return promise;
            },

            stopApp: function(appId) {
                var promise = $http.post(CommonConstants.baseUrl + '/rest/applications/' + appId + '/action/stop');
                TrainingMainTracker.addPromise(promise);
                return promise;
            },

			startBatchApps: function(classId, apps) {
				var promise = $http.post(CommonConstants.baseUrl + '/rest/applications/action/start', {classId: classId, apps: apps});
				TrainingMainTracker.addPromise(promise);
				return promise;
			},

			stopBatchApps: function(classId, apps) {
				var promise = $http.post(CommonConstants.baseUrl + '/rest/applications/action/stop', {classId: classId, apps: apps});
				TrainingMainTracker.addPromise(promise);
				return promise;
			},

            autoStopBatchApps: function(apps, autoStopMinutes) {
                var promise = $http.post(CommonConstants.baseUrl + '/rest/applications/autostop', {apps: apps, autoStopMinutes: autoStopMinutes});
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
