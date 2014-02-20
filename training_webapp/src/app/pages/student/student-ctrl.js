'use strict';

angular.module('trng.student').controller('studentController', [
    '$scope',
    '$state',
    'loginModel',
    'trng.services.StudentsService',
    function($scope, $state, loginModel, studentsService) {
        $scope.init = function() {
//            $state.go('.class.apps-list');
        };

        $scope.init();
    }
]);
