'use strict';

angular.module('trng.proxies').factory('trng.proxies.SessionsProxy', ['$http', '$q', function($http, $q) {
	return {
		'getAllSessions': function() {
			var promise = $http.get('/rest/sessions');
			
			promise.then(function(result) {
				return result;
			});
			
			return promise;
		}
	};
}]);
