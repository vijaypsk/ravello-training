'use strict';

(function (angular) {
    angular.module('trng.config', []).constant('app.config', {
        baseUrl: '',
        autoRefreshDuration: 15000,
        messagesCloseTime: 6000
    });
})(angular);
