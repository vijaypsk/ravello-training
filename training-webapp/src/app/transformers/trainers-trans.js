'use strict';

angular.module('trng.transformers').factory('TrainersTransformer', [
	function() {

        var service = {
			dtoToEntity: function(dto) {
		        var entity = _.cloneDeep(dto);

                entity.id = dto._id;
                entity = _.omit(entity, '_id');

                return entity;
			},

			entityToDto: function(entity) {
		        var dto = _.cloneDeep(entity);

                dto._id = dto.id;
                dto = _.omit(dto, 'id');

                return dto;
			}
		};
		
		return service;
    }
]);
