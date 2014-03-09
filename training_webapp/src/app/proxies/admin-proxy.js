'use strict';

angular.module('trng.proxies').factory('trng.proxies.AdminProxy', [
    '$http',
    '$q',
    'app.config',
    'trainingTracker',
    function($http, $q, config, trainingTracker) {
        var service = {
            updateProfile: function(username, password) {
                var dto = {
                    username: username,
                    password: password
                };

                var promise = $http.post(config.baseUrl + '/rest/admin/profile', dto);
                trainingTracker.addPromise(promise);
                return promise;
            }
        };

        return service;
    }
]);
