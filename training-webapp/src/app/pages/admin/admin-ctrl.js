'use strict';

angular.module('trng.admin').controller('adminController', [
    '$rootScope',
    '$scope',
    '$state',
    'loginModel',
    function($rootScope, $scope, $state, loginModel) {
        $scope.init = function() {
            $scope.handleRole();
        };

        $scope.handleRole = function() {
            $rootScope.$on('$stateChangeStart',
                function(event, toState, toParams, fromState, fromParams){
                    if (!loginModel.user || loginModel.user.role != 'ADMIN') {
                        event.preventDefault();
                    }
                });
        };

        $scope.init();
    }
]);
