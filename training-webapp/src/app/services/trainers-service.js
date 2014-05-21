'use strict';

angular.module('trng.services').factory('TrainersService', [
	'TrainersProxy',
	'TrainersTransformer',
	function(TrainersProxy, TrainersTrans) {

		var service = {
            getAllTrainers: function() {
                return TrainersProxy.getAllTrainers().then(function(result) {
                    return _.map(result.data, function(dto) {
                        return TrainersTrans.dtoToEntity(dto);
                    });
                });
            },

            saveTrainer: function(dto) {
                return TrainersProxy.saveTrainer(dto).then(function(result) {
                    return TrainersTrans.dtoToEntity(result.data);
                });
            },

            updateTrainer: function(trainerId, dto) {
                return TrainersProxy.updateTrainer(trainerId, dto).then(function(result) {
                    return TrainersTrans.dtoToEntity(result.data);
                });
            },

            deleteTrainer: function(trainerId) {
                return TrainersProxy.deleteTrainer(trainerId).then(function(result) {
                    return TrainersTrans.dtoToEntity(result.data);
                });
            }
        };
		
		return service;
    }
]);
