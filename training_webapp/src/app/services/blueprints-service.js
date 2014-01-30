'use strict';

angular.module('trng.services').factory('trng.services.BlueprintsService', [
	'trng.proxies.BlueprintsProxy',
//	'trng.transformers.BlueprintsTransformer',
	function(bpProxy) {
		
		var service = {
			getAllBlueprints: function() {
				var promise = bpProxy.getAllBlueprints();
				return promise;
//				var bpEntities = [];
//
//                return promise.then(function(result) {
//                    _.forEach(result.data, function(currentBpDto) {
//						var currentBpEntity = bpTransformer.dtoToEntity(currentBpDto);
//                        bpEntities.push(currentBpEntity);
//                    });
//                    return bpEntities;
//				});
			}
		};
		
		return service;
}]);
