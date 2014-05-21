'use strict';

angular.module('trng.admin.trainers').factory('AdminTrainerModel', [
    '$q',
    'TrainersService',
    function($q, TrainersService) {

        var trainers = [];

        var model = {
            trainers: trainers,

            getAllTrainers: function() {
                return TrainersService.getAllTrainers().then(function(entities) {
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
                    promise = TrainersService.updateTrainer(trainer.id, trainer);
                } else {
                    promise = TrainersService.saveTrainer(trainer);
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

                return promise;
            },

            deleteTrainer: function(trainerId) {
                return TrainersService.deleteTrainer(trainerId).then(function(result) {
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
