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
		next(errorHandler.createError(401, 'You are not authorized to perform this action. Verify your Ravello credentials.'));
		return;
	}

	var ravelloUsername = user.ravelloCredentials.username;
	var ravelloPassword = user.ravelloCredentials.password;

	var requestData = request.body;
	var errors = [];
    
	// First create all of the apps.
	q.all(_.map(requestData.apps, function(appDto) {
		return appsService.createApp(appDto.name, appDto.description, appDto.baseBlueprintId, appDto.bucketId, ravelloUsername, ravelloPassword).then(
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
				var appError = {
					appName: appDto.name,
					errorMsg: getErrorMsg(error)
				};
				errors.push(appError);
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
					var classData = classEntity.toJSON();

					var studentsMap = _.indexBy(classData.students, function(student) {
						return student.user._id;
					});

					// Only the apps that were created successfully will be saved in the class, and will be later published.
					_.forEach(createAppResults, function(createAppResult) {
						if (createAppResult.appData) {
							var student = studentsMap[createAppResult.originalDto.userId];
							student && student.apps.push({ravelloId: createAppResult.appData.ravelloId});
							student.scheduledApps=[];
							console.log('createAppResult ',student);

							appsToPublish.push(createAppResult);
						}
					});

					return classesDal.updateClass(requestData.classId, classData).then(
						function() {
							return classesDal.getClass(requestData.classId).then(
								function(result) {
									// The response to the client returns now, before starting to publish the apps against Ravello.
									var dto = classesTrans.entityToDto(result);
									var res = {
										class: dto,
										errors: errors
									};
									response.send(res);
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

	function getErrorMsg(error) {
		if (error.message) {
			return error.message;
		} else {
			return '';
		}
	}

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
				logger.warn({reason: error.reason, status: error.status, ravelloOpId: error.ravelloOpId}, 'Could not publish App: %s', error.message);
			}
		);
	}
};

exports.scheduleApps = function(request, response, next) {
	var user = request.user;

	if (!user.ravelloCredentials) {
		next(errorHandler.createError(401, 'You are not authorized to perform this action. Verify your Ravello credentials.'));
		return;
	}

	var ravelloUsername = user.ravelloCredentials.username;
	var ravelloPassword = user.ravelloCredentials.password;

	var requestData = request.body;
	var errors = [];
    var scheduledAppsData = [];
	// First schedule all of the apps.
	q.all(_.map(requestData.apps, function(appDto) {
		//appsService.scheduleApp(appDto);
		scheduledAppsData.push(appDto);
	})).then(
		function(){
			

			// Now that all apps are finished (whether successfully or not) we can update the class, to maintain synchronization between Ravello and TP.
			var appsSchedule = [];

			return classesDal.getClass(requestData.classId).then(
				function(classEntity) {
					var classData = classEntity.toJSON();

					

					

					// Only the apps that were scheduled successfully will be marked as scheduled, and will be later started.
					classesDal.scheduleStudentApp(requestData.classId,scheduledAppsData);
					
					console.log("After scheduling...",appsSchedule);
					return classesDal.updateClass(requestData.classId, classData).then(
						function() {
							return classesDal.getClass(requestData.classId).then(
								function(result) {
									// The response to the client returns now, before starting to publish the apps against Ravello.
									var dto = classesTrans.entityToDto(result);
									var res = {
										class: dto,
										errors: errors
									};
									response.send(res);
								}
							);
						}
					);
				}
			);


			//response.send(scheduledAppsData);
		}
	).catch(next);

	function getErrorMsg(error) {
		if (error.message) {
			return error.message;
		} else {
			return '';
		}
	}

	

	
};

exports.unscheduleApps = function(request, response, next) {
	var user = request.user;

	if (!user.ravelloCredentials) {
		next(errorHandler.createError(401, 'You are not authorized to perform this action. Verify your Ravello credentials.'));
		return;
	}

	var ravelloUsername = user.ravelloCredentials.username;
	var ravelloPassword = user.ravelloCredentials.password;

	var requestData = request.body;
	var errors = [];
    var scheduledAppsData = [];
	// First schedule all of the apps.
	q.all(_.map(requestData.apps, function(appDto) {
		//appsService.scheduleApp(appDto);
		scheduledAppsData.push(appDto);
	})).then(
		function(){
			
			// Now that all apps are finished (whether successfully or not) we can update the class, to maintain synchronization between Ravello and TP.
			var appsSchedule = [];

			return classesDal.getClass(requestData.classId).then(
				function(classEntity) {
					var classData = classEntity.toJSON();
                     //console.log("Before un scheduling...",scheduledAppsData);
					classesDal.unscheduleStudentApp(requestData.classId,scheduledAppsData);
					console.log("After un scheduling...",appsSchedule);
					return classesDal.updateClass(requestData.classId, classData).then(
						function() {
							return classesDal.getClass(requestData.classId).then(
								function(result) {
									// The response to the client returns now, before starting to publish the apps against Ravello.
									var dto = classesTrans.entityToDto(result);
									var res = {
										class: dto,
										errors: errors
									};
									response.send(res);
								}
							);
						}
					);
				}
			);


			//response.send(scheduledAppsData);
		}
	).catch(next);

	function getErrorMsg(error) {
		if (error.message) {
			return error.message;
		} else {
			return '';
		}
	}

	

	
};


exports.deleteApps = function(request, response, next) {
	var user = request.user;

	if (!user.ravelloCredentials) {
		next(errorHandler.createError(401, 'You are not authorized to perform this action.'));
		return;
	}

	var classId = request.body.classId;
	var appsToDelete = request.body.apps;

	var ravelloUsername = user.ravelloCredentials.username;
	var ravelloPassword = user.ravelloCredentials.password;

	var deletedAppsData = [];

	q.all(_.map(appsToDelete, function(appData) {
		return appsService.deleteApp(appData.ravelloId, ravelloUsername, ravelloPassword).then(
			function(result) {
				if (result && result.status < 400) {
					deletedAppsData.push(appData);
				} else {
					logger.warn('Could not delete app ' + appData.ravelloId + ' for user ' + appData.userId);
				}
				return result;
			}
		);
	})).then(
		function() {
			return classesDal.deleteStudentsApps(classId, deletedAppsData).then(
				function() {
					response.send(200);
				}
			);
		}
	).catch(next);
};

exports.appsBatchStart = function(request, response, next) {
	batchAppAction(request, response, next, 'start', true);
};

exports.appsBatchStop = function(request, response, next) {
	batchAppAction(request, response, next, 'stop', false);
};

function batchAppAction(request, response, next, action, shouldAutoStop) {
	var user = request.user;

	if (!user.ravelloCredentials) {
		next(errorHandler.createError(401, 'You are not authorized to perform this action.'));
		return;
	}

	var ravelloUsername = user.ravelloCredentials.username;
	var ravelloPassword = user.ravelloCredentials.password;

	var classId = request.body.classId;
	var apps = request.body.apps;

	classesDal.getClass(classId).then(
		function(classEntity) {
			var classData = classesTrans.entityToDto(classEntity);

			return q.all(_.map(apps, function(app) {
				var autoStop = null;

				if (shouldAutoStop) {
					autoStop = getClassAutoStopForBp(classData, app.bpId);
				}

				return appAction(app.ravelloId, action, shouldAutoStop, autoStop, ravelloUsername, ravelloPassword);
			})).then(
				function() {
					response.send(200);
				}
			);
		}
	).catch(next);

}

function appAction(appId, action, shouldAutoStop, defaultAutoStop, ravelloUsername, ravelloPassword) {
	return appsService.getAppDeployment(appId, ravelloUsername, ravelloPassword).then(
		function(result) {
			if (shouldAutoStop && result.status === 200) {
				var app = result.body;
				var autoStop = determineAppAutoStop(app, defaultAutoStop);
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

exports.appsBatchAutoStop = function(request, response, next) {
	var user = request.user;

	if (!user.ravelloCredentials) {
		next(errorHandler.createError(401, 'You are not authorized to perform this action.'));
		return;
	}

	var ravelloUsername = user.ravelloCredentials.username;
	var ravelloPassword = user.ravelloCredentials.password;

	var apps = request.body.apps;
	var autoStopMinutes = request.body.autoStopMinutes;
	var autoStop = autoStopMinutes === '-1' ? parseInt(autoStopMinutes) : parseInt(autoStopMinutes) * 60;

	return q.all(_.map(apps, function(app) {
		if (app.deployment) {
			return q(null);
		}

		return appsService.appAutoStop(app.ravelloId, autoStop, ravelloUsername, ravelloPassword);
	})).then(
		function() {
			response.send(200);
		}
	).catch(next);
};

// These actions are taken by Student users.

exports.batchVmsActions = function(request, response, next) {
	var user = request.user;
	var userId = user.id;

	var appId = request.params.appId;
	var action = request.params.action;

	var vmIds = request.body.vmIds;

	// When the user logs in, we first need to find the class associated with that user.
	classesDal.getClassByUserId(userId).then(
		function(classEntity) {
			if (!classEntity.active) {
				next(errorHandler.createError(404, 'Your class is not open yet, please contact your trainer'));
				return;
			}

			var classData = classesTrans.entityToDto(classEntity);

			var ravelloUsername = classEntity.ravelloCredentials.username;
			var ravelloPassword = classEntity.ravelloCredentials.password;

			return appsService.getAppDeployment(appId, ravelloUsername, ravelloPassword).then(
				function(result) {
					if (action !== 'stop') {
						var app = result.body;
						var defaultAutoStop = getClassAutoStopForBp(classData, app.baseBlueprintId);
						var autoStop = determineAppAutoStop(app, defaultAutoStop);
						return appsService.appAutoStop(appId, autoStop, ravelloUsername, ravelloPassword);
					} else {
						return q({});
					}
				}
			).then(
				function() {
					return appsService.batchVmsActions(appId, vmIds, action, ravelloUsername, ravelloPassword).then(
						function() {
							response.send(200);
						}
					);
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

			var classData = classEntity.toJSON();

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

// Private functions

function getClassAutoStopForBp(classData, bpId) {
	var autoStop = properties.defaultAutoStopSeconds;
	var
		publishDetails = _.find(classData.bpPublishDetailsList, {bpId: bpId});
	if (publishDetails) {
		autoStop = publishDetails.autoStop;
		if (autoStop !== -1) {
			autoStop *= 60;
		}
	}

	return autoStop;
}

function determineAppAutoStop(app, defaultAutoStop) {
	var autoStop = null;

	if (app.deployment) {
		// If the app already has a valid (later than now) expiration time - stick with it.
		if (app.deployment.expirationTime && app.deployment.expirationTime > Date.now()) {
			autoStop = (app.deployment.expirationTime - Date.now()) / 1000;
		} else {
			autoStop = defaultAutoStop;
		}
	}

	return autoStop;
}