'use strict';

var _ = require('lodash');

var classesDal = require('../dal/classes-dal');
var blueprintsDal = require('../dal/blueprints-dal');
var blueprintsService = require('../services/blueprints-service');

exports.getBlueprints = function(request, response) {
    var user = request.user;
    var userId = user.id;

    // When the user logs in, we first need to find the class associated with that user.
    classesDal.getClassOfUser(userId).then(function(classEntity) {
        var studentData = _.find(classEntity.students, function(student) {
            return (student.user.id === userId);
        });

        var ravelloUsername = studentData.ravelloCredentials.username;
        var ravelloPassword = studentData.ravelloCredentials.password;

        blueprintsService.getBlueprints(ravelloUsername, ravelloPassword).then(function(blueprints) {
            response.json(blueprints);
        }).fail(function(error) {
            console.log("Could not load blueprints, error: " + error);
        });
    });
};
