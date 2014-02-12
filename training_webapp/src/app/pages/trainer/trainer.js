'use strict';

(function(angular) {
    angular.module('trng.trainer', ['ui.router', 'trng.courses.main']).config([
        '$urlRouterProvider', '$stateProvider',
        function($urlRouterProvider, $stateProvider) {
            $urlRouterProvider.when('/courses', 'trainer/courses/classes');
            $urlRouterProvider.when('/trainer/courses', 'trainer/courses/classes');

            $stateProvider.
                state('trainer.courses', {
                    url: '/courses',
                    templateUrl: 'app/pages/trainer/courses-main/courses-main.html',
                    abstract: true
                });
        }
    ]);
})(angular);
