'use strict';

(function (angular) {
    angular.module('trng.trainer.training.classes', [
        'ngGrid',
        'ngQuickDate',
        'ui.bootstrap',
        'trng.config',
        'trng.services',
        'trng.trainer.students',
        'trng.common.directives'
    ]);

    angular.module('trng.trainer.training.classes').config([
        'ngQuickDateDefaultsProvider',
        '$urlRouterProvider',
        '$stateProvider',
        'StatesNames',
        function(ngQuickDateDefaultsProvider, $urlRouterProvider, $stateProvider, StatesNames) {

            ngQuickDateDefaultsProvider.set('parseDateFunction', function(str) {
                return Date.parse(str);
            });

            $stateProvider.
                state(StatesNames.trainer.training.singleClass.addClass.name, {
                    url: '/add',
                    templateUrl: 'app/pages/trainer/classes/single-class/trainer-single-class-add.html'
                }).state(StatesNames.trainer.training.singleClass.editClass.name, {
                    url: '/edit',
                    templateUrl: 'app/pages/trainer/classes/single-class/trainer-single-class-edit.html'
                }).state(StatesNames.trainer.training.singleClass.monitorClass.name, {
                    url: '/monitor',
                    templateUrl: 'app/pages/trainer/classes/single-class/trainer-single-class-monitor.html',
                    controller: 'trainerSingleClassMonitorController',
                    resolve: singleClassMonitorResolver
                }).state(StatesNames.trainer.training.singleClass.singleStudent.name, {
                    url: '/single-student?studentId',
                    templateUrl: 'app/pages/trainer/single-student/trainer-single-student.html',
                    controller: 'trainerSingleStudentController',
                    resolve: singleStudentResolver
                });
        }
    ]);
})(angular);
