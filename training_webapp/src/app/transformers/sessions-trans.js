'use strict';

angular.module('trng.transformers').factory('trng.transformers.SessionsTransformer', [
	'trng.transformers.GeneralTransformer',
	'trng.transformers.LabsTransformer',
    'trng.transformers.StudentsTransformer',
	'trng.common.utils.DateUtil',
	function(generalTrans, labTrans, studentsTrans, dateUtil) {

        var toStudentEntities = function(dto, entity) {
            entity['students'] = [];
            _.forEach(dto['students'], function(currentStudent) {
                var studentEntity = studentsTrans.dtoToEntity(currentStudent);
                entity['students'].push(studentEntity);
            });
        };

        var toStudentDtos = function(dto, entity) {
            dto['students'] = [];
            _.forEach(entity['students'], function(currentStudent) {
                var studentDto = studentsTrans.entityToDto(currentStudent);
                dto['students'].push(studentDto);
            });
        };

        var service = {
			dtoToEntity: function(dto) {
		        var entity = new TrainingSession();
		        generalTrans.dtoToEntity(dto, entity);

                entity['lab'] = labTrans.dtoToEntity(dto['lab']);
                entity['startDate'] = Date.parse(entity['startDate']);
                entity['endDate'] = Date.parse(entity['endDate']);

                toStudentEntities(dto, entity);

                return entity;
			},
			
			entityToDto: function(entity) {
		        var dto = generalTrans.entityToDto(entity);

                dto['lab'] = labTrans.entityToDto(entity['lab']);
                dto['startDate'] = dto['startDate'].toString(dateUtil.dateFormat);
                dto['endDate'] = dto['endDate'].toString(dateUtil.dateFormat);

                toStudentDtos(dto, entity);

                return dto;
			}
		};
		
		return service;
}]);
