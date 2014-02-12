'use strict';

(function(angular) {
    angular.module('trng.trainer.courses.main', [
        'ui.router', 'trng.trainer.courses.courses', 'trng.trainer.courses.classes']).config([
        '$urlRouterProvider',
        '$stateProvider',
        function($urlRouterProvider, $stateProvider) {

            $stateProvider.
                state('trainer.courses.classes', {
                    url: '/classes',
                    templateUrl: 'app/pages/trainer/classes/classes.html',
                    controller: 'classesController',
                    resolve: classesResolver
                }).state('trainer.courses.courses', {
                    url: '/courses',
                    templateUrl: 'app/pages/trainer/courses/courses.html',
                    controller: 'coursesController',
                    resolve: coursesResolver
                }).state('trainer.courses.single-class', {
                    url: '/single-class?classId',
                    templateUrl: 'app/pages/trainer/classes/single-class/single-class.html',
                    controller: 'singleClassController',
                    resolve: singleClassResolver
                }).state('trainer.courses.single-course', {
                    url: '/single-course?courseId',
                    templateUrl: 'app/pages/trainer/courses/single-course/single-course.html',
                    controller: 'singleCourseController',
                    resolve: singleCourseResolver
                });
        }
    ]);
})(angular);
