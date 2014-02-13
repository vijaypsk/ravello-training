'use strict';

angular.module('trng.services').factory('trng.services.StudentsService', [
	'trng.proxies.StudentsProxy',
	'trng.transformers.StudentsTransformer',
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

            getStudentClassSingleApp: function(studentId, classId, appId) {
                return studentsProxy.getStudentClassSingleApp(studentId, classId, appId).then(
                    function(result) {
                        return appsTrans.dtoToEntity(result.data);
                    }
                )
            }
        };
		
		return service;
}]);
