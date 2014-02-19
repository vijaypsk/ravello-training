'use strict';

var _ = require('lodash');

var appsService = require('../services/apps-service');
var classesDal = require('../dal/classes-dal');

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
        });
    });
};