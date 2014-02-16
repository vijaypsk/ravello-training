'use strict';

var classesDal = require('../dal/classes-dal');

exports.getClasses = function(request, response) {
    classesDal.getClasses().then(function(classes) {
        response.json(classes);
    }).fail(function(error) {
        console.log('Could not load classes, error: ' + error);
    });
};

exports.createClass = function(request, response) {
    classesDal.createClass(request.body).then(function(result) {
        response.json(result);
    }).fail(function(error) {
        console.log("Could not save class, error: " + error);
    });
};

exports.updateClass = function(request, response) {
    var classId = request.params.classId;
    var classData = request.body;

    classesDal.updateClass(classId, classData).fail(function(error) {
        console.log("Could not update class, error: " + error);
    });
};

exports.deleteClass = function(request, response) {
    var classId = request.params.classId;

    classesDal.deleteClass(classId).fail(function(error) {
        console.log("Could not delete class, error: " + error);
    });
};