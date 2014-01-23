'use strict';

angular.module('trng.transformations').factory(
	'trng.transformations.GeneralTransformation', [
		'trng.common.utils.Cloner',
		function(cloner) {
			var transfomService = {
				transDtoToEntity: function(dto, entity) {
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

				transEntityToDto: function(entity, dto) {
					return cloner.cloneObject(entity, dto);
				}
			};
			
			return transfomService;
}]);