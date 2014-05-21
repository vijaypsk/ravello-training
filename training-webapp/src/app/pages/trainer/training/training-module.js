'use strict';

(function(angular) {
    angular.module('trng.trainer.training.main', [
        'ui.router',
        'trng.trainer.training.courses',
        'trng.trainer.training.classes'
    ]);

    angular.module('trng.trainer.training.main').config([
        '$urlRouterProvider',
        '$stateProvider',
        function($urlRouterProvider, $stateProvider) {

            $stateProvider
                .state('trainer.training.classes', {
                    url: '/classes',
                    templateUrl: 'app/pages/trainer/classes/trainer-classes.html',
                    controller: 'trainerClassesController',
                    resolve: classesResolver
                }).state('trainer.training.courses', {
                    url: '/courses',
                    templateUrl: 'app/pages/trainer/courses/trainer-courses.html',
                    controller: 'trainerCoursesController',
                    resolve: coursesResolver
                }).state('trainer.training.single-class', {
                    url: '/single-class?classId',
                    templateUrl: 'app/pages/trainer/classes/single-class/trainer-single-class.html',
                    controller: 'trainerSingleClassEditController',
                    resolve: singleClassEditResolver
                }).state('trainer.training.single-course', {
                    url: '/single-course?courseId',
                    templateUrl: 'app/pages/trainer/courses/single-course/trainer-single-course.html',
                    controller: 'trainerSingleCourseController',
                    resolve: singleCourseResolver
                });
        }
    ]);
})(angular);
