'use strict';

(function (angular) {
    angular.module('trng.trainer.training.courses').factory('trng.trainer.training.courses.CourseModel', [
        '$q', '$log', 'trng.services.CoursesService',
        function ($q, $log, coursesService) {

            var coursesLoaded = false;

            var courses = [];

            var currentCourse = null;

            var getCourseById = function(courseId) {
                var matchingCourses = _.where(courses, {id: courseId});
                if (matchingCourses && matchingCourses.length > 0) {
                    return matchingCourses[0];
                }
                return null;
            };

            var model = {

                courses: courses,

                getCourseById: function(courseId) {
                    if (coursesLoaded) {
                        var deferred = $q.defer();
                        var promise = deferred.promise;
                        deferred.resolve(getCourseById(courseId));
                        return promise;
                    }

                    return model.getAllCourses().then(function(result) {
                        return getCourseById(courseId);
                    });
                },

                getAllCourses: function () {
                    if (coursesLoaded) {
                        var deferred = $q.defer();
                        var promise = deferred.promise;
                        deferred.resolve(courses);
                        return promise;
                    }

                    return coursesService.getAllCourses().
                        then(function(result) {
                            for (var i = 0; i < result.length; i++) {
                                courses.push(result[i]);
                            }

                            coursesLoaded = true;

                            return courses;
                        });
                },

                setCurrentCourse: function(course) {
                    if (course == null) {
                        currentCourse = null;
                    } else {
                        currentCourse = _.cloneDeep(course);
                    }
                },

                setCurrentCourseById: function(courseId) {
                    model.setCurrentCourse(getCourseById(courseId));
                },

                getCurrentCourse: function(courseId) {
                    if (currentCourse) {
                        var deferred = $q.defer();
                        deferred.resolve(currentCourse);
                        return deferred.promise;
                    }

                    return model.getCourseById(courseId).
                        then(function(result) {
                            model.setCurrentCourse(result);
                            return currentCourse;
                        });
                },

                deleteCourseById: function(coursesList, courseId) {
                    _.remove(coursesList, function(currentCourse) {
                        return currentCourse.hasOwnProperty('id') && currentCourse.id === courseId;
                    });

                    courses = coursesList;

                    coursesService.deleteById(courseId);
                },

                save: function(courseToSave) {
                    var exists = false;
                    var matchingCourses = _.where(courses, {id: courseToSave['id']});
                    exists = matchingCourses && matchingCourses.length > 0;

                    if (exists) {
                        courses = _.map(courses, function(currentCourse) {
                            if (currentCourse.id == courseToSave.id) {
                                return courseToSave;
                            }
                            return currentCourse;
                        });
                        return coursesService.update(courseToSave);
                    } else {
                        courses.push(courseToSave);
                        return coursesService.add(courseToSave).then(function(persistedCourse) {
                            courseToSave.id = persistedCourse.id;
                        });
                    }
                },

                deleteBlueprintById: function(course, bpId) {
                    _.remove(course.blueprints, function(currentBp) {
                        return (currentBp && currentBp.hasOwnProperty('id') && currentBp.id == bpId);
                    });
                }
            };

            return model;
        }]);
})(angular);