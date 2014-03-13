'use strict';

angular.module('trng.common.directives.setPassword').controller('setPasswordController', [
    '$log',
    '$scope',
    '$modal',
    function($log, $scope, $modal) {
        $scope.init = function() {
        };

        $scope.setPassword = function() {
            var modalInstance = $modal.open({
                templateUrl: 'app/common/directives/set-password/set-password-popup.html',
                controller: 'setPasswordPopupController',
                resolve: {
                    inlineMessage: function() {
                        return $scope.inlineMessage;
                    }
                }
            });

            modalInstance.result.then(
                function(result) {
                    $scope.password = result;
                }
            );
        };

        $scope.init();
    }
]);

angular.module('trng.common.directives.setPassword').directive('setPassword', [
    function() {
        return {
            restrict: 'EA',
            scope: {
                password: '=passwordModel',
                innerClass: '@',
                inlineMessage: '@'
            },
            templateUrl: 'app/common/directives/set-password/set-password.html',
            controller: 'setPasswordController'
//            link: function(scope, element, attrs, modelCtrl) {
//            }
        };
    }
]);
