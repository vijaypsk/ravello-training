'use strict';

angular.module('trng.services').factory('trng.services.ClassesService', [
	'trng.proxies.ClassesProxy',
//	'trng.transformers.ClassessTransformer',
	function(classesProxy) {
		
		var service = {
			getAllClasses: function() {
				var promise = classesProxy.getAllClasses();



//				return promise;
				var classEntities = [];
//
				return promise.then(function(result) {
                    _.forEach(result.data, function(currentClassDto) {
//						var currentSessionEntity = sessionTrans.dtoToEntity(currentSessionDto);
                        currentClassDto['startDate'] = Date.parse(currentClassDto['startDate']);
                        currentClassDto['endDate'] = Date.parse(currentClassDto['endDate']);
                        classEntities.push(currentClassDto);

                    });
					return classEntities;
				});
			}
		};
		
		return service;
}]);
