'use strict';

var _ = require('lodash');
var q = require('q');

var properties = require('../config/properties');
var logger = require('../config/logger');

var appsService = require('../services/apps-service');

var appsTrans = require('../trans/apps-trans');
var classesTrans = require('../trans/classes-trans');

var classesDal = require('../dal/classes-dal');

exports.createApps = function(request, response) {
	logger.debug('app-ctrl - createApps - start');

	var user = request.user;

	if (!user.ravelloCredentials) {
		response.send(401, 'User does not have sufficient Ravello credentials');
		return;
	}

	var ravelloUsername = user.ravelloCredentials.username;
	var ravelloPassword = user.ravelloCredentials.password;

	var requestData = request.body;

	q.all(_.map(requestData.apps, function(appDto) {
		return appsService.createApp(appDto.name, appDto.description, appDto.baseBlueprintId, ravelloUsername,
			ravelloPassword).then(

			function (appCreateResult) {
				logger.debug('app-ctrl - createApps - app [' + appDto.name + '] create returned, status: ' + appCreateResult.status);

				if (appCreateResult.status >= 400) {
					return q({
						userId: appDto.userId,
						message: "Could not create application [" + appDto.name + "]",
						reason: appCreateResult.text || appCreateResult.body || appCreateResult.error
					});
				}

				var appData = appsTrans.ravelloObjectToTrainerDto(appCreateResult.body);

				return appsService.publishApp(appData.ravelloId, ravelloUsername, ravelloPassword).then(
					function(appPublishResult) {
						logger.debug('app-ctrl - createApps - app [' + appDto.name + '] publish returned, status: ' + appPublishResult.status);

						if (appPublishResult.status >= 400) {
							return q({
								userId: appDto.userId,
								app: appData,
								message: "Could not publish application [" + appDto.name + "]",
								reason: appPublishResult.text || appPublishResult.body || appPublishResult.error
							});
						}

						var promise;
						if (properties.defaultAutoStopSeconds !== -1 ) {
							promise = appsService.appAutoStop(appData.ravelloId, properties.defaultAutoStopSeconds,
								ravelloUsername, ravelloPassword);
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

					logger.debug('app-ctrl - createApps - going to update class [' + requestData.classId + ']');

					classesDal.updateClass(requestData.classId, classData).then(
						function() {
							return classesDal.getClass(requestData.classId).then(
								function(result) {
									logger.debug('app-ctrl - createApps - class [' + requestData.classId + '] is updated');

									var dto = classesTrans.entityToDto(result);
									response.json(dto);
								}
							);
						}
					);
				}
			);
		}
	).catch(
		function(error) {
			logger.error({error: error});
			return response.send(400, error.message);
		}
	);
};

exports.deleteApp = function(request, response) {
    var user = request.user;

    if (!user.ravelloCredentials) {
        response.send(401, 'User does not have sufficient Ravello credentials');
        return;
    }

    var appId = request.params.appId;
    var studentId = request.query.studentId;

    var ravelloUsername = user.ravelloCredentials.username;
    var ravelloPassword = user.ravelloCredentials.password;

    return appsService.deleteApp(appId, ravelloUsername, ravelloPassword).then(
        function(result) {
            return classesDal.deleteStudentApp(studentId, appId).then(
                function(persistedClass) {
                    response.send(200);
                }
            );
        }
    ).fail(
        function(error) {
            var message = "Could not delete app [" + appId + "]";
            logger.error(error, message);
            response.send(404, message);
        }
    );
};

exports.appAction = function(request, response) {
    var user = request.user;
    var userId = user.id;

    var appId = request.params.appId;
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
                    if (result.status == 200) {
                        var app = result.body;
                        if (app.deployment.expirationType === 'AUTO_STOPPED') {
                            return appsService.appAutoStop(appId, properties.defaultAutoStopSeconds, ravelloUsername,
                                ravelloPassword);
                        }
                    } else {
                        var message = "Could not get app: " + appId + ", error: " + result.ext;
                        logger.error(message);
                        response.send(result.status, message);
                    }
                }
            ).then(
                function(autoStopResult) {
                    if (!autoStopResult || autoStopResult.result == 204) {
                        return appsService.appAction(appId, action, ravelloUsername, ravelloPassword).then(
                            function(result) {
                                response.send(result.status);
                            }
                        ).fail(
                            function(error) {
                                var message = "Could not perform action " + action;
                                logger.error(error, message);
                                response.send(400, error);
                            }
                        );
                    } else {
                        var message = "Could not set autoStop for app: " + appId + ", error: " + autoStopResult.text;
                        logger.error(message);
                        response.send(400, message);
                    }
                }
            );
        }
    );
};

exports.vmAction = function(request, response) {
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
                    if (result.status == 200) {
                        var app = result.body;
                        if (app.deployment.expirationType === 'AUTO_STOPPED') {
                            return appsService.appAutoStop(appId, properties.defaultAutoStopSeconds, ravelloUsername,
                                ravelloPassword);
                        }
                    } else {
                        var message = "Could not get app: " + appId + ", error: " + result.text;
                        logger.error(message);
                        response.send(result.status, message);
                    }
                }
            ).then(
                function(autoStopResult) {
                    if (!autoStopResult || autoStopResult.result == 204) {
                        return appsService.vmAction(appId, vmId, action, ravelloUsername, ravelloPassword).then(
                            function(result) {
                                response.send(result.status);
                            }
                        ).fail(
                            function(error) {
                                var message = "Could not perform action " + action;
                                logger.error(error, message);
                                response.send(400, error);
                            }
                        );
                    } else {
                        var message = "Could not set autoStop for app: " + appId + ", error: " + autoStopResult.text;
                        logger.error(message);
                        response.send(400, message);
                    }
                }
            ).fail(
                function(error) {
                    var message = "Could not get app [" + appId + "]";
                    logger.error(error, message);
                    response.send(400, message);
                }
            );
        }
    ).fail(
        function(error) {
            var message = "Could not find the class associated with the logged in user: " + user.username;
            logger.error(error, message);
            response.send(404, message);
        }
    );
};

exports.vmVnc = function(request, response) {
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
                    if (result.status === 200) {
                        response.send(200, result.text);
                    } else {
                        response.send(result.status, result.text);
                    }
                }
            ).fail(
                function(error) {
                    var message = "Could not get the URL for the VNC";
                    logger.error(error, message);
                    response.send(400, error);
                }
            );
        }
    ).fail(
        function(error) {
            var message = "Could not find the class associated with the logged in user: " + user.username;
            logger.error(error, message);
            response.send(404, message);
        }
    );
};