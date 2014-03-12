'use strict';

var _ = require('lodash');

var usersDal = require('../dal/users-dal');
var usersTrans = require('../trans/users-trans');

exports.getAllTrainers = function(request, response) {
    usersDal.getUserByRole('TRAINER').then(function(entities) {
        var dtos = _.map(entities, function(entity) {
            return usersTrans.entityToDto(entity);
        });

        response.json(dtos);
    }).fail(function(error) {
        var message = "Could not load trainers, error: " + error;
        console.log(message);
        response.send(404, message);
    });
};

exports.deleteTrainer = function(request, response) {
    var userId = request.params.trainerId;
    usersDal.deleteUser(userId).then(function(result) {
        response.send(200);
    }).fail(function(error) {
        var message = "Could not delete trainer [" + userId + "], error: " + error;
        console.log(message);
        response.send(404, message);
    });
};