'use strict';

angular.module('trng.services').factory('trng.services.ClassesService', [
	'trng.proxies.ClassesProxy',
	'trng.transformers.ClassesTransformer',
	function(classesProxy, classesTrans) {
		
		var service = {
			getAllClasses: function() {
				var promise = classesProxy.getAllClasses();

				var classEntities = [];

				return promise.then(function(result) {
                    _.forEach(result.data, function(currentClassDto) {
						var currentClassEntity = classesTrans.dtoToEntity(currentClassDto);
                        classEntities.push(currentClassEntity);

                    });
					return classEntities;
				});
            },

            add: function(entity) {
                var dto = classesTrans.entityToDto(entity);
                classesProxy.add(dto);
            },

            update: function(entity) {
                var dto = classesTrans.entityToDto(entity);
                classesProxy.update(dto);
            },

            delete: function(entity) {
                var dto = classesTrans.entityToDto(entity);
                classesProxy.delete(dto);
            },

            deleteById: function(entityId) {
                classesProxy.deleteById(entityId);
            }
		};
		
		return service;
}]);
