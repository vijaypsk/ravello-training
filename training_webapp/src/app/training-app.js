'use strict';

(function (angular) {
    angular.module('trng.app', [
            'trng.config',
            'trng.login',
            'trng.trainer',
            'trng.student',
            'trng.error',
            'ui.router',
            'ngAnimate',
            'ajoslin.promise-tracker',
            'cgBusy',
            'angular-growl',
            'ngSanitize',
            'dialogs'
        ]).config([
            '$urlRouterProvider',
            '$stateProvider',
            '$httpProvider',
            'growlProvider',
            'app.config',
            function ($urlRouterProvider, $stateProvider, $httpProvider, growlProvider, config) {

                // Routes configuration.

                $stateProvider.
                    state('login', {
                        url: '/login',
                        templateUrl: 'app/pages/login/login.html',
                        controller: 'loginController'
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

                growlProvider.globalTimeToLive(config.messagesCloseTime);
            }
        ]).factory('trainingTracker', [
            'promiseTracker',
            function(promiseTracker) {
                var trainingTracker = promiseTracker('trainingTracker');
                return trainingTracker;
            }
        ]);
})(angular);
