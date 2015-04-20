'use strict';

angular.module('trng.trainer').controller('TrainerController', [
    '$scope',
    '$rootScope',
    '$state',
    'StatesNames',
    function($scope, $rootScope, $state, StatesNames) {
        $scope.init = function() {
            $state.go(StatesNames.trainer.training.name);
        };

        $scope.navigateToClasses = function() {
            $state.go(StatesNames.trainer.training.classes.name);
        };

        $scope.navigateToCourses = function() {
            $state.go(StatesNames.trainer.training.courses.name);
        };

        $scope.init();
    }
]);
