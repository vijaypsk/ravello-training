'use strict';

var properties = require('../config/properties');

exports.getAllFeatureToggles = function(request, response) {
	response.json(properties.featureToggles);
};