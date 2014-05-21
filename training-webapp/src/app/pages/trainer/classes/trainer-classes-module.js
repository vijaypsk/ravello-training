'use strict';

(function (angular) {
    angular.module('trng.trainer.training.classes', [
        'ngGrid',
        'ngQuickDate',
        'ui.bootstrap',
        'trng.services',
        'trng.trainer.students',
        'trng.common.directives'
    ]);

    angular.module('trng.trainer.training.classes').config([
        'ngQuickDateDefaultsProvider',
        '$urlRouterProvider',
        '$stateProvider',
        function(ngQuickDateDefaultsProvider, $urlRouterProvider, $stateProvider) {

            ngQuickDateDefaultsProvider.set('parseDateFunction', function(str) {
                return Date.parse(str);
            });

            $stateProvider.
                state('trainer.training.single-class.add-class', {
                    url: '/add',
                    templateUrl: 'app/pages/trainer/classes/single-class/trainer-single-class-add.html'
                }).state('trainer.training.single-class.edit-class', {
                    url: '/edit',
                    templateUrl: 'app/pages/trainer/classes/single-class/trainer-single-class-edit.html'
                }).state('trainer.training.single-class.monitor-class', {
                    url: '/monitor',
                    templateUrl: 'app/pages/trainer/classes/single-class/trainer-single-class-monitor.html',
                    controller: 'trainerSingleClassMonitorController',
                    resolve: singleClassMonitorResolver
                }).state('trainer.training.single-class.single-student', {
                    url: '/single-student?studentId',
                    templateUrl: 'app/pages/trainer/single-student/trainer-single-student.html',
                    controller: 'trainerSingleStudentController',
                    resolve: singleStudentResolver
                });
        }
    ]);
})(angular);
