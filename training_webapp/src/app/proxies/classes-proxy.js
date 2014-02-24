'use strict';

angular.module('trng.proxies').factory('trng.proxies.ClassesProxy', [
    '$http',
    '$q',
    'app.config',
    'trainingTracker',
    function($http, $q, config, trainingTracker) {
        return {
            getAllClasses: function() {
                var promise = $http.get(config.baseUrl + '/rest/classes');
                trainingTracker.addPromise(promise);
                return promise;
            },

            add: function(classToSave) {
                var promise = $http.post(config.baseUrl + '/rest/classes', classToSave);
                trainingTracker.addPromise(promise);
                return promise;
            },

            update: function(classToSave) {
                var promise = $http.put(config.baseUrl + '/rest/classes/' + classToSave['_id'], classToSave);
                trainingTracker.addPromise(promise);
                return promise;
            },

            delete: function(classToDelete) {
                var promise = $http.delete(config.baseUrl + '/rest/classes/' + classToDelete['_id']);
                trainingTracker.addPromise(promise);
                return promise;
            },

            deleteById: function(classId) {
                var promise = $http.delete(config.baseUrl + '/rest/classes/' + classId);
                trainingTracker.addPromise(promise);
                return promise;
            }
        };
    }
]);
