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
        'StatesNames',
        function ($urlRouterProvider, $stateProvider, $httpProvider, growlProvider, CommonConstants, StatesNames) {

            // Routes configuration.

            $stateProvider.
                state(StatesNames.login.name, {
                    url: '/login',
                    templateUrl: 'app/pages/login/login.html',
                    controller: 'loginController'
                }).state(StatesNames.admin.name, {
                    url: '/admin',
                    templateUrl: 'app/pages/admin/admin.html',
                    controller: 'AdminController'
                }).state(StatesNames.trainer.name, {
                    url: '/trainer',
                    templateUrl: 'app/pages/trainer/trainer.html',
                    controller: 'TrainerController'
                }).state(StatesNames.student.name, {
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
