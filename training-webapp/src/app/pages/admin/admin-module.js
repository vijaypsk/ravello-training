'use strict';

(function (angular) {
    angular.module('trng.admin', [
        'trng.config',
        'trng.admin.profile',
        'trng.admin.trainers',
        'trng.services',
        'trng.login',
        'ui.router'
    ]);

    angular.module('trng.admin').config([
        '$urlRouterProvider',
        '$stateProvider',
        'StatesNames',
        function($urlRouterProvider, $stateProvider, StatesNames) {

            $urlRouterProvider.when("/admin", "/admin/trainers");

            $stateProvider.
                state(StatesNames.admin.profile.name, {
                    url: '/profile',
                    templateUrl: 'app/pages/admin/profile/admin-profile.html',
                    controller: 'adminProfileController'
                }).state(StatesNames.admin.trainers.name, {
                    url: '/trainers',
                    templateUrl: 'app/pages/admin/trainers/admin-trainers.html',
                    controller: 'adminTrainersController',
                    resolve: adminTrainerResolver
                }).state(StatesNames.admin.singleTrainer.name, {
                    url: '/single-trainer?trainerId',
                    templateUrl: 'app/pages/admin/trainers/single-trainer/admin-single-trainer.html',
                    controller: 'adminSingleTrainerController',
                    resolve: adminSingleTrainerResolver
                });
        }
    ]);
})(angular);

