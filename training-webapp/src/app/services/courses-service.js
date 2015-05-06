'use strict';

angular.module('trng.services').factory('CoursesService', [
	'$rootScope',
	'$q',
	'CommonConstants',
	'CoursesProxy',
	'CoursesTransformer',
	function($rootScope, $q, CommonConstants, CoursesProxy, CoursesTrans) {

        var cachedCourses = null;

        function updateCourse(course) {
            var persistedEntity = updateCourseInCache(course);
            $rootScope.$broadcast(CommonConstants.courseChangedEvent, course);
            return persistedEntity;
        }

		function updateCourseInCache(course) {
			var persistedEntity = CoursesTrans.dtoToEntity(course);

			cachedCourses && _.forEach(cachedCourses, function(currentCourse, courseIndex) {
				if (currentCourse.id == persistedEntity.id) {
					cachedCourses[courseIndex] = persistedEntity;
				}
			});

			return persistedEntity;
		}

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
						return updateCourseInCache(result.data);
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
						return updateCourse(result.data);
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
						return updateCourse(result.data);
					}
                );
            }
        };
		
		return service;
    }
]);
