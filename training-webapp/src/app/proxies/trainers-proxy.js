'use strict';

angular.module('trng.proxies').factory('TrainersProxy', [
    '$http',
    'CommonConstants',
    'TrainingMainTracker',
    function($http, CommonConstants, TrainingMainTracker) {
        var service = {
            getAllTrainers: function() {
                var promise = $http.get(CommonConstants.baseUrl + '/rest/admin/trainers');
                TrainingMainTracker.addPromise(promise);
                return promise;
            },

            getTrainerById: function(trainerId) {
                var promise = $http.get(CommonConstants.baseUrl + '/rest/admin/trainers/' + trainerId);
                TrainingMainTracker.addPromise(promise);
                return promise;
            },

            add: function(dto) {
                var promise = $http.post(CommonConstants.baseUrl + '/rest/admin/trainers', dto);
                TrainingMainTracker.addPromise(promise);
                return promise;
            },

            update: function(dto) {
                var promise = $http.put(CommonConstants.baseUrl + '/rest/admin/trainers/' + dto._id, dto);
                TrainingMainTracker.addPromise(promise);
                return promise;
            },

            delete: function(trainerId) {
                var promise = $http.delete(CommonConstants.baseUrl + '/rest/admin/trainers/' + trainerId);
                TrainingMainTracker.addPromise(promise);
                return promise;
            }
        };

        return service;
    }
]);
