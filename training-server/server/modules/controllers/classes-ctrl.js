'use strict';

var q = require('q');
var _ = require('lodash');

var logger = require('../config/logger');

var classesDal = require('../dal/classes-dal');
var usersDal = require('../dal/users-dal');

var classesTrans = require('../trans/classes-trans');
var appsTrans = require('../trans/apps-trans');
var usersTrans = require('../trans/users-trans');

var appsService = require('../services/apps-service');

var classValidator = require('../validators/class-validator');

/* --- Private functions --- */

var matchClassWithApps = function(theClass, ravelloUsername, ravelloPassword) {
    return q.all(_.map(theClass.students, function(student) {
        return q.all(_.map(student.apps, function(app) {
            return appsService.getApp(app.ravelloId, ravelloUsername, ravelloPassword);
        })).then(function(appsResults) {
            student.apps = _.map(appsResults, function(appResult) {
                return appsTrans.ravelloObjectToTrainerDto(appResult.body);
            });
        });
    }));
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

/* --- Public functions --- */

exports.getClasses = function(request, response) {
    var user = request.user;

    var ravelloUsername = user.ravelloCredentials.username;
    var ravelloPassword = user.ravelloCredentials.password;

    classesDal.getClasses().then(function(classes) {
        var classesDtos = _.map(classes, function(classEntity) {
            return classesTrans.entityToDto(classEntity);
        });
        response.json(classesDtos);
    }).fail(function(error) {
        var message = "Could not load classes";
        logger.error(error, message);
        response.send(404, message);
    });
};

exports.getClass = function(request, response) {
    var user = request.user;

    var ravelloUsername = user.ravelloCredentials.username;
    var ravelloPassword = user.ravelloCredentials.password;

    var classId = request.params.classId;

    classesDal.getClass(classId).then(function(classEntity) {
        var classDto = classesTrans.entityToDto(classEntity);
        response.json(classDto);
    }).fail(function(error) {
        var message = "Could not load class [" + classId + "]";
        logger.error(error, message);
        response.send(404, message);
    });
};

exports.getAllClassApps = function(request, response) {
    var user = request.user;

    var ravelloUsername = user.ravelloCredentials.username;
    var ravelloPassword = user.ravelloCredentials.password;

    var classId = request.params.classId;

    classesDal.getClass(classId).then(function(classEntity) {

        var classDto = classesTrans.entityToDto(classEntity);
        var promise = matchClassWithApps(classDto, ravelloUsername, ravelloPassword);
        promise.then(function(result) {
            response.json(classDto);
        }).fail(function(error) {
            var message = "Could not load one of the apps of one of the students in the class";
            logger.error(error, message);
            response.send(404, message);
        });
    }).fail(function(error) {
        var message = "Could not load applications of class";
            logger.error(error, message);
        response.send(404, message);
    });
};

exports.createClass = function(request, response) {
    var classData = request.body;

    var finalValidationMessage = validateClass(classData);
    if (finalValidationMessage != "") {
        response.send(403, finalValidationMessage);
        return;
    }

    // We first have to save all of the students of this class separately, since we need a store
    // of users against which login will be made.
    q.all(_.map(classData.students, function(student) {
        student.user = usersTrans.ravelloDtoToEntity(student.user);
        return usersDal.createUser(student.user).then(function(persistedUser) {
            student.user = persistedUser.id;
        });
    })).then(function() {
        var classEntityData = classesTrans.ravelloDtoToEntity(classData);
        classesDal.createClass(classEntityData).then(function(result) {
            var dto = classesTrans.entityToDto(result);
            response.json(dto);
        }).fail(function(error) {
            var message = "Could not save class";
            logger.error(error, message);
            response.send(400, message);
        });
    }).fail(function(error) {
        var message = "Could not save one of the users associated with the new class";
        if (error.message && error.message.indexOf("duplicate key") != -1) {
            message += ": username already exists";
        }
        logger.error(error, message);
        response.send(400, message);
    });
};

exports.updateClass = function(request, response) {
    var user = request.user;

    var classId = request.params.classId;
    var classData = request.body;
    var classEntityData = classesTrans.ravelloDtoToEntity(classData);

    var finalValidationMessage = validateClass(classEntityData);
    if (finalValidationMessage != "") {
        response.send(403, finalValidationMessage);
        return;
    }

    if (!user.ravelloCredentials) {
        response.send(401, 'User does not have Ravello credentials');
        return;
    }

    var ravelloUsername = user.ravelloCredentials.username;
    var ravelloPassword = user.ravelloCredentials.password;

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
                                    return usersDal.getUserByUsername(student.user.username).then(function(persistedUser) {
                                        student.user = persistedUser.id;
                                    });
                                }
                            );
                    })).then(
                        function() {
                            // And at last, actually update the class.
                            classesDal.updateClass(classId, classEntityData).then(
                                function() {
                                    return classesDal.getClass(classId).then(
                                        function(result) {
                                            var dto = classesTrans.entityToDto(result);
                                            response.json(dto);
                                        }
                                    );
                                }
                            ).fail(
                                function(error) {
                                    var message = "Could not save class";
                                    logger.error(error, message);
                                    response.send(400, message);
                                }
                            );
                        }
                    );
                }
            );
        }
    ).fail(function(error) {
        var message = "Could not save one of the users associated with the new class";
        if (error.message && error.message.indexOf("duplicate key") != -1) {
            message += ": username already exists";
        }
        logger.error(error, message);
        response.send(400, message);
    });
};

exports.deleteClass = function(request, response) {
    var user = request.user;

    if (!user.ravelloCredentials) {
        response.send(401, 'User does not have Ravello credentials');
        return;
    }

    var ravelloUsername = user.ravelloCredentials.username;
    var ravelloPassword = user.ravelloCredentials.password;

    var classId = request.params.classId;

    classesDal.deleteClass(classId).then(
        function(deletedClass) {
            var prePromises = [];

            _.forEach(deletedClass.students, function(student) {
                var userPromise = usersDal.findAndDelete(student.user.id).fail(
                    function(error) {
                        var message = "Could not delete one of the users associated with the class";
                        logger.error(error, message);
                        response.send(400, message);
                    }
                );
                prePromises.push(userPromise);

                _.forEach(student.apps, function(currentApp) {
                    prePromises.push(appsService.deleteApp(currentApp.ravelloId, ravelloUsername, ravelloPassword));
                });
            });

            return q.all(prePromises);
        }
    ).then(
        function(result) {
            response.send(200);
        }
    ).fail(
        function(error) {
            var message = "Could not delete class";
            logger.error(error, message);
            response.send(404, message);
        }
    );
};
