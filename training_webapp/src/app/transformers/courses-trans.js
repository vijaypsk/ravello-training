'use strict';

angular.module('trng.transformers').factory('trng.transformers.CoursesTransformer', [
	'trng.transformers.GeneralTransformer',
	function(generalTrans) {
		var service = {
			dtoToEntity: function(dto) {
		        var entity = new Course();
		        generalTrans.dtoToEntity(dto, entity);
                return entity;
			},
			
			entityToDto: function(entity) {
		        var dto = generalTrans.entityToDto(entity);
                return dto;
			}
		};
		
		return service;
}]);
