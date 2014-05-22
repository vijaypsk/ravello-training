'use strict';

angular.module('trng.services').factory('CoursesService', [
	'$q',
	'CoursesProxy',
	'CoursesTransformer',
	function($q, CoursesProxy, CoursesTrans) {

        var cachedCourses = null;

		var service = {
			getAllCourses: function() {
                if (cachedCourses) {
                    return $q.when(cachedCourses);
                }

                return CoursesProxy.getAllCourses().then(
                    function(result) {
                        cachedCourses = _.map(result.data, function(dto) {
                            return CoursesTrans.dtoToEntity(dto);
                        });
                        return cachedCourses;
                    }
                );
			},

            getCourseById: function(courseId) {
                if (cachedCourses) {
                    var course = _.find(cachedCourses, {id: courseId});
                    return $q.when(course);
                }

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
                        var persistedEntity = CoursesTrans.dtoToEntity(result.data);
                        cachedCourses && cachedCourses.push(persistedEntity);
                        return persistedEntity;
                    }
                );
            },

            update: function(entity) {
                var dto = CoursesTrans.entityToDto(entity);
                return CoursesProxy.update(dto).then(
                    function(result) {
                        var persistedEntity = CoursesTrans.dtoToEntity(result.data);

                        cachedCourses && _.forEach(cachedCourses, function(currentCourse, courseIndex) {
                            if (currentCourse.id == persistedEntity.id) {
                                cachedCourses[courseIndex] = persistedEntity;
                            }
                        });

                        return persistedEntity;
                    }
                );
            },

            delete: function(entity) {
                var dto = CoursesTrans.entityToDto(entity);
                return CoursesProxy.delete(dto).then(
                    function(result) {
                        cachedCourses && _.remove(cachedCourses, {id: entity.id});
                    }
                );
            },

            deleteById: function(entityId) {
                return CoursesProxy.deleteById(entityId).then(
                    function(result) {
                        cachedCourses && _.remove(cachedCourses, {id: entityId});
                    }
                );
            },

            saveOrUpdate: function(entity) {
                var dto = CoursesTrans.entityToDto(entity);

                if (!entity.id) {
                    return CoursesProxy.add(dto).then(
                        function(result) {
                            var persistedDto = result.data;
                            entity.id = persistedDto.id;

                            var persistedEntity = CoursesTrans.dtoToEntity(persistedDto);
                            cachedCourses && cachedCourses.push(persistedEntity);
                            return persistedEntity;
                        }
                    );
                }

                return CoursesProxy.update(dto).then(
                    function(result) {
                        var persistedEntity = CoursesTrans.dtoToEntity(result.data);

                        cachedCourses && _.forEach(cachedCourses, function(currentCourse, courseIndex) {
                            if (currentCourse.id == persistedEntity.id) {
                                cachedCourses[courseIndex] = persistedEntity;
                            }
                        });

                        return persistedEntity;
                    }
                );
            }
        };
		
		return service;
    }
]);
