'use strict';

angular.module('trng.student').controller('studentClassController', [
    '$scope',
    function($scope) {
        $scope.init = function() {
            $scope.name = "daniel";
        };

        $scope.init();
    }
]);