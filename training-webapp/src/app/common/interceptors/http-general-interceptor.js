'use strict';

angular.module('trng.interceptors').factory('httpGeneralInterceptor', [
    '$q',
    '$injector',
    function($q, $injector) {
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

                            var $dialogs = $injector.get('$dialogs');
                            $dialogs.error('Error', message);
                        }
                    }
                }
                return $q.reject(rejection);
            }
        };
    }
]);