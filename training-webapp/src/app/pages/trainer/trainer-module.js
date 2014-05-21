'use strict';

(function(angular) {
    angular.module('trng.trainer', [
        'ui.router',
        'trng.config',
        'trng.trainer.training.main'
    ]);

    angular.module('trng.trainer').config([
        '$urlRouterProvider',
        '$stateProvider',
        'StatesNames',
        function($urlRouterProvider, $stateProvider, StatesNames) {
            $stateProvider.
                state(StatesNames.trainer.training.name, {
                    url: '/training',
                    templateUrl: 'app/pages/trainer/training/training.html'
                });
        }
    ]);
})(angular);
