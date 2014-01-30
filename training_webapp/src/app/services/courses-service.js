'use strict';

angular.module('trng.services').factory('trng.services.CoursesService', [
	'trng.proxies.CoursesProxy',
	'trng.transformers.CoursesTransformer',
	function(coursesProxy, coursesTrans) {
		
		var service = {
			getAllCourses: function() {
				var promise = coursesProxy.getAllCourses();

                var courseEntities = [];

                return promise.then(function(result) {
                    _.forEach(result.data, function(currentLabDto) {
						var currentLabEntity = coursesTrans.dtoToEntity(currentLabDto);
                        courseEntities.push(currentLabEntity);
                    });
                    return courseEntities;
				});
			}
		};
		
		return service;
}]);
