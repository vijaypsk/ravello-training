'use strict';

var rootResolver = {
	toggleFeatures: ['FeatureTogglesService', function (FeatureTogglesService) {
		return FeatureTogglesService.getAllFeatureToggles();
	}]
};
