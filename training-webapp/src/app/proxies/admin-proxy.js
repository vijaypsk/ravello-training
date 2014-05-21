'use strict';

angular.module('trng.proxies').factory('AdminProxy', [
    '$http',
    '$q',
    'CommonConstants',
    'TrainingMainTracker',
    function($http, $q, CommonConstants, TrainingMainTracker) {
        var service = {
            updateProfile: function(username, password) {
                var dto = {
                    username: username,
                    password: password
                };

                var promise = $http.post(CommonConstants.baseUrl + '/rest/admin/profile', dto);
                TrainingMainTracker.addPromise(promise);
                return promise;
            }
        };

        return service;
    }
]);
