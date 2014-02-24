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
        var classesPromises = [];

        _.forEach(classes, function(classEntity) {

            // We then want the classes as DTOs.
            var classDto = classesTrans.entityToDto(classEntity);
            classesDtos.push(classDto);

            // Now we want to go over each student in the each class.
            var studentPromises = [];

            _.forEach(classDto.students, function(student) {

                // Then we need to get the data for each app of each student.
                var appsPromises = [];
                _.forEach(student.apps, function(app) {
                    var appPromise = appsService.getApp(app.ravelloId, ravelloUsername, ravelloPassword);
                    appsPromises.push(appPromise);
                });

                // Getting the apps is done with promises. We wait until all apps info is returned.
                // We then set the apps of the student as a map between the app's name to the app DTO.
                // Also notice that this q.all returns a promise, which will be resolved once all of
                // the promises of the apps are resolved. This promise then represents the
                // async call for a single student.
                var studentPromise = q.all(appsPromises).then(function(appsResults) {
                    var appsMap = {};

                    _.forEach(appsResults, function(appResult) {
                        var app = appsTrans.ravelloObjectToTrainerDto(appResult.body);
                        appsMap[app.name] = app;
                    });

                    student.apps = appsMap;
                });

                studentPromises.push(studentPromise);
            });

            // After we're done with all students, we wait for all of the student promises to return,
            // which will happen only after all of the apps promises of every student are returned.
            var classPromise = q.all(studentPromises);

            classesPromises.push(classPromise);
        });

        // At last, when we're done with the classes, we can wait for the promises of all classes to return.
        q.all(classesPromises).then(function(classesResult) {
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
    var usersCreationPromises = [];
    _.forEach(classData.students, function(student) {
        var promise = usersDal.createUser(student.user).then(function(persistedUser) {
            student.user = persistedUser.id;
        });
        usersCreationPromises.push(promise);
    });

    // Only once all of the promises of the users creation were resolved - continue to create the class.
    q.all(usersCreationPromises).then(function() {
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
    var userPromises = [];
    _.forEach(classData.students, function(student) {
        var promise = usersDal.updateUser(student.user.username, student.user).then(function() {
            return usersDal.getUser(student.user.username).then(function(persistedUser) {
                student.user = persistedUser.id;
            });
        });
        userPromises.push(promise);
    });

    // Once the promises of all users creation are resolved, continue to update the class entity.
    q.all(userPromises).then(function() {
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
        var studentsInClass = deletedClass.students;
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
