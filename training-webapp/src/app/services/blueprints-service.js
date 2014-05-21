'use strict';

angular.module('trng.services').factory('BlueprintsService', [
	'BlueprintsProxy',
	'BlueprintsTransformer',
	function(BlueprintsProxy, BlueprintsTrans) {
		
		var service = {
			getAllBlueprints: function() {
				var promise = BlueprintsProxy.getAllBlueprints();

				var entities = [];

				return promise.then(function(result) {
                    _.forEach(result.data, function(currentDto) {
						var currentEntity = BlueprintsTrans.dtoToEntity(currentDto);
                        entities.push(currentEntity);

                    });
					return entities;
				});
            }
		};
		
		return service;
    }
]);
