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

            getTrainerById: function(trainerId) {
                return TrainersProxy.getTrainerById(trainerId).then(function(result) {
                    return TrainersTrans.dtoToEntity(result.data);
                });
            },

            saveTrainer: function(dto) {
                return TrainersProxy.add(dto).then(function(result) {
                    return TrainersTrans.dtoToEntity(result.data);
                });
            },

            updateTrainer: function(trainerId, dto) {
                return TrainersProxy.update(dto).then(function(result) {
                    return TrainersTrans.dtoToEntity(result.data);
                });
            },

            deleteTrainer: function(trainerId) {
                return TrainersProxy.delete(trainerId).then(function() {
                    return null;
                });
            },

            saveOrUpdate: function(entity) {
                var dto = TrainersTrans.entityToDto(entity);

                if (!entity.id) {
                    return TrainersProxy.add(dto).then(
                        function(result) {
                            var persistedDto = result.data;
                            entity.id = persistedDto.id;
                            return TrainersTrans.dtoToEntity(persistedDto);
                        }
                    );
                }

                return TrainersProxy.update(dto).then(
                    function(result) {
                        return TrainersTrans.dtoToEntity(result.data);
                    }
                );
            }
        };
		
		return service;
    }
]);
