'use strict';

angular.module('trng.proxies').factory('FeatureTogglesProxy', ['$http', 'CommonConstants',
	function($http, CommonConstants) {
		return {
			getAllFeatureToggles: function() {
				return $http.get(CommonConstants.baseUrl + '/rest/featureToggles');
			}
		};
	}
]);