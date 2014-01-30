'use strict';

(function (angular) {
    angular.module('trng.app', [
            'trng.courses.main',
            'ui.router'
        ]).config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
            $urlRouterProvider.when('', 'courses/classes');
            $urlRouterProvider.when('/courses', 'courses/classes');

            $stateProvider.
                state('courses', {
                    url: '/courses',
                    templateUrl: 'app/pages/courses-main/courses-main.html',
                    abstract: true
                });
        }]);

})(angular);
