'use strict';

angular.module('trng.services').factory('trng.services.BlueprintsService', [
	'trng.proxies.BlueprintsProxy',
	'trng.transformers.BlueprintsTransformer',
	function(blueprintsProxy, blueprintsTrans) {
		
		var service = {
			getAllBlueprints: function() {
				var promise = blueprintsProxy.getAllBlueprints();

				var entities = [];

				return promise.then(function(result) {
                    _.forEach(result.data, function(currentDto) {
						var currentEntity = blueprintsTrans.dtoToEntity(currentDto);
                        entities.push(currentEntity);

                    });
					return entities;
				});
            }
		};
		
		return service;
}]);
