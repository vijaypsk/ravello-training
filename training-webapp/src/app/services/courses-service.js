'use strict';

angular.module('trng.services').factory('CoursesService', [
	'CoursesProxy',
	'CoursesTransformer',
	function(CoursesProxy, CoursesTrans) {
		
		var service = {
			getAllCourses: function() {
				var promise = CoursesProxy.getAllCourses();

                var courseEntities = [];

                return promise.then(function(result) {
                    _.forEach(result.data, function(currentLabDto) {
						var currentLabEntity = CoursesTrans.dtoToEntity(currentLabDto);
                        courseEntities.push(currentLabEntity);
                    });
                    return courseEntities;
				});
			},

            getCourseById: function(courseId) {
                return CoursesProxy.getCourseById(courseId).then(
                    function(result) {
                        return CoursesTrans.dtoToEntity(result.data);
                    }
                );
            },

            add: function(entity) {
                var dto = CoursesTrans.entityToDto(entity);
                return CoursesProxy.add(dto).then(
                    function(result) {
                        return CoursesTrans.dtoToEntity(result.data);
                    }
                );
            },

            update: function(entity) {
                var dto = CoursesTrans.entityToDto(entity);
                return CoursesProxy.update(dto);
            },

            delete: function(entity) {
                var dto = CoursesTrans.entityToDto(entity);
                return CoursesProxy.delete(dto);
            },

            deleteById: function(entityId) {
                return CoursesProxy.deleteById(entityId);
            }
        };
		
		return service;
    }
]);
