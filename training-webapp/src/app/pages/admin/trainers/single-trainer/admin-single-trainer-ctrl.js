'use strict';

angular.module('trng.admin.trainers').controller('adminSingleTrainerController', [
    '$log',
    '$scope',
    '$window',
    '$state',
    'AdminTrainerModel',
    'currentTrainer',
    function($log, $scope, $window, $state, AdminTrainerModel, currentTrainer) {
        $scope.init = function() {
            $scope.currentTrainer = currentTrainer;
        };

        $scope.saveTrainer = function() {
            return AdminTrainerModel.saveTrainer($scope.currentTrainer).then(
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
        'AdminTrainerModel',
        function($q, $stateParams, AdminTrainerModel) {
            var trainerId = $stateParams.trainerId;

            if (!trainerId) {
                var deferred = $q.defer();
                deferred.resolve({});
                return deferred.promise;
            }

            return AdminTrainerModel.getAllTrainers().then(function(trainers) {
                return _.find(trainers, function(currentTrainer) {
                    return currentTrainer.id == trainerId;
                });
            });
        }
    ]
};
