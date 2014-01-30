'use strict';

(function (angular) {
    angular.module('trng.courses.courses').factory('trng.courses.courses.CourseModel', [
        '$q', '$log', 'trng.services.CoursesService',
        function ($q, $log, coursesService) {

            var coursesLoaded = false;

            var courses = [];

            var service = {

                courses: courses,

                getAllCourses: function () {
                    if (coursesLoaded) {
                        var deferred = $q.defer();
                        var promise = deferred.promise;
                        deferred.resolve(courses);
                        return promise;
                    }

                    return coursesService.getAllCourses().then(function(result) {
                        for (var i = 0; i < result.data.length; i++) {
                            courses.push(result.data[i]);
                        }

                        coursesLoaded = true;

                        return courses;
                    });
                }
            };

            return service;
        }]);
})(angular);