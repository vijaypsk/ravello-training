'use strict';

angular.module('trng.proxies').factory('CoursesProxy', [
    '$http',
    '$q',
    'CommonConstants',
    'TrainingMainTracker',
    function($http, $q, CommonConstants, TrainingMainTracker) {
        var service = {
            getAllCourses: function() {
                var promise = $http.get(CommonConstants.baseUrl + '/rest/courses');
                TrainingMainTracker.addPromise(promise);
                return promise;
            },

            getCourseById: function(courseId) {
                var promise = $http.get(CommonConstants.baseUrl + '/rest/courses/' + courseId);
                TrainingMainTracker.addPromise(promise);
                return promise;
            },

            add: function(courseToSave) {
                var promise = $http.post(CommonConstants.baseUrl + '/rest/courses', courseToSave);
                TrainingMainTracker.addPromise(promise);
                return promise;
            },

            update: function(courseToSave) {
                var promise = $http.put(CommonConstants.baseUrl + '/rest/courses/' + courseToSave._id, courseToSave);
                TrainingMainTracker.addPromise(promise);
                return promise;
            },

            delete: function(courseToDelete) {
                var promise = $http.delete(CommonConstants.baseUrl + '/rest/courses/' + courseToDelete._id);
                TrainingMainTracker.addPromise(promise);
                return promise;
            },

            deleteById: function(courseId) {
                var promise = $http.delete(CommonConstants.baseUrl + '/rest/courses/' + courseId);
                TrainingMainTracker.addPromise(promise);
                return promise;
            }
        };

        return service;
    }
]);
