'use strict';

angular.module('trng.services').factory('trng.services.StudentsService', [
	'trng.proxies.StudentsProxy',
	'trng.transformers.SingleStudentTransformer',
	'trng.transformers.AppsTransformer',
	function(studentsProxy, studentsTrans, appsTrans) {
		
		var service = {
			getStudent: function(studentId) {
				return studentsProxy.getStudent(studentId).then(
                    function(result) {
                        return studentsTrans.dtoToEntity(result.data);
                    }
                );
			},

            getStudentClassApps: function(studentId, classId) {
                return studentsProxy.getStudentClassApps(studentId, classId).then(
                    function(result) {
                        var entities = [];

                        _.forEach(result.data, function(dto) {
                            entities.push(appsTrans.dtoToEntity(dto));
                        });

                        return entities;
                    }
                )
            },

            getStudentClassSingleApp: function(studentId, classId, appId, track) {
                return studentsProxy.getStudentClassSingleApp(studentId, classId, appId, track).then(
                    function(result) {
                        return appsTrans.dtoToEntity(result.data);
                    }
                )
            }
        };
		
		return service;
}]);
