'use strict';

angular.module('trng.admin.trainers').factory('trng.admin.trainers.trainersModel', [
    '$q',
    'trng.services.TrainersService',
    function($q, trainersService) {

        var trainers = [];

        var model = {
            trainers: trainers,

            getAllTrainers: function() {
                return trainersService.getAllTrainers().then(function(entities) {
                    trainers = _.map(entities, function(currentEntity) {
                        return _.cloneDeep(currentEntity);
                    });

                    return trainers;
                });
            },

            saveTrainer: function(trainer) {
                return trainersService.saveTrainer(trainer).then(function(entity) {
                    trainers.push(entity);
                    return entity;
                });
            },

            updateTrainer: function(trainerId, trainer) {
                return trainersService.updateTrainer(trainerId, trainer).then(function(entity) {
                    trainers = _.map(trainers, function(currentTrainer) {
                        if (currentTrainer && currentTrainer.id == trainerId) {
                            return entity;
                        }
                        return currentTrainer;
                    });

                    return entity;
                });
            },

            deleteTrainer: function(trainerId) {
                return trainersService.deleteTrainer(trainerId).then(function(result) {
                    var removedTrainers = _.remove(trainers, function(currentTrainer) {
                        return (currentTrainer && currentTrainer.id == trainerId);
                    });

                    return removedTrainers;
                });
            }
        };

        return model;
    }
]);
