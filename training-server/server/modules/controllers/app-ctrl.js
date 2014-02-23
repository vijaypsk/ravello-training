'use strict';

var _ = require('lodash');

var appsService = require('../services/apps-service');
var classesDal = require('../dal/classes-dal');

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

        appsService.appAction(appId, action, ravelloUsername, ravelloPassword).then(function(result) {
            response.send(result.status);
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

        appsService.vmAction(appId, vmId, action, ravelloUsername, ravelloPassword).then(function(result) {
            response.send(result.status);
        }).fail(function(error) {
            var message = "Could not perform action " + action + ", error: " + error;
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