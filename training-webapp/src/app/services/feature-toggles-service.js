'use strict';

angular.module('trng.proxies').factory('FeatureTogglesService', ['$q', 'FeatureTogglesProxy',
	function ($q, FeatureTogglesProxy) {
		var featureToggles = null;

		var service = {
			getAllFeatureToggles: function () {
				if (featureToggles) {
					return $q.when(featureToggles);
				}

				return FeatureTogglesProxy.getAllFeatureToggles().then(
					function (response) {
						featureToggles = response.data;
						return featureToggles;
					}
				);
			},

			getFeatureToggle: function (toggleName) {
				return service.getAllFeatureToggles().then(
					function() {
						return featureToggles[toggleName];
					}
				);
			}
		};

		return service;
	}
]);