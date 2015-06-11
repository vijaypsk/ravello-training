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
                state(StatesNames.root, {
                    abstract: true,
                    templateUrl: 'app/pages/root/root.html',
                    resolve: rootResolver
                }).state(StatesNames.login.name, {
                    url: '/login',
                    templateUrl: 'app/pages/login/login.html',
                    controller: 'loginController',
                    parent: StatesNames.root
                }).state(StatesNames.admin.name, {
                    url: '/admin',
                    templateUrl: 'app/pages/admin/admin.html',
                    controller: 'AdminController',
                    parent: StatesNames.root
                }).state(StatesNames.trainer.name, {
                    url: '/trainer',
                    templateUrl: 'app/pages/trainer/trainer.html',
                    controller: 'TrainerController',
                    parent: StatesNames.root
                }).state(StatesNames.student.name, {
                    url: '/student',
                    templateUrl: 'app/pages/student/student.html',
                    controller: 'studentController',
                    resolve: studentResolver,
                    parent: StatesNames.root
                });

            // HTTP configurations.

            $httpProvider.defaults.useXDomain = true;

            // Growl configurations.

            growlProvider.globalTimeToLive(CommonConstants.messagesCloseTime);
        }
    ]);
})(angular);
