'use strict';

angular.module('trng.admin').controller('adminController', [
    '$rootScope',
    '$scope',
    '$state',
    'LoginModel',
    function($rootScope, $scope, $state, LoginModel) {
        $scope.init = function() {
            $scope.handleRole();
        };

        $scope.handleRole = function() {
            $rootScope.$on('$stateChangeStart',
                function(event, toState, toParams, fromState, fromParams){
                    if (!LoginModel.user || LoginModel.user.role != 'ADMIN') {
                        event.preventDefault();
                    }
                });
        };

        $scope.init();
    }
]);
