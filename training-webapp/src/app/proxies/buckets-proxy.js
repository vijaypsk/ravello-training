'use strict';

angular.module('trng.proxies').factory('BucketsProxy', [
	'$http',
	'$q',
	'CommonConstants',
	'TrainingMainTracker',
	function($http, $q, CommonConstants, TrainingMainTracker) {
		var service = {
			getAllBuckets: function() {
				var promise = $http.get(CommonConstants.baseUrl + '/rest/buckets');
				TrainingMainTracker.addPromise(promise);
				return promise;
			}
		};

		return service;
	}
]);
