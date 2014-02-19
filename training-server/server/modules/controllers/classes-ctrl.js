'use strict';

var q = require('q');
var _ = require('lodash');

var classesDal = require('../dal/classes-dal');
var usersDal = require('../dal/users-dal');
var classesTrans = require('../trans/classes-trans');

exports.getClasses = function(request, response) {
    classesDal.getClasses().then(function(classes) {
        var dtos = _.map(classes, function(currentClass) {
            return classesTrans.entityToDto(currentClass);
        });
        response.json(dtos);
    }).fail(function(error) {
        console.log('Could not load classes, error: ' + error);
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
            console.log("Could not save class, error: " + error);
        });
    }).fail(function(error) {
        console.log("Could not save one of the users associated with the new class, error: " + error);
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
        var promise = usersDal.updateUser(student.user.username, student.user).then(function(persistedUser) {
            student.user = persistedUser.id;
        });
        userPromises.push(promise);
    });

    // Once the promises of all users creation are resolved, continue to update the class entity.
    q.all(userPromises).then(function() {
        var classEntityData = classesTrans.dtoToEntity(classData);
        classesDal.updateClass(classId, classEntityData).then(function(result) {
            var dto = classesTrans.entityToDto(result);
            response.json(result);
        }).fail(function(error) {
            console.log("Could not update class, error: " + error);
        });
    }).fail(function(error) {
        console.log("Could not update one of the students as users, error: " + error);
    });
};

exports.deleteClass = function(request, response) {
    var classId = request.params.classId;

    classesDal.deleteClass(classId).then(function(deletedClass) {
        var studentsInClass = deletedClass.students;
        _.forEach(deletedClass.students, function(student) {
            usersDal.findAndDelete(student.user.username).fail(function(error) {
                console.log("Could not delete one of the users associated with the class, error: " + error);
            });
        });
    }).fail(function(error) {
        console.log("Could not delete class, error: " + error);
    });
};
