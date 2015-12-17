'use strict';

var _ = require('lodash');
var q = require('q');

var logger = require('../config/logger');
var errorHandler = require('../utils/error-handler');

var coursesDal = require('../dal/courses-dal');
var classesDal = require('../dal/classes-dal');

var classesTrans = require('../trans/classes-trans');
var coursesTrans = require('../trans/courses-trans');
var appsTrans = require('../trans/apps-trans');
var singleStudentTrans = require('../trans/single-student-trans');

var appsService = require('../services/apps-service');
var blueprintsService = require('../services/blueprints-service');
var coursesService = require('../services/courses-service');

var appsHelper = require('../helpers/apps-helper');

/* --- Public functions --- */

exports.getStudentClass = function(request, response, next) {
    var userId = request.params.studentId;

    // When the user logs in, we first need to find the class associated with that user.
    classesDal.getClassByUserId(userId).then(
        function(classEntity) {
            if (!classEntity.active) {
                next(errorHandler.createError(404, 'Your class is not open yet, please contact your trainer'));
                return;
            }

            var studentEntity = classEntity.findStudentByUserId(userId);
            var dto = singleStudentTrans.entityToDto(studentEntity, classEntity);
            response.json(dto);
        }
    ).catch(next);
};

exports.getStudentClassApps = function(request, response, next) {
	var userId = request.params.studentId;

    // When the user logs in, we first need to find the class associated with that user.
    classesDal.getClassByUserId(userId).then(
        function(classEntity) {
            if (!classEntity.active) {
                next(errorHandler.createError(404, 'Your class is not open yet, please contact your trainer'));
                return;
            }

            var classData = classEntity.toJSON();
            var studentData = classEntity.findStudentByUserId(userId);

            var ravelloUsername = classData.ravelloCredentials.username;
            var ravelloPassword = classData.ravelloCredentials.password;

            return coursesDal.getCourse(classEntity.courseId).then(
                function(course) {
                    return q.all(_.map(studentData.apps, function(app) {
                        return appsService.getApp(app.ravelloId, ravelloUsername, ravelloPassword).catch(
                            function() {
                                // In case student couldn't get one of his apps - we don't want to cancel the
                                // whole flow. We saw issues where because of data corruption, student had
                                // several apps, some deleted already, and he couldn't login..
                                // TODO: add log
                                return false;
                            }
                        );
                    })).then(
                        function(appsResults) {
                            var appViewObjects = [];

                            _.forEach(appsResults, function(appResult) {
                                if (appResult) {
                                    var appViewObject = appsTrans.ravelloObjectToStudentDto(course,
                                        appResult.body);
                                    appViewObjects.push(appViewObject);
                                }
                            });

                            response.json(appViewObjects);
                        }
                    );
                }
            );
        }
    ).catch(next);
};

exports.getAppVms = function(request, response, next) {
	var userId = request.params.studentId;
    var appId = request.params.appId;

    // When the user logs in, we first need to find the class associated with that user.
    classesDal.getClassByUserId(userId).then(
        function(classEntity) {
            if (!classEntity.active) {
                next(errorHandler.createError(404, 'Your class is not open yet, please contact your trainer'));
                return;
            }

            var classData = classEntity.toJSON();

            var ravelloUsername = classData.ravelloCredentials.username;
            var ravelloPassword = classData.ravelloCredentials.password;

			return appsService.getApp(appId, ravelloUsername, ravelloPassword).then(
                function(appResult) {
                    var app = appResult.body;

                    var vms = _.map(app.deployment.vms, function(vm) {
                        return appsHelper.createVmViewObject(vm);
                    });

                    var appDto = {
                        id: app.id,
                        blueprintId: app.baseBlueprintId,
                        vms: vms
                    };

                    response.json(appDto);
                }
            );
        }
    ).catch(next);
};

exports.getStudentCourseDetails = function(request, response, next) {
	var userId = request.params.studentId;
    var courseId = request.params.courseId;

    // When the user logs in, we first need to find the class associated with that user.
    classesDal.getClassByUserId(userId).then(
        function(classEntity) {
            if (!classEntity.active) {
                next(errorHandler.createError(404, 'Your class is not open yet, please contact your trainer'));
                return;
            }

			return coursesDal.getCourse(courseId).then(
                function(courseEntity) {
                    var course = coursesTrans.entityToDto(courseEntity);
                    response.json(course);
                }
            );
        }
    ).catch(next);
};
