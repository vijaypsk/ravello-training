'use strict';

angular.module('trng.services').factory('trng.services.BlueprintsService', [
	'trng.proxies.BlueprintsProxy',
	'trng.transformers.BlueprintsTransformer',
	function(bpProxy, bpTransformer) {
		
		var service = {
			getAllBlueprints: function() {
				var promise = bpProxy.getAllBlueprints();
				
				var bpEntities = [];
				return promise.then(function(result) {
					for (var i = 0; i < result.data.length; i++) {
						var currentBpEntity = bpTransformer.dtoToEntity(result.data[i]);
                        bpEntities.push(currentBpEntity);
					}
					return bpEntities;
				});
			}
		};
		
		return service;
}]);
