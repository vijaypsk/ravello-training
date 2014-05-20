'use strict';

angular.module('trng.trainer.students').controller('trainerBpPermissionsController',
    ['$scope', '$log', '$modalInstance', 'bpPermissions',
    function($scope, $log, $modalInstance, bpPermissions) {

        $scope.init = function() {
            $scope.viewModel = {};
            $scope.viewModel.bpPermissions = _.cloneDeep(bpPermissions);
        };

        $scope.ok = function() {
            $modalInstance.close($scope.viewModel.bpPermissions);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        $scope.init();
    }
]);