'use strict';

(function(angular) {
    angular.module('trng.trainer.training.main', [
        'ui.router', 'trng.trainer.training.courses', 'trng.trainer.training.classes']).config([
        '$urlRouterProvider',
        '$stateProvider',
        function($urlRouterProvider, $stateProvider) {

            $stateProvider.
                state('trainer.training.classes', {
                    url: '/classes',
                    templateUrl: 'app/pages/trainer/classes/classes.html',
                    controller: 'classesController',
                    resolve: classesResolver
                }).state('trainer.training.courses', {
                    url: '/courses',
                    templateUrl: 'app/pages/trainer/courses/courses.html',
                    controller: 'coursesController',
                    resolve: coursesResolver
                }).state('trainer.training.single-class', {
                    url: '/single-class?classId',
                    templateUrl: 'app/pages/trainer/classes/single-class/single-class.html',
                    controller: 'singleClassController',
                    resolve: singleClassResolver
                }).state('trainer.training.single-course', {
                    url: '/single-course?courseId',
                    templateUrl: 'app/pages/trainer/courses/single-course/single-course.html',
                    controller: 'singleCourseController',
                    resolve: singleCourseResolver
                });
        }
    ]);
})(angular);
