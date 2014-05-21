'use strict';

(function (angular) {
    angular.module('trng.student', [
        'trng.config',
        'trng.services'
    ]);

    angular.module('trng.student').config([
        '$urlRouterProvider',
        '$stateProvider',
        'StatesNames',
        function($urlRouterProvider, $stateProvider, StatesNames) {
            $stateProvider.
                state(StatesNames.student.studentClass.name, {
                    url: '/class',
                    templateUrl: 'app/pages/student/student-class/student-class.html',
                    controller: 'studentClassController',
                    resolve: studentClassResolver
                }).state(StatesNames.student.studentClass.singleApp.name, {
                    url: '/single-app?appId',
                    templateUrl: 'app/pages/student/student-class/student-single-app/student-single-app.html',
                    controller: 'studentSingleAppController',
                    resolve: studentSingleAppResolver
                }).state(StatesNames.student.studentClass.appsList.name, {
                    url: '/apps',
                    templateUrl: 'app/pages/student/student-class/student-apps/student-apps.html',
                    controller: 'studentClassController'
                });
        }
    ]);
})(angular);

