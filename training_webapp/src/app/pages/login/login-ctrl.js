'use strict';

angular.module('trng.login').controller('loginController', [
    '$scope',
    '$state',
    '$cookieStore',
    'trng.services.LoginService',
    'loginModel',
    function($scope, $state, $cookieStore, loginService, loginModel) {
        $scope.init = function() {
            if ($cookieStore.get('userAuthData')) {
                $scope.username = $cookieStore.get('userAuthData').username;
                $scope.password = $cookieStore.get('userAuthData').password;
            }
        };

        $scope.login = function() {
            loginModel.login($scope.username, $scope.password);
        };

        $scope.init();
    }
]);
