'use strict';

angular.module('trng.proxies').factory('trng.proxies.ClassesProxy', ['$http', '$q', function($http, $q) {
	return {
		getAllClasses: function() {
			var promise = $http.get('/rest/classes');
			
			promise.then(function(result) {
				return result;
			});
			
			return promise;
		}
	};
}]);
