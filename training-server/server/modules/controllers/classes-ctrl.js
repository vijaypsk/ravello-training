'use strict';

var q = require('q');
var _ = require('lodash');

var logger = require('../config/logger');
var errorHandler = require('../utils/error-handler');

var classesDal = require('../dal/classes-dal');
var usersDal = require('../dal/users-dal');

var classesTrans = require('../trans/classes-trans');
var appsTrans = require('../trans/apps-trans');
var usersTrans = require('../trans/users-trans');

var appsService = require('../services/apps-service');
var loginService = require('../services/login-service');

var classValidator = require('../validators/class-validator');

/* --- Private functions --- */

var matchClassWithApps = function(theClass, ravelloUsername, ravelloPassword) {
	return appsService.getApps(ravelloUsername, ravelloPassword).then(
		function(result) {
			if (result.status >= 400) {
				return q.reject({
					status: result.status,
					reason: result.headers['error-message']
				});
			}

			var apps = result.body;
			var appsMap = _.indexBy(apps, 'id');
			_.forEach(theClass.students, function(student) {
				_.forEach(student.apps, function(studentApp) {
					var appDto = appsMap[studentApp.ravelloId];
					if (appDto) {
						_.assign(studentApp, appsTrans.ravelloObjectToTrainerDto(appDto));
					}
				});
			});
		}
	);
};

var validateClass = function(theClass) {
    var validationStatuses = classValidator.validate(theClass);

    if (!_.isEmpty(validationStatuses)) {
        var failedValidations = _.pluck(_.filter(validationStatuses, {status: false}), 'message');

        var finalMessage = _.reduce(failedValidations, function(sum, current) {
            return sum += ", " + current.message;
        });

        return finalMessage;
    }

    return "";
};

function handleUserExistsError(student) {
    return function(error) {
        if (error.status && error.status === 400) {
            return classesDal.getClassByUsername(student.user.username).then(
                function(existingUserClass) {
                    if (existingUserClass) {
                        error.message += '<br>A student with that username already exists in class: [' +
                        existingUserClass.name + '].<br>' +
                        'Delete the student from that class or assign this student a different username.';
                    }

                    return q.reject(error);
                }
            );
        } else {
            return q.reject(error);
        }
    }
}

function validateClassRavelloCredentials(classData, next) {
    if (classData.ravelloCredentials.overrideTrainerCredentials) {
        return loginService.login(classData.ravelloCredentials.username, classData.ravelloCredentials.password).catch(
            function(error) {
                if (error.status === 401) {
                    next(errorHandler.createError(403, 'The overridden Ravello credentials specified are invalid. Failed to save class.'));
                } else {
                    next(error);
                }
            }
        );
    } else {
        return q({});
    }
}

/* --- Public functions --- */

exports.getClasses = function(request, response, next) {
    classesDal.getClasses().then(
        function(classes) {
            var classesDtos = _.map(classes, function(classEntity) {
                return classesTrans.entityToDto(classEntity);
            });
            response.json(classesDtos);
        }
    ).catch(next);
};

exports.getClass = function(request, response, next) {
    var classId = request.params.classId;

    classesDal.getClass(classId).then(
        function(classEntity) {
            var classDto = classesTrans.entityToDto(classEntity);
            response.json(classDto);
        }
    ).catch(next);
};

exports.getAllClassApps = function(request, response, next) {
    var user = request.user;

    var ravelloUsername = user.ravelloCredentials.username;
    var ravelloPassword = user.ravelloCredentials.password;

    var classId = request.params.classId;

    classesDal.getClass(classId).then(
        function(classEntity) {
            var classDto = classesTrans.entityToDto(classEntity);
            var promise = matchClassWithApps(classDto, ravelloUsername, ravelloPassword);
            return promise.then(
                function() {
                    response.json(classDto);
                }
            );
        }
    ).catch(
        function(error) {
            error.message = 'Could not load applications of the class: ' + error.message;
            next(error);
        }
    );
};

