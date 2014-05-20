'use strict';

angular.module('trng.admin.trainers').controller('adminSingleTrainerController', [
    '$log',
    '$scope',
    '$window',
    '$state',
    'trng.admin.trainers.trainersModel',
    'currentTrainer',
    function($log, $scope, $window, $state, trainersModel, currentTrainer) {
        $scope.init = function() {
            $scope.currentTrainer = currentTrainer;
        };

        $scope.saveTrainer = function() {
            return trainersModel.saveTrainer($scope.currentTrainer).then(
                function(result) {
                    $state.go('^.trainers');
                }
            );
        };

        $scope.back = function() {
            $window.history.back();
        };

        $scope.init();
    }
]);

var adminSingleTrainerResolver = {
    currentTrainer: [
        '$q',
        '$stateParams',
        'trng.admin.trainers.trainersModel',
        function($q, $stateParams, trainersModel) {
            var trainerId = $stateParams.trainerId;

            if (!trainerId) {
                var deferred = $q.defer();
                deferred.resolve({});
                return deferred.promise;
            }

            return trainersModel.getAllTrainers().then(function(trainers) {
                return _.find(trainers, function(currentTrainer) {
                    return currentTrainer.id == trainerId;
                });
            });
        }
    ]
};
