'use strict';

(function (angular) {
  angular.module('trng.app', [
    'trng.labs.main',
    'trng.labs.sessions',
    'ui.router'
  ]).config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
	  $urlRouterProvider.when('', 'labs/sessions');

	  $stateProvider.
	  state('labs', {
		  url: '/labs',
		  templateUrl: 'app/pages/labs-main/labs-main.html'
	  }).state('labs.sessions', {
		  url: '/sessions',
		  templateUrl: 'app/pages/sessions/sessions.html'
	  }).state('labs.labs', {
		  url: '/labs',
		  templateUrl: 'app/pages/labs/labs.html'
	  });
	  
	  var sessionsResolve = {
			  'sessions': function() {
				  return sessionsService.getService();
			  }
	  };
  }]);

})(angular);
