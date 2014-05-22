'use strict';

var _ = require('lodash');
var q = require('q');

var logger = require('../config/logger');

var coursesDal = require('../dal/courses-dal');

var blueprintsService = require('../services/blueprints-service');
var coursesService = require('../services/courses-service');

var coursesTrans = require('../trans/courses-trans');

/* --- Public functions --- */

exports.getCourses = function(request, response) {
    var user = request.user;

    var ravelloUsername = user.ravelloCredentials.username;
    var ravelloPassword = user.ravelloCredentials.password;

    coursesDal.getCourses().then(
        function(courses) {
            var courseDtos = [];

            return q.all(_.map(courses, function(courseEntity) {
                var course = coursesTrans.entityToDto(courseEntity);

                return matchCourseWithBlueprints(courseEntity, ravelloUsername, ravelloPassword).then(
                    function(result) {
                        courseDtos.push(result);
                        return result;
                    }
                ).fail(
                    function(error) {
                        var message = "Could not get one of the course's blueprints";
                        logger.error(error, message);
                        response.send(404, message);
                    }
                );
            })).then(
                function(coursesResults) {
                    response.json(courseDtos);
                }
            );
        }
    ).fail(
        function(error) {
            var message = "Could not get one of the courses";
            logger.error(error, message);
            response.send(404, message);
        }
    );
};

exports.getCourse = function(request, response) {
    var user = request.user;

    var courseId = request.params.courseId;

    var ravelloUsername = user.ravelloCredentials.username;
    var ravelloPassword = user.ravelloCredentials.password;

    coursesDal.getCourse(courseId).then(
        function(courseEntity) {
            var courseDto = coursesTrans.entityToDto(courseEntity);
            return matchCourseWithBlueprints(courseDto, ravelloUsername, ravelloPassword).then(
                function(result) {
                    response.json(result);
                }
            ).fail(
                function(error) {
                    var message = "Could not get one of the course's blueprints";
                    logger.error(error, message);
                    response.send(404, message);
                }
            );
        }
    ).fail(
        function(error) {
            var message = "Could not get course [" + courseId + "]";
            logger.error(error, message);
            response.send(404, message);
        }
    );
};

exports.createCourse = function(request, response) {
    var user = request.user;

    var ravelloUsername = user.ravelloCredentials.username;
    var ravelloPassword = user.ravelloCredentials.password;

    coursesDal.createCourse(request.body).then(
        function(courseEntity) {
            var course = coursesTrans.entityToDto(courseEntity);
            return matchCourseWithBlueprints(course, ravelloUsername, ravelloPassword).then(
                function(result) {
                    response.json(result);
                }
            ).fail(
                function(error) {
                    var message = "Could not get one of the course's blueprints";
                    logger.error(error, message);
                    response.send(404, message);
                }
            );
        }
    ).fail(
        function(error) {
            var message = "Could not save course";
            logger.error(error, message);
            response.send(400, message);
        }
    );
};

exports.updateCourse = function(request, response) {
    var user = request.user;

    var ravelloUsername = user.ravelloCredentials.username;
    var ravelloPassword = user.ravelloCredentials.password;

    var courseId = request.params.courseId;
    var courseData = request.body;

    coursesDal.updateCourse(courseId, courseData).then(
        function(courseEntity) {
            return coursesDal.getCourse(courseId).then(
                function(result) {
                    var dto = coursesTrans.entityToDto(result);
                    return matchCourseWithBlueprints(dto, ravelloUsername, ravelloPassword).then(
                        function(result) {
                            response.json(result);
                        }
                    ).fail(
                        function(error) {
                            var message = "Could not get one of the course's blueprints";
                            logger.error(error, message);
                            response.send(404, message);
                        }
                    );
                }
            );
        }
    ).fail(
        function(error) {
            var message = "Could not update course";
            logger.error(error, message);
            response.send(404, message);
        }
    );
};

exports.deleteCourse = function(request, response) {
    var courseId = request.params.courseId;

    coursesDal.deleteCourse(courseId).then(
        function(courseEntity) {
            response.send(200);
        }
    ).fail(
        function(error) {
            var message = "Could not delete course";
            logger.error(error, message);
            response.send(404, message);
        }
    );
};

/* --- Private functions --- */

var matchCourseWithBlueprints = function(course, ravelloUsername, ravelloPassword) {
    return q.all(_.map(course.blueprints, function(bp) {
        return blueprintsService.getBlueprintById(bp.id, ravelloUsername, ravelloPassword);
    })).then(
        function(bpResults) {
            course.blueprints = coursesService.assignBlueprintsToCourse(course, bpResults);
            return course;
        }
    );
};