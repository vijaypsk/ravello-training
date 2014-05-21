'use strict';

angular.module('trng.proxies').factory('ClassesProxy', [
    '$http',
    '$q',
    'CommonConstants',
    'TrainingMainTracker',
    function($http, $q, CommonConstants, TrainingMainTracker) {
        return {
            getAllClasses: function() {
                var promise = $http.get(CommonConstants.baseUrl + '/rest/classes');
                TrainingMainTracker.addPromise(promise);
                return promise;
            },

            getClassById: function(classId) {
                var promise = $http.get(CommonConstants.baseUrl + '/rest/classes/' + classId);
                TrainingMainTracker.addPromise(promise);
                return promise;
            },

            getClassApps: function(classId) {
                var promise = $http.get(CommonConstants.baseUrl + '/rest/classes/' + classId + '/apps');
                TrainingMainTracker.addPromise(promise);
                return promise;
            },

            add: function(classToSave) {
                var promise = $http.post(CommonConstants.baseUrl + '/rest/classes', classToSave);
                TrainingMainTracker.addPromise(promise);
                return promise;
            },

            update: function(classToSave) {
                var promise = $http.put(CommonConstants.baseUrl + '/rest/classes/' + classToSave._id, classToSave);
                TrainingMainTracker.addPromise(promise);
                return promise;
            },

            delete: function(classToDelete) {
                var promise = $http.delete(CommonConstants.baseUrl + '/rest/classes/' + classToDelete._id);
                TrainingMainTracker.addPromise(promise);
                return promise;
            },

            deleteById: function(classId) {
                var promise = $http.delete(CommonConstants.baseUrl + '/rest/classes/' + classId);
                TrainingMainTracker.addPromise(promise);
                return promise;
            }
        };
    }
]);
