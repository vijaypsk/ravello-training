'use strict';

var _ = require('lodash');
var randy = require('randy');

var blueprintsDal = require('../../dal/blueprints-dal');

var courses = [];

exports.getCourses = function(request, response) {
    blueprintsDal.getBlueprints().then(function(blueprints) {
        _.forEach(courses, function(currentCourse) {
            _.forEach(currentCourse.blueprints, function(currentBp) {
                var matchingBp = _.find(blueprints, function(bp) {
                    return (bp.id === currentBp.id);
                });

                if (matchingBp) {
                    currentBp = _.assign(currentBp, matchingBp);
                }
            });
        });

        response.json(courses);
    });
};

exports.getCourse = function(request, response) {
    var result = {
        "id": "1",
        "name": "Firewall basic",
        "description": "Firewall basic",
        "ravelloCredentials": {
            "username": "pai.mei@ravellosystems.com",
            "password": "123456"
        },
        "blueprints": [
            {
                "id": "1",
                "name": "firewall basic bp01",
                "description": "",
                "creationTime": "22/06/2013 09:53:21",
                "owner": "danielw",
                "displayForStudents": "Firewall basic environment"
            },
            {
                "id": "2",
                "name": "firewall advanced bp01",
                "description": "",
                "creationTime": "02/04/2013 11:44:21",
                "owner": "danielw",
                "displayForStudents": "Firewall advanced environment"
            }
        ]
    };

    response.json(result);
};

exports.createCourse = function(request, response) {
    var courseId = "" + randy.randInt(1000000);

    var courseData = request.body;
    courseData._id = courseId;

    courses.push(courseData);

    response.json(courseData);
};

exports.updateCourse = function(request, response) {
    var courseId = request.params.courseId;
    var courseData = request.body;

    courses = _.map(courses, function(currentCourse) {
        if (currentCourse._id === courseId) {
            return courseData;
        }
        return currentCourse;
    });
};

exports.deleteCourse = function(request, response) {
    var courseId = request.params.courseId;
    _.remove(courses, function(currentCourse) {
        return (currentCourse._id === courseId);
    });
};