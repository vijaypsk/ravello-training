'use strict';

(function (angular) {
    angular.module('trng.app', [
            'trng.labs.main',
            'ui.router'
        ]).config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
            $urlRouterProvider.when('', 'labs/sessions');
            $urlRouterProvider.when('/labs', 'labs/sessions');

            $stateProvider.
                state('labs', {
                    url: '/labs',
                    templateUrl: 'app/pages/labs-main/labs-main.html',
                    abstract: true
                });

            var sessionsResolve = {
                'sessions': function () {
                    return sessionsService.getService();
                }
            };
        }]);

})(angular);
