'use strict';

var _ = require('lodash');

var properties = require('../config/properties');
var logger = require('../config/logger');

var appsService = require('../services/apps-service');

var appsTrans = require('../trans/apps-trans');
var classesTrans = require('../trans/classes-trans');

var classesDal = require('../dal/classes-dal');

exports.createApp = function(request, response) {
    var user = request.user;

    if (!user.ravelloCredentials) {
        response.send(401, 'User does not have sufficient Ravello credentials');
        return;
    }

    var ravelloUsername = user.ravelloCredentials.username;
    var ravelloPassword = user.ravelloCredentials.password;

    var requestData = request.body;

    appsService.createApp(requestData.name, requestData.description, requestData.baseBlueprintId, ravelloUsername,
            ravelloPassword).then(

        function(result) {
            if (result.status != 200 && result.status != 201) {
                return response.send(result.status, "Could not create application [" + requestData.name + "]");
            }

            var appData = appsTrans.ravelloObjectToTrainerDto(result.body);

            return appsService.publishApp(appData.ravelloId, ravelloUsername, ravelloPassword).then(
                function(publishResult) {
                    if (publishResult.status != 200 && publishResult.status != 202) {
                        return response.send(publishResult.status, "Could not publish app [" + requestData.name + "]");
                    }

                    return classesDal.updateStudentApp(requestData.userId, appData.ravelloId).then(
                        function(persistedClass) {
                            // The appData contains all the bare info of the app, as received from Ravello.
                            // But we also need to return the newly persisted data (mainly, the mongo ID of the document that was
                            // created for the app).
                            var dto = appData;

                            var matchingStudent = _.find(persistedClass.students, function(student) {
                                return student.user == requestData.userId;
                            });

                            if (matchingStudent) {
                                var newPersistedApp = _.last(matchingStudent.apps);
                                _.assign(dto, newPersistedApp.toJSON());
                            }

                            response.json(dto);
                        }
                    ).fail(
                        function(error) {
                            var message = "Could not save the new app [" + requestData.name + "] for the student";
                            logger.error(error, message);
                            return response.send(401, message);
                        }
                    );
                }
            ).fail(
                function(error) {
                    var message = "Could not publish new application [" + requestData.name + "]";
                    logger.error(error, message);
                    return response.send(401, message);
                }
            );
        }
    ).fail(
        function(error) {
            var message = "Could not create app with name [" + requestData.name + "]";
            logger.error(error, message);
            response.send(401, message);
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