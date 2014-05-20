'use strict';

var _ = require('lodash');
var q = require('q');

var logger = require('../config/logger');

var coursesDal = require('../dal/courses-dal');
var classesDal = require('../dal/classes-dal');

var blueprintsService = require('../services/blueprints-service');

var coursesTrans = require('../trans/courses-trans');
var blueprintsTrans = require('../trans/blueprints-trans');

var assignBlueprintsToCourse = function(course, bpDtos) {
    return _.map(course.blueprints, function(currentBp) {
        var matchingBp = _.find(bpDtos, function(bpResult) {
            return (bpResult.body.id == currentBp.id);
        });

        if (!matchingBp) {
            return currentBp;
        }

        var convertedBp = blueprintsTrans.dtoToEntity(matchingBp.body);
        return _.assign(currentBp, convertedBp);
    });
};

exports.getCourses = function(request, response) {
    var user = request.user;

    var ravelloUsername = user.ravelloCredentials.username;
    var ravelloPassword = user.ravelloCredentials.password;

    coursesDal.getCourses().then(function(courses) {

        var courseDtos = [];

        q.all(_.map(courses, function(courseEntity) {
            var course = coursesTrans.entityToDto(courseEntity);
            return q.all(_.map(course.blueprints, function(bp) {
                return blueprintsService.getBlueprintById(bp.id, ravelloUsername, ravelloPassword);
            })).then(function(bpResults) {
                course.blueprints = assignBlueprintsToCourse(course, bpResults);
                courseDtos.push(course);
            }).fail(function(error) {
                var message = "Could not get one of the course's blueprints";
                logger.error(error, message);
                response.send(404, message);
            });
        })).then(function(coursesResults) {
            response.json(courseDtos);
        });
    }).fail(function(error) {
        var message = "Could not get one of the courses";
        logger.error(error, message);
        response.send(404, message);
    });
};

exports.getCourse = function(request, response) {
    var courseId = request.params.courseId;

    var user = request.user;
    var userId = user.id;

    // Notice that we expect the user here to be a student, i.e. we try to get its class so that we can
    // have its real Ravello credentials.
    classesDal.getClassOfUserForNow(userId).then(function(classEntity) {

        var studentData = classEntity.findStudentByUserId(userId);

        var ravelloUsername = studentData.ravelloCredentials.username;
        var ravelloPassword = studentData.ravelloCredentials.password;

        coursesDal.getCourse(courseId).then(function(courseEntity) {
            var course = coursesTrans.entityToDto(courseEntity);
            q.all(_.map(course.blueprints, function(bp) {
                return blueprintsService.getBlueprintById(bp.id, ravelloUsername, ravelloPassword);
            })).then(function(bpResults) {
                course.blueprints = assignBlueprintsToCourse(course, bpResults);
                response.json(course);
            }).fail(function(error) {
                var message = "Could not get one of the course's blueprints";
                logger.error(error, message);
                response.send(404, message);
            });
        }).fail(function(error) {
            var message = "Could not load course: " + courseId;
            logger.error(error, message);
            response.send(404, message);
        });
    }).fail(function(error) {
        var message = "Could not load class of user " + user.username;
        logger.error(error, message);
        response.send(404, message);
    });
};

exports.createCourse = function(request, response) {
    coursesDal.createCourse(request.body).then(function(courseEntity) {
        var course = coursesTrans.entityToDto(courseEntity);
        response.json(courseEntity);
    }).fail(function(error) {
        var message = "Could not save course";
        logger.error(error, message);
        response.send(400, message);
    });
};

exports.updateCourse = function(request, response) {
    var courseId = request.params.courseId;
    var courseData = request.body;

    coursesDal.updateCourse(courseId, courseData).then(function(courseEntity) {
        response.send(200);
    }).fail(function(error) {
        var message = "Could not update course";
        logger.error(error, message);
        response.send(404, message);
    });
};

exports.deleteCourse = function(request, response) {
    var courseId = request.params.courseId;

    coursesDal.deleteCourse(courseId).then(function(courseEntity) {
        response.send(200);
    }).fail(function(error) {
        var message = "Could not delete course";
        logger.error(error, message);
        response.send(404, message);
    });
};