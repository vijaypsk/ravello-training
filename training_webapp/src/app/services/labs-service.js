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
                    _.forEach(result.data, function(currentLabDto) {
						var currentLabEntity = labTransformer.dtoToEntity(currentLabDto);
                        labEntities.push(currentLabEntity);
                    });
                    return labEntities;
				});
			}
		};
		
		return service;
}]);
