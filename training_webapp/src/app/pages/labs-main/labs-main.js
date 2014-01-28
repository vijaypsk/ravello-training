'use strict';

(function(angular) {
    angular.module('trng.labs.main', ['ui.router', 'trng.labs.labs', 'trng.labs.sessions'])
		.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {

            $stateProvider.
                state('labs.sessions', {
                    url: '/sessions',
                    templateUrl: 'app/pages/sessions/sessions.html'
                }).state('labs.labs', {
                    url: '/labs',
                    templateUrl: 'app/pages/labs/labs.html'
                }).state('labs.single-session', {
                    url: '/single-session?mode&sessionId',
                    templateUrl: 'app/pages/sessions/single-session.html'
                }).state('labs.single-student', {
                    url: '/single-student?sessionId&studentId',
                    templateUrl: 'app/pages/sessions/single-student.html'
                });
        }]);
})(angular);
