'use strict';

(function (angular) {
    angular.module('trng.trainer.training.classes', [
            'ngGrid',
            'ngQuickDate',
            'ui.bootstrap',
            'trng.services',
            'trng.trainer.students',
            'trng.common.directives'
        ]).config([
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
                        templateUrl: 'app/pages/trainer/classes/single-class/single-class-add.html'
                    }).state('trainer.training.single-class.edit-class', {
                        url: '/edit',
                        templateUrl: 'app/pages/trainer/classes/single-class/single-class-edit.html'
                    }).state('trainer.training.single-class.single-student', {
                        url: '/single-student?studentId',
                        templateUrl: 'app/pages/trainer/single-student/single-student.html',
                        controller: 'singleStudentController',
                        resolve: singleStudentResolver
                    });
            }
        ]);
})(angular);
