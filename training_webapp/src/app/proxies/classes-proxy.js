'use strict';

angular.module('trng.proxies').factory('trng.proxies.ClassesProxy', [
    '$http',
    '$q',
    'app.config',
    function($http, $q, config) {
        return {
            getAllClasses: function() {
                return $http.get(config.baseUrl + '/rest/classes');
            },

            add: function(classToSave) {
                return $http.post(config.baseUrl + '/rest/classes', classToSave);
            },

            update: function(classToSave) {
                return $http.put(config.baseUrl + '/rest/classes/' + classToSave['id'], classToSave);
            },

            delete: function(classToDelete) {
                return $http.delete(config.baseUrl + '/rest/classes/' + classToDelete['id']);
            },

            deleteById: function(classId) {
                return $http.delete(config.baseUrl + '/rest/classes/' + classId);
            }
        };
    }
]);
