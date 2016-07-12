'use strict';

angular.module('trng.services').factory('BucketsService', [
	'$rootScope',
	'$q',
	'CommonConstants',
	'BucketsProxy',
	'BucketsTransformer',
	function($rootScope, $q, CommonConstants, BucketsProxy, BucketsTransformer) {

		var cachedBuckets = null;


		var service = {
			getAllBuckets: function() {
				if (cachedBuckets) {
					return $q.when(cachedBuckets);
				}

				return BucketsProxy.getAllBuckets().then(
					function(result) {
						cachedBuckets = [];
						_.forEach(result.data, function(dto) {
							var bucket = BucketsTransformer.dtoToEntity(dto);
							cachedBuckets.push(bucket);
						});
						return cachedBuckets;
					}
				);
			}

		};

		return service;
	}
]);
