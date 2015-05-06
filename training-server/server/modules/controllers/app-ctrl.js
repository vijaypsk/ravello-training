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

	// First create all of the apps.
	q.all(_.map(requestData.apps, function(appDto) {
		return appsService.createApp(appDto.name, appDto.description, appDto.baseBlueprintId, ravelloUsername, ravelloPassword).then(
			function(createAppResult) {
				var appData = appsTrans.ravelloObjectToTrainerDto(createAppResult.body);
				return {
					originalDto: appDto,
					appData: appData
				};
			}
		).catch(
			function(error) {
				// Don't fail the whole call if one app wasn't created.
				logger.warn({reason: error}, 'Could not create App [%s] for user ID [%s]', appDto.name, appDto.userId);
				return {
					originalDto: appDto,
					appData: null
				};
			}
		);
	})).then(
		function(createAppResults) {
			// Now that all apps are finished (whether successfully or not) we can update the class, to maintain synchronization between Ravello and TP.
			var appsToPublish = [];

			return classesDal.getClass(requestData.classId).then(
				function(classEntity) {
					var classData = classesTrans.entityToDto(classEntity);

					var studentsMap = _.indexBy(classData.students, function(student) {
						return student.user._id;
					});

					// Only the apps that were created successfully will be saved in the class, and will be later published.
					_.forEach(createAppResults, function(createAppResult) {
						if (createAppResult.appData) {
							var student = studentsMap[createAppResult.originalDto.userId];
							student && student.apps.push({ravelloId: createAppResult.appData.ravelloId});

							appsToPublish.push(createAppResult);
						}
					});

					return classesDal.updateClass(requestData.classId, classData).then(
						function() {
							return classesDal.getClass(requestData.classId).then(
								function(result) {
									// The response to the client returns now, before starting to publish the apps against Ravello.
									var dto = classesTrans.entityToDto(result);
									response.send(dto);
								}
							);
						}
					);
				}
			).then(
				function() {
					// Publishing the apps happens in the background, after the response returns.
					// We do it in chunks, because there are time-based limits when working against the clouds,
					// and we don't want to meet them, so we don't perform too many actions simultaneously.
					publishAppsInChunks(appsToPublish);
				}
			);
		}
	).catch(next);

	function publishAppsInChunks(appsToPublish) {
		function publishChunk() {
			var apps = appsChunks[currentChunk];

			if (apps && apps.length) {
				logger.info('Publishing %d apps in chunk # %d', apps.length, currentChunk);

				publishApps(apps);
				currentChunk++;

				if (currentChunk < appsChunks.length) {
					setInterval(publishChunk, properties.publishAppsChunkDelay);
				}
			}
		}

		var currentChunk = 0;
		var appsChunks = _.chunk(appsToPublish, properties.publishAppsChunkSize);

		logger.info('Publishing %d apps in %d chunks. Delay between chunks: %d milliseconds',
			requestData.apps.length, (appsChunks ? appsChunks.length : 0), properties.publishAppsChunkDelay);

		if (appsChunks && appsChunks.length) {
			publishChunk();
		}
	}

	function publishApps(apps) {
		return q.all(_.map(apps, function(app) {
			return publishApp(app.appData, app.originalDto.publishDetails);
		}));
	}

	function publishApp(appData, publishDetails) {
		return appsService.publishApp(appData.ravelloId, publishDetails, ravelloUsername, ravelloPassword).then(
			function() {
				var autoStop = publishDetails && !_.isUndefined(publishDetails.autoStop) ?
					publishDetails.autoStop :
					properties.defaultAutoStopSeconds;

				if (autoStop !== -1) {
					autoStop = publishDetails.autoStop * 60;
				}

				var promise;
				if (autoStop !== -1 ) {
					promise = appsService.appAutoStop(appData.ravelloId, autoStop, ravelloUsername, ravelloPassword);
				} else {
					promise = q({});
				}

				return promise;
			}
		).catch(
			function(error) {
				// The publish action happens asynchronously, in the background, so we get informed about failures via the log...
				logger.warn({reason: error.reason, status: error.status}, 'Could not publish App: %s', error.message);
			}
		);
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
	classesDal.getClassByUserId(userId).then(
		function(classEntity) {
			if (!classEntity.active) {
				next(errorHandler.createError(404, 'Your class is not open yet, please contact your trainer'));
				return;
			}

			var classData = classesTrans.entityToDto(classEntity);

			var ravelloUsername = classData.ravelloCredentials.username;
			var ravelloPassword = classData.ravelloCredentials.password;

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
    classesDal.getClassByUserId(userId).then(
        function(classEntity) {
			if (!classEntity.active) {
				next(errorHandler.createError(404, 'Your class is not open yet, please contact your trainer'));
				return;
			}

			var classData = classesTrans.entityToDto(classEntity);

            var ravelloUsername = classData.ravelloCredentials.username;
            var ravelloPassword = classData.ravelloCredentials.password;

            return appsService.vmVnc(appId, vmId, ravelloUsername, ravelloPassword).then(
                function(result) {
					response.send(200, result.text);
                }
            );
        }
    ).catch(next);
};