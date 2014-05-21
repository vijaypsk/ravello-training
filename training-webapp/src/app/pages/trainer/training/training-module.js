'use strict';

(function(angular) {
    angular.module('trng.trainer.training.main', [
        'ui.router',
        'trng.config',
        'trng.trainer.training.courses',
        'trng.trainer.training.classes'
    ]);

    angular.module('trng.trainer.training.main').config([
        '$urlRouterProvider',
        '$stateProvider',
        'StatesNames',
        function($urlRouterProvider, $stateProvider, StatesNames) {

            $stateProvider
                .state(StatesNames.trainer.training.classes.name, {
                    url: '/classes',
                    templateUrl: 'app/pages/trainer/classes/trainer-classes.html',
                    controller: 'trainerClassesController',
                    resolve: classesResolver
                }).state(StatesNames.trainer.training.courses.name, {
                    url: '/courses',
                    templateUrl: 'app/pages/trainer/courses/trainer-courses.html',
                    controller: 'trainerCoursesController',
                    resolve: coursesResolver
                }).state(StatesNames.trainer.training.singleClass.name, {
                    url: '/single-class?classId',
                    templateUrl: 'app/pages/trainer/classes/single-class/trainer-single-class.html',
                    controller: 'trainerSingleClassEditController',
                    resolve: singleClassEditResolver
                }).state(StatesNames.trainer.training.singleCourse.name, {
                    url: '/single-course?courseId',
                    templateUrl: 'app/pages/trainer/courses/single-course/trainer-single-course.html',
                    controller: 'trainerSingleCourseController',
                    resolve: singleCourseResolver
                });
        }
    ]);
})(angular);
