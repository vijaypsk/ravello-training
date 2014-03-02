'use strict';

var q = require('q');
var _ = require('lodash');

var classesDal = require('../dal/classes-dal');
var usersDal = require('../dal/users-dal');

var classesTrans = require('../trans/classes-trans');
var appsTrans = require('../trans/apps-trans');

var appsService = require('../services/apps-service');

exports.getClasses = function(request, response) {
    var user = request.user;
    var ravelloUsername = user.ravelloCredentials.username;
    var ravelloPassword = user.ravelloCredentials.password;

    // Okay, there are many async calls here, so stick with me.
    // First, well, we get the classes entities.
    classesDal.getClasses().then(function(classes) {

        var classesDtos = [];
        q.all(_.map(classes, function(classEntity) {

            // We then want the classes as DTOs.
            var classDto = classesTrans.entityToDto(classEntity);
            classesDtos.push(classDto);

            return q.all(_.map(classDto.students, function(student) {

                return q.all(_.map(student.apps, function(app) {
                    return appsService.getApp(app.ravelloId, ravelloUsername, ravelloPassword);
                })).then(
                    function(appsResults) {
                        var appsMap = {};

                        _.forEach(appsResults, function(appResult) {
                            var app = appsTrans.ravelloObjectToTrainerDto(appResult.body);
                            appsMap[app.name] = app;
                        });

                        student.apps = appsMap;
                    }
                );
            }));
        })).then(function(classesResult) {
            response.json(classesDtos);
        }).fail(function(error) {
            console.log(error);
            response.send(404, error);
        });
    }).fail(function(error) {
        var message = "Could not load classes, error: " + error;
        console.log(message);
        response.send(404, message);
    });
};

exports.createClass = function(request, response) {
    var classData = request.body;

    // We first have to save all of the students of this class separately, since we need a store
    // of users against which login will be made.
    q.all(_.map(classData.students, function(student) {
        return usersDal.createUser(student.user).then(function(persistedUser) {
            student.user = persistedUser.id;
        });
    })).then(function() {
        var classEntityData = classesTrans.dtoToEntity(classData);
        classesDal.createClass(classEntityData).then(function(result) {
            var dto = classesTrans.entityToDto(result);
            response.json(dto);
        }).fail(function(error) {
            var message = "Could not save class, error: " + error;
            console.log(message);
            response.send(400, message);
        });
    }).fail(function(error) {
        var message = "Could not save one of the users associated with the new class, error: " + error;
        console.log(message);
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
        return usersDal.updateUser(student.user.username, student.user).then(function() {
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
            var message = "Could not save class, error: " + error;
            console.log(message);
            response.send(400, message);        });
    }).fail(function(error) {
        var message = "Could not save one of the users associated with the new class, error: " + error;
        console.log(message);
        response.send(400, message);
    });
};

exports.deleteClass = function(request, response) {
    var classId = request.params.classId;

    classesDal.deleteClass(classId).then(function(deletedClass) {
        _.forEach(deletedClass.students, function(student) {
            usersDal.findAndDelete(student.user.username).then(function(result) {
                response.send(200);
            }).fail(function(error) {
                var message = "Could not delete one of the users associated with the class, error: " + error;
                console.log(message);
                response.send(400, message);
            });
        });
    }).fail(function(error) {
        var message = "Could not delete class, error: " + error;
        console.log(message);
        response.send(404, message);
    });
};
