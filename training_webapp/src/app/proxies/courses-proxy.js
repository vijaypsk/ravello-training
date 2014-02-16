'use strict';

angular.module('trng.proxies').factory('trng.proxies.CoursesProxy', [
    '$http',
    '$q',
    'app.config',
    function($http, $q, config) {
        var service = {
            getAllCourses: function() {
                return $http.get(config.baseUrl + '/rest/courses');
            },

            getCourseById: function(courseId) {
                return $http.get(config.baseUrl + '/rest/courses/' + courseId);
            },

            add: function(courseToSave) {
                return $http.post(config.baseUrl + '/rest/courses', courseToSave);
            },

            update: function(courseToSave) {
                return $http.put(config.baseUrl + '/rest/courses/' + courseToSave['id'], courseToSave);
            },

            delete: function(courseToDelete) {
                return $http.delete(config.baseUrl + '/rest/courses/' + courseToDelete['id']);
            },

            deleteById: function(courseId) {
                return $http.delete(config.baseUrl + '/rest/courses/' + courseId);
            }
        };

        return service;
    }
]);
