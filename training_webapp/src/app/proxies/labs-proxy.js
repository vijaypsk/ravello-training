'use strict';

angular.module('trng.proxies').factory('trng.proxies.LabsProxy', ['$http', '$q', function($http, $q) {
	var service = {
		getAllLabs: function() {
			var promise = $http.get('/rest/labs');

			promise.then(function(result) {
				return result;
			});

			return promise;
		}
    };

    return service;
}]);
