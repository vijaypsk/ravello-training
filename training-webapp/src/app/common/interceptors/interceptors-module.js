'use strict';

(function (angular) {
    angular.module('trng.interceptors', []);

    angular.module('trng.interceptors').config([
        '$provide',
        '$httpProvider',
        function($provide, $httpProvider) {
            $httpProvider.interceptors.push('httpGeneralInterceptor');
        }
    ]);
})(angular);
