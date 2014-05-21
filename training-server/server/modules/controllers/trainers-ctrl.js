'use strict';

var _ = require('lodash');

var logger = require('../config/logger');

var usersDal = require('../dal/users-dal');
var usersTrans = require('../trans/users-trans');

exports.getAllTrainers = function(request, response) {
    usersDal.getUserByRole('TRAINER').then(function(entities) {
        var dtos = _.map(entities, function(entity) {
            return usersTrans.entityToDto(entity);
        });

        response.json(dtos);
    }).fail(function(error) {
        var message = "Could not load trainers";
        logger.error(error, message);
        response.send(404, message);
    });
};


exports.getTrainer = function(request, response) {
    var trainerId = request.params.trainerId;

    usersDal.getUserById(trainerId).then(function(entity) {
        var dto = usersTrans.entityToDto(entity);
        response.json(dto);
    }).fail(function(error) {
        var message = "Could not load trainer [" + trainerId + "]";
        logger.error(error, message);
        response.send(404, message);
    });
};

exports.saveTrainer = function(request, response) {
    var newTrainerDto = request.body;
    var newTrainerData = usersTrans.ravelloDtoToEntity(newTrainerDto);
    newTrainerData.role = 'TRAINER';

    usersDal.createUser(newTrainerData).then(function(trainerEntity) {
        var dto = usersTrans.entityToDto(trainerEntity);
        response.json(dto);
    }).fail(function(error) {
        var message = "Could not save new trainer";
        if (error.message && error.message.indexOf("duplicate key") != -1) {
            message += ": username already exists";
        }
        logger.error(error, message);
        response.send(400, message);
    });
};

exports.updateTrainer = function(request, response) {
    var trainerId = request.params.trainerId;

    var newTrainerDto = request.body;
    var newTrainerData = usersTrans.ravelloDtoToEntity(newTrainerDto);
    newTrainerData.role = 'TRAINER';

    usersDal.updateUser(trainerId, newTrainerData).then(function(trainerEntity) {
        var dto = usersTrans.entityToDto(trainerEntity);
        response.json(dto);
    }).fail(function(error) {
        var message = "Could not update trainer";
        logger.error(error, message);
        response.send(400, message);
    });
};

exports.deleteTrainer = function(request, response) {
    var trainerId = request.params.trainerId;
    usersDal.deleteUser(trainerId).then(function(result) {
        response.send(200);
    }).fail(function(error) {
        var message = "Could not delete trainer [" + trainerId + "]";
        logger.error(error, message);
        response.send(404, message);
    });
};