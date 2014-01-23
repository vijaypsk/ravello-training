'use strict';

(function(angular) {
	var sessionEntities = angular.module('trng.sessions.entities', []);
	
	sessionEntities.factory('trng.sessions.entities.SessionModel', [function() {
		var sessions = ['1', '2', '3'];
		
		var getSessions = function() {
			return sessions;
		};

		return {
			'sessions': sessions
		};
	}]);
})(angular);