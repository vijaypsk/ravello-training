'use strict';

angular.module('trng.transformations').factory('trng.transformations.SessionsTransformation', [
	'trng.transformations.GeneralTransformation',
	function(generalTrans) {
		var transformService = {
			dtoToEntity: function(dto) {
		        var entity = new TrainingSession();
		        generalTrans.transDtoToEntity(dto, entity);
		        return entity;
			},
			
			entityToDto: function(entity) {
		        return generalTrans.transEntityToDto(entity);
			}
		};
		
		return transformService;
}]);
