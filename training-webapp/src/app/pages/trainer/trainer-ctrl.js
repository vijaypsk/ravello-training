'use strict';

angular.module('trng.trainer').controller('TrainerController', [
    '$scope',
    '$state',
    'StatesNames',
    function($scope, $state, StatesNames) {
        $scope.init = function() {
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
