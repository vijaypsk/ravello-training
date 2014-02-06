'use strict';

(function(angular) {
    angular.module('trng.courses.main', ['ui.router', 'trng.courses.courses', 'trng.courses.classes'])
		.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {

            $stateProvider.
                state('courses.classes', {
                    url: '/classes',
                    templateUrl: 'app/pages/classes/classes.html'
                }).state('courses.courses', {
                    url: '/courses',
                    templateUrl: 'app/pages/courses/courses.html'
                }).state('courses.single-class', {
                    url: '/single-class?classId',
                    templateUrl: 'app/pages/classes/single-class/single-class.html'
                }).state('courses.single-student', {
                    url: '/single-student?classId&studentId',
                    templateUrl: 'app/pages/single-student/single-student.html'
                }).state('courses.single-course', {
                    url: '/single-course?courseId',
                    templateUrl: 'app/pages/courses/single-course/single-course.html'
                });
        }]);
})(angular);
