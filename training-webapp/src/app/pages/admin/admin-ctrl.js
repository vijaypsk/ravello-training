'use strict';

angular.module('trng.admin').controller('AdminController', [
    '$rootScope',
    '$scope',
    '$state',
    'LoginModel',
    'StatesNames',
    'CommonConstants',
    function($rootScope, $scope, $state, LoginModel, StatesNames,CommonConstants) {
        $scope.init = function() {
            $state.go(StatesNames.admin.trainers.name);
        };
        $scope.portal_header_title=CommonConstants.PORTAL_HEADER_TITLE;
        $scope.portal_header_title_logo=CommonConstants.PORTAL_HEADER_TITLE_LOGO;
        
        $scope.handleRole = function() {
            $rootScope.$on('$stateChangeStart',
                function(event, toState, toParams, fromState, fromParams){
                    if (!LoginModel.user || LoginModel.user.role != 'ADMIN') {
                        event.preventDefault();
                    }
                });
        };

        $scope.navigateToProfile = function() {
            $state.go(StatesNames.admin.profile.name);
        };

        $scope.navigateToTrainers = function() {
            $state.go(StatesNames.admin.trainers.name);
        };

        $scope.isProfileActive = function() {
            return $state.includes(StatesNames.admin.profile.name);
        };

        $scope.isTrainersActive = function() {
            return $state.includes(StatesNames.admin.trainers.name) ||
                $state.includes(StatesNames.admin.singleTrainer.name);
        };

        $scope.init();
    }
]);
