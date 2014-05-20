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

/* --- Public functions --- */

exports.getClasses = function(request, response) {
    var user = request.user;
    var ravelloUsername = user.ravelloCredentials.username;
    var ravelloPassword = user.ravelloCredentials.password;

    // Okay, there are many async calls here, so stick with me.
    // First, well, we get the classes entities.
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

    // We first have to save all of the students of this class separately, since we need a store
    // of users against which login will be made.
    q.all(_.map(classData.students, function(student) {
        student.user = usersTrans.dtoToEntity(student.user);
        return usersDal.createUser(student.user).then(function(persistedUser) {
            student.user = persistedUser.id;
        });
    })).then(function() {
        var classEntityData = classesTrans.dtoToEntity(classData);
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
    var classId = request.params.classId;
    var classData = request.body;

    // We want to first update the students associated with the class, as users for the login process.
    // We can't know if a student is a new one or an existing one, so we use 'update' which will create
    // new users if they're not existing yet.
    q.all(_.map(classData.students, function(student) {
        student.user = usersTrans.dtoToEntity(student.user);
        return usersDal.updateUser(student.user._id, student.user).then(function() {
            return usersDal.getUser(student.user.username).then(function(persistedUser) {
                student.user = persistedUser.id;
            });
        });
    })).then(function() {
        var classEntityData = classesTrans.dtoToEntity(classData);
        classesDal.updateClass(classId, classEntityData).then(function() {
            return classesDal.getClass(classId).then(function(result) {
                var dto = classesTrans.entityToDto(result);
                response.json(dto);
            });
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

exports.deleteClass = function(request, response) {
    var classId = request.params.classId;

    classesDal.deleteClass(classId).then(function(deletedClass) {
        _.forEach(deletedClass.students, function(student) {
            usersDal.findAndDelete(student.user.id).then(function(result) {
                response.send(200);
            }).fail(function(error) {
                var message = "Could not delete one of the users associated with the class";
                logger.error(error, message);
                response.send(400, message);
            });
        });
    }).fail(function(error) {
        var message = "Could not delete class";
        logger.error(error, message);
        response.send(404, message);
    });
};
