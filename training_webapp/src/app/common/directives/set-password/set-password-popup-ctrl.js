'use strict';

angular.module('trng.common.directives.setPassword').controller('setPasswordPopupController', [
    '$log',
    '$scope',
    '$modalInstance',
    function($log, $scope, $modalInstance) {
        $scope.init = function() {
            $scope.viewModel = {
                password: ''
            };
        };

        $scope.ok = function() {
            $modalInstance.close($scope.viewModel.password);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        }

        $scope.init();
    }
]);