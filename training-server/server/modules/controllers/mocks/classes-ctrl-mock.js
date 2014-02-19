'use strict';

var q = require('q');
var _ = require('lodash');
var randy = require('randy');

var classes = [];

exports.getClasses = function(request, response) {
    response.json(classes);
};

exports.createClass = function(request, response) {
    var classId = "" + randy.randInt(1000000);

    var classData = request.body;
    classData._id = classId;

    _.forEach(classData.students, function(student) {
        if (!student.apps) {
            student.apps = {};

            var appName = "checkpoint-internal_firewall-basic-bp01_" + student.user.firstName;

            classData[appName] = {
                "blueprintId": "1",
                "creationTime": "20/01/2014 09:02:31",
                "numOfRunningVms": 3
            };
        }
    });

    classes.push(classData);

    response.json(classData);
};

exports.updateClass = function(request, response) {
    var classId = request.params.classId;
    var classData = request.body;

    classes = _.map(classes, function(currentClass) {
        if (currentClass._id === classId) {
            return classData;
        }
        return currentClass;
    });

    _.forEach(classData.students, function(student) {
        if (!student._id) {
            var studentId = "" + randy.randInt(10000000);
            student._id = studentId;
        }

        if (!student.user._id) {
            var userId = "" + randy.randInt(10000000);
            student.user._id = userId;
        }
    });

    response.json(classData);
};

exports.deleteClass = function(request, response) {
    var classId = request.params.classId;
    _.remove(classes, function(currentClass) {
        return (currentClass._id === classId);
    });
};
