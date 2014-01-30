'use strict';

angular.module('trng.services').factory('trng.services.StudentsService', [
	'trng.proxies.StudentsProxy',
	'trng.transformers.StudentsTransformer',
	function(proxy, transformer) {
		
		var service = {
			getAllStudents: function() {
				var promise = proxy.getAllStudents();

				var entities = [];

				return promise.then(function(result) {
                    _.forEach(result.data, function(currentDto) {
						var currentEntity = transformer.dtoToEntity(currentDto);
                        entities.push(currentEntity);

                    });
					return entities;
				});
			}
		};
		
		return service;
}]);
