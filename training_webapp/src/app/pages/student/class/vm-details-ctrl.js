'use strict';

angular.module('trng.student').controller('vmDetailsController', [
    '$log',
    '$scope',
    '$modalInstance',
    'selectedVm',
    function($log, $scope, $modalInstance, selectedVm) {
        $scope.init = function() {
            $scope.selectedVm = selectedVm;
        };

        $scope.ok = function() {
            $modalInstance.close();
        };

        $scope.init();
    }
]);
