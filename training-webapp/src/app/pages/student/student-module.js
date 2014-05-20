'use strict';

(function (angular) {
    angular.module('trng.student', [
        'trng.services']).
    config([
        '$urlRouterProvider',
        '$stateProvider',
        function($urlRouterProvider, $stateProvider) {
            $stateProvider.
                state('student.class', {
                    url: '/class',
                    templateUrl: 'app/pages/student/student-class/student-class.html',
                    controller: 'studentClassController',
                    resolve: studentClassResolver
                }).state('student.class.single-app', {
                    url: '/single-app?appId',
                    templateUrl: 'app/pages/student/student-class/student-single-app/student-single-app.html',
                    controller: 'studentSingleAppController',
                    resolve: studentAppResolver
                }).state('student.class.apps-list', {
                    url: '/apps',
                    templateUrl: 'app/pages/student/student-class/student-apps/student-apps.html',
                    controller: 'studentClassController'
                });
        }
    ]);
})(angular);

