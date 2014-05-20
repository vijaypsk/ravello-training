'use strict';

(function (angular) {
    angular.module('trng.admin', [
            'trng.admin.profile',
            'trng.admin.trainers',
            'trng.services',
            'trng.login',
            'ui.router'
        ]).
        config([
            '$urlRouterProvider',
            '$stateProvider',
            function($urlRouterProvider, $stateProvider) {
                $stateProvider.
                    state('admin.profile', {
                        url: '/profile',
                        templateUrl: 'app/pages/admin/profile/admin-profile.html',
                        controller: 'adminProfileController'
                    }).state('admin.trainers', {
                        url: '/trainers',
                        templateUrl: 'app/pages/admin/trainers/admin-trainers.html',
                        controller: 'adminTrainersController',
                        resolve: adminTrainerResolver
                    }).state('admin.single-trainer', {
                        url: '/single-trainer?trainerId',
                        templateUrl: 'app/pages/admin/trainers/single-trainer/admin-single-trainer.html',
                        controller: 'adminSingleTrainerController',
                        resolve: adminSingleTrainerResolver
                    });
            }
        ]);
})(angular);

