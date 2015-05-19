'use strict';

angular.module('trng.admin.trainers').controller('adminSingleTrainerController', [
    '$log',
    '$scope',
    '$window',
    '$state',
    '$dialogs',
    'StatesNames',
    'TrainersService',
    'currentTrainer',
    function($log, $scope, $window, $state, $dialogs, StatesNames, TrainersService, currentTrainer) {
        $scope.init = function() {
            $scope.currentTrainer = currentTrainer;
        };

        $scope.saveTrainer = function() {
            var validationStatus = getValidationStatus();

            if (!_.isEmpty(validationStatus)) {
                var finalMessage = _.reduce(validationStatus, function(sum, current) {
                    return sum += ", " + current;
                });

                finalMessage = "Could not save, please fill required fields: [" + finalMessage + "]";

                $dialogs.error('Validation error', finalMessage);

                return;
            }

            return TrainersService.saveOrUpdate($scope.currentTrainer).then(
                function() {
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

        function getValidationStatus() {
            var validationStatus = [];

            !$scope.currentTrainer.firstName && validationStatus.push("First name");
            !$scope.currentTrainer.username && validationStatus.push("Training Portal Username");

            !$scope.currentTrainer.id && !$scope.currentTrainer.password && validationStatus.push("password");

            return validationStatus;
        }

        $scope.init();
    }
]);
