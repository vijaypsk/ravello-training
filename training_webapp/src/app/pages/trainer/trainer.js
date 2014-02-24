'use strict';

(function(angular) {
    angular.module('trng.trainer', ['ui.router', 'trng.trainer.courses.main']).config([
        '$urlRouterProvider',
        '$stateProvider',
        function($urlRouterProvider, $stateProvider) {
            $stateProvider.
                state('trainer.courses', {
                    url: '/courses',
                    templateUrl: 'app/pages/trainer/courses-main/courses-main.html'
                });
        }
    ]);
})(angular);
