'use strict';

angular.module('trng.transformers').factory('trng.transformers.LabsTransformer', [
	'trng.transformers.GeneralTransformer',
	function(generalTrans) {
		var service = {
			dtoToEntity: function(dto) {
		        var entity = new TrainingLab();
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
