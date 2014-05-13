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
                var existingTrainer = _.find(trainers, function(currentTrainer) {
                    return currentTrainer.id == trainer.id;
                });

                var promise;
                if (existingTrainer) {
                    promise = trainersService.updateTrainer(trainer.id, trainer);
                } else {
                    promise = trainersService.saveTrainer(trainer);
                }

                promise.then(function(persistedTrainer) {
                    if (existingTrainer) {
                        trainers = _.map(trainers, function(currentTrainer) {
                            if (currentTrainer.id == persistedTrainer.id) {
                                return persistedTrainer;
                            }
                            return currentTrainer;
                        });
                    } else {
                        trainers.push(persistedTrainer);
                    }
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
