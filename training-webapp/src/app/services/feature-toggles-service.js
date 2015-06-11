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

			hasFeatureToggle: function (toggleName) {
				return featureToggles ? featureToggles[toggleName] : false;
			}
		};

		return service;
	}
]);