'use strict';

angular.module('trng.proxies').factory('trng.proxies.StudentsProxy', ['$http', '$q', function($http, $q) {
	var service = {
		getStudent: function(studentId) {
			return $http.get('/rest/students/' + studentId);
		},

        getStudentClass: function(studentId, classId) {
			return $http.get('/rest/students/' + studentId + '/class/' + classId);
        },

        getStudentClassApps: function(studentId, classId) {
			return $http.get('/rest/students/' + studentId + '/class/' + classId + '/apps');
        },

        getStudentClassSingleApp: function(studentId, classId, appId) {
			return $http.get('/rest/students/' + studentId + '/class/' + classId + '/apps/' + appId);
        }
    };

    return service;
}]);
