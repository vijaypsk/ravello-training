'use strict';

angular.module('trng.interceptors').factory('httpGeneralInterceptor', [
    '$q',
    'growl',
    function($q, growl) {
        return {
            responseError: function(rejection) {
                if (rejection.hasOwnProperty('status')) {
                    if (rejection.status >= 400) {

                        if (rejection.config.url.indexOf('login') == -1 ||
                            rejection.status >= 500) {

                            var message = rejection.data;
                            if (rejection.status >= 500) {
                                message = "Technical error occurred, cannot proceed";
                            }

                            console.log(message);
                            growl.addErrorMessage(message);
                        }
                    }
                }
                return $q.reject(rejection);
            }
        };
    }
]);