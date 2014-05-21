'use strict';

angular.module('trng.transformers').factory('BlueprintsTransformer', [
	function() {
        var service = {
			dtoToEntity: function(dto) {
		        var entity = _.cloneDeep(dto);
                return entity;
			},
			
			entityToDto: function(entity) {
                var dto = _.cloneDeep(entity);
                return dto;
			}
		};
		
		return service;
    }
]);
