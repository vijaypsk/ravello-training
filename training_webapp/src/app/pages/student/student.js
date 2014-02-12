'use strict';

(function (angular) {
    angular.module('trng.student', []).config([
        '$urlRouterProvider', '$stateProvider',
        function($urlRouterProvider, $stateProvider) {
            $urlRouterProvider.when('/class', 'student/class');

            $stateProvider.
                state('student.class', {
                    url: '/class/{classId}',
                    templateUrl: 'app/pages/student/class/student-class.html',
                    controller: 'studentClassController'
                });
        }
    ]);
})(angular);

