'use strict';

angular.module('trng.services').factory('trng.services.TrainersService', [
	'trng.proxies.TrainersProxy',
	'trng.transformers.TrainersTransformer',
	function(trainersProxy, trainersTrans) {

		var service = {
            getAllTrainers: function() {
                return trainersProxy.getAllTrainers().then(function(result) {
                    return _.map(result.data, function(dto) {
                        return trainersTrans.dtoToEntity(dto);
                    });
                });
            },

            saveTrainer: function(dto) {
                return trainersProxy.saveTrainer(dto).then(function(result) {
                    return trainersTrans.dtoToEntity(result.data);
                });
            },

            updateTrainer: function(trainerId, dto) {
                return trainersProxy.updateTrainer(trainerId, dto).then(function(result) {
                    return trainersTrans.dtoToEntity(result.data);
                });
            },

            deleteTrainer: function(trainerId) {
                return trainersProxy.deleteTrainer(trainerId).then(function(result) {
                    return trainersTrans.dtoToEntity(result.data);
                });
            }
        };
		
		return service;
}]);
