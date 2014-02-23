'use strict';

(function (angular) {
    angular.module('trng.error', []).config([
        '$provide',
        '$httpProvider',
        function($provide, $httpProvider) {
            $provide.factory('httpInterceptor', [
                '$q',
                function($q) {
                    return {
                        responseError: function(rejection) {
                            if (rejection.hasOwnProperty('status')) {
                                if (rejection.status >= 400) {
                                    console.log(rejection.data);
                                    alert(rejection.data);
                                }
                            }
                            return $q.reject(rejection);
                        }
                    };
                }
            ]);

            $httpProvider.interceptors.push('httpInterceptor');
        }
    ]);
})(angular);
