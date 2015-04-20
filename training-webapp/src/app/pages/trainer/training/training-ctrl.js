'use strict';

angular.module('trng.trainer.training.main').controller('trainerTrainingController', [
    '$log',
    '$scope',
    '$rootScope',
    '$state',
    'StatesNames',
    function($log, $scope, $rootScope, $state, StatesNames) {
        $scope.init = function() {
            $state.go(StatesNames.trainer.training.classes.name);
        };

        $scope.init();
    }
]);