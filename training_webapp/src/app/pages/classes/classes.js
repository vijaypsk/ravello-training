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
                    state('courses.single-class.add-class', {
                        url: '/add',
                        templateUrl: 'app/pages/classes/single-class/single-class-add.html'
                    }).state('courses.single-class.edit-class', {
                        url: '/edit',
                        templateUrl: 'app/pages/classes/single-class/single-class-edit.html'
                    }).state('courses.single-class.single-student', {
                        url: '/single-student?studentId',
                        templateUrl: 'app/pages/single-student/single-student.html'
                    });
            }
        ]);
})(angular);
