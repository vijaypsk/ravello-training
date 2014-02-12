'use strict';

angular.module('trng.proxies').factory('trng.proxies.BlueprintsProxy', ['$http', '$q', function($http, $q) {
	return {
		getAllBlueprints: function() {
			var promise = $http.get('/rest/blueprints');
			
			promise.then(function(result) {
				return result;
			});
			
			return promise;
		}
	};
}]);
