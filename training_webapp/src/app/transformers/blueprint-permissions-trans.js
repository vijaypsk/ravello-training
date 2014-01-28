'use strict';

angular.module('trng.transformers').factory('trng.transformers.BlueprintPermissionsTransformer', [
	'trng.transformers.GeneralTransformer',
    'trng.transformers.BlueprintsTransformer',
	function(generalTrans, bpTrans) {
        var service = {
			dtoToEntity: function(dto) {
		        var entity = new BlueprintPermission();
		        generalTrans.dtoToEntity(dto, entity);
                entity['blueprint'] = bpTrans.dtoToEntity(dto['blueprint']);
                return entity;
			},
			
			entityToDto: function(entity) {
		        var dto = generalTrans.entityToDto(entity);
                dto['blueprint'] = bpTrans.entityToDto(entity['blueprint']);
                return dto;
			}
		};
		
		return service;
}]);
