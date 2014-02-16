'use strict';

var _ = require('lodash');

var coursesDal = require('../dal/courses-dal');
var blueprintsDal = require('../dal/blueprints-dal');

exports.getCourses = function(request, response) {
    coursesDal.getCourses().then(function(courses) {
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
        }).fail(function(error) {
            console.log("Could not load blueprints, error: " + error);
        });
    }).fail(function(error) {
        console.log("Could not load courses, error: " + error);
    });
};

exports.createCourse = function(request, response) {
    coursesDal.createCourse(request.body).then(function(result) {
        response.json(result);
    }).fail(function(error) {
        console.log("Could not save course, error: " + error);
    });
};

exports.updateCourse = function(request, response) {
    var courseId = request.params.courseId;
    var course = request.body;

    coursesDal.updateCourse(courseId, course).fail(function(error) {
        console.log("Could not update course, error: " + error);
    });
};

exports.deleteCourse = function(request, response) {
    var courseId = request.params.courseId;

    coursesDal.deleteCourse(courseId).fail(function(error) {
        console.log("Could not delete course, error: " + error);
    });
};