'use strict';

(function(angular) {
	angular.module('trng.courses.classes', ['ngGrid', 'ngQuickDate', 'ui.bootstrap', 'trng.services', 'trng.students']).
        config([
            'ngQuickDateDefaultsProvider',
            '$urlRouterProvider',
            '$stateProvider',
            function(ngQuickDateDefaultsProvider, $urlRouterProvider, $stateProvider) {
                ngQuickDateDefaultsProvider.set('parseDateFunction', function(str) {
                    return Date.parse(str);
                });

                $stateProvider.
                    state('trainer.courses.single-class.add-class', {
                        url: '/add',
                        templateUrl: 'app/pages/trainer/classes/single-class/single-class-add.html'
                    }).state('trainer.courses.single-class.edit-class', {
                        url: '/edit',
                        templateUrl: 'app/pages/trainer/classes/single-class/single-class-edit.html'
                    }).state('trainer.courses.single-class.single-student', {
                        url: '/single-student?studentId',
                        templateUrl: 'app/pages/trainer/single-student/single-student.html',
                        controller: 'singleStudentController'
                    });
            }
        ]);
})(angular);
