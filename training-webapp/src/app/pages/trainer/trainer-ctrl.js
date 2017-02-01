'use strict';

angular.module('trng.trainer').controller('TrainerController', [
    '$scope',
    '$rootScope',
    '$state',
    'StatesNames',
    'CommonConstants',
    function($scope, $rootScope, $state, StatesNames,CommonConstants) {
        $scope.init = function() {
            $state.go(StatesNames.trainer.training.name);
        };
        $scope.portal_header_title=CommonConstants.PORTAL_HEADER_TITLE;
         $scope.portal_header_title_logo=CommonConstants.PORTAL_HEADER_TITLE_LOGO;

        $scope.navigateToClasses = function() {
            $state.go(StatesNames.trainer.training.classes.name);
        };

        $scope.navigateToCourses = function() {
            $state.go(StatesNames.trainer.training.courses.name);
        };

        $scope.isClassesActive = function() {
            return $state.includes(StatesNames.trainer.training.classes.name) ||
                $state.includes(StatesNames.trainer.training.singleClass.name);
        };

        $scope.isCoursesActive = function() {
            return $state.includes(StatesNames.trainer.training.courses.name) ||
                $state.includes(StatesNames.trainer.training.singleCourse.name);
        };

        $scope.init();
    }
]);
