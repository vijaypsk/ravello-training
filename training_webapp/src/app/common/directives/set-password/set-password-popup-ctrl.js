'use strict';

angular.module('trng.common.directives.setPassword').controller('setPasswordPopupController', [
    '$log',
    '$scope',
    '$modalInstance',
    'inlineMessage',
    function($log, $scope, $modalInstance, inlineMessage) {
        $scope.init = function() {
            $scope.viewModel = {
                password: '',
                inlineMessage: inlineMessage
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