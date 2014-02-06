'use strict';

angular.module('trng.services').factory('trng.services.CoursesService', [
	'trng.proxies.CoursesProxy',
	'trng.transformers.CoursesTransformer',
	function(coursesProxy, coursesTrans) {
		
		var service = {
			getAllCourses: function() {
				var promise = coursesProxy.getAllCourses();

                var courseEntities = [];

                return promise.then(function(result) {
                    _.forEach(result.data, function(currentLabDto) {
						var currentLabEntity = coursesTrans.dtoToEntity(currentLabDto);
                        courseEntities.push(currentLabEntity);
                    });
                    return courseEntities;
				});
			},

            add: function(entity) {
                var dto = coursesTrans.entityToDto(entity);
                coursesProxy.add(dto);
            },

            update: function(entity) {
                var dto = coursesTrans.entityToDto(entity);
                coursesProxy.update(dto);
            },

            delete: function(entity) {
                var dto = coursesTrans.entityToDto(entity);
                coursesProxy.delete(dto);
            },

            deleteById: function(entityId) {
                coursesProxy.deleteById(entityId);
            }
        };
		
		return service;
}]);
