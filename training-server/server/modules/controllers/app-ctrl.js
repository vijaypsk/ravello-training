'use strict';

var _ = require('lodash');
var q = require('q');

var properties = require('../config/properties');
var logger = require('../config/logger');
var errorHandler = require('../utils/error-handler');

var appsService = require('../services/apps-service');

var appsTrans = require('../trans/apps-trans');
var classesTrans = require('../trans/classes-trans');

var classesDal = require('../dal/classes-dal');

// These actions are taken by Trainer users.

exports.createApps = function(request, response, next) {
	var user = request.user;

	if (!user.ravelloCredentials) {
		next(errorHandler.createError(401, 'User does not have sufficient Ravello credentials'));
		return;
	}

	var ravelloUsername = user.ravelloCredentials.username;
	var ravelloPassword = user.ravelloCredentials.password;

	var requestData = request.body;

	var currentChunk = 0;
	var appsChunks = _.chunk(requestData.apps, properties.createChuckSize);

	logger.info('Creating %d apps in %d chunks. Delay between chunks: %d milliseconds',
		requestData.apps.length, (appsChunks ? appsChunks.length : 0), properties.createChuckDelay);

	if (appsChunks && appsChunks.length) {
		createAppsInChunks();
	}

	response.send(200);

	function createAppsInChunks() {
		var apps = appsChunks[currentChunk];

		if (apps && apps.length) {
			logger.info('Creating %d apps in chunk # %d', apps.length, currentChunk);

			createApps(apps);
			currentChunk++;

			if (currentChunk < appsChunks.length) {
				setInterval(createAppsInChunks, properties.createChuckDelay);
			}
		}
	}

	function createApps(apps) {
		q.all(_.map(apps, function(appDto) {
			return appsService.createApp(appDto.name, appDto.description, appDto.baseBlueprintId, ravelloUsername, ravelloPassword).then(
				function (appCreateResult) {
					var appData = appsTrans.ravelloObjectToTrainerDto(appCreateResult.body);

					return appsService.publishApp(appData.ravelloId, appDto.publishDetails, ravelloUsername, ravelloPassword).then(
						function() {
							var autoStop = appDto.publishDetails && !_.isUndefined(appDto.publishDetails.autoStop) ?
								appDto.publishDetails.autoStop :
								properties.defaultAutoStopSeconds;

							if (autoStop !== -1) {
								autoStop = appDto.publishDetails.autoStop * 60;
							}

							var promise;
							if (autoStop !== -1 ) {
								promise = appsService.appAutoStop(appData.ravelloId, autoStop, ravelloUsername, ravelloPassword);
							} else {
								promise = q({});
							}

							return promise.then(
								function() {
									return {
										userId: appDto.userId,
										app: appData
									};
								}
							)
						}
					);
				}
			);
		})).then(
			function(appsResults) {
				return classesDal.getClass(requestData.classId).then(
					function(classEntity) {
						var classData = classesTrans.entityToDto(classEntity);

						var studentsMap = _.indexBy(classData.students, function(student) {
							return student.user._id;
						});

						_.forEach(appsResults, function(appResult) {
							if (appResult.app) {
								var student = studentsMap[appResult.userId];
								student && student.apps.push({ravelloId: appResult.app.ravelloId});
							}

							if (appResult.message) {
								logger.warn(appResult.message, {reason: appResult.reason});
							}
						});

						classesDal.updateClass(requestData.classId, classData).then(
							function() {
								return classesDal.getClass(requestData.classId).then(
									function(result) {
										var dto = classesTrans.entityToDto(result);
									}
								);
							}
						);
					}
				);
			}
		).catch(next);
	}
};

exports.deleteApp = function(request, response, next) {
    var user = request.user;

    if (!user.ravelloCredentials) {
		next(errorHandler.createError(401, 'User does not have sufficient Ravello credentials'));
        return;
    }

    var appId = request.params.appId;
    var studentId = request.query.studentId;

    var ravelloUsername = user.ravelloCredentials.username;
    var ravelloPassword = user.ravelloCredentials.password;

    return appsService.deleteApp(appId, ravelloUsername, ravelloPassword).then(
        function() {
            return classesDal.deleteStudentApp(studentId, appId).then(
                function() {
                    response.send(200);
                }
            );
        }
    ).catch(next);
};

