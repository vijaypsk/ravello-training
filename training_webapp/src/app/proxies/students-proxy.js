'use strict';

angular.module('trng.proxies').factory('trng.proxies.StudentsProxy', [
    '$http',
    '$q',
    'app.config',
    function($http, $q, config) {
        var service = {
            getStudent: function(studentId) {
                return $http.get(config.baseUrl + '/rest/students/' + studentId);
            },

            getStudentClass: function(studentId, classId) {
                return $http.get(config.baseUrl + '/rest/students/' + studentId + '/class/' + classId);
            },

            getStudentClassApps: function(studentId, classId) {
                return $http.get(config.baseUrl + '/rest/students/' + studentId + '/class/' + classId + '/apps');
            },

            getStudentClassSingleApp: function(studentId, classId, appId) {
                return $http.get(config.baseUrl + '/rest/students/' + studentId + '/class/' + classId + '/apps/' + appId);
            }
        };

        return service;
    }
]);
