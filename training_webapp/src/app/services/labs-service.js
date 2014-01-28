'use strict';

angular.module('trng.services').factory('trng.services.LabsService', [
	'trng.proxies.LabsProxy',
	'trng.transformers.LabsTransformer',
	function(labProxy, labTransformer) {
		
		var service = {
			getAllLabs: function() {
				var promise = labProxy.getAllLabs();
				
				var labEntities = [];
				return promise.then(function(result) {
					for (var i = 0; i < result.data.length; i++) {
						var currentLabEntity = labTransformer.dtoToEntity(result.data[i]);
                        labEntities.push(currentLabEntity);
					}
					return labEntities;
				});
			}
		};
		
		return service;
}]);