exports.appsBatchActions = function(request, response, next) {
	var user = request.user;

	if (!user.ravelloCredentials) {
		next(errorHandler.createError(401, 'User does not have sufficient Ravello credentials'));
		return;
	}

	var ravelloUsername = user.ravelloCredentials.username;
	var ravelloPassword = user.ravelloCredentials.password;

	var classId = request.body.classId;
	var apps = request.body.apps;
	var action = request.params.action;

	classesDal.getClass(classId).then(
		function(classEntity) {
			var classData = classesTrans.entityToDto(classEntity);

			return q.all(_.map(apps, function(app) {
				var autoStop = properties.defaultAutoStopSeconds;
				var publishDetails = _.find(classData.bpPublishDetailsList, {bpId: app.bpId});
				if (publishDetails) {
					autoStop = publishDetails.autoStop;
					if (autoStop !== -1) {
						autoStop *= 60;
					}
				}

				return appAction(app.ravelloId, action, autoStop, ravelloUsername, ravelloPassword);
			})).then(
				function() {
					response.send(200);
				}
			).catch(next);
		}
	);
};

function appAction(appId, action, autoStop, ravelloUsername, ravelloPassword) {
	return appsService.getAppDeployment(appId, ravelloUsername, ravelloPassword).then(
		function(result) {
			if (result.status === 200) {
				var app = result.body;
				if (app.deployment.expirationType !== 'AUTO_STOPPED') {
					return q(null);
				}

				return appsService.appAutoStop(appId, autoStop, ravelloUsername, ravelloPassword);
			}
		}
	).then(
		function(autoStopResult) {
			if (!autoStopResult || autoStopResult.status < 400) {
				return appsService.appAction(appId, action, ravelloUsername, ravelloPassword);
			}
		}
	);
}

// These actions are taken by Student users.

exports.vmAction = function(request, response, next) {
    var user = request.user;
    var userId = user.id;

	var appId = request.params.appId;
	var vmId = request.params.vmId;
	var action = request.params.action;

	// When the user logs in, we first need to find the class associated with that user.
	classesDal.getClassOfUserForNow(userId).then(
		function(classEntity) {
			var classData = classesTrans.entityToDto(classEntity);
			var studentData = _.find(classEntity.students, function(student) {
				return (student.user.id === userId);
			});

			var ravelloUsername = studentData.ravelloCredentials.username || classData.ravelloCredentials.username;
			var ravelloPassword = studentData.ravelloCredentials.password || classData.ravelloCredentials.password;

			return appsService.getAppDeployment(appId, ravelloUsername, ravelloPassword).then(
				function(result) {
					var app = result.body;
					if (app.deployment.expirationType === 'AUTO_STOPPED') {
						return appsService.appAutoStop(appId, properties.defaultAutoStopSeconds, ravelloUsername, ravelloPassword);
					}
				}
			).then(
				function(autoStopResult) {
					if (!autoStopResult || autoStopResult.status === 204) {
						return appsService.vmAction(appId, vmId, action, ravelloUsername, ravelloPassword).then(
							function() {
								response.send(200);
							}
						);
					}
				}
			);
		}
	).catch(next);
};

exports.vmVnc = function(request, response, next) {
    var user = request.user;
    var userId = user.id;

    var appId = request.params.appId;
    var vmId = request.params.vmId;

    // When the user logs in, we first need to find the class associated with that user.
    classesDal.getClassOfUserForNow(userId).then(
        function(classEntity) {
            var classData = classesTrans.entityToDto(classEntity);
            var studentData = _.find(classEntity.students, function(student) {
                return (student.user.id === userId);
            });

            var ravelloUsername = studentData.ravelloCredentials.username || classData.ravelloCredentials.username;
            var ravelloPassword = studentData.ravelloCredentials.password || classData.ravelloCredentials.password;

            return appsService.vmVnc(appId, vmId, ravelloUsername, ravelloPassword).then(
                function(result) {
					response.send(200, result.text);
                }
            );
        }
    ).catch(next);
};