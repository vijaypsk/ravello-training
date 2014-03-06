'use strict';

var _ = require('lodash');

var properties = require('../config/properties');

var appsService = require('../services/apps-service');

var appsTrans = require('../trans/apps-trans');

var classesDal = require('../dal/classes-dal');

exports.createApp = function(request, response) {
    var user = request.user;
    var userId = user.id;

    var appData = request.body;

    if (user.ravelloCredentials) {
        var ravelloUsername = user.ravelloCredentials.username;
        var ravelloPassword = user.ravelloCredentials.password;

        appsService.createApp(appData.name, appData.description, appData.baseBlueprintId, ravelloUsername, ravelloPassword).then(
            function(result) {
                if (result.status != 200 && result.status != 201) {
                    return response.send(result.status, result.text);
                }

                var appDto = appsTrans.ravelloObjectToTrainerDto(result.body);

                appsService.publishApp(appDto.id, ravelloUsername, ravelloPassword).then(function(publishResult) {
                    if (publishResult.status != 200 && publishResult.status != 202) {
                        return response.send(publishResult.status, publishResult.text);
                    }

                    response.json(appDto);
                }).fail(function(error) {
                    var message = "Could not publish new application [" + appData.name + "], error: " + error;
                    console.log(message);
                    return response.send(401, message);
                });
            }
        ).fail(function(error) {
            var message = "Could not create app with name [" + appData.name + "], error: " + error;
            console.log(message);
            response.send(401, message);
        });
    } else {
        response.send(401, 'User does not have sufficient Ravello credentials');
    }
};

exports.appAction = function(request, response) {
    var user = request.user;
    var userId = user.id;

    var appId = request.params.appId;
    var action = request.params.action;

    // When the user logs in, we first need to find the class associated with that user.
    classesDal.getClassOfUser(userId).then(function(classEntity) {
        var studentData = _.find(classEntity.students, function(student) {
            return (student.user.id === userId);
        });

        var ravelloUsername = studentData.ravelloCredentials.username;
        var ravelloPassword = studentData.ravelloCredentials.password;

        appsService.getAppDeployment(appId, ravelloUsername, ravelloPassword).then(function(result) {
            if (result.status == 200) {
                var app = result.body;
                if (app.deployment.expirationType === 'AUTO_STOPPED') {
                    return appsService.appAutoStop(appId, properties.defaultAutoStopSeconds, ravelloUsername,
                        ravelloPassword);
                }
            } else {
                var message = "Could not get app: " + appId + ", error: " + result.text;
                console.log(message);
                response.send(result.status, message);
            }
        }).then(function(autoStopResult) {
            if (!autoStopResult || autoStopResult.result == 204) {
                appsService.appAction(appId, action, ravelloUsername, ravelloPassword).then(function(result) {
                    response.send(result.status);
                }).fail(function(error) {
                    var message = "Could not perform action " + action + ", error: " + error;
                    console.log(message);
                    response.send(400, error);
                });
            } else {
                var message = "Could not set autoStop for app: " + appId + ", error: " + autoStopResult.text;
                console.log(message);
                response.send(400, message);
            }
        });
    });
};

exports.vmAction = function(request, response) {
    var user = request.user;
    var userId = user.id;

    var appId = request.params.appId;
    var vmId = request.params.vmId;
    var action = request.params.action;

    // When the user logs in, we first need to find the class associated with that user.
    classesDal.getClassOfUser(userId).then(function(classEntity) {
        var studentData = _.find(classEntity.students, function(student) {
            return (student.user.id === userId);
        });

        var ravelloUsername = studentData.ravelloCredentials.username;
        var ravelloPassword = studentData.ravelloCredentials.password;

        appsService.getAppDeployment(appId, ravelloUsername, ravelloPassword).then(function(result) {
            if (result.status == 200) {
                var app = result.body;
                if (app.deployment.expirationType === 'AUTO_STOPPED') {
                    return appsService.appAutoStop(appId, properties.defaultAutoStopSeconds, ravelloUsername,
                        ravelloPassword);
                }
            } else {
                var message = "Could not get app: " + appId + ", error: " + result.text;
                console.log(message);
                response.send(result.status, message);
            }
        }).then(function(autoStopResult) {
                if (!autoStopResult || autoStopResult.result == 204) {
                    appsService.vmAction(appId, vmId, action, ravelloUsername, ravelloPassword).then(function(result) {
                        response.send(result.status);
                    }).fail(function(error) {
                        var message = "Could not perform action " + action + ", error: " + error;
                        console.log(message);
                        response.send(400, error);
                    });
                } else {
                    var message = "Could not set autoStop for app: " + appId + ", error: " + autoStopResult.text;
                    console.log(message);
                    response.send(400, message);
                }
        }).fail(function(error) {
            console.log(error);
            response.send(400, error);
        });
    }).fail(function(error) {
        var message =
            "Could not find the class associated with the logged in user: " + user.username +
            ", error: " + error;
        console.log(message);
        response.send(404, message);
    });
};

exports.vmVnc = function(request, response) {
    var user = request.user;
    var userId = user.id;

    var appId = request.params.appId;
    var vmId = request.params.vmId;

    // When the user logs in, we first need to find the class associated with that user.
    classesDal.getClassOfUser(userId).then(function(classEntity) {
        var studentData = _.find(classEntity.students, function(student) {
            return (student.user.id === userId);
        });

        var ravelloUsername = studentData.ravelloCredentials.username;
        var ravelloPassword = studentData.ravelloCredentials.password;

        appsService.vmVnc(appId, vmId, ravelloUsername, ravelloPassword).then(function(result) {
            if (result.status === 200) {
                response.send(200, result.text);
            } else {
                response.send(result.status, result.text);
            }
        }).fail(function(error) {
            var message = "Could not get the URL for the VNC, error: " + error;
            console.log(message);
            response.send(400, error);
        });
    }).fail(function(error) {
        var message =
            "Could not find the class associated with the logged in user: " + user.username +
                ", error: " + error;
        console.log(message);
        response.send(404, message);
    });
};