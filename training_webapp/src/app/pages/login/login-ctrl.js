'use strict';

angular.module('trng.login').controller('loginController', [
    '$scope',
    '$state',
    '$cookieStore',
    'trng.services.LoginService',
    'loginModel',
    function($scope, $state, $cookieStore, loginService, loginModel) {
        $scope.init = function() {
            $scope.username = "";
            $scope.password = "";
        };

        $scope.login = function() {
            loginModel.login($scope.username, $scope.password);
        };

        $scope.init();
    }
]);
