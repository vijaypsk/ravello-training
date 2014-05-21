'use strict';

angular.module('trng.admin.trainers').controller('adminSingleTrainerController', [
    '$log',
    '$scope',
    '$window',
    '$state',
    'StatesNames',
    'AdminTrainerModel',
    'currentTrainer',
    function($log, $scope, $window, $state, StatesNames, AdminTrainerModel, currentTrainer) {
        $scope.init = function() {
            $scope.currentTrainer = currentTrainer;
        };

        $scope.saveTrainer = function() {
            return AdminTrainerModel.saveTrainer($scope.currentTrainer).then(
                function(result) {
                    $state.go(StatesNames.admin.trainers.name);
                }
            );
        };

        $scope.back = function() {
            $window.history.back();
        };

        $scope.init();
    }
]);
