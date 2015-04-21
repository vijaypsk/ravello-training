'use strict';

angular.module('trng.admin.trainers').controller('adminSingleTrainerController', [
    '$log',
    '$scope',
    '$window',
    '$state',
    'StatesNames',
    'TrainersService',
    'currentTrainer',
    function($log, $scope, $window, $state, StatesNames, TrainersService, currentTrainer) {
        $scope.init = function() {
            $scope.currentTrainer = currentTrainer;
        };

        $scope.saveTrainer = function() {
            return TrainersService.saveOrUpdate($scope.currentTrainer).then(
                function(result) {
                    $state.go(StatesNames.admin.trainers.name);
                }
            );
        };

        $scope.back = function() {
            $window.history.back();
        };

        $scope.isSaveDisabled = function() {
            return $scope.singleTrainerForm ? !$scope.singleTrainerForm.$valid : false;
        };

        $scope.init();
    }
]);
