'use strict';

angular.module('trng.proxies').factory('trng.proxies.TrainersProxy', [
    '$http',
    'app.config',
    'trainingTracker',
    function($http, config, trainingTracker) {
        var service = {
            getAllTrainers: function() {
                var promise = $http.get(config.baseUrl + '/rest/admin/trainers');
                trainingTracker.addPromise(promise);
                return promise;
            },

            saveTrainer: function(dto) {
                var promise = $http.post(config.baseUrl + '/rest/admin/trainers', dto);
                trainingTracker.addPromise(promise);
                return promise;
            },

            updateTrainer: function(trainerId, dto) {
                var promise = $http.put(config.baseUrl + '/rest/admin/trainers/' + trainerId, dto);
                trainingTracker.addPromise(promise);
                return promise;
            },

            deleteTrainer: function(trainerId) {
                var promise = $http.delete(config.baseUrl + '/rest/admin/trainers/' + trainerId);
                trainingTracker.addPromise(promise);
                return promise;
            }
        };

        return service;
    }
]);
