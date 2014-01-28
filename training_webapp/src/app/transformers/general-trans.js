'use strict';

angular.module('trng.transformers').factory('trng.transformers.GeneralTransformer', [
		'trng.common.utils.Cloner',
		function(cloner) {
			var service = {
				dtoToEntity: function(dto, entity) {
					angular.forEach(dto, function(value, key) {
						if (!(key in entity)) {
							console.warn('Unexpected field ' + key
									+ ' in dto (value = ' + value + ' )');
						} else {
							entity[key] = value;
						}
					});
					
					return entity;
				},

				entityToDto: function(entity, dto) {
					return cloner.cloneObject(entity, dto);
				}
			};
			
			return service;
}]);