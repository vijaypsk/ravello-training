'use strict';

angular.module('trng.proxies').factory('trng.proxies.CoursesProxy', ['$http', '$q', function($http, $q) {
	var service = {
		getAllCourses: function() {
			var promise = $http.get('/rest/courses');

			promise.then(function(result) {
				return result;
			});

			return promise;
		}
    };

    return service;
}]);
