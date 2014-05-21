'use strict';

angular.module('trng.services').factory('CoursesService', [
	'CoursesProxy',
	'CoursesTransformer',
	function(CoursesProxy, CoursesTrans) {
		
		var service = {
			getAllCourses: function() {
                return CoursesProxy.getAllCourses().then(
                    function(result) {
                        return _.map(result.data, function(dto) {
                            return CoursesTrans.dtoToEntity(dto);
                        });
                    }
                );
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
            },

            saveOrUpdate: function(entity) {
                var dto = CoursesTrans.entityToDto(entity);

                if (!entity.id) {
                    return CoursesProxy.add(dto).then(
                        function(result) {
                            var persistedDto = result.data;
                            entity.id = persistedDto.id;
                            return CoursesTrans.dtoToEntity(persistedDto);
                        }
                    );
                }

                return CoursesProxy.update(dto).then(
                    function(result) {
                        return CoursesTrans.dtoToEntity(result.data);
                    }
                );
            }
        };
		
		return service;
    }
]);
