'use strict';

angular.module('trng.proxies').factory('trng.proxies.LoginProxy', [
    '$http',
    '$base64',
    'app.config',
    function($http, $base64, config) {
        var service = {
            login: function(username, password) {
                var auth = "Basic " + $base64.encode(username + ":" + password);

                $http.defaults.headers.common.Authorization = auth;

                return $http.post(config.baseUrl + '/rest/login');
            }
        };

        return service;
    }
]);
