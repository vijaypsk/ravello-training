'use strict';

angular.module('trng.proxies').factory('trng.proxies.LoginProxy', [
    '$http',
    '$base64',
    'app.config',
    'trainingTracker',
    function($http, $base64, config, trainingTracker) {
        var service = {
            login: function(username, password) {
                var auth = "Basic " + $base64.encode(username + ":" + password);

                $http.defaults.headers.common.Authorization = auth;

                var promise = $http.post(config.baseUrl + '/rest/login');
                trainingTracker.addPromise(promise);
                return promise;
            }
        };

        return service;
    }
]);
