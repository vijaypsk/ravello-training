'use strict';

angular.module('trng.transformers').factory('trng.transformers.StudentsTransformer', [
	'trng.transformers.GeneralTransformer',
	'trng.transformers.BlueprintPermissionsTransformer',
	function(generalTrans, bpPermissionsTrans) {

        var toBpPermissionEntities = function(dto, entity) {
            entity['blueprintPermissions'] = [];
            _.forEach(dto['blueprintPermissions'], function(currentBpPermissions) {
                var bpPermissionEntity = bpPermissionsTrans.dtoToEntity(currentBpPermissions);
                entity['blueprintPermissions'].push(bpPermissionEntity);
            });
        };

        var toBpPermissionDtos = function(dto, entity) {
            dto['blueprintPermissions'] = [];
            _.forEach(entity['blueprintPermissions'], function(currentBpPermissions) {
                var bpPermissionDto = bpPermissionsTrans.entityToDto(currentBpPermissions);
                dto['blueprintPermissions'].push(bpPermissionDto);
            });
        };

        var service = {
			dtoToEntity: function(dto) {
		        var entity = new Student();
		        generalTrans.dtoToEntity(dto, entity);
                toBpPermissionEntities(dto, entity);
                return entity;
			},

			entityToDto: function(entity) {
		        var dto = generalTrans.entityToDto(entity);
                toBpPermissionDtos(dto, entity);
                return dto;
			}
		};
		
		return service;
}]);
