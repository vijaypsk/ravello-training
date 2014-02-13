'use strict';

angular.module('trng.proxies').factory('trng.proxies.CoursesProxy', ['$http', '$q', function($http, $q) {
	var service = {
		getAllCourses: function() {
			return $http.get('/rest/courses');
		},

        getCourseById: function(courseId) {
            return $http.get('/rest/courses/' + courseId);
        },

        add: function(courseToSave) {
            return $http.post('/rest/courses', courseToSave);
        },

        update: function(courseToSave) {
            return $http.put('/rest/courses/' + courseToSave['id'], courseToSave);
        },

        delete: function(courseToDelete) {
            return $http.delete('/rest/courses/' + courseToDelete['id']);
        },

        deleteById: function(courseId) {
            return $http.delete('/rest/courses/' + courseId);
        }

    };

    return service;
}]);
