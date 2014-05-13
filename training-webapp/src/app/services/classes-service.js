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

            getClassApps: function(classId) {
                return classesProxy.getClassApps(classId).then(function(result) {
                    return classesTrans.dtoToEntity(result.data);
                });
            },

            add: function(entity) {
                var dto = classesTrans.entityToDto(entity);
                return classesProxy.add(dto).then(
                    function(result) {
                        return classesTrans.dtoToEntity(result.data);
                    });
            },

            update: function(entity) {
                var dto = classesTrans.entityToDto(entity);
                return classesProxy.update(dto).then(
                    function(result) {
                        return classesTrans.dtoToEntity(result.data);
                    }
                );
            },

            delete: function(entity) {
                var dto = classesTrans.entityToDto(entity);
                return classesProxy.delete(dto);
            },

            deleteById: function(entityId) {
                return classesProxy.deleteById(entityId);
            }
		};
		
		return service;
}]);
