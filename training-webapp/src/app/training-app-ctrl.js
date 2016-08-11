'use strict';

angular.module('trng.app').controller('MainController', [
    '$scope',
    '$cookieStore',
    '$state',
    '$dialogs',
    'StatesNames',
    'LoginModel',
    function ($scope, $cookieStore, $state, $dialogs, StatesNames, LoginModel) {
        $scope.initApp = function() {
            var userAuthData = $cookieStore.get('userAuthData');

            if (userAuthData && userAuthData.hasOwnProperty('username') &&
                userAuthData.hasOwnProperty('password')) {

                LoginModel.login(userAuthData.username, userAuthData.password).catch(
                    function() {
                        $state.go(StatesNames.login.name);
                    }
                );
            } else {
                $state.go(StatesNames.login.name);
            }
        };

        $scope.logout = function() {
            var dialog = $dialogs.confirm('Confirm logout', 'Are you sure you want to logout?');
            dialog.result.then(function() {
                $cookieStore.remove('userAuthData');
                $state.go(StatesNames.login.name);
            });
        };

        $scope.initApp();
    }
]);
