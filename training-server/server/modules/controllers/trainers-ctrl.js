'use strict';

var _ = require('lodash');

var logger = require('../config/logger');
var errorHandler = require('../utils/error-handler');

var usersDal = require('../dal/users-dal');
var usersTrans = require('../trans/users-trans');
var loginService = require('../services/login-service');

exports.getAllTrainers = function(request, response, next) {
    usersDal.getUserByRole('TRAINER').then(
        function(entities) {
            var dtos = _.map(entities, function(entity) {
                return usersTrans.entityToDto(entity);
            });

            response.json(dtos);
        }
    ).catch(next);
};

exports.getTrainer = function(request, response, next) {
    var trainerId = request.params.trainerId;

    usersDal.getUserById(trainerId).then(
        function(entity) {
            var dto = usersTrans.entityToDto(entity);
            response.json(dto);
        }
    ).catch(next);
};

exports.saveTrainer = function(request, response, next) {
    var newTrainerDto = request.body;
    var newTrainerData = usersTrans.ravelloDtoToEntity(newTrainerDto);
    newTrainerData.role = 'TRAINER';

    loginService.login(newTrainerData.ravelloCredentials.username, newTrainerData.ravelloCredentials.password).then(
        function() {
            usersDal.createUser(newTrainerData).then(
                function(trainerEntity) {
                    var dto = usersTrans.entityToDto(trainerEntity);
                    response.json(dto);
                }
            ).catch(next);
        }
    ).catch(
        function(error) {
            if (error.status === 401) {
                next(errorHandler.createError(403, 'Ravello credentials specified are invalid. Failed to add trainer.'));
            } else {
                next(error);
            }
        }
    );
};

exports.updateTrainer = function(request, response, next) {
    var trainerId = request.params.trainerId;

    var newTrainerDto = request.body;
    var newTrainerData = usersTrans.ravelloDtoToEntity(newTrainerDto);
    newTrainerData.role = 'TRAINER';

    loginService.login(newTrainerData.ravelloCredentials.username, newTrainerData.ravelloCredentials.password).then(
        function() {
            usersDal.updateUser(trainerId, newTrainerData).then(
                function(trainerEntity) {
                    var dto = usersTrans.entityToDto(trainerEntity);
                    response.json(dto);
                }
            ).catch(next);
        }
    ).catch(
        function(error) {
            if (error.status === 401) {
                next(errorHandler.createError(403, 'Ravello credentials specified are invalid. Failed to updated trainer.'));
            } else {
                next(error);
            }
        }
    );
};

exports.deleteTrainer = function(request, response, next) {
    var trainerId = request.params.trainerId;
    usersDal.deleteUser(trainerId).then(
        function(result) {
            response.send(200);
        }
    ).catch(next);
};