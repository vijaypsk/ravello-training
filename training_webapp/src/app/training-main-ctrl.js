'use strict';

angular.module('trng.app').controller('MainController', [
    '$scope',
    '$cookieStore',
    '$state',
    'loginModel',
    function ($scope, $cookieStore, $state, loginModel) {
        $scope.initApp = function() {
            var userAuthData = $cookieStore.get('userAuthData');

            if (userAuthData && userAuthData.hasOwnProperty('username') &&
                userAuthData.hasOwnProperty('password')) {

                loginModel.login(userAuthData.username, userAuthData.password).catch(
                    function(error) {
                        $state.go("/login");
                    }
                );
            } else {
                $state.go("login");
            }
        };

        $scope.initApp();
    }
]);
