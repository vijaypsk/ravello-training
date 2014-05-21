'use strict';

angular.module('trng.services').factory('ClassesService', [
	'ClassesProxy',
	'ClassesTransformer',
	function(ClassesProxy, ClassesTrans) {
		
		var service = {
			getAllClasses: function() {
				var promise = ClassesProxy.getAllClasses();

				var classEntities = [];

				return promise.then(function(result) {
                    _.forEach(result.data, function(currentClassDto) {
						var currentClassEntity = ClassesTrans.dtoToEntity(currentClassDto);
                        classEntities.push(currentClassEntity);

                    });
					return classEntities;
				});
            },

            getClassApps: function(classId) {
                return ClassesProxy.getClassApps(classId).then(function(result) {
                    return ClassesTrans.dtoToEntity(result.data);
                });
            },

            add: function(entity) {
                var dto = ClassesTrans.entityToDto(entity);
                return ClassesProxy.add(dto).then(
                    function(result) {
                        return ClassesTrans.dtoToEntity(result.data);
                    });
            },

            update: function(entity) {
                var dto = ClassesTrans.entityToDto(entity);
                return ClassesProxy.update(dto).then(
                    function(result) {
                        return ClassesTrans.dtoToEntity(result.data);
                    }
                );
            },

            delete: function(entity) {
                var dto = ClassesTrans.entityToDto(entity);
                return ClassesProxy.delete(dto);
            },

            deleteById: function(entityId) {
                return ClassesProxy.deleteById(entityId);
            }
		};
		
		return service;
    }
]);
