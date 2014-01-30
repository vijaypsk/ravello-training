'use strict';

angular.module('trng.services').factory('trng.services.CoursesService', [
	'trng.proxies.CoursesProxy',
//	'trng.transformers.CoursesTransformer',
	function(coursesProxy) {
		
		var service = {
			getAllCourses: function() {
				var promise = coursesProxy.getAllCourses();
				return promise;
//				var labEntities = [];
//
//                return promise.then(function(result) {
//                    _.forEach(result.data, function(currentLabDto) {
//						var currentLabEntity = labTransformer.dtoToEntity(currentLabDto);
//                        labEntities.push(currentLabEntity);
//                    });
//                    return labEntities;
//				});
			}
		};
		
		return service;
}]);
