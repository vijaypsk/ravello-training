'use strict';

(function (angular) {
    angular.module('trng.app', [
            'trng.login',
            'trng.trainer',
            'trng.student',
            'ui.router'
        ]).config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
            $urlRouterProvider.when('', 'login');

            $stateProvider.
                state('login', {
                    url: '/login',
                    templateUrl: 'app/pages/login/login.html',
                    controller: 'loginController'
                }).state('trainer', {
                    url: '/trainer',
                    templateUrl: 'app/pages/trainer/trainer.html',
                    abstract: true
                }).state('student', {
                    url: '/student',
                    templateUrl: 'app/pages/student/student.html',
                    abstract: true
                });
        }]);

})(angular);
