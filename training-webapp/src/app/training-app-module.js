'use strict';

(function (angular) {
    angular.module('trng.app', [
        'trng.config',
        'trng.login',
        'trng.admin',
        'trng.trainer',
        'trng.student',
        'trng.interceptors',
        'trng.trackers',
        'ui.router',
        'ngAnimate',
        'ajoslin.promise-tracker',
        'cgBusy',
        'angular-growl',
        'ngSanitize',
        'dialogs'
    ]);

    angular.module('trng.app').config([
        '$urlRouterProvider',
        '$stateProvider',
        '$httpProvider',
        'growlProvider',
        'CommonConstants',
        function ($urlRouterProvider, $stateProvider, $httpProvider, growlProvider, CommonConstants) {

            // Routes configuration.

            $stateProvider.
                state('login', {
                    url: '/login',
                    templateUrl: 'app/pages/login/login.html',
                    controller: 'loginController'
                }).state('admin', {
                    url: '/admin',
                    templateUrl: 'app/pages/admin/admin.html'
                }).state('trainer', {
                    url: '/trainer',
                    templateUrl: 'app/pages/trainer/trainer.html'
                }).state('student', {
                    url: '/student',
                    templateUrl: 'app/pages/student/student.html',
                    controller: 'studentController',
                    resolve: studentResolver
                });

            // HTTP configurations.

            $httpProvider.defaults.useXDomain = true;

            // Growl configurations.

            growlProvider.globalTimeToLive(CommonConstants.messagesCloseTime);
        }
    ]);
})(angular);
