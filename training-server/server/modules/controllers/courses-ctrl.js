'use strict';

var _ = require('lodash');
var q = require('q');

var logger = require('../config/logger');

var coursesDal = require('../dal/courses-dal');
var classesDal = require('../dal/classes-dal');

var blueprintsService = require('../services/blueprints-service');
var coursesService = require('../services/courses-service');

var coursesTrans = require('../trans/courses-trans');
var classesTrans = require('../trans/classes-trans');

/* --- Public functions --- */

exports.getCourses = function(request, response, next) {
    var user = request.user;

    var ravelloUsername = user.ravelloCredentials ? user.ravelloCredentials.username : '';
    var ravelloPassword = user.ravelloCredentials ? user.ravelloCredentials.password : '';

    coursesDal.getCourses().then(
        function(courses) {
            var courseDtos = [];

            return q.all(_.map(courses, function(courseEntity) {
                var course = coursesTrans.entityToDto(courseEntity);

                return matchCourseWithBlueprints(course, ravelloUsername, ravelloPassword).then(
                    function(result) {
                        courseDtos.push(result);
                        return result;
                    }
                );
            })).then(
                function() {
                    response.json(courseDtos);
                }
            );
        }
    ).catch(next);
};

exports.getCourse = function(request, response, next) {
    var user = request.user;

    var courseId = request.params.courseId;

    var ravelloUsername = user.ravelloCredentials ? user.ravelloCredentials.username : '';
    var ravelloPassword = user.ravelloCredentials ? user.ravelloCredentials.password : '';

    coursesDal.getCourse(courseId).then(
        function(courseEntity) {
            var courseDto = coursesTrans.entityToDto(courseEntity);
            return matchCourseWithBlueprints(courseDto, ravelloUsername, ravelloPassword).then(
                function(result) {
                    response.json(result);
                }
            );
        }
    ).catch(next);
};

exports.createCourse = function(request, response, next) {
    var user = request.user;

    var ravelloUsername = user.ravelloCredentials ? user.ravelloCredentials.username : '';
    var ravelloPassword = user.ravelloCredentials ? user.ravelloCredentials.password : '';

    coursesDal.createCourse(request.body).then(
        function(courseEntity) {
            var course = coursesTrans.entityToDto(courseEntity);
            return matchCourseWithBlueprints(course, ravelloUsername, ravelloPassword).then(
                function(result) {
                    response.json(result);
                }
            );
        }
    ).catch(next);
};

exports.updateCourse = function(request, response, next) {
    var user = request.user;

    var ravelloUsername = user.ravelloCredentials ? user.ravelloCredentials.username : '';
    var ravelloPassword = user.ravelloCredentials ? user.ravelloCredentials.password : '';

    var courseId = request.params.courseId;
    var courseData = request.body;

    coursesDal.updateCourse(courseId, courseData).then(
        function() {
            return coursesDal.getCourse(courseId).then(
                function(result) {
                    var dto = coursesTrans.entityToDto(result);
                    return matchCourseWithBlueprints(dto, ravelloUsername, ravelloPassword).then(
                        function(result) {
                            return updateClassesOfCourse(result).then(
                                function() {
                                    response.json(result);
                                }
                            );
                        }
                    );
                }
            );
        }
    ).catch(next);
};

exports.deleteCourse = function(request, response, next) {
    var courseId = request.params.courseId;

    coursesDal.deleteCourse(courseId).then(
        function() {
            response.send(200);
        }
    ).catch(next);
};

/* --- Private functions --- */

var matchCourseWithBlueprints = function(course, ravelloUsername, ravelloPassword) {
    return q.all(_.map(course.blueprints, function(bp) {
        return blueprintsService.getBlueprintById(bp.id, ravelloUsername, ravelloPassword).catch(
            function(rejection) {
                if (rejection.status === 404 || rejection.status === 401) {
                    // If we fail to get a specific blueprint, we don't want to hold the trainer
                    // work. So we just skip them.
                    // So do nothing.
                    // TODO: log
                } else {
                    return q.reject(rejection);
                }
            }
        );
    })).then(
        function(bpResults) {
            course.blueprints = coursesService.assignBlueprintsToCourse(course, bpResults);
            return course;
        }
    );
};

var updateClassesOfCourse = function(persistedCourse) {
    return classesDal.getClassByCourseId(persistedCourse._id).then(
        function(classes) {
            return q.all(_.map(classes, function(currentClass) {
                var classData = classesTrans.entityToDto(currentClass);

                _.remove(classData.bpPublishDetailsList, function(bpPublishDetails) {
                    return !_.find(persistedCourse.blueprints, {id: bpPublishDetails.bpId});
                });
                _.forEach(classData.students, function(student) {
                    _.remove(student.blueprintPermissions, function(bpPermissions) {
                        return !_.find(persistedCourse.blueprints, {id: bpPermissions.bpId});
                    });
                });

                return classesDal.updateClass(currentClass.id, classData);
            }));
        }
    );
};