'use strict';

(function (angular) {
    angular.module('trng.admin', [
            'trng.admin.profile',
            'trng.admin.trainers',
            'trng.services',
            'ui.router'
        ]).
        config([
            '$urlRouterProvider',
            '$stateProvider',
            function($urlRouterProvider, $stateProvider) {
                $stateProvider.
                    state('admin.profile', {
                        url: '/profile',
                        templateUrl: 'app/pages/admin/profile/profile.html',
                        controller: 'adminProfileController'
                    }).state('admin.trainers', {
                        url: '/trainers',
                        templateUrl: 'app/pages/admin/trainers/trainers.html',
                        controller: 'adminTrainersController'
                    }).state('student.trainers.single-trainer', {
                        url: '/single-trainer?trainerId',
                        templateUrl: 'app/pages/admin/trainers/single-trainer/single-trainer.html',
                        controller: 'adminSingleTrainerController'
                    });
            }
        ]);
})(angular);

