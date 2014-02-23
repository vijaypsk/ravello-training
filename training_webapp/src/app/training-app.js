'use strict';

(function (angular) {
    angular.module('trng.app', [
            'trng.login',
            'trng.trainer',
            'trng.student',
            'trng.error',
            'ui.router',
            'ngAnimate',
            'ajoslin.promise-tracker',
            'cgBusy'
        ]).config([
            '$urlRouterProvider',
            '$stateProvider',
            '$httpProvider',
            function ($urlRouterProvider, $stateProvider, $httpProvider) {

                // Routes configuration.

//                $urlRouterProvider.when('', 'login');

                $stateProvider.
                    state('login', {
                        url: '/login',
                        templateUrl: 'app/pages/login/login.html',
                        controller: 'loginController'
                    }).state('trainer', {
                        url: '/trainer',
                        templateUrl: 'app/pages/trainer/trainer.html'
//                        abstract: true
                    }).state('student', {
                        url: '/student',
                        templateUrl: 'app/pages/student/student.html',
                        controller: 'studentController',
                        resolve: studentResolver
//                        abstract: true
                    });

                // HTTP configurations

                $httpProvider.defaults.useXDomain = true;



            }
        ]).factory('trainingTracker', [
            'promiseTracker',
            function(promiseTracker) {
                var trainingTracker = promiseTracker('trainingTracker');
                return trainingTracker;
            }
        ]);
})(angular);
