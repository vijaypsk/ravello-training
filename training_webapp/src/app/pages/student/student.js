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
                    templateUrl: 'app/pages/student/class/student-class.html',
                    controller: 'studentClassController',
                    resolve: studentClassResolver
//                    abstract: true
                }).state('student.class.single-app', {
                    url: '/single-app?appId',
                    templateUrl: 'app/pages/student/class/student-single-app.html',
                    controller: 'studentAppController',
                    resolve: studentAppResolver
                }).state('student.class.apps-list', {
                    url: '/apps',
                    templateUrl: 'app/pages/student/class/student-apps-list.html',
                    controller: 'studentClassController'
                });
        }
    ]);
})(angular);

