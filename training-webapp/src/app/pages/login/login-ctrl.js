'use strict';

angular.module('trng.login').controller('loginController', [
    '$scope',
    '$timeout',
    'LoginModel',
    'CommonConstants',
    function($scope, $timeout, LoginModel,CommonConstants) {
        $scope.init = function() {
            $scope.loginErrorMessages = [];
            $scope.initAutofillHandlers();
            $scope.portal_header_title=CommonConstants.PORTAL_HEADER_TITLE;
            $scope.portal_header_title_logo=CommonConstants.PORTAL_HEADER_TITLE_LOGO;
        };

        $scope.initAutofillHandlers = function() {
            // The following 2 change event listeners make sure the model in the $scope is updated
            // with the values set to the text inputs by the browser's autofill.
            $('#usernameInput').change(function(event) {
                if ($scope.username == undefined && event.target.value) {
                    $scope.username = event.target.value;
                }
            });

            $('#passwordInput').change(function(event) {
                if ($scope.password == undefined && event.target.value) {
                    $scope.password = event.target.value;
                }
            });

            // Sometimes, when navigating to the login page, the browsers' autofill will happen and the
            // event still won't be fired (happens after logout). Therefore, we manually fire the change
            // event. We also do that after a 1 sec timeout, to avoid a race condition with the autofill
            // itself (otherwise, we might fire an even before the text inputs were even filled).
            $timeout(function() {
                $('#usernameInput').checkAndTriggerAutoFillEvent();
                $('#passwordInput').checkAndTriggerAutoFillEvent();
            }, 1000);
        };

        $scope.login = function() {
            LoginModel.login($scope.username, $scope.password).then(function(result) {
                $scope.loginErrorMessages = [];
            }).catch(function(error) {
                $scope.loginErrorMessages = [];
                $scope.loginErrorMessages.push("Username/password is incorrect!");
            });
        };

        $scope.init();
    }
]);
