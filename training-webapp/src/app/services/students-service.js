'use strict';

angular.module('trng.services').factory('StudentsService', [
	'StudentsProxy',
	'StudentTransformer',
	'AppsTransformer',
	function(StudentsProxy, StudentsTrans, AppsTrans) {
		
		var service = {
			getStudent: function(studentId) {
				return StudentsProxy.getStudent(studentId).then(
                    function(result) {
                        return StudentsTrans.dtoToEntity(result.data);
                    }
                );
			},

            getStudentClassApps: function(studentId, classId) {
                return StudentsProxy.getStudentClassApps(studentId, classId).then(
                    function(result) {
                        var entities = [];

                        _.forEach(result.data, function(dto) {
                            entities.push(AppsTrans.dtoToEntity(dto));
                        });

                        return entities;
                    }
                )
            },

            getStudentClassSingleApp: function(studentId, classId, appId, track) {
                return StudentsProxy.getStudentClassSingleApp(studentId, classId, appId, track).then(
                    function(result) {
                        return AppsTrans.dtoToEntity(result.data);
                    }
                )
            }
        };
		
		return service;
    }
]);
