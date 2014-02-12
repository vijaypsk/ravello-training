'use strict';

angular.module('trng.transformers').factory('trng.transformers.BlueprintsTransformer', [
	'trng.transformers.GeneralTransformer',
	function(generalTrans) {

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
}]);
