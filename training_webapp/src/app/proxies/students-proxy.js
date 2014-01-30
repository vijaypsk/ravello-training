'use strict';

angular.module('trng.proxies').factory('trng.proxies.StudentsProxy', ['$http', '$q', function($http, $q) {
	return {
		getAllStudents: function() {
			var promise = $http.get('/rest/students');
			
			promise.then(function(result) {
				return result;
			});
			
			return promise;
		}
	};
}]);
