'use strict';

angular.module('trng.transformers').factory('trng.transformers.StudentsTransformer', [
	function() {

        var service = {
			dtoToEntity: function(dto) {
		        var entity = _.cloneDeep(dto);

                entity.id = dto._id;
                entity = _.omit(entity, '_id');

                entity.user.id = dto.user._id;
                entity.user = _.omit(entity.user, '_id');

                return entity;
			},

			entityToDto: function(entity) {
		        var dto = _.cloneDeep(entity);

                dto._id = dto.id;
                dto = _.omit(dto, 'id');

                dto.user._id = dto.user.id;
                dto.user = _.omit(dto.user, 'id');

                return dto;
			}
		};
		
		return service;
}]);
