'use strict';

angular.module('trng.admin.profile').controller('adminProfileController', [
    '$log',
    '$scope',
    '$state',
    'loginModel',
    'trng.services.AdminService',
    function($log, $scope, $state, loginModel, adminService) {
        $scope.init = function() {
            $scope.username = _.cloneDeep(loginModel.user.username);
        };

        $scope.save = function() {
            adminService.updateProfile($scope.username, $scope.password).then(function(result) {
                $state.go('login');
            });
        };

        $scope.init();
    }
]);
