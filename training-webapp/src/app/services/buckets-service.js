'use strict';

angular.module('trng.services').factory('BucketsService', [
	'$rootScope',
	'$q',
	'CommonConstants',
	'BucketsProxy',
	function($rootScope, $q, CommonConstants, BucketsProxy) {

		var cachedBuckets = null;


		var service = {
			getAllBuckets: function() {
				if (cachedBuckets) {
					return $q.when(cachedBuckets);
				}

				return BucketsProxy.getAllBuckets().then(
					function(result) {
						cachedBuckets = result.data;
						return cachedBuckets;
					}
				);
			}

		};

		return service;
	}
]);
