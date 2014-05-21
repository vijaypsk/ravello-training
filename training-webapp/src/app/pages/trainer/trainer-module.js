'use strict';

(function(angular) {
    angular.module('trng.trainer', [
        'ui.router',
        'trng.trainer.training.main'
    ]);

    angular.module('trng.trainer').config([
        '$urlRouterProvider',
        '$stateProvider',
        function($urlRouterProvider, $stateProvider) {
            $stateProvider.
                state('trainer.training', {
                    url: '/training',
                    templateUrl: 'app/pages/trainer/training/training.html'
                });
        }
    ]);
})(angular);
