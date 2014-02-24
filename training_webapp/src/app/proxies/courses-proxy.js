'use strict';

angular.module('trng.proxies').factory('trng.proxies.CoursesProxy', [
    '$http',
    '$q',
    'app.config',
    'trainingTracker',
    function($http, $q, config, trainingTracker) {
        var service = {
            getAllCourses: function() {
                var promise = $http.get(config.baseUrl + '/rest/courses');
                trainingTracker.addPromise(promise);
                return promise;
            },

            getCourseById: function(courseId) {
                var promise = $http.get(config.baseUrl + '/rest/courses/' + courseId);
                trainingTracker.addPromise(promise);
                return promise;
            },

            add: function(courseToSave) {
                var promise = $http.post(config.baseUrl + '/rest/courses', courseToSave);
                trainingTracker.addPromise(promise);
                return promise;
            },

            update: function(courseToSave) {
                var promise = $http.put(config.baseUrl + '/rest/courses/' + courseToSave['_id'], courseToSave);
                trainingTracker.addPromise(promise);
                return promise;
            },

            delete: function(courseToDelete) {
                var promise = $http.delete(config.baseUrl + '/rest/courses/' + courseToDelete['_id']);
                trainingTracker.addPromise(promise);
                return promise;
            },

            deleteById: function(courseId) {
                var promise = $http.delete(config.baseUrl + '/rest/courses/' + courseId);
                trainingTracker.addPromise(promise);
                return promise;
            }
        };

        return service;
    }
]);
