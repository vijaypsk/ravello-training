'use strict';

angular.module('trng.app').controller('MainController', [
    '$scope',
    '$cookieStore',
    '$state',
    '$dialogs',
    'LoginModel',
    function ($scope, $cookieStore, $state, $dialogs, LoginModel) {
        $scope.initApp = function() {
            var userAuthData = $cookieStore.get('userAuthData');

            if (userAuthData && userAuthData.hasOwnProperty('username') &&
                userAuthData.hasOwnProperty('password')) {

                LoginModel.login(userAuthData.username, userAuthData.password).catch(
                    function(error) {
                        $state.go("login");
                    }
                );
            } else {
                $state.go("login");
            }
        };

        $scope.logout = function() {
            var dialog = $dialogs.confirm('Confirm logout', 'Are you sure you want to logout?');
            dialog.result.then(function(result) {
                $cookieStore.remove('userAuthData');
                $state.go('login');
            });
        };

        $scope.initApp();
    }
]);