exports.createClass = function(request, response, next) {
    var classData = request.body;

    var finalValidationMessage = validateClass(classData);
    if (finalValidationMessage != "") {
        next(errorHandler.createError(404, finalValidationMessage));
        return;
    }

    // We first have to save all of the students of this class separately, since we need a store
    // of users against which login will be made.
    q.all(_.map(classData.students, function(student) {
        student.user = usersTrans.ravelloDtoToEntity(student.user);
        return usersDal.createUser(student.user).then(
            function(persistedUser) {
                student.user = persistedUser.id;
            }
        ).fail(handleUserExistsError(student));
    })).then(
        function() {
            return validateClassRavelloCredentials(classData, next);
        }
    ).then(
        function() {
            return classesDal.createClass(classData).then(
                function(result) {
                    var dto = classesTrans.entityToDto(result);
                    response.json(dto);
                }
            );
        }
    ).catch(next);
};

exports.updateClass = function(request, response, next) {
    var user = request.user;

    var ravelloUsername = user.ravelloCredentials ? user.ravelloCredentials.username : '';
    var ravelloPassword = user.ravelloCredentials ? user.ravelloCredentials.password : '';

    var classId = request.params.classId;
    var classData = request.body;

    var finalValidationMessage = validateClass(classData);
    if (finalValidationMessage != "") {
        next(errorHandler.createError(404, finalValidationMessage));
        return;
    }

    // 1st step is to delete the users and apps for students that no longer exist in the new class data.
    classesDal.getClass(classId).then(
        function(persistedClass) {
            var prePromises = [];

            _.forEach(persistedClass.students, function(currentStudent) {
                // All of the students that were in the persisted class, but not in the new one - delete their corresponding
                // user and apps.
                if (!_.find(classData.students, {_id: currentStudent.id})) {
                    prePromises.push(usersDal.deleteUser(currentStudent.user.id));

                    _.forEach(currentStudent.apps, function(currentApp) {
                        prePromises.push(appsService.deleteApp(currentApp.ravelloId, ravelloUsername, ravelloPassword));
                    });
                }
            });

            return q.all(prePromises).then(
                function() {
                    // Then update the users for the students that remained in the class data.
                    return q.all(_.map(classData.students, function(student) {
                        student.user = usersTrans.ravelloDtoToEntity(student.user);
                        return usersDal.updateUser(student.user._id, student.user).then(
                            function() {
                                return usersDal.getUserByUsername(student.user.username).then(
                                    function(persistedUser) {
                                        student.user = persistedUser.id;
                                    }
                                );
                            }
                        ).fail(handleUserExistsError(student));
                    })).then(
                        function() {
                            return validateClassRavelloCredentials(classData, next);
                        }
                    ).then(
                        function() {
                            // And at last, actually update the class.
                            return classesDal.updateClass(classId, classData).then(
                                function () {
                                    return classesDal.getClass(classId).then(
                                        function (result) {
                                            var dto = classesTrans.entityToDto(result);
                                            response.json(dto);
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
            );
        }
    ).catch(next);
};

exports.deleteClass = function(request, response, next) {
    var user = request.user;

    var ravelloUsername = user.ravelloCredentials ? user.ravelloCredentials.username : '';
    var ravelloPassword = user.ravelloCredentials ? user.ravelloCredentials.password : '';

    var classId = request.params.classId;

    classesDal.deleteClass(classId).then(
        function(deletedClass) {
            var prePromises = [];

            _.forEach(deletedClass.students, function(student) {
                var userPromise = usersDal.findAndDelete(student.user.id);
                prePromises.push(userPromise);

                _.forEach(student.apps, function(currentApp) {
                    prePromises.push(appsService.deleteApp(currentApp.ravelloId, ravelloUsername, ravelloPassword));
                });
            });

            return q.all(prePromises);
        }
    ).then(
        function() {
            response.send(200);
        }
    ).catch(next);
};
