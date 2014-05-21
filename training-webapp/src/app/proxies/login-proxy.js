'use strict';

angular.module('trng.proxies').factory('LoginProxy', [
    '$http',
    '$base64',
    'CommonConstants',
    'TrainingMainTracker',
    function($http, $base64, CommonConstants, TrainingMainTracker) {
        var service = {
            login: function(username, password) {
                var auth = "Basic " + $base64.encode(username + ":" + password);

                $http.defaults.headers.common.Authorization = auth;

                var promise = $http.post(CommonConstants.baseUrl + '/rest/login');
                TrainingMainTracker.addPromise(promise);
                return promise;
            }
        };

        return service;
    }
]);
