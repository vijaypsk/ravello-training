'use strict';

var _ = require('lodash');

var coursesDal = require('../dal/courses-dal');
var blueprintsDal = require('../dal/blueprints-dal');

var assignBlueprintsToCourse = function(course, blueprints) {
    _.forEach(course.blueprints, function(currentBp) {
        var matchingBp = _.find(blueprints, function(bp) {
            return (bp.id == currentBp.id);
        });

        if (matchingBp) {
            currentBp = _.assign(currentBp, matchingBp);
        }
    });
};

exports.getCourses = function(request, response) {
    coursesDal.getCourses().then(function(courses) {
        blueprintsDal.getBlueprints().then(function(blueprints) {
            _.forEach(courses, function(currentCourse) {
                assignBlueprintsToCourse(currentCourse, blueprints);
            });

            response.json(courses);
        }).fail(function(error) {
            console.log("Could not load blueprints, error: " + error);
        });
    }).fail(function(error) {
        console.log("Could not load courses, error: " + error);
    });
};

exports.getCourse = function(request, response) {
    var courseId = request.params.courseId;

    coursesDal.getCourse(courseId).then(function(course) {
        blueprintsDal.getBlueprints().then(function(blueprints) {
            assignBlueprintsToCourse(course, blueprints);
            response.json(course);
        }).fail(function(error) {
                console.log("Could not load blueprints, error: " + error);
        });
    }).fail(function(error) {
        console.log("Could not load course: " + courseId + ", error: " + error);
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
    var courseData = request.body;

    coursesDal.updateCourse(courseId, courseData).fail(function(error) {
        console.log("Could not update course, error: " + error);
    });
};

exports.deleteCourse = function(request, response) {
    var courseId = request.params.courseId;

    coursesDal.deleteCourse(courseId).fail(function(error) {
        console.log("Could not delete course, error: " + error);
    });
};